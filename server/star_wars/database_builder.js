const axios = require("axios");
let speciesList = [];

async function downloadSpeciesList() {
  console.log("1/3 downloading species list from swapi.dev");
  //   if (speciesList.length === 0) {
  let species = [];
  let nextURL = "https://swapi.dev/api/species/";

  while (nextURL) {
    const response = await axios.get(nextURL).catch((error) => {
      console.error(`Error fetching species: ${error}`);
    });
    species = species.concat(response.data.results);

    /// console log
    nextURL = response.data.next;
    const percentComplete = Math.round((species.length / 37) * 100) + "%";
    console.log(percentComplete);
  }
  speciesList = species;
  //   }
  //   return speciesList;
}

async function downloadHomeworldData() {
  console.log("2/3 populating species list homeworld data");
  let i = 0;
  for (const species of speciesList) {
    const homeworldURL = species.homeworld;
    try {
      const response = await axios.get(homeworldURL);
      const { name: homeworld, climate, terrain } = response.data;
      species.homeworld = homeworld;
      species.homeworld_climate = climate;
      species.homeworld_terrain = terrain;

      /// console log
      const percentComplete = Math.round((i / 37) * 100) + "%";
      i++;
      console.log(percentComplete, homeworld, climate, terrain);
    } catch (error) {
      const percentComplete = Math.round((i / 37) * 100) + "%";
      console.log(percentComplete, `Error fetching homeworld: ${error}`);
      species.homeworld = "none";
      species.homeworld_climate = "none";
      species.homeworld_terrain = "none";
    }
  }
}

async function downloadPeopleData() {
  console.log("3/3 populating species list with people data");
  let c = 0;
  for (const species of speciesList) {
    let peopleList = [];
    for (let i = 0; i < species.people.length; i++) {
      const peopleURL = species.people[i];
      try {
        const response = await axios.get(peopleURL);
        const { name } = response.data;
        peopleList.push(name);

        /// console log
        const percentComplete = Math.round((c / 37) * 100) + "%";
        console.log(percentComplete, name);
      } catch (error) {
        const percentComplete = Math.round((c / 37) * 100) + "%";
        console.log(percentComplete, `Error fetching people: ${error}`);
        peopleList = ["none"];
      }
    }
    species.people = peopleList;
    c++;
  }
}

async function buildDatabase() {
  await downloadSpeciesList();
  await downloadHomeworldData();
  await downloadPeopleData();
  console.log(speciesList);
  return speciesList;
}

buildDatabase();

module.exports = {
  buildDatabase,
};

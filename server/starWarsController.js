const axios = require("axios");
const backupDatabase = require("./starWarsBackupDatabase");
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

async function initializeDatabase(useOnlineDatabase) {
  if (useOnlineDatabase) {
    await downloadSpeciesList();
    await downloadHomeworldData();
    await downloadPeopleData();
    console.log(speciesList);
  } else {
    speciesList = backupDatabase.backupDatabase;
  }
}

const getSpeciesList = (req, res) => {
  res.status(200).send(speciesList);
};

function lookupAttribute(req, res) {
  const attribute = req.params.id;
  console.log(attribute);

  function cleanData(data) {
    let originalData = data;
    let splitData = [];
    let cleanedData = [];

    /// split lists ///
    if (!originalData[0]) {
      console.log(originalData);
      originalData = ["none"];
    }
    splitData = originalData.map((item) => item.split(", ")).flat();

    /// eliminate duplicates ///
    splitData.forEach((item) => {
      if (!cleanedData.includes(item)) {
        cleanedData.push(item);
      }
    });

    cleanedData.sort((a, b) => a.localeCompare(b));

    console.log(cleanedData);
    return cleanedData;
  }

  let attributeList = speciesList.map((species) => species[attribute]);
  console.log(attributeList);
  attributeList = cleanData(attributeList);

  res.status(200).send(attributeList);
}

module.exports = {
  initializeDatabase,
  getSpeciesList,
  lookupAttribute,
};

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

function getAttributeList(req, res) {
  const attribute = req.params.id;
  console.log(`looking up attribute: ${attribute}`);

  function cleanData(data) {
    let originalData = data;
    let splitData = [];
    let cleanedData = [];

    /// split lists ///
    if (!originalData[0]) {
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

    return cleanedData;
  }

  let attributeList = speciesList.map((species) => species[attribute]);
  attributeList = cleanData(attributeList);

  res.status(200).send(attributeList);
}

function getSpeciesByAttribute(req, res) {
  console.log(`looking up species with the following attributes:`);
  console.log(req.body);

  const {
    average_height,
    skin_colors,
    hair_colors,
    eye_colors,
    average_lifespan,
    homeworld_terrain,
    homeworld_climate,
  } = req.body;

  const responseBody = {
    average_height: speciesList
      .filter((species) =>
        species.average_height.split(", ").includes(average_height)
      )
      .map((species) => species.name),
    skin_colors: speciesList
      .filter((species) =>
        species.skin_colors.split(", ").includes(skin_colors)
      )
      .map((species) => species.name),
    hair_colors: speciesList
      .filter((species) =>
        species.hair_colors.split(", ").includes(hair_colors)
      )
      .map((species) => species.name),
    eye_colors: speciesList
      .filter((species) => species.eye_colors.split(", ").includes(eye_colors))
      .map((species) => species.name),
    average_lifespan: speciesList
      .filter((species) =>
        species.average_lifespan.split(", ").includes(average_lifespan)
      )
      .map((species) => species.name),
    homeworld_terrain: speciesList
      .filter((species) =>
        species.homeworld_terrain.split(", ").includes(homeworld_terrain)
      )
      .map((species) => species.name),
    homeworld_climate: speciesList
      .filter((species) =>
        species.homeworld_climate.split(", ").includes(homeworld_climate)
      )
      .map((species) => species.name),
  };

  res.status(200).send(responseBody);
}

function getListOfPeople(req, res) {
  const species = req.params.id;
  const people = speciesList[species].people;
  res.status(200).send(people);
}

module.exports = {
  initializeDatabase,
  getSpeciesList,
  getAttributeList,
  getSpeciesByAttribute,
  getListOfPeople,
};

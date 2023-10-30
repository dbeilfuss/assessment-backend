const axios = require("axios");
const backupDatabase = require("./starWarsDatabase");

let speciesList = backupDatabase.backupDatabase;

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
  console.log(req.query);

  const {
    average_height,
    skin_colors,
    hair_colors,
    eye_colors,
    average_lifespan,
    homeworld_terrain,
    homeworld_climate,
  } = req.query;

  console.log(average_height);

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
  const species = speciesList.filter(
    (species) => species.name === req.params.id
  );
  const people = species[0].people;
  console.log(species, people);
  res.status(200).send(people);
}

function postPerson(req, res) {
  const { species, name } = req.body;
  const targetSpecies = speciesList.find((s) => s.name === species);

  if (!targetSpecies) {
    return res.status(404).send("Species not found");
  }

  if (targetSpecies.people.includes(name)) {
    return res.status(400).send("Name already exists for this species");
  }

  targetSpecies.people.push(name);

  res.status(200).send(`Successfully added ${name} to ${species}`);
}

module.exports = {
  getSpeciesList,
  getAttributeList,
  getSpeciesByAttribute,
  getListOfPeople,
  postPerson,
};

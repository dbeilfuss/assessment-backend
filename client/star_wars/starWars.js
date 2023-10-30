/// items we'll use from the DOM ///
const dropDowns = document.querySelectorAll("select");
const loadingNotification = document.getElementById("loading-notification");
const speciesForm = document.getElementById("species_form");
const speciesNameElement = document.getElementById("speciesName");
const similarAttributesElement = document.getElementById("similarAttributes");
const differentAttributesElement = document.getElementById(
  "differentAttributes"
);
const otherMembersElement = document.getElementById("otherMembers");
const addButton = document.getElementById("addToList");
const resultsSection = document.querySelector("#results");
const addToListButton = document.getElementById("add-to-list-button");
const addSpeciesButton = document.getElementById("add-species-button");
const characterNameInput = document.getElementById("character-name");
const speciesNameInput = document.getElementById("species-name");
const deleteSpeciesButton = document.getElementById("delete-species-button");

// console.log(dropDowns);

const baseURL = `http://localhost:4000/api/`;
let yourSpecies = "";

function populateDropDowns() {
  for (i = 0; i < dropDowns.length; i++) {
    const dropdown = dropDowns[i];
    const attribute = dropdown.id;

    axios
      .get(`${baseURL}attribute/${attribute}`)

      .then((res) => {
        const optionsList = res.data;
        for (let i = 0; i < optionsList.length; i++) {
          const option = optionsList[i];
          const optionElement = document.createElement("option");
          optionElement.value = option;
          optionElement.textContent = option;
          dropdown.appendChild(optionElement);
        }
      })

      .catch((error) => console.log("error", error));

    loadingNotification.style.display = "none";
    speciesForm.style.display = "block";
  }
}

function lookupPeople(species) {
  let otherPeople = "";
  url = `${baseURL}people/${species}`;
  console.log(url);

  axios
    .get(url)
    .then((res) => {
      otherPeople = res.data.join(", ");
      otherMembersElement.textContent = `Other members of your species: ${otherPeople}`;
    })
    .catch((err) => console.log(err));
}

function displayResults(results) {
  const { species, similarAttributes } = results;
  yourSpecies = species;
  // Populate the HTML with the result!
  speciesNameElement.textContent = `Your species is: ${species}!`;
  similarAttributesElement.textContent = `Like other members of your species, you have these similar attributes: ${similarAttributes.join(
    ", "
  )}.`;

  resultsSection.style.display = "block";
}

function addSpecies() {
  const speciesName = speciesNameInput.value;
  if (speciesName) {
    const requestURL = `${baseURL}newSpecies`;

    const requestBody = {
      name: speciesName,
      average_height: dropDowns[0].value,
      skin_colors: dropDowns[1].value,
      hair_colors: dropDowns[2].value,
      eye_colors: dropDowns[3].value,
      average_lifespan: dropDowns[4].value,
      homeworld_terrain: dropDowns[5].value,
      homeworld_climate: dropDowns[6].value,
    };

    axios
      .post(requestURL, requestBody)
      .then((res) => {
        lookupPeople(yourSpecies);
      })
      .catch((err) => console.log(err));
  }
}

async function findOutSpecies(event) {
  event.preventDefault();
  const requestBody = {
    average_height: dropDowns[0].value,
    skin_colors: dropDowns[1].value,
    hair_colors: dropDowns[2].value,
    eye_colors: dropDowns[3].value,
    average_lifespan: dropDowns[4].value,
    homeworld_terrain: dropDowns[5].value,
    homeworld_climate: dropDowns[6].value,
  };

  let results = await speciesCalculator(requestBody);
  displayResults(results);
  lookupPeople(yourSpecies);
  addSpecies();
}

function addPerson() {
  const characterName = characterNameInput.value;
  if (characterName) {
    const requestURL = `${baseURL}person`;

    const requestBody = {
      species: yourSpecies,
      name: characterName,
    };

    axios
      .post(requestURL, requestBody)
      .then((res) => {
        lookupPeople(yourSpecies);
      })
      .catch((err) => console.log(err));
  }
}

function deleteSpecies() {
  const species = yourSpecies;
  url = `${baseURL}deleteSpecies/${species}`;
  axios
    .delete(url)
    .then((res) => {
      location.reload();
    })
    .catch((err) => console.log(err));
}

populateDropDowns();
speciesForm.addEventListener("submit", findOutSpecies);
addToListButton.addEventListener("click", addPerson);
addSpeciesButton.addEventListener("click", addSpecies);
deleteSpeciesButton.addEventListener("click", deleteSpecies);

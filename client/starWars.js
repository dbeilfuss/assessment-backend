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
const results = document.querySelector("#results");
const addToListButton = document.getElementById("add-to-list-button");
const characterNameInput = document.getElementById("character-name");

/// Global Variables ///
let mostCommonSpecies = "";

// console.log(dropDowns);

const baseURL = `http://localhost:4000/api/`;

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

populateDropDowns();

function findOutSpecies(event) {
  event.preventDefault();

  let requestURL = `${baseURL}matchSpecies/`;

  const requestBody = {
    average_height: dropDowns[0].value,
    skin_colors: dropDowns[1].value,
    hair_colors: dropDowns[2].value,
    eye_colors: dropDowns[3].value,
    average_lifespan: dropDowns[4].value,
    homeworld_terrain: dropDowns[5].value,
    homeworld_climate: dropDowns[6].value,
  };

  console.log(requestBody);
  console.log(requestURL);

  axios
    .post(requestURL, requestBody)
    .then((res) => {
      console.log(res);

      // Initialize objects to hold species counts and attribute lists
      const speciesCounts = {};
      const speciesAttributes = {};

      // Iterate over each attribute in the response data
      for (const [attribute, speciesArray] of Object.entries(res.data)) {
        speciesArray.forEach((species) => {
          // Increment species count
          speciesCounts[species] = (speciesCounts[species] || 0) + 1;

          // Add attribute to species' list of attributes
          if (!speciesAttributes[species]) {
            speciesAttributes[species] = [];
          }
          speciesAttributes[species].push(attribute);
        });
      }

      // Find the species with the highest count
      let maxCount = 0;
      for (const [species, count] of Object.entries(speciesCounts)) {
        if (count > maxCount) {
          maxCount = count;
          mostCommonSpecies = species;
        }
      }

      // List of attributes that the most common species did and did not appear in
      const appearedIn = speciesAttributes[mostCommonSpecies] || [];
      const notAppearedIn = Object.keys(res.data).filter(
        (attr) => !appearedIn.includes(attr)
      );

      console.log(`Most common species: ${mostCommonSpecies}`);
      console.log(`Appeared in attributes: ${appearedIn.join(", ")}`);
      console.log(`Did not appear in attributes: ${notAppearedIn.join(", ")}`);

      // Populate the HTML with the result!
      speciesNameElement.textContent = `Your species is: ${mostCommonSpecies}!`;
      similarAttributesElement.textContent = `Like other members of your species, you have these similar attributes: ${appearedIn.join(
        ", "
      )}.`;
      //   differentAttributesElement.textContent = `Unlike other members of your species, you have these different attributes: ${notAppearedIn.join(
      // ", "
      //   )}.`;

      lookupPeople();
      results.style.display = "block";
    })
    .catch((err) => console.log(err));
}

function lookupPeople() {
  let otherPeople = "";

  axios
    .get(`${baseURL}people/${mostCommonSpecies}`)
    .then((res) => {
      otherPeople = res.data.join(", ");
      console.log(otherPeople);
      otherMembersElement.textContent = `Other members of your species: ${otherPeople}`;
    })
    .catch((err) => console.log(err));
}

function addPerson() {
  console.log("hit");
  const characterName = characterNameInput.value;
  if (characterName) {
    const requestURL = `${baseURL}person`;

    const requestBody = {
      species: mostCommonSpecies,
      name: characterName,
    };

    console.log(requestBody);
    console.log(requestURL);

    axios
      .post(requestURL, requestBody)
      .then((res) => {
        console.log(res);
        lookupPeople();
      })
      .catch((err) => console.log(err));
  }
}

speciesForm.addEventListener("submit", findOutSpecies);
addToListButton.addEventListener("click", addPerson);

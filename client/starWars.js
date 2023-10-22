const dropDowns = document.querySelectorAll("select");
const loadingNotification = document.getElementById("loading-notification");
const speciesForm = document.getElementById("species_form");

// console.log(dropDowns);

const baseURL = `http://localhost:4000/api/`;

async function fetchOptionsList(characteristic) {
  function cleanUpData(data) {
    let splitData = [];
    let cleanedData = [];

    /// split lists ///
    splitData = data.map((item) => item.split(", ")).flat();

    /// eliminate duplicates ///
    splitData.forEach((item) => {
      if (!cleanedData.includes(item)) {
        cleanedData.push(item);
      }
    });

    cleanedData.sort((a, b) => a.localeCompare(b));

    return cleanedData;
  }

  try {
    const response = await axios.get(baseURL + "species");
    let options = response.data.map((species) => species[characteristic]);
    options = cleanUpData(options);
    return options;
  } catch (error) {
    console.log("error fetching options", error);
    return [];
  }
}

async function populateDropDowns() {
  for (i = 0; i < dropDowns.length; i++) {
    const dropdown = dropDowns[i];
    const optionsList = await fetchOptionsList(dropdown.id);
    console.log(optionsList);
    optionsList.forEach((attribute) => {
      const optionElement = document.createElement("option");
      optionElement.value = attribute;
      optionElement.textContent = attribute;
      dropdown.appendChild(optionElement);
    });
  }
  loadingNotification.style.display = "none";
  speciesForm.style.display = "block";
}

populateDropDowns();

// const createHouse = (body) =>
//   axios.post(baseURL, body).then(housesCallback).catch(errCallback);
// const deleteHouse = (id) =>
//   axios.delete(`${baseURL}/${id}`).then(housesCallback).catch(errCallback);
// const updateHouse = (id, type) =>
//   axios
//     .put(`${baseURL}/${id}`, { type })
//     .then(housesCallback)
//     .catch(errCallback);

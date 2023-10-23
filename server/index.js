const express = require("express");
const cors = require("cors");
const axios = require("axios");
const app = express();

app.use(cors());
app.use(express.json());

/// Initial Functions ///
const { getCompliment } = require("./controller");
const { getFortune } = require("./controller");

/// Initial EndPoints ///
app.get("/api/compliment", getCompliment);
app.get("/api/fortune", getFortune);

/// Star Wars Functions ///
const {
  initializeDatabase: reInitializeDatabase,
  getSpeciesList,
  getAttributeList,
  getSpeciesByAttribute,
  getListOfPeople,
  postPerson,
} = require("./starWarsController");

/// Star Wars EndPoints ///
app.get("/api/species", getSpeciesList);
app.get("/api/attribute/:id", getAttributeList);
app.get("/api/people/:id", getListOfPeople);
app.post("/api/matchSpecies", getSpeciesByAttribute);
app.post("/api/person", postPerson);

/// Run Server ///
app.listen(4000, () => console.log("Server running on 4000"));

/// To Re-Download the Database ///
reInitializeDatabase(false);
/// Will re-create the database by downloading various elements from swapi.dev ///
/// While set to false, the server will use the backupDatabase ///

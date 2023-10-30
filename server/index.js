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
  getSpeciesList,
  getAttributeList,
  getSpeciesByAttribute,
  getListOfPeople,
  postPerson,
  postSpecies,
  deleteSpecies,
} = require("./star_wars/starWarsController");

/// Log Incoming Requests ///
// app.use((req, res, next) => {
//   console.log(`Incoming request: ${req.method} ${req.url}`);
//   next();
// });

/// Star Wars EndPoints ///
app.get("/api/species", getSpeciesList);
app.get("/api/attribute/:id", getAttributeList);
app.get("/api/people/:id", getListOfPeople);
app.get("/api/matchSpecies", getSpeciesByAttribute);
app.post("/api/person", postPerson);
app.post("/api/newSpecies", postSpecies);
app.delete("/api/deleteSpecies/:species", deleteSpecies);

/// Run Server ///
app.listen(4000, () => console.log("Server running on 4000"));

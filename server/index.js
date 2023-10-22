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
const starWarsController = require("./starWarsController");

const { getSpeciesList: downloadSpeciesList } = starWarsController;

downloadSpeciesList();

/// Star Wars EndPoints ///
app.get("/api/species", (req, res) => {
  downloadSpeciesList().then((species) => {
    if (species) {
      res.json(species);
      return;
    }
    res.status(500).send("Could not fetch species");
  });
});

/// Run Server ///
app.listen(4000, () => console.log("Server running on 4000"));

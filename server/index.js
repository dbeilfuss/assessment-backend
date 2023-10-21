const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json());

/// Functions ///
const { getCompliment } = require("./controller");

const { getFortune } = require("./controller");

/// EndPoints ///
app.get("/api/compliment", getCompliment);
app.get("/api/fortune", getFortune);

/// Run Server ///
app.listen(4000, () => console.log("Server running on 4000"));

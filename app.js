const express = require("express");
const mongoose = require("mongoose");
//const Thing = require("./models/thing");
const stuffRoutes = require("./routes/stuff");
const userRoutes = require("./routes/user");

const app = express();
app.use(express.json());

//Connexion à MongoDB
mongoose
  .connect(
    "mongodb+srv://alexisgallien83:bGYxzO8UPGxV8X2Y@cluster0.mzs4grf.mongodb.net/?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

//Cors
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use("/api/stuff", stuffRoutes);
app.use("/api/auth", userRoutes);

module.exports = app;

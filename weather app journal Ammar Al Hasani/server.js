// Set up an empty JavaScript object to serve as an endpoint for all routes
let projectData = {};

// Import necessary modules and set up Express server
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

// Configure middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Serve the main project folder
app.use(express.static("website"));

// Set up the server to listen on port 8000
const port = 8000;
const server = app.listen(port, () =>
  console.log(`Server is running on http://localhost:${port}`)
);

// Define routes for handling GET and POST requests
const getData = (req, res) => {
  // Respond with the projectData object
  res.send(projectData);
};

// Handle GET requests at the /projectData endpoint
app.get("/projectData", getData);

const postData = (req, res) => {
  // Extract data from the request body and update projectData with the new forecast
  const newForecast = {
    date: req.body.date,
    temp: req.body.temp,
    content: req.body.content,
    city: req.body.city,
    description: req.body.description,
  };
  projectData = newForecast;

  // Respond with a success message and the updated data
  res.status(200).send({
    success: true,
    message: "Everything is fine, thank you for visiting :*",
    data: newForecast,
  });
};

// Handle POST requests at the /projectData endpoint
app.post("/projectData", postData);

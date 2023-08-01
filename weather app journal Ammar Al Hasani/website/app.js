/* Global Variables */
setTimeout(() => {
  document.querySelector("body").style.opacity = '1';
}, 300);

const country = document.getElementById("country");
const api_key = "b36b742e4ff3e4d670efec9996925a21";
const base_url = "http://api.openweathermap.org/data/2.5/weather"; // Changed the base URL to get current weather

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.toDateString();

// Event handler for the "Generate" button
const onGenerate = () => {
  const zip = document.getElementById("zip").value;
  const url = `${base_url}?zip=${zip},${country.value}&units=metric&APPID=${api_key}`; // Changed the URL to get current weather
  let feelings = document.getElementById("feelings").value;

  if (!zip) {
    // Show an error message for empty zip
    document.getElementById("content").innerHTML =
      "Please enter a zip code for more accurate results.";
    return; // Exit the function early
  }

  if (!country) {
    // Show an error message for empty country
    document.getElementById("content").innerHTML =
      "Please enter a country for more accurate results.";
    return; // Exit the function early
  }

  if (!feelings) feelings = "You didn't say how you're feeling..";

  // Fetch weather data from the API and update the UI
  getWeather(url)
    .then((data) => {
      if (data.cod === "404") {
        // Show an error message for invalid zip/country
        document.getElementById("content").innerHTML =
          "Invalid zip code or country. Please check and try again.";
      } else {
        // Valid response, update the UI with weather data
        postData("/projectData", {
          date: newDate,
          temp: Math.round(data.main.temp), // Access the temperature from the main object
          content: feelings,
          city: data.name, // Access the city name from the data object
          description: data.weather[0].description, // Access the weather description from the weather array
        }).then(updateUI("/projectData"));
      }
    })
    .catch((error) => {
      console.log(`Error: ${error}`);
      document.getElementById("content").innerHTML =
        "An error occurred while fetching weather data. Please try again.";
    });
};

// Function to fetch weather data from the API
const getWeather = async (url) => {
  const res = await fetch(url);
  if (res.status === 404 || res.status === 400) {
    document.getElementById("content").innerHTML =
      "Please write a valid zip code!";
  }
  try {
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(`Error: ${err}`);
  }
};

// Function to post data to the server
const postData = async (url = "", data = {}) => {
  const res = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  try {
    const newData = await res.json();
    console.log(newData);
    return newData;
  } catch (err) {
    console.log(`Error: ${err}`);
  }
};

// Function to update the UI with weather data
const updateUI = async (url) => {
  const request = await fetch(url);
  try {
    const allData = await request.json();
    document.getElementById("date").innerHTML = `Date: ${allData.date}`;
    document.getElementById("temp").innerHTML = `Temperature in C°: ${allData.temp}`;
    document.getElementById("content").innerHTML = `I am feeling ${allData.content}`;
    document.getElementById("city").innerHTML = `City: ${allData.city},${country.value.toUpperCase()}`;
    document.getElementById("description").innerHTML = `Description: ${allData.description}`;
    document.querySelector(".holderEntry").style.opacity = "1";
    setTimeout(async () => {
      document.querySelector("#entryHolder").style.opacity = "1";
      document.querySelector("#entryHolder").scrollIntoView();
    }, 1000);
    if (allData.temp < 14) {
      document.querySelector("img").setAttribute("src", "./img/png-transparent-cold-wave-thermometer-wind-cold-snowflake-temperature-weather-frozen-weather-icon-thumbnail.png");
    } else if (allData.temp > 33) {
      document.querySelector("img").setAttribute("src", "./img/hotweather.png");
    } else {
      document.querySelector("img").setAttribute("src", "./img/mediumtemp.png");
    }
  } catch (err) {
    console.log(`Error: ${err}`);
  }
};

const button = document.getElementById("generate");
button.addEventListener("click", onGenerate);

const weatherForm = document.getElementById("weather-form");
const searchInput = document.getElementById("location-input");
const weatherDataContainer = document.getElementById("weather-data-container");

weatherForm.addEventListener("submit", function submitWeatherForm(e) {
  e.preventDefault();
  const location = searchInput.value;

  weatherDataContainer.children[0].textContent = `Loading...`;
  weatherDataContainer.children[1].textContent = ``;

  fetch(`http://localhost:3000/weather?address=${location}`)
    .then(function fetchWeatherRes(response) {
      response.json().then(function resJsonThen(data) {
        if (data.error) {
          weatherDataContainer.children[0].textContent = `${data.error}`;
        } else {
          weatherDataContainer.children[1].textContent = `Location: ${data.location}`;
          weatherDataContainer.children[0].textContent = `Forecast: ${data.forecast}`;
        }
      });
    });
});
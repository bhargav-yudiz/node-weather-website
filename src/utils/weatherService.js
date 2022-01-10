const request = require("request");

// Weather API
// const url = "http://api.weatherstack.com/current?access_key=829d36c002a6c030b88f9e6fdbfb1ef0&query=37.8267,-122.4233&units=f";

// request({ url, json: true }, function weatherResponse(error, response) {
//   if (error) {
//     console.log("Unable to connect to weather service");
//     console.log(error.message);
//   } else if (response.body.error) {
//     console.log("Unable to find Location");
//     console.log(response.body?.error?.code);
//     console.log(response.body?.error?.type);
//     console.log(response.body?.error?.info);
//   } else {
//     console.log(`It is currently ${response.body.current.temperature} degrees out. The wind speed is ${15}`)
//   }
// });


function fetchWeatherForLocation(latitude, longitude, callback) {
  const url = `http://api.weatherstack.com/current?access_key=829d36c002a6c030b88f9e6fdbfb1ef0&query=${latitude},${longitude}`;

  request({ url, json: true }, function fetchWeather(error, response) {
    if (error) {
      callback("Unable to connect to weather services", null);
    } else if (response?.body?.error) {
      callback("Unable to find Weather for this location", null);
      // console.log(response.body?.error?.code);
      // console.log(response.body?.error?.type);
      // console.log(response.body?.error?.info);
    } else {
      const { weather_descriptions, temperature, humidity, wind_speed, feelslike } = response?.body?.current
      // callback(null, response?.body);
      callback(null, {
        forecast: `${weather_descriptions[0]}.
        It is currently ${temperature} degrees out. 
        It feels like ${feelslike} degrees out. 
        The Humidity is: ${humidity}%.
        The Wind Speed is: ${wind_speed}`,
        location: `${response?.body?.location?.name} ${response?.body?.location?.country}`
      })
    }
  });
}

module.exports = fetchWeatherForLocation;
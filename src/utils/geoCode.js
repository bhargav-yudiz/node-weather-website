const request = require("request");

// Geocoding API 
// address => lat/long => weather for those coordinates

// const geoUrl = `http://api.mapbox.com/geocoding/v5/mapbox.places/Los%20Angeles.json?access_token=pk.eyJ1IjoiYmhhcmdhdi1wYW5keWEiLCJhIjoiY2txYW9wd2kwMG81aTJubGJlaXp2aGttdCJ9.wPPzAdbSdkO1yTP-hC5DKg&limit=1`


// request({ url: geoUrl, json: true }, function getCoordinates(error, response) {
//   // console.log(response);
//   if (error) {
//     console.log("Could not connect to server");
//     console.log(error);
//   } else if (response?.body?.features?.length == 0) {
//     console.log("Unable to find location");
//   } else {
//     const parsedResCoords = response.body.features[0]?.center;
//     console.log(`Latitude: ${parsedResCoords[1]} | Longitude: ${parsedResCoords[0]}}`)
//   }
// })


function geoCode(address, callback) {
  const url = `http://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=pk.eyJ1IjoiYmhhcmdhdi1wYW5keWEiLCJhIjoiY2txYW9wd2kwMG81aTJubGJlaXp2aGttdCJ9.wPPzAdbSdkO1yTP-hC5DKg&limit=1`

  request({ url, json: true }, function getCoordinates(error, response) {
    if (error) {
      callback(`Unable to connect to the location services. Error body: ${error}`, null);
    } else if (response?.body?.features?.length == 0) {
      callback(`Unable to find location. Try another service`, null);
    } else {
      callback(null, {
        latitude: response?.body?.features[0]?.center[1],
        longitude: response?.body?.features[0]?.center[0],
        location: response?.body?.features[0]?.place_name
      });
    }
  });
}

module.exports = geoCode;
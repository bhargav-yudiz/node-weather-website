// hierarchy for require statements:
// 1) Core Modules provided my Node
// 2) NPM Modules
// 3) File/Folder Imports
// path is a cross platform compatible core module provided by Node 
const path = require("path");
// express in itself is a single huge function of sorts.. you need to call it in order to get a new express application
const express = require("express");
const hbs = require("hbs");
const geoCode = require("./utils/geoCode");
const fetchWeatherForLocation = require("./utils/weatherService");

// __dirname && __filename are provided by the wrapper function provided by NodeJS
// __dirname contains path to the directory the current folder (app.js) resides in
// console.log(__dirname);
// path.join() returns the final path. we pass individual pieces/strings to it and it manipulates the string for us to get us the desired path
// console.log(path.join(__dirname, "../public"));
// __filename gives you the complete path from the root of your machine all the way to the source folder
// console.log(__filename);

const app = express();

// to serve up a directory using express, like in this case to serve up public folder using express call app.use()
// .use() is a way to customize your server
// express.static() is another function. in this we can pass the path to the folder that we wanna serve up. the return value of express.static() will be passed to app.use();
// static() only renders static pages (pages that don't change on refresh) 
// index.html is a special name. say it is at the root of public directory, then "/" path would serve up index.html
// since we are already serving up a page for the "/" path, express is not go any further and send response for the app.get("/") path
// app.use(express.static(path.join(__dirname, "../public/")));
// here we are asking express to use the publicDirPath to gain access of everything inside our public directory
const publicDirPath = path.join(__dirname, "../public");
// app.use(express.static) is the setup to serve static directory
app.use(express.static(publicDirPath));

// if we wanted "views" folder to have a different name we'd have to create another path for that dir 
const viewsPath = path.join(__dirname, "../templates/views");

// set allows you to set a value for a given express setting
// - we have the key which is the setting name
// - & we have the value that we wanna set for that key
// here we set hbs (handlebars - dynamic templating engine) as the "view engine" for express
// express expects all our views to be in a specific folder on the root of this project.. we have the "views" folder
app.set("view engine", "hbs");

// if we wanna use a directory other than views for loading hbs, we again need to do app.set in order to use the viewsPath
app.set("views", viewsPath);

// path for loading hbs partials
const partialsPath = path.join(__dirname, "../templates/partials");
// following lines register the partials by taking in the path to the partials file
hbs.registerPartials(partialsPath);

// following lines will process the response when client makes get request on path "/"
app.get("/", function appHomeGet(req, res) {
  // .render() allows us to render one of our views.
  // .render() converts the hbs view you're about to render into html
  // we have already configured express to use the view engine : hbs so we can render handlebars templates
  // 1 - the first arg string we pass in render needs to match the name of the file (that is in views directory) & no need of extension 
  // 2 - 2nd argument is an object that contains all the values that we want our view to dynamically access
  res.render("index", {
    title: "Weather Application",
    name: "Andrew Mandrew Sandrew"
  });
});

// imagine we have an app that serves these 3 routes.. to serve different routes you use .get() method that express provides for sending a response to the get request by the client
// app.com
// app.com/help
// app.com/about

// .get() takes in 2 args..
// 1) Route/Partial-URL 
// 2) function where we describe what to do when client tries to visit that route
//    - appHomeGet has two args
//    - req/request which is an object containing information about the incoming request from the client
//    - res/response : contains a bunch of methods that allows us to customize what response we'd send back to the requestor
// app.get("/", function appHomeGet(req, res) {
//   // res.send() to send a response back to the requestor 
//   // you can send back stuff like HTML/JSON data
//   res.send("<h1>Hello Express!</h1>");
// });

// const temp = express.static(__dirname + "../public")
// console.log(temp);
// app.use(express.static(path.join(__dirname, "../public")));
app.get("/help", function appHelpGet(req, res) {
  res.render("help", {
    title: "The Help",
    name: "Andrew Garfield",
    msg: "this is an example message"
  });
})
// app.get("/help", function appHelpGet(req, res) {
//   // express automatically converts this object/array to JSON
//   res.send([
//     {
//       name: "bhargav",
//       age: 2
//     },
//     {
//       name: "pandya",
//       age: 4
//     }
//   ]);
// });

app.get("/about", function appAboutGet(req, res) {
  res.render("about", {
    title: "About Page",
    info: "this is just some really interesting information about me and this particular page that I have built",
    name: "Do you really think I have a name?"
  });
})
// app.get("/about", function appAboutGet(req, res) {
//   res.send("<h1>About Page</h1>");
// });

app.get("/weather", function appWeatherGet(req, res) {
  if (!req.query.address) return res.send({ error: "Address Must Be Provided" });

  geoCode(req?.query?.address, function geoCodeCb(geoDataErr, geoDataResponse) {
    if (geoDataErr) res.send({ error: geoDataErr });
    else {
      const { location, latitude, longitude } = geoDataResponse;
      fetchWeatherForLocation(latitude, longitude, function fetchWeatherCb(fetchWeatherErr, fetchWeatherData) {
        if (fetchWeatherErr) return res.send({ error: fetchWeatherErr });
        const { temperature } = fetchWeatherData
        // res.send(fetchWeatherData);
        res.send({
          forecast: fetchWeatherData?.forecast,
          location: fetchWeatherData?.location,
          address: req?.query?.address
        });
      });
    }
  });
});

app.get("/products", function appProductsGet(req, res) {
  if (!req.query.search) return res.send({ error: "You Must Provide a Search Term" });
  // query is an object on request
  // queries are formed my doing ?first-key=first-value&second-key=second-value at the end of your endpoint
  console.log(req.query);

  // you cannot send response twice on one request!
  res.send({
    products: []
  });
});

// following page will handle errors for when user tries to visit help/a-page-that-does-not-exist
app.get("/help/*", function (req, res) {
  res.render("error", {
    title: "Wrong Help Page",
    message: "motherfucker! this is the wrong help page",
    goBack: "Wanna Go Back to Help Page? Click me",
    name: "I am anonymous"
  });
})

// always get the * route at the end (for error handling) so that only after none of the routes above match, shall we display the error page
app.get("*", function appErrGet(req, res) {
  res.render("error", {
    title: "ERROR PAGE!!!!",
    message: "The route you're trying to reach does not exist!!! GO BACK IN 2 SECONDS OR YOU DIE",
    name: "unknown entity",
    goBack: "Let's get back to the home page shall we?"
  })
});

app.listen(3000, function appListenerCb() {
  console.log("Server is listening on port 3000");
});
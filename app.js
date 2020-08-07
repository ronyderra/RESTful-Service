global.config = require("./config.json"); // Load once config.json file.

const express = require("express"); // Get Express.
const productsController = require("./controllers/products-controller"); // Get the Controller.
const server = express(); // Create the server.

server.use(express.json()); // Support JSON in the body.
server.use("/api/products", productsController); // If client request the root address - give the control to productsController router.
server.use("*", (request, response) => response.sendStatus(404)); // On any other route - return 404 error.
 
server.listen(3003, ()=>console.log("Listening on http://localhost:3003")); // Load server to the air.

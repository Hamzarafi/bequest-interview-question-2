import express from "express";
import cors from "cors";

const PORT = 8080;
const app = express();

// Database structure to hold data, hash, and history for versioning
// #TODO: change structure to hold hash and history
const database = { data: "Hello World" };


// Middleware to parse JSON and handle CORS
app.use(cors());
app.use(express.json());


// #TODO: add a sanitization function for input


// Routes

// #TODO change to return current data and hash
app.get("/", (req, res) => {
  res.json(database);
});

// #TODO update according to new data structure and validates and sanitizes input before storing
app.post("/", (req, res) => {
  database.data = req.body.data;
  res.sendStatus(200);
});

// #TODO new route to return previous versions of the data


app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});

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

/**
 * Sanitizes the input data to prevent any harmful content
 * Only allows strings of certain length and removes harmful characters
 */
const sanitizeInput = (input: string): string => {
  return input.replace(/[^a-zA-Z0-9\s]/g, "").trim();
};

// Routes

// #TODO change to return current data and hash
app.get("/", (req, res) => {
  res.json(database);
});

// #TODO update according to new data structure and validates and sanitizes input before storing
app.post("/", (req, res) => {
  let newData = req.body.data;

  // Validate input
  if (typeof newData !== "string" || newData.trim() === "") {
    return res
      .status(400)
      .json({ error: "Invalid data: must be a non-empty string" });
  }
  if (newData.length > 100) {
    return res
      .status(400)
      .json({ error: "Invalid data: must be less than 100 characters" });
  }

  // Sanitize input to remove potentially harmful content
  newData = sanitizeInput(newData);

  database.data = newData;
  res.sendStatus(200);
});

// #TODO new route to return previous versions of the data

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});

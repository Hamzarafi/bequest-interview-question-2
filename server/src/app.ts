import express from "express";
import cors from "cors";
import { generateHash } from "../utilities/utils";

const PORT = 8080;
const app = express();

// Database structure to hold data, hash, and history for versioning
const database = {
  data: "",
  hash: "",
  versions: [] as { data: string; hash: string }[],
};

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

/**
 * GET route to return current data and hash
 */
app.get("/", (req, res) => {
  res.json({ data: database.data, hash: database.hash });
});

/**
 * POST route to update the data.
 * Validates and sanitizes input before storing.
 */
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

  // Update data and hash
  database.data = newData;
  database.hash = generateHash(newData);

  // Save the current data to history for versioning
  database.versions.push({ data: database.data, hash: database.hash });

  res.sendStatus(200);
});

/**
 * GET route to return previous versions of the data
 */
app.get("/history", (req, res) => {
  res.json(database.versions);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

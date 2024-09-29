import React, { useEffect, useState } from "react";
import { generateHash } from "./utilities/utils";

const API_URL = "http://localhost:8080";
const HASH_KEY = "stored_hash"; // Local storage key for the hash

function App() {
  const [data, setData] = useState<string>(""); // Holds the current data
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [history, setHistory] = useState<{ data: string; hash: string }[]>([]);
  const [tampered, setTampered] = useState<boolean>(false); // Tracks if data has been tampered

  // Fetches data and hash from the server when the component mounts
  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    getHistory(); // Fetch history for recovery option
  }, [data]);

  // Fetches data and its corresponding hash from the server
  const getData = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Failed to fetch data from server.");

      const { data, hash } = await response.json();
      setData(data);
      setErrorMessage("");
    } catch (error: any) {
      setErrorMessage(`Error fetching data: ${error.message}`);
    }
  };

  // Fetches version history from server for recovery
  const getHistory = async () => {
    try {
      const response = await fetch(`${API_URL}/history`);
      if (!response.ok) throw new Error("Failed to fetch history from server.");

      const history = await response.json();
      setHistory(history);
      setErrorMessage("");
    } catch (error: any) {
      setErrorMessage(`Error fetching data: ${error.message}`);
    }
  };

  // Updates the data on the server after validation and sanitization
  const updateData = async () => {
    if (!validateInput(data)) return; // Validate before sending
    try {
      const hash = generateHash(data); // Generate hash for the current data
      localStorage.setItem(HASH_KEY, hash); // Store the hash locally

      const response = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({ data }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to update data on server.");

      await getData(); // Fetch updated data after success
    } catch (error: any) {
      setErrorMessage(`Error updating data: ${error.message}`);
    }
  };

  // Validates input (e.g., non-empty strings)
  const validateInput = (input: string | undefined): boolean => {
    if (!input || input.trim() === "") {
      setErrorMessage("Data cannot be empty!");
      return false;
    }
    if (input.length > 100) {
      setErrorMessage("Data too long. Must be less than 100 characters.");
      return false;
    }
    setErrorMessage(""); // Clear error if valid
    return true;
  };

  // Verifies if the current data has been tampered with
  const verifyData = async () => {
    try {
      const storedHash = localStorage.getItem(HASH_KEY);

      if (!storedHash) {
        alert("No hash found, please update the data first.");
        return;
      }

      const currentHash = generateHash(data); // Generate hash for current data
      if (currentHash === storedHash) {
        alert("Data integrity verified: no tampering detected.");
      } else {
        setTampered(true);
        setErrorMessage("Warning: Data integrity compromised!");
      }
    } catch (error: any) {
      setErrorMessage(`Error verifying data: ${error.message}`);
    }
  };

  // Fetches previous version of data to recover in case of tampering
  const recoverData = async () => {
    try {
      if (history.length === 0) {
        alert("No previous versions available.");
        return;
      }

      // Use the last version in history
      const lastVersion = history[history.length - 1];
      setData(lastVersion.data);
      localStorage.setItem(HASH_KEY, lastVersion.hash); // Restore the correct hash
      setErrorMessage("Previous version recovered successfully.");
      setTampered(false); // Reset tampered state
    } catch (error: any) {
      setErrorMessage(`Error recovering data: ${error.message}`);
    }
  };

  // Simulate tampering by modifying the data directly
  const simulateTamperedData = () => {
    setData(data + " - tampered");
    alert("Simulated tampering: Data has been modified.");
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        position: "absolute",
        padding: 0,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "20px",
        fontSize: "30px",
      }}
    >
      <div>Saved Data</div>
      <input
        style={{
          fontSize: "30px",
          borderColor: tampered ? "red" : "black", // Red border if data is tampered
        }}
        type="text"
        value={data}
        onChange={(e) => setData(e.target.value)}
      />

      {errorMessage && (
        <div style={{ color: "red", fontSize: "18px" }}>{errorMessage}</div>
      )}

      <div style={{ display: "flex", gap: "10px" }}>
        <button style={{ fontSize: "20px" }} onClick={updateData}>
          Update Data
        </button>
        <button style={{ fontSize: "20px" }} onClick={verifyData}>
          Verify Data
        </button>
        {tampered && (
          <button style={{ fontSize: "20px" }} onClick={recoverData}>
            Recover Data
          </button>
        )}
      </div>

      <button
        style={{ fontSize: "20px", marginTop: "20px" }}
        onClick={simulateTamperedData}
      >
        Simulate Tampered Data
      </button>
    </div>
  );
}

export default App;

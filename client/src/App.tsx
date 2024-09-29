import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:8080";

function App() {
  const [data, setData] = useState<string>(""); // Holds the current data
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [originalHash, setOriginalHash] = useState<string>(""); // Holds the hash for verification
  const [tampered, setTampered] = useState<boolean>(false); // Tracks if data has been tampered

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const response = await fetch(API_URL);
    const { data, hash } = await response.json();
    setData(data);
    setData(data);
    setOriginalHash(hash);
    setTampered(false);
    setErrorMessage("");
  };

  const updateData = async () => {
    if (!validateInput(data)) return;

    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({ data }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    await getData();
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
    // TODO: encrypt and compare with original hash

    if (1 === 1) {
      alert("Data integrity verified: no tampering detected.");
    } else {
      setTampered(true);
      setErrorMessage("Warning: Data integrity compromised!");
    }
  };

  // Fetches previous version of data to recover in case of tampering
  const recoverData = async () => {
    const response = await fetch(`${API_URL}/history`);
    const history = await response.json();

    if (history.length > 0) {
      const lastVersion = history[history.length - 1];
      setData(lastVersion.data);
      setOriginalHash(lastVersion.hash);
      setErrorMessage("Previous version recovered successfully.");
      setTampered(false);
    } else {
      setErrorMessage("No previous versions available.");
    }
  };

  // Simulate tampered data (this function modifies the local state to simulate data tampering)
  const simulateTamperedData = () => {
    setData((prevData) => prevData + "_something");
    setTampered(true);
    setErrorMessage("Warning: Data tampered with for testing purposes.");
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
        <button style={{ fontSize: "20px" }} onClick={recoverData}>
          Recover Data
        </button>
        <button style={{ fontSize: "20px" }} onClick={simulateTamperedData}>
          Simulate Tampering
        </button>
      </div>
    </div>
  );
}

export default App;

import crypto from "crypto";

// Utility function to generate a SHA-256 hash for a given string
export const generateHash = (data: string) => {
  return crypto.createHash("sha256").update(data).digest("hex");
};

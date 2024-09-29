import crypto from "crypto";

// Generate SHA-256 hash for the given string (helper function)
export const generateHash = (data: string) => {
  return crypto.createHash("sha256").update(data).digest("hex");
};

# Tamper Proof Data

At Bequest, we require that important user data be tamper-proof. If our system is compromised, incorrect data distribution could cause significant issues. This document explains how we ensure data integrity and how we recover data in case of tampering.

## 1. How does the client ensure that their data has not been tampered with?

### **Solution: Cryptographic Hashing**

To ensure the integrity of the data, we have implemented **SHA-256 hashing** on the server-side, which generates a unique fingerprint for the data. This hash is provided to the client alongside the data, allowing the client to verify that the data has not been altered.

### **Why SHA-256?**
- **Security**: SHA-256 is a widely-used cryptographic hashing algorithm that produces a 256-bit hash. It is collision-resistant, meaning it is nearly impossible for two different data inputs to produce the same hash. Even the smallest change to the data will result in a drastically different hash.
- **Efficiency**: Despite being secure, SHA-256 is computationally efficient and can be easily used in both backend and frontend environments without introducing significant performance overhead.

### **How It Works:**
1. **Data Retrieval**: When the client requests data from the server, the server responds with both the data and its SHA-256 hash.
2. **Verification**: On the client side, the data is hashed again using the same SHA-256 algorithm, and the client compares the server-provided hash with the locally generated one. If the hashes match, the data has not been tampered with. If they don't match, tampering is detected.

### **Code Implementation:**
- **Server-side**: We use the `crypto` module in Node.js to generate the SHA-256 hash when the data is created or updated.
- **Client-side**: The client fetches the hash from the server and generates its own hash using the SubtleCrypto API available in modern browsers.

This ensures that if the data is tampered with on the server, during transmission, or after being fetched by the client, the tampering will be detected before any critical decisions or actions are made based on that data.

### **Advantages:**
- **Simplicity**: This method introduces minimal complexity and can be implemented with native libraries on both the client and server.
- **Widely Supported**: SHA-256 is supported in most platforms and environments, ensuring compatibility and future-proofing.
- **Low Overhead**: The hash calculation is quick and efficient, even for large datasets.

---

## 2. If the data has been tampered with, how can the client recover the lost data?

### **Solution: Version History**

In the event of data tampering, we use a **versioning system** on the server that stores a history of all previous versions of the data. When tampering is detected, the client can recover the last untampered version from this history.

### **Why Version History?**
- **Data Recovery**: By keeping a history of all previous versions, the client can easily recover any previous state if tampering is detected. This is especially useful for critical data where even temporary tampering can have significant consequences.
- **Resilience**: Even if the latest version of the data is compromised, previous versions remain untouched and can be restored, ensuring the system remains operational.

### **How It Works:**
1. **Version Storage**: Every time the data is updated on the server, the current version of the data and its corresponding hash are stored in a version history.
2. **Recovery**: If the client detects tampering, it can request a previous untampered version of the data from the server. The client can then restore this version and continue operations without using compromised data.

### **Code Implementation:**
- **Server-side**: When the client updates the data, the server stores the current data and hash in a history array before applying the update. This array allows the server to track all versions of the data.
- **Client-side**: If tampering is detected, the client can fetch the previous versions from the server and restore the last valid version.

### **Advantages:**
- **Simple Recovery**: This approach allows easy recovery without requiring complex mechanisms like blockchain or third-party backups.
- **Efficient**: Storing a few previous versions does not introduce significant storage overhead, especially for small datasets.

---

### **Alternatives Considered:**
1. **Digital Signatures**: We considered using digital signatures to verify data integrity. While more secure, this method would require key management and introduce additional complexity.
2. **Blockchain**: Blockchain could provide an immutable, tamper-proof data store. However, the complexity, performance overhead, and storage requirements make this approach less practical for this use case.
3. **Third-Party Backup Services**: Using external services (e.g., cloud storage) to store backups and verify data could be another solution. While this would reduce the server’s responsibility for data integrity, it would introduce costs, external dependencies, and potential data privacy concerns.

We opted for a versioning system due to its simplicity, low overhead, and ease of implementation within the existing infrastructure.

---

## To Run the App:

1. Install dependencies:
   ```bash
   npm install

2. Start the frontend and backend:
    In the server and client directory:

   ```bash
   npm run start


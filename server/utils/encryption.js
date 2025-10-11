import crypto from "crypto";

// ⚡ Must be 32 bytes for AES-256
console.log("⚡ encryption.js file loaded at startup");
console.log("process.env.CHAT_SECRET_KEY (raw):", process.env.CHAT_SECRET_KEY);

console.log("CHAT_SECRET_KEY:", process.env.CHAT_SECRET_KEY);
const key = Buffer.from(process.env.CHAT_SECRET_KEY, "hex"); 
const algorithm = "aes-256-cbc";
console.log("Key length (bytes):",key.length);

// 🔐 Encrypt text
export const encryptText = (plainText) => {
  const iv = crypto.randomBytes(16); // random initialization vector
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(plainText, "utf-8", "hex");
  encrypted += cipher.final("hex");

  return {
    content: encrypted,
    iv: iv.toString("hex"),
  };
};

// 🔓 Decrypt text
export const decryptText = (encrypted, ivHex) => {
  const decipher = crypto.createDecipheriv(
    algorithm,
    key,
    Buffer.from(ivHex, "hex")
  );
  let decrypted = decipher.update(encrypted, "hex", "utf-8");
  decrypted += decipher.final("utf-8");
  return decrypted;
};

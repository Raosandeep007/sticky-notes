import { useState } from "react";

const ID_SIZE = 6;
const DECODED_SIZE = 4;

const generateRandomId = () => {
  // Generate a random ID using crypto API
  return btoa(
    crypto.getRandomValues(new Uint8Array(DECODED_SIZE)).join("")
  ).slice(0, ID_SIZE);
};

export function useCryptoId() {
  const [id, setId] = useState(() => generateRandomId());

  const isValidId = (id: string) => {
    // Check if the ID is a valid base64 string and has the correct length
    try {
      const decoded = atob(id);
      return decoded.length === 4 && /^[A-Za-z0-9+/]+={0,2}$/.test(id);
    } catch (e) {
      return false;
    }
  };

  const generateNewId = () => {
    const newId = generateRandomId();
    setId(newId);
  };

  return { id, generateNewId, isValidId };
}

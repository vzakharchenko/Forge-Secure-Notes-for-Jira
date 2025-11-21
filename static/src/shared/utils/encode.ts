export const DERIVE_PURPOSE_ENCRYPTION = "forge-secure-note:v1:encrypt";
export const DERIVE_PURPOSE_VERIFICATION = "forge-secure-note:v1:verify";

function bufferToHex(buffer: ArrayBuffer | Uint8Array) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function hexToBuffer(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function arrayBufferToBase64url(buffer: ArrayBuffer): string {
  return arrayBufferToBase64(buffer).replace(/\+/g, "").replace(/\//g, "").replace(/=+$/, "");
}

async function hashFunction(data: string, salt: string, iterations = 27000): Promise<ArrayBuffer> {
  const passwordBuffer = new TextEncoder().encode(data);
  const importedKey = await crypto.subtle.importKey("raw", passwordBuffer, "PBKDF2", false, [
    "deriveBits",
  ]);
  return window.crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: new TextEncoder().encode(salt),
      iterations,
      hash: { name: "SHA-256" },
    },
    importedKey,
    256,
  );
}

export async function calculateHash(
  data: string,
  salt: string,
  iterations = 27000,
): Promise<string> {
  return bufferToHex(await hashFunction(data, salt, iterations));
}
export async function calculateHashBase64(
  data: string,
  salt: string,
  iterations = 27000,
): Promise<string> {
  return arrayBufferToBase64url(await hashFunction(data, salt, iterations));
}

export type EncryptedPayload = {
  encrypted: string;
  iv: string;
  salt: string;
};

export async function encryptMessage(plaintext: string, password: string) {
  const enc = new TextEncoder();

  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const keyMaterial = await getKeyMaterial(password);
  const key = await deriveKey(keyMaterial, salt);

  const encrypted = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
    },
    key,
    enc.encode(plaintext),
  );

  return {
    encrypted: bufferToHex(new Uint8Array(encrypted)),
    iv: bufferToHex(iv),
    salt: bufferToHex(salt),
  };
}

export async function decryptMessage(
  payload: { encrypted: string; iv: string; salt: string },
  password: string,
) {
  const dec = new TextDecoder();

  const keyMaterial = await getKeyMaterial(password);
  const key = await deriveKey(keyMaterial, hexToBuffer(payload.salt) as BufferSource);

  const decrypted = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: hexToBuffer(payload.iv) as BufferSource,
    },
    key,
    hexToBuffer(payload.encrypted) as BufferSource,
  );

  return dec.decode(decrypted);
}

// helpers

async function getKeyMaterial(password: string) {
  const enc = new TextEncoder();
  return crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveKey"]);
}

async function deriveKey(keyMaterial: CryptoKey, salt: BufferSource) {
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 100_000,
      hash: "SHA-256",
    },
    keyMaterial,
    {
      name: "AES-GCM",
      length: 256,
    },
    false,
    ["encrypt", "decrypt"],
  );
}

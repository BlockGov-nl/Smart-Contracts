import { expect } from "chai";
import { ethers } from "hardhat";
import { EncryptedProfileStorage, EncryptedProfileStorage__factory } from "../typechain";
import crypto from "crypto";
import zlib from "zlib";

// AES encryption and decryption functions
const ENCRYPTION_KEY = crypto.randomBytes(32); // 32 bytes for AES-256
const IV_LENGTH = 16; // AES block size

function encryptData(data: string): Buffer {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
    let encrypted = cipher.update(data);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return Buffer.concat([iv, encrypted]); // Prepend IV to the encrypted data
}

function decryptData(encryptedData: Buffer): string {
    const iv = encryptedData.slice(0, IV_LENGTH); // Extract IV from the beginning
    const encryptedText = encryptedData.slice(IV_LENGTH);
    const decipher = crypto.createDecipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

// Compression and decompression functions
function compressData(data: Buffer): string {
    const compressed = zlib.deflateSync(data);
    return ethers.hexlify(compressed);
}

function decompressData(compressedData: string): Buffer {
    const compressedBuffer = ethers.getBytes(compressedData);
    return zlib.inflateSync(Buffer.from(compressedBuffer));
}

describe("EncryptedProfileStorage with Encryption and Compression", function () {
  let encryptedProfileStorage: EncryptedProfileStorage;
  let owner: any;
  let nonOwner: any;

  beforeEach(async function () {
    const EncryptedProfileStorageFactory = await ethers.getContractFactory("EncryptedProfileStorage") as EncryptedProfileStorage__factory;
    [owner, nonOwner] = await ethers.getSigners();
    encryptedProfileStorage = await EncryptedProfileStorageFactory.deploy();
  });

  it("Should store, retrieve, encrypt, and compress name (John Doe)", async function () {
    const keyName = 0;
    const originalName = "John Doe";

    // Encrypt the data
    const encryptedName = encryptData(originalName);

    // Compress the encrypted data
    const compressedName = compressData(encryptedName);

    // Store the compressed encrypted data
    await encryptedProfileStorage.storeEncryptedData(keyName, compressedName);

    // Retrieve the compressed encrypted data
    const retrievedData = await encryptedProfileStorage.retrieveEncryptedData(keyName);

    // Decompress the retrieved data
    const decompressedName = decompressData(retrievedData);

    // Decrypt the decompressed data
    const decryptedName = decryptData(decompressedName);

    // Expect the decrypted data to match the original
    expect(decryptedName).to.equal(originalName);
  });

  it("Should store, retrieve, encrypt, and compress email (john.doe@example.com)", async function () {
    const keyEmail = 1;
    const originalEmail = "john.doe@example.com";

    // Encrypt the data
    const encryptedEmail = encryptData(originalEmail);

    // Compress the encrypted data
    const compressedEmail = compressData(encryptedEmail);

    // Store the compressed encrypted data
    await encryptedProfileStorage.storeEncryptedData(keyEmail, compressedEmail);

    // Retrieve the compressed encrypted data
    const retrievedData = await encryptedProfileStorage.retrieveEncryptedData(keyEmail);

    // Decompress the retrieved data
    const decompressedEmail = decompressData(retrievedData);

    // Decrypt the decompressed data
    const decryptedEmail = decryptData(decompressedEmail);

    // Expect the decrypted data to match the original
    expect(decryptedEmail).to.equal(originalEmail);
  });

  it("Should return empty bytes if no data is stored", async function () {
    const keyEmail = 1; // DataKey.Email

    const retrievedData = await encryptedProfileStorage.retrieveEncryptedData(keyEmail);
    expect(retrievedData).to.equal(ethers.zeroPadBytes('0x', 0)); // empty bytes32 value
  });
});

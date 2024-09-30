// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EncryptedProfileStorage {

    // Enum to define keys for encrypted data (Profile fields)
    enum DataKey { Name, Email, Phone }

    // Mapping to store encrypted data as bytes, associated with each wallet
    mapping(address => mapping(DataKey => bytes)) private encryptedWalletData;

    // Function to store encrypted data (as bytes) for the sender's wallet
    function storeEncryptedData(DataKey key, bytes memory encryptedData) public {
        encryptedWalletData[msg.sender][key] = encryptedData;
    }

    // Function to retrieve encrypted data (as bytes) for the sender's wallet
    function retrieveEncryptedData(DataKey key) public view returns (bytes memory) {
        return encryptedWalletData[msg.sender][key];
    }
}

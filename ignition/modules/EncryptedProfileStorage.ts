// ignition/modules/EncryptedProfileStorageModule.ts
// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const EncryptedProfileStorageModule = buildModule("EncryptedProfileStorageModule", (m) => {
  // There are no constructor arguments for EncryptedProfileStorage, so we don't need any parameters
  const encryptedProfileStorage = m.contract("EncryptedProfileStorage");

  return { encryptedProfileStorage };
});

export default EncryptedProfileStorageModule;

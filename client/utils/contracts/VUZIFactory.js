const VUZIFactory = {
  address: "0xcbd8EF2d15E11fC65793e693d7D11e918fAfa5D6",
  abi: [
    {
      inputs: [
        {
          internalType: "address",
          name: "_trustedForwarder",
          type: "address",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      name: "VUZINameToDetails",
      outputs: [
        {
          internalType: "address",
          name: "walletAddress",
          type: "address",
        },
        {
          internalType: "bool",
          name: "isUsed",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "accountImplementation",
      outputs: [
        {
          internalType: "contract VUZI",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "name",
          type: "string",
        },
        {
          components: [
            {
              components: [
                {
                  internalType: "uint256",
                  name: "X",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "Y",
                  type: "uint256",
                },
              ],
              internalType: "struct Pairing.G1Point",
              name: "a",
              type: "tuple",
            },
            {
              components: [
                {
                  internalType: "uint256[2]",
                  name: "X",
                  type: "uint256[2]",
                },
                {
                  internalType: "uint256[2]",
                  name: "Y",
                  type: "uint256[2]",
                },
              ],
              internalType: "struct Pairing.G2Point",
              name: "b",
              type: "tuple",
            },
            {
              components: [
                {
                  internalType: "uint256",
                  name: "X",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "Y",
                  type: "uint256",
                },
              ],
              internalType: "struct Pairing.G1Point",
              name: "c",
              type: "tuple",
            },
          ],
          internalType: "struct RecoveryVerifier.Proof",
          name: "proof",
          type: "tuple",
        },
        {
          internalType: "uint256[2]",
          name: "_passwordHash",
          type: "uint256[2]",
        },
      ],
      name: "changePasscode",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "name",
          type: "string",
        },
        {
          internalType: "uint256[2]",
          name: "_passwordHash",
          type: "uint256[2]",
        },
        {
          internalType: "uint256[4]",
          name: "_recoveryHashes",
          type: "uint256[4]",
        },
        {
          internalType: "uint256",
          name: "salt",
          type: "uint256",
        },
      ],
      name: "createAccount",
      outputs: [
        {
          internalType: "contract VUZI",
          name: "ret",
          type: "address",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "name",
          type: "string",
        },
        {
          components: [
            {
              components: [
                {
                  internalType: "uint256",
                  name: "X",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "Y",
                  type: "uint256",
                },
              ],
              internalType: "struct PasscodePairing.PasscodeG1Point",
              name: "a",
              type: "tuple",
            },
            {
              components: [
                {
                  internalType: "uint256[2]",
                  name: "X",
                  type: "uint256[2]",
                },
                {
                  internalType: "uint256[2]",
                  name: "Y",
                  type: "uint256[2]",
                },
              ],
              internalType: "struct PasscodePairing.PasscodeG2Point",
              name: "b",
              type: "tuple",
            },
            {
              components: [
                {
                  internalType: "uint256",
                  name: "X",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "Y",
                  type: "uint256",
                },
              ],
              internalType: "struct PasscodePairing.PasscodeG1Point",
              name: "c",
              type: "tuple",
            },
          ],
          internalType: "struct PasscodeVerifier.PasscodeProof",
          name: "proof",
          type: "tuple",
        },
        {
          internalType: "address[]",
          name: "dest",
          type: "address[]",
        },
        {
          internalType: "uint256[]",
          name: "value",
          type: "uint256[]",
        },
        {
          internalType: "bytes[]",
          name: "func",
          type: "bytes[]",
        },
      ],
      name: "executeBatchVUZITx",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "name",
          type: "string",
        },
        {
          components: [
            {
              components: [
                {
                  internalType: "uint256",
                  name: "X",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "Y",
                  type: "uint256",
                },
              ],
              internalType: "struct PasscodePairing.PasscodeG1Point",
              name: "a",
              type: "tuple",
            },
            {
              components: [
                {
                  internalType: "uint256[2]",
                  name: "X",
                  type: "uint256[2]",
                },
                {
                  internalType: "uint256[2]",
                  name: "Y",
                  type: "uint256[2]",
                },
              ],
              internalType: "struct PasscodePairing.PasscodeG2Point",
              name: "b",
              type: "tuple",
            },
            {
              components: [
                {
                  internalType: "uint256",
                  name: "X",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "Y",
                  type: "uint256",
                },
              ],
              internalType: "struct PasscodePairing.PasscodeG1Point",
              name: "c",
              type: "tuple",
            },
          ],
          internalType: "struct PasscodeVerifier.PasscodeProof",
          name: "proof",
          type: "tuple",
        },
        {
          internalType: "address",
          name: "dest",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
        {
          internalType: "bytes",
          name: "func",
          type: "bytes",
        },
      ],
      name: "executeVUZITx",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "name",
          type: "string",
        },
        {
          internalType: "uint256[2]",
          name: "_passwordHash",
          type: "uint256[2]",
        },
        {
          internalType: "uint256[4]",
          name: "_recoveryHashes",
          type: "uint256[4]",
        },
        {
          internalType: "uint256",
          name: "salt",
          type: "uint256",
        },
      ],
      name: "getAddress",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "name",
          type: "string",
        },
      ],
      name: "getVuzi",
      outputs: [
        {
          components: [
            {
              internalType: "address",
              name: "walletAddress",
              type: "address",
            },
            {
              internalType: "bool",
              name: "isUsed",
              type: "bool",
            },
          ],
          internalType: "struct VUZIStorage.VUZIDetails",
          name: "",
          type: "tuple",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "forwarder",
          type: "address",
        },
      ],
      name: "isTrustedForwarder",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          components: [
            {
              components: [
                {
                  internalType: "uint256",
                  name: "X",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "Y",
                  type: "uint256",
                },
              ],
              internalType: "struct PasscodePairing.PasscodeG1Point",
              name: "a",
              type: "tuple",
            },
            {
              components: [
                {
                  internalType: "uint256[2]",
                  name: "X",
                  type: "uint256[2]",
                },
                {
                  internalType: "uint256[2]",
                  name: "Y",
                  type: "uint256[2]",
                },
              ],
              internalType: "struct PasscodePairing.PasscodeG2Point",
              name: "b",
              type: "tuple",
            },
            {
              components: [
                {
                  internalType: "uint256",
                  name: "X",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "Y",
                  type: "uint256",
                },
              ],
              internalType: "struct PasscodePairing.PasscodeG1Point",
              name: "c",
              type: "tuple",
            },
          ],
          internalType: "struct PasscodeVerifier.PasscodeProof",
          name: "proof",
          type: "tuple",
        },
        {
          internalType: "uint256[4]",
          name: "input",
          type: "uint256[4]",
        },
      ],
      name: "passcodeVerifyTx",
      outputs: [
        {
          internalType: "bool",
          name: "r",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          components: [
            {
              components: [
                {
                  internalType: "uint256",
                  name: "X",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "Y",
                  type: "uint256",
                },
              ],
              internalType: "struct Pairing.G1Point",
              name: "a",
              type: "tuple",
            },
            {
              components: [
                {
                  internalType: "uint256[2]",
                  name: "X",
                  type: "uint256[2]",
                },
                {
                  internalType: "uint256[2]",
                  name: "Y",
                  type: "uint256[2]",
                },
              ],
              internalType: "struct Pairing.G2Point",
              name: "b",
              type: "tuple",
            },
            {
              components: [
                {
                  internalType: "uint256",
                  name: "X",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "Y",
                  type: "uint256",
                },
              ],
              internalType: "struct Pairing.G1Point",
              name: "c",
              type: "tuple",
            },
          ],
          internalType: "struct RecoveryVerifier.Proof",
          name: "proof",
          type: "tuple",
        },
        {
          internalType: "uint256[6]",
          name: "input",
          type: "uint256[6]",
        },
      ],
      name: "recoveryVerifyTx",
      outputs: [
        {
          internalType: "bool",
          name: "r",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "name",
          type: "string",
        },
        {
          components: [
            {
              components: [
                {
                  internalType: "uint256",
                  name: "X",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "Y",
                  type: "uint256",
                },
              ],
              internalType: "struct PasscodePairing.PasscodeG1Point",
              name: "a",
              type: "tuple",
            },
            {
              components: [
                {
                  internalType: "uint256[2]",
                  name: "X",
                  type: "uint256[2]",
                },
                {
                  internalType: "uint256[2]",
                  name: "Y",
                  type: "uint256[2]",
                },
              ],
              internalType: "struct PasscodePairing.PasscodeG2Point",
              name: "b",
              type: "tuple",
            },
            {
              components: [
                {
                  internalType: "uint256",
                  name: "X",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "Y",
                  type: "uint256",
                },
              ],
              internalType: "struct PasscodePairing.PasscodeG1Point",
              name: "c",
              type: "tuple",
            },
          ],
          internalType: "struct PasscodeVerifier.PasscodeProof",
          name: "proof",
          type: "tuple",
        },
      ],
      name: "verifyVUZIPassword",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ],
  inheritedFunctions: {
    VUZINameToDetails: "contracts/VUZIStorage.sol",
    getVuzi: "contracts/VUZIStorage.sol",
    isTrustedForwarder: "@openzeppelin/contracts/metatx/ERC2771Context.sol",
    passcodeVerifyTx: "contracts/verifier/PasscodeVerifier.sol",
    recoveryVerifyTx: "contracts/verifier/RecoveryVerifier.sol",
  },
};

export default VUZIFactory;

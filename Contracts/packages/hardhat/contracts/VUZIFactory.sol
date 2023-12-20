//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./VUZI.sol";
import "./VUZIStorage.sol";

import "@openzeppelin/contracts/utils/Create2.sol";
import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import "@openzeppelin/contracts/metatx/ERC2771Context.sol";

import "./verifier/PasscodeVerifier.sol";
import "./verifier/RecoveryVerifier.sol";

contract VUZIFactory is VUZIStorage, ERC2771Context, PasscodeVerifier, RecoveryVerifier {
   
   VUZI public immutable accountImplementation;

    constructor(address _trustedForwarder) ERC2771Context(_trustedForwarder) {
        accountImplementation = new VUZI();
    }

    modifier onlyTrustedForwarder() {
        require(isTrustedForwarder(msg.sender), "VUZI: caller is not the trusted forwarder");
        _;
    }

    function createAccount(string memory name, uint256[2] memory _passwordHash, uint256[4] memory _recoveryHashes, uint256 salt) onlyTrustedForwarder public returns (VUZI ret) {
        address addr = getAddress(name, _passwordHash, _recoveryHashes , salt);
        uint codeSize = addr.code.length;
        if (codeSize > 0) {
            return VUZI(payable(addr));
        }
        ret = VUZI(payable(new ERC1967Proxy{salt : bytes32(salt)}(
                address(accountImplementation),
                abi.encodeCall(VUZI.initialize, (address(this), name, _passwordHash, _recoveryHashes))
            )));
        addVuzi(name, address(ret));
    }

    function getAddress(string memory name, uint256[2] memory _passwordHash, uint256[4] memory _recoveryHashes, uint256 salt) public view returns (address) {
        return Create2.computeAddress(bytes32(salt), keccak256(abi.encodePacked(
                type(ERC1967Proxy).creationCode,
                abi.encode(
                    address(accountImplementation),
                    abi.encodeCall(VUZI.initialize, (address(this), name, _passwordHash, _recoveryHashes))
                )
            )));
    }

    function executeVUZITx(string memory name, PasscodeProof memory proof ,address dest, uint256 value, bytes calldata func) onlyTrustedForwarder external isValidVuzi(name) {
        VUZI vuzi = VUZI(payable(address(VUZINameToDetails[name].walletAddress)));

        uint nonce = vuzi._useNonce();

        uint256[4] memory input = [
            vuzi.passwordHash(0),
            vuzi.passwordHash(1),
            nonce,
            0x0000000000000000000000000000000000000000000000000000000000000001
        ];

        bool success = passcodeVerifyTx(proof, input);
        require(success, "VUZI: Invalid Proof");

        vuzi.execute(dest, value, func);
    }

    function verifyVUZIPassword(string memory name, PasscodeProof memory proof) external view isValidVuzi(name) returns (bool) {
        VUZI vuzi = VUZI(payable(address(VUZINameToDetails[name].walletAddress)));

        uint nonce = vuzi.getNonce();

        uint256[4] memory input = [
            vuzi.passwordHash(0),
            vuzi.passwordHash(1),
            nonce,
            0x0000000000000000000000000000000000000000000000000000000000000001
        ];

        bool success = passcodeVerifyTx(proof, input);
        require(success, "VUZI: Invalid Proof");
        return true;
    }

    function executeBatchVUZITx(string memory name, PasscodeProof memory proof, address[] calldata dest, uint256[] calldata value, bytes[] calldata func) onlyTrustedForwarder external isValidVuzi(name) {
        VUZI vuzi = VUZI(payable(address(VUZINameToDetails[name].walletAddress)));

        uint nonce = vuzi._useNonce();

        uint256[4] memory input = [
            vuzi.passwordHash(0),
            vuzi.passwordHash(1),
            nonce,
            0x0000000000000000000000000000000000000000000000000000000000000001
        ];

        bool success = passcodeVerifyTx(proof, input);
        require(success, "VUZI: Invalid Proof");

        vuzi.executeBatch(dest, value, func);
    }

    function changePasscode(string memory name, Proof memory proof, uint256[2] memory _passwordHash) onlyTrustedForwarder external isValidVuzi(name) {
        VUZI vuzi = VUZI(payable(address(VUZINameToDetails[name].walletAddress)));

        uint nonce = vuzi._useNonce();

        uint256[6] memory input = [
            vuzi.recoveryHashes(0),
            vuzi.recoveryHashes(1),
            vuzi.recoveryHashes(2),
            vuzi.recoveryHashes(3),
            nonce,
            0x0000000000000000000000000000000000000000000000000000000000000001
        ];

        bool success = recoveryVerifyTx(proof, input);

        require(success, "VUZI: Invalid Proof");

        vuzi.changePassword(_passwordHash);
    }
}
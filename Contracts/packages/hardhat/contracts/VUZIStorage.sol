//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract VUZIStorage {
    
    struct VUZIDetails {
        address walletAddress;
        bool isUsed;
    }

    mapping(string => VUZIDetails) public VUZINameToDetails;

    function addVuzi(string memory name, address walletAddress) internal {
        VUZINameToDetails[name] = VUZIDetails(walletAddress, true);
    }

    function _checkVuzi(string memory name) internal view {
        require(VUZINameToDetails[name].isUsed, "VUZI: Invalid VUZI");
    }
    
    function getVuzi(string memory name) external view returns (VUZIDetails memory) {
        VUZIDetails memory details = VUZINameToDetails[name];
        return details;
    }

    modifier isValidVuzi(string memory name) {
        _checkVuzi(name);
        _;
    }

}
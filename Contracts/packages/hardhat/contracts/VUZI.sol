//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./callback/TokenCallbackHandler.sol";
import "@openzeppelin/contracts/metatx/ERC2771Context.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";

contract VUZI is TokenCallbackHandler, Initializable {
	
	address public VUZI_FACTORY;

	string public VUZI_NAME;

	uint256[2] public passwordHash;

	uint256[4] public recoveryHashes;

	modifier onlyVUZIFactory() {
		require(msg.sender == VUZI_FACTORY, "VUZI: Only VUZI Factory");
		_;
	}

	 function initialize(address _vuziFactory, string memory name, uint256[2] memory _passwordHash, uint256[4] memory _recoveryHashes) public virtual initializer {
        _initialize(_vuziFactory, name, _passwordHash, _recoveryHashes);
    }

    function _initialize(address _vuziFactory, string memory name, uint256[2] memory _passwordHash, uint256[4] memory _recoveryHashes) internal virtual {
		require(_vuziFactory != address(0), "VUZI: Invalid VUZI Factory");
		VUZI_FACTORY = _vuziFactory;
		VUZI_NAME = name;
		passwordHash = _passwordHash;
		recoveryHashes = _recoveryHashes;
    }

	function execute(address dest, uint256 value, bytes calldata func) external onlyVUZIFactory{
        _call(dest, value, func);
    }

	function _call(address target, uint256 value, bytes memory data) internal {
        (bool success, bytes memory result) = target.call{value : value}(data);
        if (!success) {
            assembly {
                revert(add(result, 32), mload(result))
            }
        }
    }

	function executeBatch(address[] calldata dest, uint256[] calldata value, bytes[] calldata func) external onlyVUZIFactory {
        require(dest.length == func.length && (value.length == 0 || value.length == func.length), "wrong array lengths");
        if (value.length == 0) {
            for (uint256 i = 0; i < dest.length; i++) {
                _call(dest[i], 0, func[i]);
            }
        } else {
            for (uint256 i = 0; i < dest.length; i++) {
                _call(dest[i], value[i], func[i]);
            }
        }
    }

	function changePassword(uint256[2] memory _passwordHash) external onlyVUZIFactory {
		passwordHash = _passwordHash;
	}
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

/// @title Name Registry Contract
/// @notice This contract allows users to claim and manage unique names and attach them to their addresses.
contract NameRegistry {
    /// @dev Mapping from names to their respective owners
    mapping(string => address) public nameToOwner;

    /// @dev Event emitted when a name is registered
    event NameRegistered(address indexed user, string name);
    /// @dev Event emitted when a name is released
    event NameReleased(address indexed user, string name);

    /// @notice Claim a unique name
    /// @param name The name to be claimed
    /// @dev Reverts if the name is already claimed
    /// @dev Emits a NameRegistered event upon successful registration
    function claimName(string calldata name) external {
        require(nameToOwner[name] == address(0), "Name already claimed");
        nameToOwner[name] = msg.sender;
        emit NameRegistered(msg.sender, name);
    }


    /// @notice Release a claimed name
    /// @param name The name to be released
    /// @dev Reverts if the caller is not the owner of the name
    function releaseName(string calldata name) external {
        require(nameToOwner[name] == msg.sender, "Not the owner of the name");
        delete nameToOwner[name];

        /// @dev Emit event indicating the name has been released
        emit NameReleased(msg.sender, name);
    }

}
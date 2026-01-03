// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

/// @title Name Registry Contract
/// @author Kyle Monaghan
/// @notice This contract allows users to claim and manage unique names.
contract NameRegistry {
    /// @notice Mapping from names to their respective owners
    mapping(string => address) private nameToOwner;
    mapping(address => string[]) private ownerToNames;

    event NameRegistered(address indexed user, string name);
    event NameUpdated(address indexed user, string oldName, string newName);

    function claimName(string calldata name) external {
        require(nameToOwner[name] == address(0), "Name already claimed");
        nameToOwner[name] = msg.sender;
        ownerToNames[msg.sender].push(name);
        emit NameRegistered(msg.sender, name);
    }


    function releaseName(string calldata name) external {
        require(nameToOwner[name] == msg.sender, "Not the owner of the name");
        delete nameToOwner[name];

        // Remove name from owner's list
        string[] storage namesList = ownerToNames[msg.sender];
        for (uint i = 0; i < namesList.length; i++) {
            if (keccak256(bytes(namesList[i])) == keccak256(bytes(name))) {
                namesList[i] = namesList[namesList.length - 1];
                namesList.pop();
                break;
            }
        }

        emit NameUpdated(msg.sender, name, "");
    }

    function getMyNames(address user) external view returns (string[] memory) {
        return ownerToNames[user];
    }

     function getOwner(string calldata name) external view returns (address) {
        return nameToOwner[name];
    }
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract NameRegistry {
    //mapping(address => string) private names;
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


    function registerName(string calldata name) external {
        require(bytes(names[msg.sender]).length == 0, "Name already registered");
        names[msg.sender] = name;
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

    // function updateName(string calldata newName) external {
    //     string memory oldName = names[msg.sender];
    //     require(bytes(oldName).length != 0, "No name registered");
    //     names[msg.sender] = newName;
    //     emit NameUpdated(msg.sender, oldName, newName);
    // }

    function getName(address user) external view returns (string memory) {
        return ownerToNames[user][];
    }
}
// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;
import "./Project.sol";

contract ProjectFactory {
    Project[] public allProjects;
    uint256 public numProjects;

    function getAllTheProjects() public view returns (Project[] memory) {
        return allProjects;
    }

    mapping(address => address) public projectOwners;
    mapping(address => uint256) public numberOfProjectsPerOwner;

    function getOwnerProjects(address _owner)
        public
        view
        returns (address[] memory)
    {
        address[] memory result = new address[](
            numberOfProjectsPerOwner[_owner]
        );
        uint256 j = 0;
        for (uint256 i = 0; i < numProjects; i++) {
            if (projectOwners[address(allProjects[i])] == _owner) {
                result[j] = address(allProjects[i]);
                j++;
            }
        }
        return result;
    }

    function getNotOwnerProjects(address _owner)
        public
        view
        returns (address[] memory)
    {
        address[] memory result = new address[](
            numProjects - numberOfProjectsPerOwner[_owner]
        );
        uint256 j = 0;
        for (uint256 i = 0; i < numProjects; i++) {
            if (projectOwners[address(allProjects[i])] != _owner) {
                result[j] = address(allProjects[i]);
                j++;
            }
        }
        return result;
    }

    event ProjectCreated(
        address projectCreator,
        address projectAddress,
        string projectName,
        string projectDescription,
        uint256 projectDeadline,
        uint256 projectAmountToBeRasied,
        string phoneNumber
    );

    function createProject(
        string calldata projectName,
        string calldata projectDesciption,
        uint256 duration,
        uint256 amountToBeRaised,
        string calldata phoneNumber
    ) external {
        uint256 deadline = block.timestamp + duration * 10 seconds;
        Project proj = new Project(
            msg.sender,
            deadline,
            amountToBeRaised,
            projectName,
            projectDesciption,
            phoneNumber
        );
        allProjects.push(proj);
        numProjects++;
        projectOwners[address(proj)] = msg.sender;
        numberOfProjectsPerOwner[msg.sender]++;
        emit ProjectCreated(
            msg.sender,
            address(proj),
            projectName,
            projectDesciption,
            deadline,
            amountToBeRaised,
            phoneNumber
        );
    }
}

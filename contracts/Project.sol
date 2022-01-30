// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

/**
 * @title Ballot
 * @dev Implements voting process along with vote delegation
 */
contract Project {
    // State of the project goes here -->
    enum State {
        Fundraising,
        Expired,
        Funded
    }

    struct ProjectInfo {
        uint256 amountToBeRaised;
        string projectName;
        string projectDesciption;
        string moreProjectInformation;
        string naturalCalamity;
        string phoneNumber;
    }

    //state variables
    string public projectName;
    uint256 public numberOfFunders;
    string public projectDescription;
    uint256 public deadline;
    uint256 public amountToBeRasied;
    string public moreProjectInfo;
    string public naturalCalamity;
    string public phoneNumber;
    State public projectState = State.Fundraising;
    address public projectOwner;
    uint256 public amountRaiseTillNow;
    uint256 lastChecked;
    mapping(address => uint256) public funders;

    //Events
    event MoneyRecieved(address _funders, uint256 _amount, uint256 totolAmount);
    event PayoutDone(address _owner, uint256 _totalAmount);

    //Modifiers
    modifier onlyOwner() {
        require(msg.sender == projectOwner);
        _;
    }

    modifier isState(State _state) {
        require(projectState == _state);
        _;
    }

    //Constructor

    constructor(
        address projectCreator,
        uint256 deadlineToTheEnd,
        uint256 amountToBeRasiedTillTheEnd,
        string memory nameOfTheProject,
        string memory desc,
        string memory numberOfPhone
    ) {
        projectOwner = projectCreator;
        deadline = deadlineToTheEnd;
        amountToBeRasied = amountToBeRasiedTillTheEnd * 1 ether;
        projectName = nameOfTheProject;
        projectDescription = desc;

        phoneNumber = numberOfPhone;
        amountRaiseTillNow = 0;
    }

    //Functions
    function contribute() external payable isState(State.Fundraising) {
        require(msg.value > 0, "Contribution amount must be greater than 0");
        require(
            msg.sender != projectOwner,
            "You cannot contribute to your own project"
        );
        require(
            msg.value <= (amountToBeRasied - amountRaiseTillNow),
            "Amount is more than the amount to be raised"
        );
        if (funders[msg.sender] <= 0) {
            numberOfFunders++;
        }
        funders[msg.sender] = funders[msg.sender] + msg.value;

        amountRaiseTillNow = amountRaiseTillNow + msg.value;
        emit MoneyRecieved(msg.sender, msg.value, amountRaiseTillNow);
    }

    function checkTheStatusOfTheProject()
        public
        payable
        returns (string memory)
    {
        if (amountRaiseTillNow >= amountToBeRasied) {
            projectState = State.Funded;
            endProject();
            emit PayoutDone(projectOwner, amountRaiseTillNow);
            return "Project is Funded";
        } else if (block.timestamp > deadline) {
            projectState = State.Expired;
            endProject();
            emit PayoutDone(projectOwner, amountRaiseTillNow);
            return "Project is Expired";
        }
        lastChecked = block.timestamp;
        return "Project is still in progress";
    }

    function endProject() internal  {
        (bool success, ) = projectOwner.call{value: address(this).balance}("");
        require(success, "Transfer Failed due to some reason");
    }

    function sendRefunds() public isState(State.Expired) {
        require(numberOfFunders > 0, "No one has contributed to this project");
        require(
            funders[msg.sender] > 0,
            "You have not contributed to this project"
        );

        uint256 amountToBeGiven = funders[msg.sender];
        (bool success, ) = msg.sender.call{value: amountToBeGiven}("");
        require(success, "Transfer Failed due to some reason");
        funders[msg.sender] = 0;
        numberOfFunders--;
    }

    // Getter
    function getBalanceOfProject() external view returns (uint256) {
        return address(this).balance;
    }

    function sendDetails()
        public
        view
        returns (
            address creator,
            uint256 timeLeft,
            uint256 fundRaiseAmount,
            string memory nameOftheProj,
            string memory descOfProj,
            string memory cellNumber,
            uint256 amountRaised,
            string memory stateOfTheProj
        )
    {
        creator = projectOwner;
        timeLeft = deadline;
        fundRaiseAmount = amountToBeRasied;
        nameOftheProj = projectName;
        descOfProj = projectDescription;
        cellNumber = phoneNumber;
        amountRaised = amountRaiseTillNow;
        if (projectState == State.Fundraising) {
            stateOfTheProj = "Fundraising";
        } else if (projectState == State.Funded) {
            stateOfTheProj = "Funded";
        } else if (projectState == State.Expired) {
            stateOfTheProj = "Expired";
        }
    }

    function getTheMoneyFromTheVariable() external view returns (uint256) {
        return amountRaiseTillNow;
    }
}

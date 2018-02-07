pragma solidity 0.4.18;


/**
 * @title AddressRegisterInterface
 * @dev AddressRegister interface.
 * @author Króliczek Dominik (https://github.com/krolis)
 */
contract AddressRegisterInterface {

    function isExist(address addressToCheck) public view returns (bool);

}


/**
 * @title Deposit
 * @dev Keeps track of balances and accepts deposits of Ether
 * @author Króliczek Dominik (https://github.com/krolis)
 */
contract Deposit {

    struct DepositEntry {
        uint256 balance;
        uint256 firstDepositTimestamp;
    }

    mapping(address => DepositEntry) private deposits;

    AddressRegisterInterface public addressRegister;

    function Deposit(AddressRegisterInterface _addressRegister) public {
        addressRegister = _addressRegister;
    }

    modifier after2weeks() {
        require(now > deposits[msg.sender].firstDepositTimestamp + 2 weeks);
        _;
    }

    modifier onlyRegistered(address addr) {
        require(addressRegister.isExist(addr));
        _;
    }

    function getBalance() public view returns (uint) {
        return deposits[msg.sender].balance;
    }

    function deposit() public payable onlyRegistered(msg.sender) {
        DepositEntry storage dep = deposits[msg.sender];
        // todo check overflow
        dep.balance += msg.value;
        if (dep.firstDepositTimestamp == 0) {
            dep.firstDepositTimestamp = now;
        }
        // todo consider to use event here
    }

    function withdraw(uint256 amount) public after2weeks {
        DepositEntry storage dep = deposits[msg.sender];
        require(dep.balance >= amount);
        dep.balance -= amount;
        msg.sender.transfer(amount);
    }

    function getLockTimestamp() public view returns (uint256) {
        return deposits[msg.sender].firstDepositTimestamp;
    }
}
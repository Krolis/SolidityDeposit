pragma solidity 0.4.18;

/**
 * @title Deposit
 * @dev Keeps track of balances and accepts deposits of Ether
 * @author Kroliczek Dominik (https://github.com/krolis)
 */
contract Deposit {

    struct Deposit {
        uint256 balance;
        uint256 firstDepositTimestamp;
    }

    mapping(address => Deposit) private deposits;

    modifier after2weeks() {
        require(now > deposits[msg.sender].firstDepositTimestamp + 2 weeks);
        _;
    }

    function getBalance() public view returns (uint){
        return deposits[msg.sender].balance;
    }

    function deposit() public payable {
        Deposit dep = deposits[msg.sender];
        // todo check overflow
        dep.balance += msg.value;
        if (dep.firstDepositTimestamp == 0) {
            dep.firstDepositTimestamp = now;
        }
        // todo consider to use event here
    }

    function withdraw(uint256 amount) public after2weeks {
        Deposit dep = deposits[msg.sender];
        require(dep.balance >= amount);
        dep.balance -= amount;
        msg.sender.transfer(amount);
    }

    function getLockTimestamp() public view returns(uint256){
        return deposits[msg.sender].firstDepositTimestamp;
    }

}
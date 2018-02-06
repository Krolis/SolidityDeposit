pragma solidity 0.4.18;

/**
 * @title Deposit
 * @dev Keeps track of balances and accepts deposits of Ether
 * @author Kroliczek Dominik (https://github.com/krolis)
 */
contract Deposit {

    address private owner;

    function AddressRegister() public {
        owner = msg.sender;
    }

}
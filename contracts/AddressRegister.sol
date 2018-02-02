pragma solidity 0.4.18;

/**
 * @title Account addresses register
 * @dev Allows to store addresses in hopefully optimal way
 * @author Kroliczek Dominik (https://github.com/krolis)
 */
contract AddressRegister {

    address owner;

    mapping(address => bool) public addresses;

    event AddressRegistered(address addr);

    modifier onlyIfAddressExists(address addr){
        require(addresses[addr] == false);
        _;
    }

    modifier onlyOwner(address addr) {
        require(address[addr] == owner);
    }

    function AddressRegister() public {
        owner = msg.sender;
    }

    function registerAddress(address addressToAdd) public onlyIfAddressExists(addressToAdd) {
        addresses[addressToAdd] = true;
        AddressRegistered(addressToAdd);
    }

    function isExist(address addressToCheck) public view returns (bool){
        return addresses[addressToCheck];
    }

    function getAllAddresses() public returns (address[]){
        return new address[](0);
    }


    function remove(address addressToRemove) public returns (bool addressData){
        addressData = addresses[addressToRemove];
        addresses[addressToRemove] = false;
    }

    function removeAll() public {
    }
}

pragma solidity 0.4.18;

/**
 * @title Account addresses register
 * @dev Allows to store addresses in hopefully optimal way
 * @author Kroliczek Dominik (https://github.com/krolis)
 */
contract AddressRegister {

    mapping(address => bool) public addresses;

    function AddressRegister() public {
    }

    function addAddress(address addressToAdd) public returns (bool addressData){
        addressData = addresses[addressToAdd];
        addresses[addressToAdd] = true;
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

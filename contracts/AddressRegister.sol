pragma solidity 0.4.18;

/**
 * @title Account addresses register
 * @dev Allows to store addresses in hopefully optimal way
 * @author Kroliczek Dominik (https://github.com/krolis)
 */
contract AddressRegister {

    address private owner;

    mapping(address => bool) public addresses;

    event AddressRegistered(address addr);

    modifier onlyIfAddressExists(address addr){
        require(addresses[addr] == false);
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    function AddressRegister() public {
        owner = msg.sender;
    }

    function registerAddress(address addressToAdd)
        public
        onlyOwner
        onlyIfAddressExists(addressToAdd)
    {
        addresses[addressToAdd] = true;
        AddressRegistered(addressToAdd);
    }

    function isExist(address addressToCheck) public view returns (bool){
        return addresses[addressToCheck];
    }

    function getAllAddresses() public view returns (address[]){
        return new address[](0);
    }

    function remove(address addressToRemove) public onlyOwner returns (bool addressData){
        addressData = addresses[addressToRemove];
        addresses[addressToRemove] = false;
    }

    function removeAll() public onlyOwner {
    }
}

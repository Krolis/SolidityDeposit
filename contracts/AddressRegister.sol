pragma solidity 0.4.18;

/**
 * @title Account addresses register
 * @dev Allows to store addresses in hopefully optimal way
 * @author Kroliczek Dominik (https://github.com/krolis)
 */
contract AddressRegister {

    address private owner;

    struct Entry {
        address last;
        address next;
    }

    mapping(address => Entry) private addressesQueue;

    address private head;

    address private tail;

    mapping(address => bool) private addressesExistence;

    event AddressRegistered(address addr);

    modifier onlyIfAddressExists(address addr){
        require(addressesExistence[addr] == false);
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
        if (head == 0) {
            head = addressToAdd;
            tail = addressToAdd;
        }

        addressesQueue[addressToAdd].last = tail;
        addressesQueue[tail].next = addressToAdd;
        tail = addressToAdd;

        addressesExistence[addressToAdd] = true;

        AddressRegistered(addressToAdd);
    }

    function isExist(address addressToCheck) public view returns (bool){
        return addressesExistence[addressToCheck];
    }

    function getNextAddress(address currentAddress) public view returns (address) {
        if (currentAddress == 0) {
            return head;
        } else {
            return addressesQueue[currentAddress].next;
        }
    }

    function remove(address addressToRemove) public onlyOwner{
        Entry entry = addressesQueue[addressToRemove];

        addressesQueue[entry.last].next = entry.next;
        addressesQueue[entry.next].last = entry.last;

        addressesExistence[addressToRemove] = false;
    }

    function removeAll() public onlyOwner {


    }
}

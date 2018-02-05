pragma solidity 0.4.18;

/**
 * @title Account addresses register
 * @dev Allows to store addresses in hopefully optimal way
 * @author Kroliczek Dominik (https://github.com/krolis)
 */
contract AddressRegister {

    struct Entry {
        address prev;
        address next;
    }

    address private owner;

    mapping(address => Entry) private addressesQueue;

    address private head;

    address private tail;

    uint256 private addressesCount;

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

        addressesQueue[addressToAdd].prev = tail;
        addressesQueue[tail].next = addressToAdd;
        tail = addressToAdd;

        addressesCount++;

        addressesExistence[addressToAdd] = true;

        AddressRegistered(addressToAdd);
    }

    function isExist(address addressToCheck) public view returns (bool){
        return addressesExistence[addressToCheck];
    }

    function getAllAddresses() public view returns (address[]){
        address[] memory result = new address[](addressesCount);

        address iterator = head;

        for (uint i = 0; i < addressesCount; i++) {
            //assert?
            result[i] = iterator;
            iterator = addressesQueue[iterator].next;
        }
        return result;
    }

    function remove(address addressToRemove) public onlyOwner {
        Entry entry = addressesQueue[addressToRemove];

        addressesQueue[entry.prev].next = entry.next;
        addressesQueue[entry.next].prev = entry.prev;

        addressesCount--;

        addressesExistence[addressToRemove] = false;
    }

    function removeAll() public onlyOwner {
        address iterator = head;

        for (uint i = 0; i < addressesCount; i++) {
            delete addressesExistence[iterator];
            iterator = addressesQueue[iterator].next;
            delete addressesQueue[iterator].prev;
        }

        delete head;
        delete tail;
        delete addressesCount;
    }
}

pragma solidity 0.4.18;

import { Ownable } from "zeppelin-solidity/contracts/ownership/Ownable.sol";


/**
 * @title Account addresses register
 * @dev Allows to store addresses in hopefully optimal way
 * @author Kroliczek Dominik (https://github.com/krolis)
 */
contract AddressRegister is Ownable {

    struct QueueEntry {
        address prev;
        address next;
    }

    mapping (address => QueueEntry) private addressesQueue;

    address private tail;

    uint256 private addressesCount;

    event AddressRegistered(address addr);

    modifier onlyIfAddressNotExist(address addr) {
        require(!isExisting(addr));
        _;
    }

    function registerAddress(address addressToAdd)
        public
        onlyOwner
        onlyIfAddressNotExist(addressToAdd)
    {
        addressesQueue[addressToAdd].prev = tail;
        addressesQueue[tail].next = addressToAdd;
        tail = addressToAdd;

        addressesCount++;

        AddressRegistered(addressToAdd);
    }

    function isExisting(address addressToCheck) public view returns (bool) {
        return addressToCheck == tail || addressesQueue[addressToCheck].next != address(0);
    }

    function getAllAddresses() public view returns (address[]) {
        address[] memory result = new address[](addressesCount);

        address iterator = tail;

        for (uint i = 0; i < addressesCount; i++) {
            result[i] = iterator;
            iterator = addressesQueue[iterator].prev;
        }
        return result;
    }

    function remove(address addressToRemove) public onlyOwner {
        QueueEntry storage entry = addressesQueue[addressToRemove];

        addressesQueue[entry.prev].next = entry.next;
        addressesQueue[entry.next].prev = entry.prev;

        delete entry.next;
        delete entry.prev;

        addressesCount--;
    }

    function removeAll() public onlyOwner {
        address iterator = tail;

        for (uint i = 0; i < addressesCount; i++) {
            address toDelete = iterator;
            iterator = addressesQueue[iterator].prev;
            delete addressesQueue[toDelete];
        }

        delete tail;
        delete addressesCount;
    }
}

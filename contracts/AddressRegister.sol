pragma solidity 0.4.18;

import { SafeMath } from "zeppelin-solidity/contracts/math/SafeMath.sol";
import { Ownable } from "zeppelin-solidity/contracts/ownership/Ownable.sol";


/**
 * @title Account addresses register
 * @dev Allows to store addresses in hopefully optimal way
 * @author Kroliczek Dominik (https://github.com/krolis)
 */
contract AddressRegister is Ownable {

    using SafeMath for uint256;

    struct QueueEntry {
        address prev;
        address next;
    }

    mapping (address => QueueEntry) private addressesQueue;

    uint256 private addressesCount;

    event AddressRegistered(address addr);

    modifier onlyValidAddress(address addr) {
        require(addr != address(0));
        _;
    }

    modifier onlyIfAddressNotExist(address addr) {
        require(!isExisting(addr));
        _;
    }

    function registerAddress(address addressToAdd)
        public
        onlyOwner
        onlyValidAddress(addressToAdd)
        onlyIfAddressNotExist(addressToAdd)
    {
        QueueEntry storage head = addressesQueue[0];
        QueueEntry storage prev = addressesQueue[head.prev];

        addressesQueue[addressToAdd].prev = head.prev;
        head.prev = addressToAdd;
        prev.next = addressToAdd;

        addressesCount = addressesCount.add(1);

        AddressRegistered(addressToAdd);
    }

    function isExisting(address addressToCheck)
        public
        view
        onlyValidAddress(addressToCheck)
        returns (bool)
    {
        return addressesQueue[addressToCheck].prev != address(0);
    }

    function getAllAddresses() public view returns (address[]) {
        address[] memory result = new address[](addressesCount);

        address iterator = addressesQueue[0].prev;

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

        addressesCount = addressesCount.sub(1);
    }

    function removeAll() public onlyOwner {
        address iterator = addressesQueue[0].prev;

        for (uint i = 0; i < addressesCount; i++) {
            address toDelete = iterator;
            iterator = addressesQueue[iterator].prev;
            delete addressesQueue[toDelete];
        }

        delete addressesQueue[0].prev;
        delete addressesCount;
    }
}

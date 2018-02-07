declare module 'deposit' {
    import {
        AnyContract,
        Contract,
        ContractBase,
        TransactionOptions,
        TransactionResult,
        TruffleArtifacts
    } from 'truffle';
    import BigNumber from 'bignumber.js';

    namespace deposit {
        interface Migrations extends ContractBase {
            setCompleted(completed: number,
                         options?: TransactionOptions): Promise<TransactionResult>;

            upgrade(address: Address,
                    options?: TransactionOptions): Promise<TransactionResult>;
        }

        interface AddressRegister extends ContractBase {

            isExist(addr: Address): Promise<boolean>;

            getAllAddresses(): Promise<Address[]>;

            registerAddress(address: Address, options?: TransactionOptions): Promise<TransactionResult>;

            remove(addr: Address, options?: TransactionOptions): Promise<TransactionResult>;

            removeAll(options?: TransactionOptions): Promise<TransactionResult>;
        }

        interface Deposit extends ContractBase {

            addressRegister(): Promise<Address>;

            getBalance(options?: TransactionOptions): Promise<BigNumber>;

            getLockTimestamp(options?: TransactionOptions): Promise<BigNumber>;

            deposit(options?: TransactionOptions): Promise<TransactionResult>;

            withdraw(amount: number, options?: TransactionOptions): Promise<TransactionResult>;
        }

        interface MigrationsContract extends Contract<Migrations> {
            'new'(options?: TransactionOptions): Promise<Migrations>;
        }

        interface AddressRegisterContract extends Contract<AddressRegister> {
            'new'(options?: TransactionOptions): Promise<AddressRegister>;
        }

        interface DepositContract extends Contract<Deposit> {
            'new'(addr: Address, options?: TransactionOptions): Promise<Deposit>;
        }

        interface DepositArtifacts extends TruffleArtifacts {
            require(name: string): AnyContract;

            require(name: './Migrations.sol'): MigrationsContract;

            require(name: './AddressRegister.sol'): AddressRegisterContract;

            require(name: './Deposit.sol'): DepositContract;
        }
    }

    export = deposit;
}

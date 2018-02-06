import {Contract, TransactionOptions, TransactionResult} from 'truffle';

declare module 'register' {
    import {
        AnyContract,
        Contract,
        ContractBase,
        TransactionOptions,
        TransactionResult,
        TruffleArtifacts
    } from 'truffle';

    namespace register {
        interface Migrations extends ContractBase {
            setCompleted(completed: number,
                         options?: TransactionOptions): Promise<TransactionResult>;

            upgrade(address: Address,
                    options?: TransactionOptions): Promise<TransactionResult>;
        }

        interface AddressRegister extends ContractBase {

            isExist(addr: number): Promise<boolean>;

            getAllAddresses(): Promise<Address[]>;

            registerAddress(address: Address, options?: TransactionOptions): Promise<TransactionResult>;

            remove(addr: Address, options?: TransactionOptions): Promise<TransactionResult>;

            removeAll(options?: TransactionOptions): Promise<TransactionResult>;
        }

        interface Deposit extends ContractBase {
            getBalance(options?: TransactionOptions): Promise<number>;

            getLockTimestamp(options?: TransactionOptions): Promise<number>;

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
            'new'(options?: TransactionOptions): Promise<Deposit>;
        }

        interface RegisterArtifacts extends TruffleArtifacts {
            require(name: string): AnyContract;

            require(name: './Migrations.sol'): MigrationsContract;

            require(name: './AddressRegister.sol'): AddressRegisterContract;

            require(name: './Deposit.sol'): DepositContract;
        }
    }

    export = register;
}

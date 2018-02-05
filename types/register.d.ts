import {TransactionOptions} from 'truffle';

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

            registerAddress(address: Address): void;

            isExist(addr: number): boolean;

            getAllAddresses(): Address[];

            remove(addr: Address, options?: TransactionOptions): string;

            removeAll(options?: TransactionOptions): void;
        }

        interface MigrationsContract extends Contract<Migrations> {
            'new'(options?: TransactionOptions): Promise<Migrations>;
        }

        interface AddressRegisterContract extends Contract<AddressRegister> {
            'new'(options?: TransactionOptions): Promise<AddressRegister>;
        }

        interface RegisterArtifacts extends TruffleArtifacts {
            require(name: string): AnyContract;

            require(name: './Migrations.sol'): MigrationsContract;

            require(name: './AddressRegister.sol'): AddressRegisterContract;
        }
    }

    export = register;
}

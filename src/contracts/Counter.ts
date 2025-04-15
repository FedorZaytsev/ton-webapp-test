import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type CounterConfig = {
    value: number;
};

export function counterConfigToCell(config: CounterConfig): Cell {
    return beginCell().storeUint(config.value, 64).endCell();
}

export class Counter implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new Counter(address);
    }

    static createFromConfig(config: CounterConfig, code: Cell, workchain = 0) {
        const data = counterConfigToCell(config);
        const init = { code, data };
        return new Counter(contractAddress(workchain, init), init);
    }
    
    static createForDeploy(code: Cell, initialValue: number): Counter {
        const data = beginCell().storeUint(initialValue, 64).endCell();
        const address = contractAddress(/* workchain */ 0, { code, data });
        return new Counter(address, { code, data });
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async get(provider: ContractProvider) {
        const { stack } = await provider.get("counter", []);
        return stack.readNumber();
    }

    async sendIncrementMessage(provider: ContractProvider, via: Sender) {
        const messageBody = beginCell().storeUint(1, 32).endCell();

        await provider.internal(via, {
            value: "0.001",
            body: messageBody,
        });
    }
}

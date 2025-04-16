import { Sender, SenderArguments } from '@ton/core';
import { TonConnectUI, useTonConnectUI } from '@tonconnect/ui-react';
import { logs } from '../components/Logs'


function createSender(tonConnectUI?: TonConnectUI ): Sender {
    if (!tonConnectUI) {
        tonConnectUI = useTonConnectUI()[0];
    }
    return {
        send: async (args: SenderArguments) => {
            if (!tonConnectUI.connected) {
                logs.log('TonClient is not initialized');
                throw new Error('TonConnect is not connected');
            }

            logs.log('sending transaction '+args.toString());
            tonConnectUI.sendTransaction({
                messages: [
                    {
                        address: args.to.toString(),
                        amount: args.value.toString(),
                        payload: args.body?.toBoc().toString('base64')
                    },
                ],
                validUntil: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour
            })
        }
    }
}

export default createSender;

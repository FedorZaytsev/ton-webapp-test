import { useEffect, useState } from 'react'
import { useTonConnectUI } from '@tonconnect/ui-react';
import { getHttpEndpoint } from '@orbs-network/ton-access';
import './App.css'
import { TonConnectButton } from '@tonconnect/ui-react'
import { Address, TonClient } from '@ton/ton'
import { Counter } from './contracts/Counter'
import Alert from './components/Alert'
import LogView from './components/LogView'
import { logs } from './components/Logs'
import createSender from './ton/TonSender'

function useAsyncInitialize<T>(func: () => Promise<T>, deps: any[] = []) {
  const [state, setState] = useState<T | undefined>();
  useEffect(() => {
    (async () => {
      setState(await func());
    })();
  }, deps);

  return state;
}

const contractAddress = "EQCGPnGpjYVuax7Tpv3-SMRDdME_zhKLkOBjYeYqJImWqjRT"

function initialize(setError: (error: string | null) => void) {

  const tonClient = useAsyncInitialize(async () => {
    return new TonClient({endpoint: await getHttpEndpoint()})
  })

  const tonSender = createSender();

  useEffect(() => {
    if (!tonSender) {
      logs.log('TonSender is not initialized');
      setError('TonSender is not initialized');
    } else {
      logs.log('TonSender is initialized');
      setError(null);
    }
  }, [tonSender]);

  useEffect(() => {
    if (!tonClient) {
      logs.log('TonClient is not initialized');
      setError('TonClient is not initialized');
    } else {
      logs.log('TonClient is initialized');
      setError(null);
    }
  }, [tonClient]);

  const [counter, setCounterVal] = useState<null | number>();

  const contract = useAsyncInitialize(async () => {
    if (tonClient) {
      return tonClient.open(new Counter(Address.parse(contractAddress)));
    }
  }, [tonClient]);

  useEffect(() => {
    if (!contract) {
      setError('Contract is not initialized');
    }
  }, [contract]);

  useEffect(() => {
    if (!contract) return;
    setCounterVal(null);
    contract.get().then((val) => {
      setCounterVal(val);
    })
  }, [contract]);

  return {
    counter: counter,
    address: contractAddress,
    contract: contract,
    sendIncrement: async() => {
      if (!tonSender) {
        setError('TonSender is undefined');
        console.error('TonSender is undefined');
        return;
      }
      await contract?.sendIncrementMessage(tonSender);
    }
  }
}

function App() {
  const [error, setError] = useState<string | null>(null);
  const {counter, address, contract, sendIncrement} = initialize(setError);

  const simulateError = () => {
    setError('An unexpected error occurred!');
  };

  return (
    <>
      <div className='Container'>
        <TonConnectButton />

        { address &&
          <div className='Card'>
            <b>Counter Address</b>
            <div className='Hint'>{address}</div>
          </div>
        }

        {counter &&
          <>
            <div className='Card'>
              <b>Counter Value</b>
              <div>{counter}</div>
            </div>
            <div className='Card'>
              <button
                className='button'
                onClick={sendIncrement}
              >Increase counter</button>
            </div>
          </>
        }



        <button onClick={simulateError}>Simulate Error</button>
        {error && <Alert message={error} onClose={() => setError(null)} />}
        <LogView />
      </div>
    </>
  )
}

export default App

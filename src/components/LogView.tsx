import React from 'react';
import { logs } from './Logs'
import './LogView.css';

interface LogViewState{
    logs: string[];
}


class LogView extends React.Component<{}, LogViewState> {
    
  constructor(props: any) {
    super(props);
    this.state = { logs: [] }; // Correctly initialize the state
  }
  
  render(): React.ReactNode {
      return <>
        <div className='log-view'>
            <div>Log View</div>
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {
                this.state.logs.map((log: string, index: number) => {
                    return <div key={index}>{log}</div>
                })
            }
            </div>
        </div>
      </>
  }

  componentDidMount(): void {
      logs.subscribe(this.handleLogs);
  }


  componentWillUnmount(): void {
      logs.unsubscribe(this.handleLogs)
  }

  handleLogs = (logs: string[]) => {
    this.setState({ logs });
  };
}

export default LogView;
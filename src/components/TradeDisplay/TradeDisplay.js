import React, { Component } from 'react';
import './TradeDisplay.css';

class TradeDisplay extends Component {
  state = {
    data: {
      asks: [],
      bids: [],
    },
    subscribeMsg: {},
  }

  componentDidMount = () => {
    const { pair } = this.props;
    this.setMessage(pair, 'subscribe');
  }

  componentDidUpdate = async (prevProps) => {
    const { pair } = this.props;
    if(prevProps.pair !== pair) {
      await this.setMessage(prevProps.pair, 'unsubscribe');
      await this.setMessage(pair, 'subscribe');
    }
  }

  setMessage = async (pairDetail, type) => {
    await this.setState({
      subscribeMsg: {
        "event": `bts:${type}`,
        "data": {
          "channel": `order_book_${pairDetail.toLowerCase().replace('/', '')}`,
        },
      },
      data: {
        asks: type === 'unsubscribe' ? [] : this.state.data.asks,
        bids: type === 'unsubscribe' ? [] : this.state.data.bids,
      },
    });
    this.initWebsocket();
  }
  
  initWebsocket = () => {
    const { subscribeMsg } = this.state;
    let ws;
    ws = new WebSocket('wss://ws.bitstamp.net');

    ws.onopen = async () => {
      await ws.send(JSON.stringify(subscribeMsg));
    }

    ws.onmessage = async (e) => {
      const response = JSON.parse(e.data);
      switch (response.event) {
        case 'data': {
          await this.setState(prevState => {
            const { asks, bids } = prevState.data;
            return {
              ...prevState,
              data: {
                bids: bids
                  .length > 20 ? response.data.bids : bids.concat(response.data.bids),
                asks: asks
                  .length > 20 ? response.data.asks : asks.concat(response.data.asks),
              },
            };
          })
          break;
        }
        case 'bts:request_reconnect': {
          this.initWebsocket();
          break;
        }
        default: {
          break;
        }
      }
    }

    ws.onclose = () => {
      console.log('Websocket connection closed');
      this.initWebsocket();
    }
  }

  render = () => {
    const { data: {asks, bids} } = this.state;
    const { pair } = this.props;
    const currencies = pair ? pair.split('/') : [];

    const askList = asks ? asks
      .map(ask => <div key={`${ask[1]}${ask[0]}`}>{`${ask[1]} ${currencies[0]} @ ${ask[0]} ${currencies[1]}`}</div>) : [];
    const bidList = bids ? bids
      .map(bid => <div key={`${bid[1]}${bid[0]}`}>{`${bid[1]} ${currencies[0]} @ ${bid[0]} ${currencies[1]}`}</div>) : [];
    return (
      <div className="display-container">
        <div className="header">
          <h3 className="sub-header">Bids</h3>
          <h3 className="sub-header">Asks</h3>
        </div>
        <div className="display">
          <div className="sub-display">
            {bidList}
          </div>
          <div className="sub-display">
            {askList}
          </div>
        </div>
      </div>
    );
  }
}


export default TradeDisplay;

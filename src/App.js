import React, { Component } from 'react';
import CurrencySelector from './components/CurrencySelector/';
import TradeDisplay from './components/TradeDisplay';
import './App.css';

class App extends Component {
  state = {
    currencyPair: 'LTC/USD',
  }

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  }

  render = () => {
    const { currencyPair } = this.state;
    return (
      <div className="App">
        <CurrencySelector handleChange={this.handleChange} value={currencyPair}/>
        <TradeDisplay pair={currencyPair} />
      </div>
    );
  }
}

export default App;

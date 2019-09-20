import React, { Component } from 'react';
import './CurrencySelector.css';

class CurrencySelector extends Component {
  state = {
    currencyPairsInfo: [],
  };

  componentDidMount = async () => {
    const response = await fetch('https://www.bitstamp.net/api/v2/trading-pairs-info/');
    const currencyPairsInfo = await response.json();
    this.setState({
      currencyPairsInfo,
    });
  }

  render = () => {
    const { currencyPairsInfo } = this.state;
    const { handleChange, value } = this.props;
    const currencyPairs = currencyPairsInfo.map(currencyPair => (
      <option
        key={currencyPair.url_symbol}
        value ={currencyPair.name}
      >
        {currencyPair.name}
      </option>
      )
    );
    return (
      <div>
        <select name="currencyPair" value={value} onChange={handleChange}>
          {currencyPairs}
        </select>
      </div>
    );
  }
}

export default CurrencySelector;

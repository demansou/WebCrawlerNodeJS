import React, { Component } from 'react';
import History from './History';
import SearchForm from './SearchForm';

export default class Home extends Component {
  render() {
    return (
      <div className="Home-root">
        <SearchForm/>
        <History/>
      </div>
    );
  }
}

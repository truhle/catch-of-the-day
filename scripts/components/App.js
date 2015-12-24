/*
  App
*/

import React from 'react';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import Catalyst from 'react-catalyst';
import Fish from './Fish';
import Header from './Header';
import Inventory from './Inventory';
import Order from './Order';

// Firebase
import Rebase from 're-base';
var base = Rebase.createClass('https://glowing-fire-3715.firebaseio.com/');

var App = React.createClass({
  mixins : [Catalyst.LinkedStateMixin],
  getInitialState : function() {
    return {
      fishes : {},
      order : {}
    }
  },
  componentDidMount : function() {
    base.syncState(this.props.params.store_id + '/fishes', {
      context : this,
      state : 'fishes'
    });

    var localStorageRef = localStorage.getItem('order-' + this.props.params.store_id);

    if (localStorageRef) {
      this.setState({
        order : JSON.parse(localStorageRef)
      })
    }
  },
  componentWillUpdate : function(nextProps, nextState) {
    localStorage.setItem('order-' + this.props.params.store_id, JSON.stringify(nextState.order));
  },
  addToOrder : function(key) {
    this.state.order[key] = this.state.order[key] + 1 || 1;
    this.setState({ order : this.state. order });
  },
  removeFromOrder : function(key) {
    delete this.state.order[key];
    this.setState({ order : this.state.order });
  },
  addFish : function(fish) {
    var timestamp = (new Date()).getTime();
    this.state.fishes['fish-' + timestamp] = fish;
    this.setState({ fishes : this.state.fishes });
  },
  removeFish : function(key) {
    if (confirm("Are you sure you want to remove this fish?")) {
      this.state.fishes[key] = null;
      this.setState({ fishes : this.state.fishes });
    }
  },
  loadSamples : function() {
    this.setState({
      fishes : require('../sample-fishes')
    });
  },
  renderFish : function(key) {
    return <Fish key={key} index={key} details={this.state.fishes[key]} addToOrder={this.addToOrder}/>
  },
  render : function() {
    return (
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline="Fresh Seafood Good"/>
          <ul className="list-of-fishes">
            {Object.keys(this.state.fishes).map(this.renderFish)}
          </ul>
        </div>
        <Order fishes={this.state.fishes} order={this.state.order} removeFromOrder={this.removeFromOrder}/>
        <Inventory addFish={this.addFish} fishes={this.state.fishes} linkState={this.linkState} loadSamples={this.loadSamples} removeFish={this.removeFish}/>
      </div>
    )
  }
});

export default App;

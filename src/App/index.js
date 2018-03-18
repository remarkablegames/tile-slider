import React, { Component } from 'react';
import TileSlider from '../TileSlider';
import './styles.css';

export default class App extends Component {
  render() {
    return (
      <main className="App-center" role="main">
        <h1 className="App-heading text-center">Tile Slider</h1>
        <TileSlider size={3} />
      </main>
    );
  }
}

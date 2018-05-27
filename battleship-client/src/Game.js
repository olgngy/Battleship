import React, {Component} from 'react';
import Board from './Board';
import {N, SHIPS} from './Constants';
import {tryFit, randomShuffle} from './API';

let randomCoords;
let field;
let opponentsField;

function init() {
  randomCoords = [];
  for (let x = 0; x < N; x++) {
    for (let y = 0; y < N; y++) {
      randomCoords.push([x, y]);
    }
  }
  randomShuffle(randomCoords);
  field = new Array(N);
  opponentsField = new Array(N);
  for (let i = 0; i < N; i++) {
    field[i] = new Array(N).fill(0);
    opponentsField[i] = new Array(N).fill(0);
  }
  return [field, opponentsField];
}

function generateField (idx) { 
  if (idx === SHIPS.length) {
    return true;
  }
  const ship = SHIPS[idx];
  for (let c of randomCoords) {
    const initialField = JSON.parse(JSON.stringify(field));
    if (tryFit(c, ship, field)) {
      if (generateField(idx + 1)) {
        return true;
      }
    }
    field = initialField;
  }
  return false;
}


class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      turn: props.turn,
    }
    init();
    generateField(0);

    this.switchTurns = this.switchTurns.bind(this);
  }

  switchTurns() {
    let newTurn = !this.state.turn;
    this.setState({turn: newTurn});
    this.props.updateStats();
  }


  render() {
    let status = this.state.turn ? "Your turn" : "Opponent's turn";
    return (
      <div>
        <div>{status}</div>
        <Board isOpponent={false} 
               board={field} 
               socket={this.props.socket} 
               stats={this.props.stats}
               switchTurns={this.switchTurns} 
        />
        <Board isOpponent={true} 
               turn={this.state.turn} 
               board={opponentsField} 
               socket={this.props.socket} 
               stats={this.props.stats}
               switchTurns={this.switchTurns} 
        />
        <div className="reference">
            <div className="water">water</div>
            <div className="miss">miss</div>
            <div className="hit">hit</div>
            <div className="sunk">sunk</div>
            <div className="ship">your ship</div>
          </div>
      </div>
    );
  }

}

export default Game;
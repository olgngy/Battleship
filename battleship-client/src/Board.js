import React, {Component} from 'react';
import Cell from './Cell';
import {MISS, HIT, SHIPS} from './Constants';
import {bfs, getBorder} from './API';

function cutShip(point, field) {
  let points = bfs(point, HIT, field);
  let curShip = buildShip(points);
  for (let ship of SHIPS) {
    if (compareShips(curShip, ship)) {
      return points;
    }
  }
  return [];
}

function compareShips(s1, s2) {
  if (s1.length !== s2.length) {
    return false;
  }
  if (s1[0].length !== s2[0].length) {
    return false;
  }
  for (let i = 0; i < s2.length; i++) { 
    for (let j = 0; j < s1[0].length; j++) {
      if (s1[i][j] !== s2[i][j]) {
        return false;
      }
    }
  }
  return true;
}

function buildShip(points) {
  let maxX = points[0][0], maxY = points[0][1];
  let minX = points[0][0], minY = points[0][1];
  for (let point of points) {
    if (point[0] < minX) {
      minX = point[0];
    }
    if (point[0] > maxX) {
      maxX = point[0];
    }
    if (point[1] < minY) {
      minY = point[1];
    }
    if (point[1] > maxY) {
      maxY = point[1];
    }
  }
  let lenX = maxX - minX + 1;
  let lenY = maxY - minY + 1;
  let ship = new Array(lenX).fill(0);
  for (let i = 0; i < lenX; i++) {
    ship[i] = new Array(lenY).fill(0);
  }
  for (let point of points) {
    const x = point[0] - minX;
    const y = point[1] - minY;
    ship[x][y] = 1;
  }
  return ship;
}

class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      board: props.board,
      socket: props.socket,
    }
  }

  componentDidMount() {
    this.state.socket.on('check hit', (x, y) => {
      if (!this.props.isOpponent) {
        let newBoard = Object.assign([], this.state.board);
        newBoard[x][y] += 2;
        let result = newBoard[x][y];
        let points = [];
        let ship = cutShip([x, y], newBoard);
        if (ship.length !== 0) {
          points = Object.assign([], ship);
          result = HIT;
          for (let point of points) {
            const pX = point[0];
            const pY = point[1];
            newBoard[pX][pY] = result;
            point.push(result);
          }
          let border = getBorder([x, y], result, newBoard);
          for (let point of border) {
            const pX = point[0];
            const pY = point[1];
            newBoard[pX][pY] = MISS;
            point.push(MISS);
            points.push(point);
          }
          this.props.stats.opponent.ships++;
          console.log(this.props.stats);
        } else {
          points.push([x, y, result]);
        }
        this.state.socket.emit('send result', points);
        this.setState({board: newBoard});
        this.props.switchTurns();
      }
    });

    this.state.socket.on('hit result', (points) => {
      if (this.props.isOpponent) {
        let newBoard = Object.assign([], this.state.board);
        if (points.length > 1) {
          this.props.stats.player.ships++;
          console.log(this.props.stats);
        } else {
          this.props.stats.opponent.moves++;
        }
        for (let point of points) {
          const x = point[0];
          const y = point[1];
          newBoard[x][y] = point[2];
        }
        this.setState({board: newBoard});
        this.props.switchTurns();
      }
    });
  }

  handleClick(x, y) {
    this.props.stats.player.moves++;
    this.state.socket.emit('send hit', x, y);
  }

  renderRow(row, x) {
    return (
      <tr key={x}>
        {row.map((col, y) =>
          <Cell 
            key={y} 
            type={this.state.board[x][y]} 
            handleClick={(this.props.isOpponent && this.props.turn ? () => this.handleClick(x, y) : null)}
          />)
        }
      </tr>
    );
  }

  render() {
    return (
      <div className="inline-block">
        <p className="table-header">
          {this.props.isOpponent ? "Opponent" : "Player"}
        </p>
        <table className={this.props.isOpponent ? "opponent" : "player"}>
          <tbody>
            {this.state.board.map((row, idx) => this.renderRow(row, idx))}
          </tbody>
        </table>
      </div>
    );
  }

}

export default Board;
import React, {Component} from 'react';
import Board from './Board';

const N = 8;

const SHIPS = [
  [[1, 0], [1, 0], [1, 1]],   // L-shape
  [[1, 1], [1, 1]],           // Box
  [[1, 1, 1, 1]],             // H-Line
  [[1], [1], [1], [1]]        // V-Line
];

const DX = [-1, 0, 1, 0];
const DY = [0, -1, 0, 1];

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
}

function randomShuffle(array) {
  let idx = array.length;
  while (idx !== 0) {
    const randIdx = Math.floor(Math.random() * idx--);
    const tmp = array[idx];
    array[idx] = array[randIdx];
    array[randIdx] = tmp;
  }
  return array;
}

function generateField(idx) { 
  if (idx === SHIPS.length) {
    return true;
  }
  const ship = SHIPS[idx];
  for (let c of randomCoords) {
    const initialField = JSON.parse(JSON.stringify(field));
    if (tryFit(c, ship)) {
      if (generateField(idx + 1)) {
        return true;
      }
    }
    field = initialField;
  }
  return false;
}

function tryFit(point, ship) {
  const TMP_MARKER = 2;
  for (let i = 0; i < ship.length; i++) {
    for (let j = 0; j < ship[i].length; j++) {
      if (ship[i][j] === 0) {
        continue;
      }
      const x = point[0] + i;
      const y = point[1] + j;
      if (!checkPointEqual(x, y, 0)) {
        return false;
      }
      field[x][y] = TMP_MARKER;
    }
  }
  let border = getBorder(point, TMP_MARKER);
  for (let bPoint of border) {
    const x = bPoint[0];
    const y = bPoint[1];
    if (field[x][y] !== 0) {
      return false;
    }
  }
  for (let x = 0; x < N; x++) {
    for (let y = 0; y < N; y++) {
      if (field[x][y] === TMP_MARKER) {
        field[x][y] = 1;  
      }
    }
  }
  return true;
}

function getBorder(point, val) {
  let points = bfs(point, val);
  let used = new Array(N);
  for (let i = 0; i < N; i++) {
    used[i] = new Array(N).fill(false);
  }
  let result = [];
  for (let p of points) {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) {
          continue;
        }
        const x = p[0] + i;
        const y = p[1] + j;
        if (checkPointNonEqual(x, y, val) && !used[x][y]) {
          used[x][y] = true;
          result.push([x, y]);
        }
      }
    }
  }
  return result;
}

function checkPointEqual(x, y, val) {
  return x >= 0 && x < N &&
         y >= 0 && y < N &&
         field[x][y] === val;
}

function checkPointNonEqual(x, y, val) {
  return x >= 0 && x < N &&
         y >= 0 && y < N &&
         field[x][y] !== val;
}

function bfs(point, val) {
  let q = [];
  let used = new Array(N);
  for (let i = 0; i < N; i++) {
    used[i] = new Array(N).fill(false);
  }
  let result = [];
  q.push(point);
  used[point[0]][point[1]] = true;
  result.push(point);
  while (q.length > 0) {
    const v = q.shift();
    for (let i = 0; i < 4; i++) {
      const x = v[0] + DX[i];
      const y = v[1] + DY[i];
      if (checkPointEqual(x, y, val) && !used[x][y]) {
        used[x][y] = true;
        const next = [x, y];
        q.push(next);
        result.push(next);
      }
    }
  }
  return result;
}




class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      turn: props.turn,
    }
    init();
    generateField(0);
  }

  render() {
    let status = this.state.turn ? "Your turn" : "Opponent's turn";
    return (
      <div>
        <div>{status}</div>
        <Board isOpponent={false} board={field} />
        <Board isOpponent={true} board={opponentsField} />
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
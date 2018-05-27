import {N, DX, DY} from './Constants';

function checkPointEqual(x, y, val, field) {
  return x >= 0 && x < N &&
         y >= 0 && y < N &&
         field[x][y] === val;
}

function checkPointNonEqual(x, y, val, field) {
  return x >= 0 && x < N &&
         y >= 0 && y < N &&
         field[x][y] !== val;
}

export const tryFit = (point, ship, field) => {
  const TMP_MARKER = 8;
  for (let i = 0; i < ship.length; i++) {
    for (let j = 0; j < ship[i].length; j++) {
      if (ship[i][j] === 0) {
        continue;
      }
      const x = point[0] + i;
      const y = point[1] + j;
      if (!checkPointEqual(x, y, 0, field)) {
        return false;
      }
      field[x][y] = TMP_MARKER;
    }
  }
  let border = getBorder(point, TMP_MARKER, field);
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

export const bfs = (point, val, field) => {
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
    for (let i = 0; i < DX.length; i++) {
      const x = v[0] + DX[i];
      const y = v[1] + DY[i];
      if (checkPointEqual(x, y, val, field) && !used[x][y]) {
        used[x][y] = true;
        const next = [x, y];
        q.push(next);
        result.push(next);
      }
    }
  }
  return result;
}

export const getBorder = (point, val, field) => {
  let points = bfs(point, val, field);
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
        if (checkPointNonEqual(x, y, val, field) && !used[x][y]) {
          used[x][y] = true;
          result.push([x, y]);
        }
      }
    }
  }
  return result;
}

export const randomShuffle = (array) => {
  let idx = array.length;
  while (idx !== 0) {
    const randIdx = Math.floor(Math.random() * idx--);
    const tmp = array[idx];
    array[idx] = array[randIdx];
    array[randIdx] = tmp;
  }
  return array;
}
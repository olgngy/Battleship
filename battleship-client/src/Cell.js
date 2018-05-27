import React from 'react';
import {MISS, SHIP, HIT, SUNK} from './Constants';

function Cell(props) {
  return (
    <td className={getType(props.type)} onClick={props.handleClick}>
    </td>
  );
}

function getType(value) {
  switch(value) {
    case SHIP:
      return 'ship';
    case MISS:
      return 'miss';
    case HIT:
      return 'hit';
    case SUNK:
      return 'sunk';
    default:
      return 'water';
  }
}

export default Cell;
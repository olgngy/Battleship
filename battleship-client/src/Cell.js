import React from 'react';

function Cell(props) {
  return (
    <td className={getType(props.type)} onClick={props.handleClick}>
    </td>
  );
}

function getType(value) {
  switch(value) {
    case 1:
      return 'ship';
    case 2:
      return 'miss';
    case 3:
      return 'hit';
    case 4:
      return 'sunk';
    default:
      return 'water';
  }
}

export default Cell;
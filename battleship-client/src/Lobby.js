import React from 'react';

function Lobby(props) {
  return (
    <div>
      <h2>Hello</h2>
      <button onClick={props.startGame}>Start game</button>
    </div>
  );
}

export default Lobby;
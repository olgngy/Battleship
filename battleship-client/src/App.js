import React, {Component} from 'react';
import Lobby from './Lobby';
import Game from './Game';
import Result from './Result';
import socketIOClient from 'socket.io-client';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      endpoint: "http://localhost:8000",
      color: "white",
      isGame: false,
      isResult: false,
      turn: false,
    };
  }

  startGame() {
    const socket = socketIOClient(this.state.endpoint);
    socket.emit('add player');
    
    socket.on('start game', (isFirstPlayer) => {
      console.log("Hello, I'm " + (isFirstPlayer ? "first" : "second"));
      if (!isFirstPlayer) {
        let newTurn = JSON.parse(JSON.stringify(this.state.turn));
        this.setState({turn: !newTurn});
      }
      this.setState({isGame: !this.state.isGame});
    });

    // if player clicked on cell socket.emit('send hit')

    socket.on('check hit', (data) => {
      let result = "Hello";
      // find the state of the cell data(x, y)
      socket.emit('send result', result);
    });

    socket.on('hit result', (data) => {
      // change gameboard state and switch turns
    });

    socket.on('disconnect', () => {
      console.log('Bye');
    });
  }

  showResults() {
    console.log("RESULTS!!!");
  }

  showComponent() {
    if (this.state.isGame) return (<Game turn={this.state.turn} showResults={() => this.showResults()} />);
    if (this.state.isResult) return(<Result />);
    return (<Lobby startGame={() => this.startGame()} />);
  }

  render() { 
    return (
      <div>
        <header>
          <h1>
            Battleship
          </h1>
        </header>
        <section className="main">
          {this.showComponent()}
        </section>
        <footer>
          <p>
            Best game ever<br />
            Olga Nad
          </p>
        </footer>
      </div>
    );
  }
}

export default App;

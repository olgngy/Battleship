import React, {Component} from 'react';
import Lobby from './Lobby';
import Game from './Game';
import Result from './Result';
import io from 'socket.io-client';

class App extends Component {
  constructor(props) {
    super(props);
    let stats = {"player": {"ships": 0, "moves": 0}, "opponent": {"ships": 0, "moves": 0}};
    this.state = {
      isGame: false,
      isResult: false,
      turn: true,
      socket: io("http://localhost:8000"),
      stats: stats,
    };
    this.updateStats = this.updateStats.bind(this);
  }

  startGame() {
    this.state.socket.emit('add player');

    this.state.socket.on('start game', (isFirstPlayer) => {
      if (!isFirstPlayer) {
        this.setState({turn: !this.state.turn});
      }
      this.setState({isGame: !this.state.isGame});
    });

    this.state.socket.on('disconnect', () => {
      console.log('Bye');
    });
  }

  updateStats() {
    // if win-win show results
    if (stats.player.ships === 4 || stats.opponent.ships === 4) {
      this.setState({isGame: !this.state.isGame, isResult: !this.state.isResult});
    }
  }

  showResults() {
    console.log("RESULTS!!!");
    // disconnect from the server
  }

  showComponent() {
    if (this.state.isGame) return (
      <Game turn={this.state.turn}
            stats={this.state.stats}
            socket={this.state.socket}
            showResults={() => this.showResults()}
        />);
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

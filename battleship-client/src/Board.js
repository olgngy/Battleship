import React, {Component} from 'react';
import Cell from './Cell';

class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      board: props.board,
    }
  }

  handleClick(x, y) {
    let newBoard = JSON.parse(JSON.stringify(this.state.board));
    newBoard[x][y] = Math.round(Math.random() * 2) + 1;
    //hit(x, y); get response with the cell(x, y) status from enemy
    this.setState({
      board: newBoard,
    });
  }

  renderRow(row, x) {
    return (
      <tr key={x}>
        {row.map((col, y) =>
          <Cell 
            key={y} 
            type={this.state.board[x][y]} 
            handleClick={(this.props.isOpponent ? () => this.handleClick(x, y) : null)}
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
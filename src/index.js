import "./main.scss";
import React, { Component } from "react";
import ReactDOM from "react-dom";

import Row from "./components/Row";

class Minesweeper extends React.Component {
	constructor() {
		super();
		this.state = {
			rows: 10,
			cols: 10,
			board: [],
			mines: 10,
			win: false,
			gameOver: false
		};
	}

	componentDidMount() {
		let board = this.createBoard(this.state.rows, this.state.cols);
		this.setState({
			board
		});
	}

	createBoard = (rows, columns) => {
		let board = [];
		for (let i = 0; i < rows; i++) {
			board.push([]);

			for (let j = 0; j < columns; j++) {
				board[i].push({
					row: i,
					col: j,
					hasMine: false,
					isOpen: false,
					count: 0
				});
			}
		}

		for (let i = 0; i < this.state.mines; i++) {
			let randomRow = Math.floor(Math.random() * rows);
			let randomCol = Math.floor(Math.random() * columns);
			let cell = board[randomRow][randomCol];

			if (cell.hasMine) --i;
			else cell.hasMine = true;
		}
		return board;
	};

	reveal = cellData => {
		let board = [...this.state.board];
		let stack = [];
		stack.push(cellData);

		if (cellData.hasMine) {
			this.revealAll();
			this.setState({
				gameOver: true
			});
			return;
		} else {
			while (stack.length) {
				let cell = stack.shift();

				let count = this.getMinesCount(cell.row, cell.col, board);

				if (cell.isOpen || cell.hasMine) continue;

				cell.isOpen = true;
				let cellsLeft = this.getCellsLeft(board);
				if (cellsLeft === this.state.mines) {
					this.revealAll();
					this.setState({
						win: true
					});
					return;
				}

				if (count) {
					cell.count = count;
					continue;
				}

				for (let i = -1; i <= 1; i++) {
					for (let j = -1; j <= 1; j++) {
						let ni = cell.row + i;
						let nj = cell.col + j;

						if (
							ni < 0 ||
							nj < 0 ||
							ni >= this.state.rows ||
							nj >= this.state.cols
						)
							continue;

						stack.push(board[ni][nj]);
					}
				}
			}

			this.setState({
				board
			});
		}
	};

	revealAll = () => {
		let board = [...this.state.board];

		for (let i = 0; i < this.state.rows; i++) {
			for (let j = 0; j < this.state.cols; j++) {
				let count = this.getMinesCount(i, j, board);
				board[i][j].count = count;
				board[i][j].isOpen = true;
			}
		}

		this.setState({ board });
	};

	getMinesCount = (row, col, board) => {
		let count = 0;

		for (let i = -1; i <= 1; i++) {
			for (let j = -1; j <= 1; j++) {
				if (
					row + i >= this.state.rows ||
					col + j >= this.state.cols ||
					row + i < 0 ||
					col + j < 0
				)
					continue;

				let cell = board[row + i][col + j];

				if (cell.hasMine) count++;
			}
		}

		return count;
	};

	getCellsLeft = board => {
		let tempboard = [...board];
		let total = 0;
		for (let i = 0; i < this.state.rows; i++) {
			for (let j = 0; j < this.state.cols; j++) {
				if (!tempboard[i][j].isOpen) {
					total++;
				}
			}
		}
		return total;
	};

	gameStatus = () => {
		if (this.state.win) return <h2>You Win</h2>;
		if (this.state.gameOver) return <h2>Game Over! You lose.</h2>;
	};

	handleRestart = () => {
		let board = this.createBoard(this.state.rows, this.state.cols);

		this.setState({
			board,
			win: false,
			gameOver: false
		});
	};

	render() {
		let rows = this.state.board.map((row, i) => {
			return <Row key={i} cellData={row} reveal={this.reveal} />;
		});

		return (
			<React.Fragment>
				<h1>Minesweeper !!</h1>
				<p>Beware! There are 10 mines.</p>
				<button className="restart-btn" onClick={this.handleRestart}>
					Restart
				</button>
				<div
					className={
						this.state.gameOver
							? "board game-over"
							: this.state.win
							? "board win"
							: "board"
					}
				>
					{rows}
				</div>
				{this.gameStatus()}
			</React.Fragment>
		);
	}
}
//rendering to dom
ReactDOM.render(<Minesweeper />, document.querySelector(".app"));

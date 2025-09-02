// src/modules/Game.class.js
export class Game {
  constructor(initialState) {
    this.state = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'idle'; // 'idle', 'playing', 'won', 'over'
  }

  getState() {
    return this.state;
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.status = 'playing';
    this.score = 0;

    this.state = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.start();
  }

  addRandomTile() {
    const emptyCells = [];

    this.state.forEach((row, rowIndex) => {
      row.forEach((val, colIndex) => {
        if (val === 0) {
          emptyCells.push({ r: rowIndex, c: colIndex });
        }
      });
    });

    if (emptyCells.length === 0) {
      return;
    }

    const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.state[r][c] = Math.random() < 0.9 ? 2 : 4;
  }

  slideAndMerge(row) {
    const filtered = row.filter((v) => v !== 0);
    const newRow = [];
    let skip = false;

    for (let i = 0; i < filtered.length; i++) {
      if (skip) {
        skip = false;
        continue;
      }

      if (filtered[i] === filtered[i + 1]) {
        const merged = filtered[i] * 2;

        newRow.push(merged);
        this.score += merged;
        skip = true;

        if (merged === 2048) {
          this.status = 'won';
        }
      } else {
        newRow.push(filtered[i]);
      }
    }

    while (newRow.length < 4) {
      newRow.push(0);
    }

    return newRow;
  }

  moveLeft() {
    this.state = this.state.map((row) => this.slideAndMerge(row));
    this.addRandomTile();
    this.checkGameOver();
  }

  moveRight() {
    const slideRow = (row) => this.slideAndMerge([...row].reverse()).reverse();

    this.state = this.state.map(slideRow);
    this.addRandomTile();
    this.checkGameOver();
  }

  moveUp() {
    const slideRow = (row) => this.slideAndMerge(row);

    this.state = this.transpose(this.state).map(slideRow);
    this.state = this.transpose(this.state);
    this.addRandomTile();
    this.checkGameOver();
  }

  moveDown() {
    const slideRow = (row) => this.slideAndMerge([...row].reverse()).reverse();

    this.state = this.transpose(this.state).map(slideRow);
    this.state = this.transpose(this.state);
    this.addRandomTile();
    this.checkGameOver();
  }

  transpose(matrix) {
    return matrix[0].map((_, c) => matrix.map((row) => row[c]));
  }

  checkGameOver() {
    if (this.status === 'won') {
      return;
    }

    const canMove = () => {
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          if (this.state[r][c] === 0) {
            return true;
          }

          if (c < 3 && this.state[r][c] === this.state[r][c + 1]) {
            return true;
          }

          if (r < 3 && this.state[r][c] === this.state[r + 1][c]) {
            return true;
          }
        }
      }

      return false;
    };

    if (!canMove()) {
      this.status = 'over';
    }
  }
}

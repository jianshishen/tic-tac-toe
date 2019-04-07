import { Injectable } from "@angular/core";

export enum Flag {
  None = 0,
  X = 1,
  O = 2
}

export enum GameState {
  XTurn = 0,
  OTurn = 1,
  Won = 2,
  Draw = 3
}

export interface Cell {
  row: number;
  col: number;
  flag: Flag;
}

export type Row = Cell[];

@Injectable()
export class Board {
  public rows: Row[] = [];
  public gameState: GameState;
  public twoTurn: GameState;
  public twoWon: boolean = false;
  public winScenarios: Row[] = [];

  constructor() {
    this.reset();
  }

  // Initialisation of a game
  public reset(): void {
    while (this.rows.pop());
    while (this.winScenarios.pop());

    this.gameState = GameState.XTurn;

    // Making an empty board
    for (let row = 0; row < 3; row += 1) {
      let newRow = [];
      this.rows.push(newRow);
      for (let col = 0; col < 3; col += 1) {
        let newCell = {
          row: row,
          col: col,
          flag: Flag.None,
          winningCell: false
        };
        newRow.push(newCell);
      }
    }

    // Simulating every winning scenarios

    // Top row
    let topRow = this.rows[0];
    this.winScenarios.push(topRow);

    // Middle row
    let middleRow = this.rows[1];
    this.winScenarios.push(middleRow);

    // Bottom row
    let bottomRow = this.rows[2];
    this.winScenarios.push(bottomRow);

    // Left column
    let leftColumn = [this.rows[0][0], this.rows[1][0], this.rows[2][0]];
    this.winScenarios.push(leftColumn);

    // Middle column
    let middleColumn = [this.rows[0][1], this.rows[1][1], this.rows[2][1]];
    this.winScenarios.push(middleColumn);

    // Right column
    let rightColumn = [this.rows[0][2], this.rows[1][2], this.rows[2][2]];
    this.winScenarios.push(rightColumn);

    // \ Diagonal
    let leftTopDiagonal = [this.rows[0][0], this.rows[1][1], this.rows[2][2]];
    this.winScenarios.push(leftTopDiagonal);

    // / Diagonal
    let leftBottomDiagonal = [
      this.rows[2][0],
      this.rows[1][1],
      this.rows[0][2]
    ];
    this.winScenarios.push(leftBottomDiagonal);

    this.twoTurn = Math.random() < 0.5 ? GameState.XTurn : GameState.OTurn;
  }

  public checkWin(): void {
    let won = false,
      twoState = this.twoTurn === GameState.XTurn ? Flag.X : Flag.O;

    // Checking if there is a winner
    for (let x = 0; !won && x < this.winScenarios.length; x += 1) {
      let row = this.winScenarios[x];
      if (this.won(row)) {
        won = true;
        for (let y = 0; y < row.length; y += 1) {
          this.twoWon = twoState === row[y].flag;
        }
      }
    }

    if (won) {
      this.gameState = GameState.Won;
      return;
    }

    // Checking draw
    let draw = true;

    for (let x = 0; draw && x < this.winScenarios.length; x += 1) {
      draw = this.draw(this.winScenarios[x]);
    }

    if (draw) {
      this.gameState = GameState.Draw;
      return;
    }

    this.gameState =
      this.gameState === GameState.XTurn ? GameState.OTurn : GameState.XTurn;
  }

  // Checking if there is a draw scenario in each row
  public draw(row: Row): boolean {
    let hasX = false,
      hasO = false;
    for (let y = 0; y < row.length; y += 1) {
      hasX = hasX || row[y].flag === Flag.X;
      hasO = hasO || row[y].flag === Flag.O;
    }
    return hasX && hasO;
  }

  // Checking if there is a winning scenario
  public won(row: Row): boolean {
    return (
      row[0].flag != Flag.None &&
      row[0].flag === row[1].flag &&
      row[1].flag === row[2].flag
    );
  }
}

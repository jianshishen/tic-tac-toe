import { Row, Cell, Flag } from "./board";
import { Injectable } from "@angular/core";

export enum RowValue {
  Draw = 0,
  Empty = 1,
  OneOpponent = 10,
  OneMine = 50,
  TwoOpponent = 100,
  TwoMine = 1000
}

export interface Rank {
  id: number;
  weight: number;
  cell: Cell;
}

@Injectable()
export class Nextmove {
  // For invincible AI
  public hardStrategy(rows: Row[], targetFlag: Flag): void {
    // Label each position with number from 0 to 8
    let idFunc = (cell: Cell) => cell.row * 3 + cell.col,
      rank: Rank[] = [];

    // Create a empty list of next possible moves
    for (let x = 0; x < 9; x += 1) {
      rank.push({ id: x, weight: 0, cell: null });
    }

    // Checking how close each side is to a winning scenario
    // Pick up each winning scenario
    for (let x = 0; x < rows.length; x += 1) {
      let row = rows[x],
        myCount = 0,
        theirCount = 0,
        value = RowValue.Draw;
      // Pick up each cell in a scenario
      for (let y = 0; y < row.length; y += 1) {
        let cell = row[y],
          id = idFunc(cell);
        // Check if the cell is a candidate
        if (rank[id].cell === null) {
          // Put the cell as a candidate
          rank[id].cell = cell;
        }
        // Assign the lowest priority to the occupied cell
        if (cell.flag !== Flag.None) {
          rank[id].weight = -99999;
          // Count occupied cells of each side in a scenario
          if (cell.flag === targetFlag) {
            myCount += 1;
          } else {
            theirCount += 1;
          }
        }
      }

      // Assign a rating of a possible scenario
      if (myCount === 0) {
        value =
          theirCount === 0
            ? RowValue.Empty
            : theirCount === 1
            ? RowValue.OneOpponent
            : RowValue.TwoOpponent;
      } else {
        value =
          theirCount > 0
            ? RowValue.Draw
            : myCount === 1
            ? RowValue.OneMine
            : RowValue.TwoMine;
      }

      // Add the rating to the weight of each possible move
      for (let y = 0; y < row.length; y += 1) {
        let cell = row[y],
          id = idFunc(cell);
        rank[id].weight += value;
      }
    }

    // Sort the list by highest rating
    rank.sort((a, b) => b.weight - a.weight);

    let shortList: Cell[] = [],
      weight = rank[0].weight;

    // Put all moves with the highest rating in the list
    shortList.push(rank[0].cell);
    for (let x = 1; x < rank.length; x += 1) {
      if (rank[x].weight === weight) {
        shortList.push(rank[x].cell);
      }
    }

    // Randomly choose a move
    shortList.sort(() => 0.5 - Math.random());
    let cell: Cell;
    while ((cell = shortList.pop())) {
      if (cell.flag === Flag.None) {
        cell.flag = targetFlag;
        break;
      }
    }
  }

  // For beatable AI
  public noBrainerStrategy(rows: Row[], targetFlag: Flag): void {
    let idFunc = (cell: Cell) => cell.row * 3 + cell.col,
      shortList: Cell[] = [],
      temp: { [id: number]: Cell } = {};
    for (let x = 0; x < rows.length; x += 1) {
      let row = rows[x];
      for (let y = 0; y < row.length; y += 1) {
        let cell = row[y],
          id = idFunc(cell);
        // Push an empty cell into the candidate list
        if (cell.flag === Flag.None && temp[id] === undefined) {
          shortList.push(cell);
          temp[id] = cell;
        }
      }
      // Randomly select a move from the list
      if (shortList.length > 0) {
        shortList[
          Math.floor(Math.random() * shortList.length)
        ].flag = targetFlag;
        return;
      }
    }
  }
}

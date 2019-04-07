import { Component, OnInit } from "@angular/core";
import { Board, Row, Cell, Flag, GameState } from "../board";
import { Nextmove } from "../nextmove";

@Component({
  selector: "app-homepage",
  templateUrl: "./homepage.component.html",
  styleUrls: ["./homepage.component.css"],
  providers: [Board, Nextmove]
})
export class HomepageComponent implements OnInit {
  public modeAi: boolean;
  public invincible: boolean;
  public ongoing: boolean;
  public oneName: string;
  public twoName: string;
  public rows: Row[] = [];
  public oneIsX: boolean;
  public oneTurn: boolean;
  public won: boolean;
  public twoWon: boolean;
  public draw: boolean;

  constructor(private board: Board, private nextmove: Nextmove) {
    this.rows = board.rows;
    this.oneIsX = board.twoTurn === GameState.OTurn;
  }

  ngOnInit(): void {
    this.gameReset();
    this.update();
  }

  gameReset(): void {
    this.modeAi = false;
    this.invincible = false;
    this.ongoing = false;
    this.oneName = "";
    this.twoName = "";
    this.won = false;
    this.draw = false;
  }

  // Give the turn to the other, and check if there is a win or draw
  private update(): void {
    this.oneTurn =
      this.board.gameState !== GameState.Won &&
      this.board.gameState !== GameState.Draw &&
      this.board.gameState !== this.board.twoTurn;
    this.won = this.board.gameState === GameState.Won;
    this.twoWon = this.board.twoWon;
    this.draw = this.board.gameState === GameState.Draw;
    // If the AI is playing, tell AI to move
    if (this.modeAi && !this.oneTurn) {
      this.twoMove();
    }
  }

  // Handle the move
  public stateChange(cell: Cell) {
    cell.flag = this.board.gameState === GameState.XTurn ? Flag.X : Flag.O;
    this.board.checkWin();
    this.update();
  }

  // Handle AI movement
  private twoMove(): void {
    if (this.oneTurn || this.won || this.draw) {
      return;
    }
    if (this.invincible) {
      this.nextmove.hardStrategy(
        this.board.winScenarios,
        this.board.twoTurn === GameState.XTurn ? Flag.X : Flag.O
      );
    } else {
      this.nextmove.noBrainerStrategy(
        this.board.winScenarios,
        this.board.twoTurn === GameState.XTurn ? Flag.X : Flag.O
      );
    }

    this.board.checkWin();
    this.update();
  }

  // Start a game
  start(): void {
    this.ongoing = true;
    this.board.reset();
    this.oneIsX = this.board.twoTurn === GameState.OTurn;
    this.update();
  }

  // Stop a game
  stop(): void {
    this.ongoing = false;
    this.gameReset();
  }
}

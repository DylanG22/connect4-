/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */
const startBtn = document.getElementById('startBtn');
let input1 = document.querySelector('#p1Input');
let input2 = document.querySelector('#p2Input');
const inputArr = ['',input1,input2];

class Game{
  constructor(h,w){
    this.height = h;
    this.width = w;
    this.currPlayer = p1;
    this.board = [];
    this.gameOver = false;

  }
  makeBoard(){
    for (let y = 0; y < this.height; y++) {
      this.board.push(Array.from({ length: this.width }));
    }
  };

  makeHtmlBoard() {
    const board = document.getElementById('board');
    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    top.addEventListener('click', this.handleClick.bind(this));
  
    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }
  
    board.append(top);
  
    // make main part of board
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement('tr');
  
      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }
  
      board.append(row);
    }
  };

  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  };

  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.classList.add(`p${this.currPlayer.playerNum}`);
    piece.setAttribute('style',`background-color :${this.currPlayer.playerColor}`);
    piece.style.top = -50 * (y + 2);
    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  };

  endGame(msg) {
    this.gameOver = true;
    alert(msg);
  };

  handleClick(evt) {

    if(this.gameOver){
      return
    }
    // get x from ID of clicked cell
    const x = +evt.target.id;
    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }
  
    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer.playerNum;
    this.placeInTable(y, x);
    
    // check for win
    if (this.checkForWin()) {
      return this.endGame(`Player ${this.currPlayer.playerNum} won!`);
    }
    
    // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('Tie!');
    }
      
    // switch players
    if(this.currPlayer.playerNum === 1){
      this.currPlayer = p2;
    }
    else if(this.currPlayer.playerNum === 2){
      this.currPlayer = p1;
    }
  };

  _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < this.height &&
        x >= 0 &&
        x < this.width &&
        this.board[y][x] === this.currPlayer.playerNum
    );
  }
  checkForWin() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
  
        // find winner (only checking each win-possibility as needed)
        if (this._win(horiz) || this._win(vert) || this._win(diagDR) || this._win(diagDL)) {
          return true;
        }
      }
    }
  }
}

class Player {
  constructor(color,playerNum){
    this.playerColor = color;
    this.playerNum = playerNum;
  }
  updateColor(){ 

    if(inputArr[this.playerNum].value === ''){
      return
    }
    this.playerColor = inputArr[this.playerNum].value;
  }
}

const p1 = new Player('red',1);
const p2 = new Player('blue',2);





startBtn.addEventListener('click',function(e){
  e.preventDefault();
  const board = document.getElementById('board');
  board.innerHTML = '';
  let game = new Game(6,7);
  game.makeBoard();
  game.makeHtmlBoard();
  p1.updateColor();
  p2.updateColor();
});

const puzzleContainer = document.querySelector("#puzzle-container");
const timeP = document.querySelector("#time");

let board;

let time;
let moves;
let timeH = localStorage.getItem("timeH") || "NA";
let movesH = localStorage.getItem("movesH") || "NA";

class Board {
    constructor() {
        this.board = [];
        this.winningBoard = [];
        this.size = 3;
    }

    shuffleBoard() {
        console.log("shuffling");
        while( this.isWinning()) {
            shuffle(this.board, true);
        };
    };

    showBoard() {
        for(let rows = 0; rows < this.size; rows++){
            for(let cols = 0; cols < this.size; cols++){
                this.board[rows][cols].show();
            };
        };
    }

    updateBoard() {
        for(let rows = 0; rows < this.size; rows++){
            for(let cols = 0; cols < this.size; cols++){
                this.board[rows][cols].update(rows, cols);
            };
        };
    }

    isWinning() {
        let winning = true;
        for(let rows = 0; rows < this.size; rows++){
            for(let cols = 0; cols < this.size; cols++){
                if (this.board[rows][cols].value != this.winningBoard[rows][cols]) {
                    winning = false;
                    break;
                };
            };
        };
        return winning;
    }

    celebrate() {
        background(color(0, 0, 50, 0.5));
        textAlign(CENTER);
        textSize(40);
        fill(255);
        stroke(0);
        strokeWeight(2);
        text(`You won! in ${time}s & ${moves} moves`, width/2, height/2);
        text(`High score: ${timeHigh}s & ${movesHigh} moves`, width/2, height/2 + 50);
        if (time > timeHigh && moves > movesHigh) {
            text(`New high score: ${timeHigh}s & ${movesHigh} moves`, width/2, height/2 + 50);
            localStorage.setItem("timeHigh", timeHigh);
            localStorage.setItem("movesHigh", movesHigh);
        }
        
    }
};

class Piece {
    constructor(rows, cols, value) {
        this.x = cols;
        this.y = rows;
        this.value = value;

        this.maxMag = 20;
        this.xSpeed = 0;
        this.ySpeed = 0;   
        this.size = 100;
        colorMode(HSB);
        this.color = color(random(0, 360), 50, 100); 
    }

    show() {
        if (this. value == "x")
            return;
        fill(this.color);
        stroke(0);
        let borderRadius = 5;
        rect(this.x, this.y, this.size, this.size, borderRadius);
        textSize(22);
        fill(0);
        text(this.value.toString(), this.x + this.size/2, this.y + this.size/2);
    }

    clicked() {
        if (mouseX >= this.x 
            && mouseX <= this.x + this.size
            && mouseY >= this.y
            && mouseY <= this.y + this.size){
                console.log("Clicked", this.value);
                return true;
        } else {
            return false;
        };               
    }

    move() {
        console.log("Moving: ",this.value);
        let rows = floor(this.y / this.size);
        let cols = floor(this.x / this.size);
        console.log(`board[${rows}][${cols}]: ${board.board[rows][cols].value}`);
        if ( !(rows - 1 < 0) ) 
            console.log(`top; ${board.board[rows - 1][cols].value}`);
        if ( !(cols + 1 > board.size - 1) )
            console.log(`right: ${board.board[rows][cols + 1].value}`);
        if ( !(rows + 1 > board.size - 1) )
            console.log(`bottom: ${board.board[rows + 1][cols].value}`);
        if ( !(cols - 1 < 0) )
            console.log(`left: ${board.board[rows][cols - 1].value}`);
        //top
        if ( !(rows - 1 < 0) ) {
            let top = board.board[rows - 1][cols];
            if (top.value == "x") {
                let temp = board.board[rows][cols];
                board.board[rows][cols] = top;
                board.board[rows - 1][cols] = temp;
                moves++;
            };
        };
        //right
        if ( !(cols + 1 > board.size - 1) ) {
            let right = board.board[rows][cols + 1];
            if (right.value == "x") {
                let temp = board.board[rows][cols];
                board.board[rows][cols] = right;
                board.board[rows][cols + 1] = temp;
                moves++;
            };
        };
        //bottom
        if ( !(rows + 1 > board.size - 1) ) {
            let bottom = board.board[rows + 1][cols];
            if (bottom.value == "x") {
                let temp = board.board[rows][cols];
                board.board[rows][cols] = bottom;
                board.board[rows + 1][cols] = temp;
                moves++;
            };
        };
        //left
        if ( !(cols - 1 < 0) ) {
            let left = board.board[rows][cols - 1];
            if (left.value == "x") {
                let temp = board.board[rows][cols];
                board.board[rows][cols] = left;
                board.board[rows][cols - 1] = temp;
                moves++;
            };
        };
        console.log(board.board);
    }

    update(rows, cols) {
        let targetX = cols * this.size;
        let targetY = rows * this.size;
        if (this.x != targetX) {
            if (this.x <= targetX) {
                this.xSpeed = this.maxMag ;
            } else {
                this.xSpeed = -this.maxMag ;
            };
        };
        if (this.y != targetY) {
            if (this.y <= targetY) {
                this.ySpeed = this.maxMag ;
            } else {
                this.ySpeed = -this.maxMag ;
            };
        };
        if (this.x == targetX && this.y == targetY) {
            this.xSpeed = 0;
            this.ySpeed = 0;
        };
        this.x += this.xSpeed;
        this.y += this.ySpeed;
    }
}

function mouseClicked() {
    for(let rows = 0; rows < board.size; rows++){
        for(let cols = 0; cols < board.size; cols++){
            if (board.board[rows][cols].clicked()) {
                board.board[rows][cols].move();
            }
        };
    };    
}

function setup() {
    time = 0;
    moves = 0;
    let width = 300;
    let height = 300;
    let canvas = createCanvas(width, height);
    canvas.parent("puzzle-container");

    board = new Board();
    for(let rows = 0; rows < board.size; rows++) {
        board.board[rows] = new Array(board.size);
    };
    for(let rows = 0; rows < board.size; rows++){
        for(let cols = 0; cols < board.size; cols++){
            let spacing = 100;
            let piece = new Piece(rows * spacing, cols * spacing, rows * board.size + cols + 1);
            board.board[rows][cols] = piece;
        };
    };
    board.board[board.size - 1][board.size - 1].value = "x";

    for(let rows = 0; rows < board.size; rows++) {
        board.winningBoard[rows] = new Array(board.size);
    };
    for(let rows = 0; rows < board.size; rows++){
        for(let cols = 0; cols < board.size; cols++){
            board.winningBoard[rows][cols] = board.board[rows][cols].value;
        };
    };

    console.log("Board:", board.board);
    board.shuffleBoard();
    console.log("Shuffled board", board.board);
    console.log("Winning board:", board.winningBoard);
}

function draw() {    
    frameRate(60);
    background(200);
    board.showBoard();
    board.updateBoard();
    if (board.isWinning() == true) {
        board.celebrate();
    };
    time = floor(millis() / 1000);
    timeP.textContent = `Time: ${time}s  Moves: ${moves}`;
}
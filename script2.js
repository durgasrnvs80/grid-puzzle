class Piece {
    constructor(value, x, y, size) {
        this.value = value;
        this.x = x;
        this.y = y;
        this.targetX = x;
        this.targetY = y;
        this.size = size;
        this.speed = 10;
        colorMode(HSB);
        this.color = color(random(0, 360), 50, 100);
    }

    show() {
        if (this.value == "x") return;
        fill(this.color);
        rect(this.x, this.y, this.size, this.size, 5, 5);
        textSize(22);
        textAlign(CENTER);
        fill(0);
        text(this.value, this.x + this.size / 2, this.y + this.size / 2 + 11);
    }

    update(row, col) {
        this.targetX = col * this.size;
        this.targetY = row * this.size;
        //console.log(`targetX: ${this.targetX}, targetY: ${this.targetY}`);
    }

    animate() {
        if (abs(this.x - this.targetX) < 3) {
            this.x = this.targetX;
        };

        if (abs(this.y - this.targetY) < 3) {
            this.y = this.targetY;
        };

        if (this.x != this.targetX) {
            if (this.x <= this.targetX) {
                this.x += this.speed;
            } else {
                this.x -= this.speed;
            };
        };
        if (this.y != this.targetY) {
            if (this.y <= this.targetY) {
                this.y += this.speed;
            } else {
                this.y -= this.speed;
            };
        };
    }
};

class Board {
    constructor() {
        this.pieces = [];
        this.winningPieces = [];
        for(let row = 0; row < 3; row++) {
            this.pieces[row] = new Array(3);
            this.winningPieces[row] = new Array(3);
        };
        for(let row = 0; row < 3; row++) {
            for(let col = 0; col < 3; col++){
                this.pieces[row][col] = new Piece(
                    row * 3 + col + 1,
                    col * 100,
                    row * 100,
                    100
                );

                this.winningPieces[row][col] = new Piece(
                    row * 3 + col + 1,
                    col * 100,
                    row * 100,
                    100
                );
            };
        };
        this.pieces[2][2].value = "x";
        this.winningPieces[2][2].value = "x";

        //GLOBAL
        score.moves = 0;
    }

    show() {
        for(let row = 0; row < 3; row++) {
            for(let col = 0; col < 3; col++){
                this.pieces[row][col].show();
            };
        };
    }

    animate() {
        for(let row = 0; row < 3; row++) {
            for(let col = 0; col < 3; col++){
                this.pieces[row][col].animate();
            };
        };
    }
    
    clicked() {
        let row = floor(map(mouseY, 0, 300, 0, 3));
        let col = floor(map(mouseX, 0, 300, 0, 3));
        if(row < 0 || row > 2 || col < 0 || col > 2) {
            //console.log(`Clicked out of canvas`);
            return;
        }
        //console.log(`Clicked row:${row} col:${col}, this.pieces[${row}][${col}]: ${this.pieces[row][col].value}`);
        this.move(row, col);
    }

    move(row, col, shuffling) {
        //console.log(`To move: this.pieces[${row}][${col}]: ${this.pieces[row][col].value}`);
        //top
        if (row - 1 >= 0) {    
            let top = this.pieces[row - 1][col];   
            //console.log("Top", top);
            if (top.value == "x") {
                this.swap(row, col, row - 1, col);
            };
        };
        //right
        if (col + 1 < 3) {
            let right = this.pieces[row][col + 1];
            //console.log("Right", right);
            if (right.value == "x") {
                this.swap(row, col, row, col + 1);
            };
        };
        //bottom
        if (row + 1 < 3) {
            let bottom = this.pieces[row + 1][col];
            //console.log("Bottom", bottom);
            if (bottom.value == "x") {
                this.swap(row, col, row + 1, col);
            };
        };
        //left
        if (col - 1 >= 0) {
            let left = this.pieces[row][col - 1];
            //console.log("Left", left);
            if (left.value == "x") {
                this.swap(row, col, row, col - 1);
            }
        };
        
        //GLOBAL
        score.moves++;

        if (this.hasWon() && !shuffling) {
            celebrate();
        };
    }

    swap(row1, col1, row2, col2) {
        //console.log("To swap", this.pieces[row1][col1], this.pieces[row2][col2]);
        let temp = this.pieces[row1][col1];
        this.pieces[row1][col1] = this.pieces[row2][col2];
        this.pieces[row2][col2] = temp;
        //console.log("After swap", this.pieces[row1][col1], this.pieces[row2][col2]);
        this.pieces[row1][col1].update(row1, col1);
        this.pieces[row2][col2].update(row2, col2);
    }

    shuffle () {
        for (let i = 0; i < 10000; i++) {
            let row = floor((random() * 10) % 3);
            let col = floor((random() * 10) % 3);
            let shuffling = true;
            board.move(row, col, shuffling);
        };
    }

    hasWon () {
        let win = true;
        for(let row = 0; row < 3; row++) {
            for(let col = 0; col < 3; col++){
                if (this.pieces[row][col].value != this.winningPieces[row][col].value) {
                    win = false;
                };
            };
        };
        return win;
    }
}

const puzzleContainer = document.querySelector("#puzzle-container");
const loadingSpinner = document.querySelector("#loading-spinner");
const replayBtn = document.querySelector("#replay");
const celebration = document.querySelector("#celebration");
const scoreDisplay = document.querySelector("#score-display");

let board;
let score = {
    time: 0,
    prevTime: 0,
    moves: 0
};

function setup() {
    let canvas = createCanvas(300, 300);
    canvas.parent("puzzle-container");
    board = new Board();
    loadingSpinner.classList.remove("hide");
    board.shuffle();
    loadingSpinner.classList.add("hide");
    score.prevTime = score.time;
    score.moves = 0;
}

function draw() {
    background(255);
    board.show();
    board.animate();
    score.time = floor(millis() / 1000) - score.prevTime;
    scoreDisplay.textContent = `Time: ${score.time}s Moves: ${score.moves}`;
}

function mouseClicked() {
    //console.log("Game Ended", gameEnded());
    if (!gameEnded()) {
        board.clicked();
    };
    function gameEnded() {
        let ended = true;
        let replayBtnClassList = replayBtn.classList.value.split();
        replayBtnClassList.forEach((element) => {
            if (element == "hide") {
                ended = false;
            };
        });
        return ended;
    };
}

function celebrate() {
        for(let row = 0; row < 3; row++) {
            for(let col = 0; col < 3; col++) {
                board.pieces[row][col].speed = 3;
                board.pieces[row][col].targetX = random() * 10000;
                if (random() <= 0.5) {
                    board.pieces[row][col].targetX *= -1;
                };
                board.pieces[row][col].targetY = random() * 10000;
                if (random() <= 0.5) {
                    board.pieces[row][col].targetY *= -1;
                };
            };
        };
        celebration.classList.remove("hide");
        celebration.textContent = `You won! in ${score.time} s and ${score.moves} moves.`;
        scoreDisplay.classList.add("hide");
        replayBtn.classList.remove("hide");
        replayBtn.addEventListener("click", () => {
            //console.log("replay click");
            replayBtn.classList.add("hide");
            celebration.classList.add("hide");
            scoreDisplay.classList.remove("hide");
            board = new Board();
            loadingSpinner.classList.remove("hide");
            board.shuffle();
            loadingSpinner.classList.add("hide");
            score.prevTime = score.time;
            score.moves = 0;
        });
}
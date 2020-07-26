const puzzleContainer = document.querySelector("#puzzle-container");

const size = 3;
let board = [];
let templateBoard = [
    [1,2,3],
    [4,5,6],
    [7,8,"x"]
];

class Piece {
    constructor(rows, cols, value) {
        this.x = cols;
        this.y = rows;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.size = 100;
        this.value = value;    
    };

    show() {
        fill(200);
        rect(this.x, this.y, this.size, this.size);
        stroke(0);
        strokeWeight(2);
        textSize(16);
        text(this.value.toString(), this.x + this.size/2, this.y + this.size/2);
    }

    click() {
        if (mouseX >= this.x 
            && mouseX <= this.x + this.size
            && mouseY >= this.y
            && mouseY <= this.y + this.size){
                console.log("Clicked", this.value);
                this.move();
        };               
    }

    move() {
        console.log("Moving: ",this.value);
        let rows = floor(this.y / this.size);
        let cols = floor(this.x / this.size);
        console.log(`board[${rows}][${cols}]: ${board[rows][cols].value}`);
        //top
        if ( !(rows - 1 < 0) ) {
            console.log(`top; ${board[rows - 1][cols].value}`);
            let top = board[rows - 1][cols];
            if (top.value == "x") {
                let temp = board[rows][cols];
                board[rows][cols] = top;
                board[rows - 1][cols] = temp;
                showBoard();
            };
        };
        //right
        if ( !(cols + 1 > size - 1) ) {
            console.log(`right: ${board[rows][cols + 1].value}`);
            let right = board[rows][cols + 1];
            if (right.value == "x") {
                let temp = board[rows][cols];
                board[rows][cols] = right;
                board[rows][cols + 1] = temp;
                showBoard();
            };
        };
        //bottom
        if ( !(rows + 1 > size - 1) ) {
            console.log(`bottom: ${board[rows + 1][cols].value}`);
            let bottom = board[rows + 1][cols];
            if (bottom.value == "x") {
                let temp = board[rows][cols];
                board[rows][cols] = bottom;
                board[rows + 1][cols] = temp;
                showBoard();
            };
        };
        //left
        if ( !(cols - 1 < 0) ) {
            console.log(`left: ${board[rows][cols - 1].value}`);
            let left = board[rows][cols - 1];
            if (left.value == "x") {
                let temp = board[rows][cols];
                board[rows][cols] = left;
                board[rows][cols - 1] = temp;
                showBoard();
            };
        };
        console.log(board);
    };

    update() {
        this.xSpeed = random(-3, 3);
        this.ySpeed = random(-3, 3);
        this.x += this.xSpeed;
        this.y += this.ySpeed;
    };
}

function setup() {
    let width = 300;
    let height = 300;
    let canvas = createCanvas(width, height);
    canvas.parent("puzzle-container");
    
    for(let rows = 0; rows < size; rows++) {
        board[rows] = new Array(size);
    };
    for(let rows = 0; rows < size; rows++){
        for(let cols = 0; cols < size; cols++){
            let spacing = 100;
            let piece = new Piece(rows * spacing, cols * spacing, templateBoard[rows][cols]);
            board[rows][cols] = piece;
        };
    };
    console.log(board);
}

function draw() {
    background(200);
    showBoard();
    updateBoard();    
    frameRate(30);
}


function showBoard() {
    for(let rows = 0; rows < size; rows++){
        for(let cols = 0; cols < size; cols++){
            let rectWidth = 100;
            let x = cols * rectWidth;
            let y = rows * rectWidth;
            fill(200);
            rect(x, y, rectWidth, rectWidth);
            stroke(0);
            strokeWeight(2);
            textSize(16);
            text(board[rows][cols].value.toString(), x + rectWidth/2, y + rectWidth/2);
        };
    };
};

function updateBoard() {
    for(let rows = 0; rows < size; rows++){
        for(let cols = 0; cols < size; cols++){
            board[rows][cols].update();
        };
    };
};

function mouseClicked() {
    for(let rows = 0; rows < size; rows++){
        for(let cols = 0; cols < size; cols++){
            board[rows][cols].click();
        };
    };    
};
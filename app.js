let visited = new Array(16).fill(false);

let contentBox = document.querySelector(".contentBox");
let box = document.querySelectorAll(".tiles");
let score = document.querySelector(".score");
let newGameBtn = document.querySelector(".newGame-btn");

document.addEventListener("DOMContentLoaded", () => {
    generateRandomTwo();
    generateRandomTwo();
})

newGameBtn.addEventListener("click", () => {
    score.innerText = "0";
    for(let val of box){
        val.innerText = '';
        val.className = '';
        val.classList.add("tiles");
    }

    for(let i in visited)
        visited[i] = false;

    generateRandomTwo();
    generateRandomTwo();
})

function generateRandomTwo(){
    let randomBox = Math.floor(Math.random()*16);

    while(visited[randomBox] != false)
        randomBox = Math.floor(Math.random()*16);

    visited[randomBox] = true;
    addBox2(randomBox);
}

function addBox2(boxIndex){
    visited[boxIndex] = true;
    box[boxIndex].innerText = "2";
    box[boxIndex].classList.add("box2");
}

/* document.addEventListener("keydown", handleKeyPress());

function handleKeyPress(event){
    switch(event.key){
        case ('ArrowUp') :
            moveUp();
            break;
        case('ArrowDown'):
            moveDown();
            break;
        case('ArrowLeft'):
            moveLeft();
            break;
        case('ArrowRight'):
            moveRight();
            break;
    }
}

function moveRight(){
    for(let row = 0; row < 4; row++){
        let rightEmpty = new Array(4).fill(0);
        for(let col = 3; col > 0; col--){
            if(box[row][col].innerText == '')
                rightEmpty[col-1]++;
            else
                rightEmpty[col-1] = rightEmpty[col];
        }
    }
} */
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
    box[boxIndex].classList.add("appear");
    setTimeout(() => {
        box[boxIndex].classList.remove("appear");
    }, 200);
}

document.addEventListener("keydown", handleKeyPress);

function handleKeyPress(event){
    switch(event.key){
        case 'ArrowUp' :
            moveUp();
            break;
        case 'ArrowDown':
            moveDown();
            break;
        case 'ArrowLeft':
            moveLeft();
            break;
        case 'ArrowRight':
            moveRight();
            break;
    }
}

function moveRight() {
    let hasChanged = false;

    for (let i = 0; i < 4; i++) {
        // Extract the current row
        let row = [];
        for (let j = 0; j < 4; j++) {
            let idx = i * 4 + j;
            if (box[idx].innerText !== '') {
                row.push(parseInt(box[idx].innerText));
            }
        }

        // Merge tiles
        for (let j = row.length - 1; j > 0; j--) {
            if (row[j] === row[j - 1]) {
                row[j] *= 2;
                row[j - 1] = 0;
                score.innerText = parseInt(score.innerText) + row[j];
            }
        }

        // Filter out the merged (zeros) and place the remaining to the right
        row = row.filter(value => value !== 0);
        while (row.length < 4) {
            row.unshift(0);
        }

        // Update the grid
        for (let j = 0; j < 4; j++) {
            let idx = i * 4 + j;

            if(row[j] === 0 && box[idx].innerText === '')
                hasChanged = hasChanged;
            else if (row[j].toString() !== box[idx].innerText)
                hasChanged = true;


            box[idx].innerText = (row[j] === 0) ? '' : row[j];
            box[idx].className = 'tiles';
            if (row[j] !== 0) {
                box[idx].classList.add('box' + row[j]);
            }
        }

        //update visited array
        for(let j = 0; j < 4; j++){
            let idx = i*4 + j;
            visited[idx] = (box[idx].innerText !== '') ? true : false;
        }
    }

    if (hasChanged) {
        generateRandomTwo();
    }
}

function moveLeft(){
    let hasChanged = false;

    for(let i = 0; i < 4; i++){
        let row = [];
        //create row array
        for(let j = 0; j < 4; j++){
            let idx = i*4 + j;
            if(box[idx].innerText !== '')
                row.push(parseInt(box[idx].innerText));
        }

        //merge tiles
        for(let j = 0; j < row.length - 1; j++){
            if(row[j] === row[j+1]){
                row[j] *= 2;
                row[j+1] = 0;
                
                score.innerText = parseInt(score.innerText) + row[j];
            }
        }

        //filter
        row = row.filter((val) => {
            return val !== 0;
        })
        while(row.length < 4)
            row.push(0);

        //update original grid
        for(let j = 0; j < 4; j++){
            let idx = i*4 + j;

            if(row[j] === 0 && box[idx].innerText === '')
                hasChanged = hasChanged;
            else if(row[j] !== parseInt(box[idx].innerText))
                hasChanged = true;

            box[idx].innerText = (row[j] === 0) ? '' : row[j];
            box[idx].className = 'tiles';
            if(row[j] !== 0)
                box[idx].classList.add('box' + row[j]);
        }
        
        //update visited array
        for(let j = 0; j < 4; j++){
            let idx = i*4 + j;
            visited[idx] = (box[idx].innerText !== '') ? true : false;
        }
    }

    if(hasChanged)
        generateRandomTwo();
}
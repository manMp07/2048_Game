let visited = new Array(16).fill(false);

let contentBox = document.querySelector(".contentBox");
let box = document.querySelectorAll(".tiles");
let score = document.querySelector(".score");
let buttons = document.querySelectorAll("button");
let overlay = document.querySelector(".overlay");

document.addEventListener("DOMContentLoaded", () => {
    generateRandomTwo();
    generateRandomTwo();
})

buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
        score.innerText = "0";
        for(let val of box){
            val.innerText = '';
            val.className = '';
            val.classList.add("tiles");
        }
    
        for(let i in visited)
            visited[i] = false;
    
        overlay.classList.add("hide");
    
        generateRandomTwo();
        generateRandomTwo();
    })
});

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

    if(checkGameOver()){
        overlay.classList.remove("hide");
        overlay.classList.add("appear");
        setTimeout(() => {
            overlay.classList.remove("appear");
        }, 200);
        return;
    }
}

function checkGameOver(){
    for(let i = 0; i < 4; i++){
        for(let j = 0; j < 4; j++){
            let curr = i*4 + j;
            if(box[curr].innerText === '')
                return false;

            let down = (i+1)*4 + j;
            let right = i*4 + j+1;

            if(i+1 < 4 && (box[down].innerText == '' || box[curr].innerText == box[down].innerText))
                return false;
            if(j+1 < 4 && (box[right].innerText == '' || box[curr].innerText == box[right].innerText))
                return false;
        }
    }

    return true;
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
    let hasMerged = false;

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
                hasMerged = true;
            }
        }

        // Filter out the merged (zeros) and place the remaining to the right
        row = row.filter(value => value !== 0);
        while (row.length < 4) {
            row.unshift(0);
        }

        let mergedTiles = findMergedTilesRight(row, i);

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

        if(hasMerged)
            addMerge(mergedTiles);
    }

    if (hasChanged) {
        generateRandomTwo();
    }
}

function findMergedTilesRight(arr, i){
    let k = 3;
    let skip = 0;

    let mergedTiles = [];
    for(let j = 3; j >= 0; j--){
        let idx = i*4 + j;
        if(box[idx].innerText === '')
            continue;

        if(skip){
            skip--;
            continue;
        }
        
        if(parseInt(box[idx].innerText) !== arr[k]){
            mergedTiles.push(i*4 + k);
            skip = 1;
        }
        k--;
    }

    return mergedTiles;
}

function moveLeft(){
    let hasChanged = false;
    let hasMerged = false

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
                hasMerged = true;
            }
        }

        //filter
        row = row.filter((val) => {
            return val !== 0;
        })
        while(row.length < 4)
            row.push(0);

        let mergedTiles = findMergedTilesLeft(row, i);

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

        if(hasMerged)
            addMerge(mergedTiles);
    }

    if(hasChanged)
        generateRandomTwo();
}

function findMergedTilesLeft(arr, i){
    let k = 0;
    let skip = 0;

    let mergedTiles = [];
    for(let j = 0; j < 4; j++){
        let idx = i*4 + j;
        if(box[idx].innerText === '')
            continue;

        if(skip){
            skip--;
            continue;
        }
        
        if(parseInt(box[idx].innerText) !== arr[k]){
            mergedTiles.push(i*4 + k);
            skip = 1;
        }
        k++;
    }

    return mergedTiles;
}

function moveUp(){
    let hasChanged = false;
    let hasMerged = false;

    // for each column
    for(j = 0; j < 4; j++){
        let col = [];

        //Extract the current column
        for(let i = 0; i < 4; i++){
            let idx = i*4 + j;
            if(box[idx].innerText != '')
                col.push(parseInt(box[idx].innerText));
        }

        //Merge Tiles
        for(let i = 0; i < col.length - 1; i++){
            if(col[i] == col[i+1]){
                col[i] *= 2;
                col[i+1] = 0;

                score.innerText = parseInt(score.innerText) + col[i];
                hasMerged = true;
            }
        }

        col = col.filter((val) => {
            return val !== 0;
        })
        while(col.length < 4)
            col.push(0);

        let mergedTiles = findMergedTilesUp(col, j);

        //comparing with original grid
        for(let i = 0; i < 4; i++){
            let idx = i*4 + j;

            if(col[i] === 0 && box[idx].innerText === '')
                hasChanged = hasChanged;
            else if(col[i] !== parseInt(box[idx].innerText))
                hasChanged = true;

            box[idx].innerText = (col[i] === 0) ? '' : col[i];
            box[idx].className = 'tiles';
            if(col[i] !== 0)
                box[idx].classList.add('box' + col[i]);
        }

        //update visited array
        for(let i = 0; i < 4; i++){
            let idx = i*4 + j;
            visited[idx] = (box[idx].innerText !== '') ? true : false;
        }

        isFinite(hasMerged)
            addMerge(mergedTiles);
    }

    if(hasChanged)
        generateRandomTwo();
}

function findMergedTilesUp(arr, i){
    let k = 0;
    let skip = 0;

    let mergedTiles = [];
    for(let j = 0; j < 4; j++){
        let idx = j*4 + i;
        if(box[idx].innerText === '')
            continue;

        if(skip){
            skip--;
            continue;
        }
        
        if(parseInt(box[idx].innerText) !== arr[k]){
            mergedTiles.push(k*4 + i);
            skip = 1;
        }
        k++;
    }

    return mergedTiles;
}

function moveDown() {
    let hasChanged = false;
    let hasMerged = false;

    for(let j = 0; j < 4; j++){
        let col = [];

        //Extracting the 
        for(let i = 0; i < 4; i++){
            let idx = i*4 + j;
            if(box[idx].innerText !== '')
                col.push(parseInt(box[idx].innerText));
        }

        //merge
        for(let i = col.length-1; i > 0; i--){
            if(col[i] == col[i-1]){
                col[i] *= 2;
                col[i-1] = 0;

                score.innerText = parseInt(score.innerText) + col[i];
                hasMerged = true;
            }
        }

        //removing 0s
        col = col.filter(val => val != 0);
        while(col.length < 4)
            col.unshift(0);

        let mergedTiles = findMergedTilesDown(col, j);

        //comparing with original
        for(let i = 0; i < 4; i++){
            let idx = i*4 + j;

            if(col[i] === 0 && box[idx].innerText == '')
                hasChanged = hasChanged;
            else if(col[i] !== parseInt(box[idx].innerText))
                hasChanged = true;
            box[idx].innerText = (col[i] === 0) ? '' : col[i];
            box[idx].className = "tiles";
            if(col[i] !== 0)
                box[idx].classList.add('box' + col[i]);
        }

        //updating visited array
        for(let i = 0; i < 4; i++){
            let idx = i*4 + j;
            visited[idx] = (box[idx].innerText !== '') ? true : false ;
        }

        if(hasMerged)
            addMerge(mergedTiles);
    }

    if(hasChanged)
        generateRandomTwo();
}

function findMergedTilesDown(arr, i){
    let k = 3;
    let skip = 0;

    let mergedTiles = [];
    for(let j = 3; j >= 0; j--){
        let idx = j*4 + i;
        if(box[idx].innerText === '')
            continue;

        if(skip){
            skip--;
            continue;
        }
        
        if(parseInt(box[idx].innerText) !== arr[k]){
            mergedTiles.push(k*4 + i);
            skip = 1;
        }
        k--;
    }

    return mergedTiles;
}

function addMerge(mergedTiles){
    mergedTiles.forEach(idx => {
        box[idx].classList.add("merge");
        setTimeout(() => {
            box[idx].classList.remove("merge");
        }, 200);
    });
}
/* 
function mergeAnimation(idx){
    box[idx].classList.add('merge');
    setTimeout(() => {
        box[idx].classList.remove('merge');
    }, 200);
} */
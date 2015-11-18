var turnCount = 0;
var _boardArray = [];
var cellObject = {
    id: '',
    piece: '',
    status:'',
    color:'',
    available:'false'
};
var currentObject1 = '';
var currentObject2 = '';
var currentObject3 = '';
var currentRow = '';
var currentCell = '';

setupBoard();
function setupBoard () {
    var gameBoardDiv = document.getElementById('game-board');
    for (var i = 0; i < 8; i++) { //for rows
        var row = document.createElement("div");
        row.setAttribute('id', 'row' + i);
        row.setAttribute('class', 'row');
        var rowArray = []; //subArray of the board array
        for (var j = 0; j < 8; j++) { //for cell
            var cellObject = {
                id: i + '' + j,
                status:'none'
            };
            var cell = document.createElement('div');
            cell.setAttribute('id', i + '' + j);
            if(isEven(i) && isEven(j)) {
                cell.setAttribute('class', 'black-cell');
                cellObject.color = 'black';
            }else if(isEven(i) && !isEven(j)) {
                cellObject.color = 'white';
                cell.addEventListener("click", function (event) {
                    console.log(event);
                    moveClickOne(event.target.id);
                    cellObject.clicked = 'true';
                });
                if(i < 3) {
                    cell.setAttribute('class', 'white-cell red-piece');
                    cellObject.piece = 'red';
                    cellObject.status = 'piece';
                }else if(i > 4) {
                    cell.setAttribute('class', 'white-cell black-piece');
                    cellObject.piece = 'black';
                    cellObject.status = 'piece';
                } else {
                    cell.setAttribute('class', 'white-cell');
                }
            }else if(!isEven(i) && isEven(j)) {
                cellObject.color = 'white';
                cell.addEventListener("click", function (event) {
                console.log(event);
                moveClickOne(event.target.id);
                cellObject.clicked = 'true';
                });
                if(i < 3) {
                    cell.setAttribute('class', 'white-cell red-piece');
                    cellObject.piece = 'red';
                    cellObject.status = 'piece';
                }else if(i > 4) {
                    cell.setAttribute('class', 'white-cell black-piece');
                    cellObject.piece = 'black';
                    cellObject.status = 'piece';
                } else {
                    cell.setAttribute('class', 'white-cell');
                }
            }else {
                cell.setAttribute('class', 'black-cell');
                cellObject.color = 'black';
            }
            row.appendChild(cell);
            rowArray.push(cellObject);
        }
        gameBoardDiv.appendChild(row);
        _boardArray.push(rowArray);
    }
    console.log(_boardArray);
}

function isEven (number) {
    return number % 2 === 0;
}

function moveClickOne(cellObject) {
    var idArray = cellObject.split('');
    var currentRow = idArray[0];
    var currentCell = idArray[1];
    var currentObject1 = _boardArray[currentRow][currentCell];
    if (currentObject1.status === 'piece') {
        checkAvailability(cellObject);
        for (var m = 0; m < _boardArray.length; m++) {
            for(var n = 0; n < _boardArray[m].length; n++){
                if (_boardArray[m][n].clicked === 'true' && _boardArray[m][n].status === 'none') {
                    _boardArray[m][n].status === 'piece';
                    if (currentObject1.piece === 'red') {
                        document.getElementById(_boardArray[m][n].id).setAttribute('class', 'red-piece');
                        _boardArray[m][n].piece === 'red';
                    } else if (currentObject1.piece ==='black') {
                        _boardArray[m][n].piece === 'black';
                        document.getElementById(_boardArray[m][n].id).setAttribute('class', 'black-piece');
                    }
                }
            }
        }
        currentObject1.piece === '';
        currentObject1.clicked === '';
        currentObject1.status === 'none';
    } else {
        return false;
    }
}



function checkAvailability(cellObject) {
    var idArray = cellObject.split('');
    currentRow = idArray[0];
    currentCell = idArray[1];
    console.log(currentRow + 1)
    var currentObject1 = _boardArray[currentRow][currentCell];
    if (currentObject1.piece === 'red') {
        var currentObject2 = _boardArray[currentRow++][currentCell++];
        var currentObject2 = _boardArray[currentRow][currentCell];
        var currentObject3 = _boardArray[currentRow][currentCell--];
        var currentObject3 = _boardArray[currentRow][currentCell--];
        var currentObject3 = _boardArray[currentRow][currentCell];
        if (currentObject2.status === "none") {
            currentObject2.color = "green";
            currentObject2.available = true;
        }
        if (currentObject3.status === "none") {
            currentObject3.color = "green";
            currentObject3.available = true;
        }
        update();
    }
}



//         ;
//     }
//     //check availability of surrounding cells in boardstate array
//     //if clicked piece=red (or if move number is even/odd?), check cells in id+9 and id+11. if j=0, only id+11. if j=7, only id+9.
//     //if clicked piece=black (or if move number is even/odd?), check cells in id-9 and id-11. if j=0, only id-9. if j=7, only id-11.
//     //if there isn't already a piece there, append "available" class to surrounding cells through boardState array
//     //call update()
// }

function update () {
    for (var k = 0; k < _boardArray.length; k++) {
        for(var l = 0; l < _boardArray[k].length; l++){
        if (_boardArray[k][l].available === true) {
            document.getElementById(_boardArray[k][l].id).setAttribute('class', 'available-cell');
        }
    }
}
//     //prob have to call this function w/each click
//     //loops through full boardstate array looking for any changes,
//     //anything newly marked "available" (or otherwise?) and makes same changes
//     //to respective div element cell in html by appending a class. also make it yellow.
//     //and make it so only the available ones can be clicked.
//
}
//


// //can only call this function if 'available' flags are up
// //determine which cell was clicked for moveClickOne,
// //remove piece class from moveClickOne cell, append class to clickTwo cell (in the array)
// //remove "available" class from everything
// //make only cells with pieces(red/black) are clickable
// //call update function
// var turnCount++;
// whoseTurn(turnCount);


function whoseTurn(turnCount) {
    if (isEven(turnCount)) {
        console.log("Turn: team red");
    } else {
        console.log("Turn: team black");
    }
}


// function isEven (number) { //this is the same as the function above but a longer way to write it
//     if (number % 2 === 0) {
//         return true;
//     }
//     else {
//         return false;
//     }
// }

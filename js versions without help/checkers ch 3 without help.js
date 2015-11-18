var turnCount = 0;
var _boardArray = [];
var _pieceClicked = {};
var _potentialJumpSquares = [];
var _availableSquares = [];

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
                    movePiece(event.target.id);
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
                movePiece(event.target.id);
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

function checkAvailable (row, cell, direction, pieceColor) {
    var piecesJumped = 0;
    var fails = 0;
    var cellsHighlighted = 0;
    var justPainted = false;
    var jumpedPieces = 0;
    var potentialSecondJump
    while (fails <= 2) {
        switch (direction) {
            case 'upLeft':
                row--;
                cell--;
                break;
            case 'upRight':
                row--;
                cell++;
                break;
            case 'downLeft':
                row++;
                cell--;
                break;
            case 'downRight':
                row++;
                cell++;
                break;
        }
        if(row < 0 || cell < 0 || row > 7 || cell > 7) {
            break;
        }
        // if(justPainted && fails === 1) {
        //     _boardArray[row][cell].potentiallyJumpedOver = true;
        if(_boardArray[row][cell].status === 'none') {
            if(justPainted) {
                justPainted = false;
                break;
            }
            var currentCell = (row) + '' + (cell);
            _availableSquares.push(currentCell);
            cellsHighlighted++;
            justPainted = true;
            if (piecesJumped === 0) {
                break;
            }
        } else if(_boardArray[row][cell].status === 'piece' && _boardArray[row][cell].piece === pieceColor) {
            break;
        }
        else if(_boardArray[row][cell].status === 'piece' && _boardArray[row][cell].piece !== pieceColor) {
            fails++;
            piecesJumped++;
            _potentialJumpSquares.push(currentCell);
            if(piecesJumped === 1 && justPainted) {
                piecesJumped = 0;
                // fails = 0;
                // justPainted = false;
                if(_pieceClicked.piece === 'black') {
                    checkAvailable(row, cell, 'upLeft', _pieceClicked.piece);
                    checkAvailable(row, cell, 'upRight', _pieceClicked.piece);
                } else if(_pieceClicked.piece === 'red') {
                    checkAvailable(row, cell, 'downLeft', _pieceClicked.piece);
                    checkAvailable(row, cell, 'downRight', _pieceClicked.piece);
                }
            } else if (justPainted && fails === 2) {
                justPainted = false;
            }
        }
    }
}


function movePiece(id) {
    var row = parseInt(id[0]);
    var cell = parseInt(id[1]);
    var cellObject = _boardArray[row][cell];
    if (cellObject.piece) {
        if (cellObject.status === 'clicked') {
            for(var i = 0; i < _availableSquares.length; i++) {
                var availableRow = parseInt(_availableSquares[i][0]);
                var availableCell = parseInt(_availableSquares[i][1]);
                _boardArray[availableRow][availableCell].status = 'none';
            }
            availableSquares = [];
            cellObject.status = 'piece';
            updateBoard('pieceClicked');
            return;
        }
        cellObject.status = 'clicked';
        if(cellObject.piece === 'black') {
            _pieceClicked.piece = 'black';
            checkAvailable(row, cell, 'upLeft', cellObject.piece);
            checkAvailable(row, cell, 'upRight', cellObject.piece);
            _pieceClicked.class = 'black-piece';
        } else if(cellObject.piece === 'red') {
            _pieceClicked.piece = 'red';
            checkAvailable(row, cell, 'downLeft', cellObject.piece);
            checkAvailable(row, cell, 'downRight', cellObject.piece);
            _pieceClicked.class = 'red-piece';
        }
        for(var i = 0; i < _availableSquares.length; i++) {
            var availableRow = parseInt(_availableSquares[i][0]);
            var availableCell = parseInt(_availableSquares[i][1]);
            _boardArray[availableRow][availableCell].status = 'available';
        }
        updateBoard('piece clicked');
    } else if(cellObject.status === 'available') {
        cellObject.status = 'moved';
        cellObject.piece = _pieceClicked.piece;
        updateBoard('piece moved', cellObject.potentiallyJumpedTo);
    }
}

function updateBoard (typeOfEvent) {
    for(var i = 0; i < _boardArray.length; i++) {
        for(var j = 0; j < _boardArray[i].length; j++) {
            var cellClassArray = document.getElementById(_boardArray[i][j].id).className.split(' ');
            if(typeOfEvent === 'piece moved') {
                if(_boardArray[i][j].potentiallyJumpedOver === true) {
                    if(_boardArray[i][j].piece === 'black') {
                        if(cellClassArray.indexOf('black-piece') !== -1) {
                            cellClassArray.splice(cellClassArray.indexOf('black-piece'), 1);
                        }
                    } else {
                        if(cellClassArray.indexOf('red-piece') !== -1) {
                            cellClassArray.splice(cellClassArray.indexOf('red-piece'), 1);
                        }
                    }
                    _boardArray[i][j].status = 'none';
                    _boardArray[i][j].potentiallyJumpedOver = false;
                    delete _boardArray[i][j].piece;
                }
                if(_boardArray[i][j].status === 'clicked') {
                    if(cellClassArray.indexOf(_pieceClicked.class) !== -1) {
                        cellClassArray.splice(cellClassArray.indexOf(_pieceClicked.class), 1);
                    }
                    if(cellClassArray.indexOf('clicked-cell') !== -1) {
                        cellClassArray.splice(cellClassArray.indexOf('clicked-cell'), 1);
                    }
                    delete _boardArray[i][j].piece;
                    _boardArray[i][j].status = 'none';
                }
                if(_boardArray[i][j].status ==='moved') {
                    if(cellClassArray.indexOf('available-cell') !== -1) {
                        cellClassArray.splice(cellClassArray.indexOf('available-cell'), 1, _pieceClicked.class);
                    } else {
                        cellClassArray.push(_pieceClicked.class);
                    }
                    _boardArray[i][j].status = 'piece';
                }
                if (_boardArray[i][j].status === 'available') {
                    if(cellClassArray.indexOf('available-cell') !== -1) {
                        cellClassArray.splice(cellClassArray.indexOf('available-cell'), 1);
                    }
                    _boardArray[i][j].status = 'none';
                }
                _availableSquares = [];
            } else {
                if(_boardArray[i][j].status === 'available') {
                    cellClassArray.push('available-cell');
                } else if(_boardArray[i][j].status === 'none') {
                    if(cellClassArray.indexOf('available-cell') !== -1) {
                        cellClassArray.splice(cellClassArray.indexOf('available-cell'), 1);
                    }
                    if(cellClassArray.indexOf('clicked-cell') !== -1) {
                        cellClassArray.splice(cellClassArray.indexOf('clicked-cell'), 1);
                    }
                } else if (_boardArray[i][j].status === 'clicked') {
                    cellClassArray.push('clicked-cell');
                } else if(_boardArray[i][j].status === 'piece' && cellClassArray.indexOf('clicked-cell') !== -1) {
                    cellClassArray.splice(cellClassArray.indexOf('clicked-cell'), 1);
                    _availableSquares = [];
                }
            }
            document.getElementById(_boardArray[i][j].id).className = cellClassArray.join(' ');
        }
    }
    console.log(_boardArray);
}


// function whoseTurn(turnCount) {
//     if (isEven(turnCount)) {
//         console.log("Turn: team red");
//     } else {
//         console.log("Turn: team black");
//     }
// }
//

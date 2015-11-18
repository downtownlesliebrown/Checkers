var turnCount = 0;
var _boardArray = [];
var _pieceClicked = {};
var _availableSquares = [];
var _potentiallyJumpedSquares = [];
var _newDiagonal = false;
var _rpBoardArray = [];
var _bpBoardArray = [];
var _currentTrack = '';
var _evenTurnColor = '';
var _toggleHighlightedCells = true;



setupRedPiecePrison ();
whoseTurn();
function setupRedPiecePrison () {
    var redPiecePrison = document.getElementById('red-piece-prison');
    for (var k = 0; k < 4; k++) { //for rows
        var row = document.createElement("div");
        row.setAttribute('id', 'row' + k);
        row.setAttribute('class', 'prisonRow');
        var rRowArray = []; //subArray of the board array
        for (var l = 0; l < 3; l++) { //for cell
            var rCellObject = {
                id: k + '' + l,
                status:'none'
            };
            var cell = document.createElement('div');
            cell.setAttribute('id', 'r' + k + '' + l);
            cell.setAttribute('class', 'prisonCell');
            row.appendChild(cell);
            rRowArray.push(rCellObject);
        }
        redPiecePrison.appendChild(row);
        _rpBoardArray.push(rRowArray);
    }
}
// swal({
//     title: "Who goes first?",
//     text: "Type 'red' or 'black'",
//     type: "input",
//     showCancelButton: true,
//     cancelButton
//     closeOnConfirm: false,
//     animation: "slide-from-top",
//     inputPlaceholder: "Write something"
// },
// function(inputValue){
//     if (inputValue === false)
//         return false;
//     if (inputValue === "") {
//         swal.showInputError("You need to write something!");
//         return false
//     }
//     _evenTurnColor = inputValue;
//
//
//     swal("Nice! " + inputValue + " goes first.");
//
// });

function whoseTurn (){
    swal({   title: "Who goes first?",
    text: "Click 'red' or 'black' to choose who goes first.",
    // type: "warning",
    showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Red",   cancelButtonText: "Black",   closeOnConfirm: false,   closeOnCancel: false }, function(isConfirm){   if (isConfirm) {     swal("Red goes first!"); _evenTurnColor = 'red';   } else {     swal("Black goes first!"); _evenTurnColor = 'black';  } });
}

function toggleHighlightedCells(element) {
    _toggleHighlightedCells = element.checked;
}

setupBlackPiecePrison ();
function setupBlackPiecePrison () {
    var blackPiecePrison = document.getElementById('black-piece-prison');
    for (var k = 0; k < 4; k++) { //for rows
        var row = document.createElement("div");
        row.setAttribute('id', 'row' + k);
        row.setAttribute('class', 'prisonRow');
        var bRowArray = []; //subArray of the board array
        for (var l = 0; l < 3; l++) { //for cell
            var bCellObject = {
                id: k + '' + l,
                status:'none'
            };
            var cell = document.createElement('div');
            cell.setAttribute('id', 'b' + k + '' + l);
            cell.setAttribute('class', 'prisonCell');
            row.appendChild(cell);
            bRowArray.push(bCellObject);
        }
        blackPiecePrison.appendChild(row);
        _bpBoardArray.push(bRowArray);
    }
}





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
            hahahhahahahahahhahahahahahhahahhahahh
            var cell = document.createElement('div');
            cell.setAttribute('id', i + '' + j);
            cell.innerHTML = i + '' + j;
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

function checkOtherDiagonal(row, cell, direction, pieceColor) {
    switch(direction) {
        case 'upLeft':
            checkAvailable(row, cell, 'upRight', pieceColor);
            break;
        case 'upRight':
            checkAvailable(row, cell, 'upLeft', pieceColor);
            break;
        case 'downLeft':
            checkAvailable(row, cell, 'downRight', pieceColor);
            break;
        case 'downRight':
            checkAvailable(row, cell, 'downLeft', pieceColor);
            break;
    }
}

function checkAvailable (row, cell, direction, pieceColor) {
    var currentTrack
    var fails = 0;
    var cellsHighlighted = 0;
    var justPainted = false;
    var jumpedPieces = 0;
    while (fails < 2) {
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
        _boardArray[row][cell].currentTrack = _currentTrack;
        if(_boardArray[row][cell].status === 'none') {
            if(_newDiagonal && fails === 0) {
                break
            }
            if(justPainted) {
                break;
            }
            var upLeftCell = (row) + '' + (cell);
            _availableSquares.push(upLeftCell);
            if (fails > 0) {
                jumpedPieces++;
                checkIfPotJumped(row, cell, direction);
                _newDiagonal = true;
                checkOtherDiagonal(row, cell, direction, pieceColor);
                _newDiagonal = false;
                _boardArray[row][cell].potentiallyJumpedTo = true;
            }
            fails = 0
            cellsHighlighted++;
            justPainted = true;
        } else if (_boardArray[row][cell].status === 'piece' && _boardArray[row][cell].piece === pieceColor) {
            break;
        } else if (_boardArray[row][cell].status === 'piece' && _boardArray[row][cell].piece !== pieceColor) {
            fails++;
            if(justPainted && fails === 0) { //does this need to be here? we won't get here ever because fails was just set ++
                break;
            }
            if (fails > 0 && jumpedPieces > 0) {
                justPainted = false;
            }
        }
    }
    console.log(_potentiallyJumpedSquares)
}

function checkIfPotJumped (row, cell, direction) {
    switch (direction) {
        case 'upLeft':
            row++;
            cell++;
            break;
        case 'upRight':
            row++;
            cell--;
            break;
        case 'downLeft':
            row--;
            cell++;
            break;
        case 'downRight':
            row--;
            cell--;
            break;
    }
    _potentiallyJumpedSquares.push(_boardArray[row][cell]);
}

function movePiece(id) {
    _pieceClicked.isAKing = false;
    var row = parseInt(id[0]);
    var cell = parseInt(id[1]);
    var cellObject = _boardArray[row][cell];
    if (cellObject.status === 'piece'){
        if (isEven(turnCount) && cellObject.piece !== _evenTurnColor) {
            swal("Oops!", "Not your turn!", "error");
            return;
        } else if (!isEven(turnCount) && cellObject.piece === _evenTurnColor) {
            swal("Oops!", "Not your turn!", "error");
            return;
        } else {
        }
    }
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
        if (cellObject.isAKing === true && cellObject.piece === 'red'){
            _currentTrack = 'upLeft';
            checkAvailable(row, cell, 'upLeft', cellObject.piece);
            _currentTrack = 'upRight';
            checkAvailable(row, cell, 'upRight', cellObject.piece);
            _currentTrack = 'downLeft';
            checkAvailable(row, cell, 'downLeft', cellObject.piece);
            _currentTrack = 'downRight';
            checkAvailable(row, cell, 'downRight', cellObject.piece);
            _pieceClicked.class = 'red-king-piece';
            _pieceClicked.piece = 'red';
            _pieceClicked.isAKing = true;
        }
        else if (cellObject.isAKing === true && cellObject.piece === 'black'){
            _currentTrack = 'upLeft';
            checkAvailable(row, cell, 'upLeft', cellObject.piece);
            _currentTrack = 'upRight';
            checkAvailable(row, cell, 'upRight', cellObject.piece);
            _currentTrack = 'downLeft';
            checkAvailable(row, cell, 'downLeft', cellObject.piece);
            _currentTrack = 'downRight';
            checkAvailable(row, cell, 'downRight', cellObject.piece);
            _pieceClicked.class = 'black-king-piece';
            _pieceClicked.piece = 'black';
            _pieceClicked.isAKing = true;
        }
        else if(cellObject.piece === 'black') {
            _currentTrack = 'upLeft';
            checkAvailable(row, cell, 'upLeft', cellObject.piece);
            _currentTrack = 'upRight';
            checkAvailable(row, cell, 'upRight', cellObject.piece);
            _pieceClicked.class = 'black-piece';
            _pieceClicked.piece = 'black';
            _pieceClicked.isAKing = false;
        } else if(cellObject.piece === 'red') {
            _currentTrack = 'downLeft';
            checkAvailable(row, cell, 'downLeft', cellObject.piece);
            _currentTrack = 'downRight';
            checkAvailable(row, cell, 'downRight', cellObject.piece);
            _pieceClicked.class = 'red-piece';
            _pieceClicked.piece = 'red';
            _pieceClicked.isAKing = false;
        }
        for(var i = 0; i < _availableSquares.length; i++) { //will have to mirror this for jumped over squares array
            var availableRow = parseInt(_availableSquares[i][0]);
            var availableCell = parseInt(_availableSquares[i][1]);
            _boardArray[availableRow][availableCell].status = 'available';
        }
        for(var i = 0; i < _potentiallyJumpedSquares.length; i++) {
            var potentiallyJumpedRow = parseInt(_potentiallyJumpedSquares[i].id[0]);
            var potentiallyJumpedCell = parseInt(_potentiallyJumpedSquares[i].id[1]);
            _boardArray[potentiallyJumpedRow][potentiallyJumpedCell].potentiallyJumped = true;
        }
        updateBoard('piece clicked');
    } else if(cellObject.status === 'available') {
        cellObject.status = 'moved';
        cellObject.piece = _pieceClicked.piece;
        _currentTrack = cellObject.currentTrack;
        updateBoard('piece moved', cellObject.potentiallyJumpedTo);
    }
}

function updateBoard (typeOfEvent) {
    for(var i = 0; i < _boardArray.length; i++) {
        for(var j = 0; j < _boardArray[i].length; j++) {
            var cellClassArray = document.getElementById(_boardArray[i][j].id).className.split(' ');
            if(typeOfEvent === 'piece moved') {
                if(_boardArray[i][j].potentiallyJumped === true && _boardArray[i][j].currentTrack === _currentTrack) {
                    if(_boardArray[i][j].piece === 'black') {
                        if(cellClassArray.indexOf('black-piece') !== -1 || cellClassArray.indexOf('black-king-piece')) {
                            cellClassArray.splice(cellClassArray.indexOf('black-piece'), 1);
                            _boardArray[i][j].isAKing = false;
                            for (var k = 0; k < _bpBoardArray.length; k++) {
                                var paintedCell = 0;
                                for (var l = 0; l < _bpBoardArray[k].length; l++) {
                                    if (_bpBoardArray[k][l].status === 'none') {
                                        _bpBoardArray[k][l].status = 'piece';
                                        document.getElementById('b' + k + '' + l).setAttribute('class', 'prisonCell black-piece');
                                        if(_bpBoardArray[3][2].status === 'piece') {
                                            swal({   title: "Congrats!",   text: "Red is the winna!",   type: "success",   showCancelButton: false,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Okay",     closeOnConfirm: false,  }, function(isConfirm){   if (isConfirm) {     resetGame();   }  });
                                        }
                                        break;
                                    } else if (_bpBoardArray[k][l].status === 'piece') {
                                        paintedCell++;
                                    }
                                }
                                if (paintedCell < 3) {
                                    break;
                                }
                            }
                        }
                    } else {
                        if(cellClassArray.indexOf('red-piece') !== -1 || cellClassArray.indexOf('red-king-piece')) {
                            cellClassArray.splice(cellClassArray.indexOf('red-piece'), 1);
                            // if (_boardArray[i][j].isAKing === true) {
                                _boardArray[i][j].isAKing = false;
                            //     cellClassArray.splice(cellClassArray.indexOf('red-king-piece'), 1);
                            // }
                            for (var k = 0; k < _rpBoardArray.length; k++) {
                                var paintedCell = 0;
                                for (var l = 0; l < _rpBoardArray[k].length; l++) {
                                    if (_rpBoardArray[k][l].status === 'none') {
                                        _rpBoardArray[k][l].status = 'piece';
                                        document.getElementById('r' + k + '' + l).setAttribute('class', 'prisonCell red-piece');
                                        if(_rpBoardArray[3][2].status === 'piece') {
                                            swal({   title: "Congrats!",   text: "Black is the winna!",   type: "success",   showCancelButton: false,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Okay",     closeOnConfirm: false,  }, function(isConfirm){   if (isConfirm) {     resetGame();   }  });
                                        }
                                        break;
                                    } else if (_rpBoardArray[k][l].status === 'piece') {
                                        paintedCell++;
                                    }
                                }
                                if (paintedCell < 3) {
                                    break;
                                }
                            }
                        }
                    }
                    _boardArray[i][j].status = 'none';
                    _boardArray[i][j].potentiallyJumped = false;
                    delete _boardArray[i][j].piece;
                    delete _boardArray[i][j].currentTrack;
                } else if (_boardArray[i][j].potentiallyJumped === true && _boardArray[i][j].currentTrack !== _currentTrack) {
                    _boardArray[i][j].currentTrack = '';
                    _boardArray[i][j].potentiallyJumped = false;
                }
                if(_boardArray[i][j].status === 'clicked') {
                    if(cellClassArray.indexOf(_pieceClicked.class) !== -1) {
                        cellClassArray.splice(cellClassArray.indexOf(_pieceClicked.class), 1);
                        _boardArray[i][j].isAKing = false;
                    }
                    if (cellClassArray.indexOf('red-king-piece') !== -1) {
                        cellClassArray.splice(cellClassArray.indexOf('red-king-piece'), 1);
                        _boardArray[i][j].isAKing = false;
                    }
                    if (cellClassArray.indexOf('black-king-piece') !== -1) {
                        cellClassArray.splice(cellClassArray.indexOf('black-king-piece'), 1);
                        _boardArray[i][j].isAKing = false;
                    }
                    if(cellClassArray.indexOf('clicked-cell') !== -1) {
                        cellClassArray.splice(cellClassArray.indexOf('clicked-cell'), 1);
                        _boardArray[i][j].isAKing = false;
                    }
                    delete _boardArray[i][j].piece;
                    _boardArray[i][j].status = 'none';
                    _boardArray[i][j].isAKing = false;
                }
                if(_boardArray[i][j].status ==='moved') {
                    turnCount++;
                    if(cellClassArray.indexOf('available-cell') !== -1) {
                        cellClassArray.splice(cellClassArray.indexOf('available-cell'), 1);
                    }
                    if (i === 0 && _pieceClicked.piece === 'black') {
                            cellClassArray.push('black-king-piece');
                            _boardArray[i][j].isAKing = true;
                    }
                    else if (i === 7 && _pieceClicked.piece === 'red') {
                            cellClassArray.push('red-king-piece');
                            _boardArray[i][j].isAKing = true;
                    }
                    else if (_pieceClicked.class === 'red-king-piece') {
                        cellClassArray.push('red-king-piece');
                        _boardArray[i][j].isAKing = true;
                        _pieceClicked.isAKing = false;
                        _pieceClicked.class = 'none';
                        _pieceClicked.piece = 'none';

                    }
                    else if (_pieceClicked.class === 'black-king-piece') {
                        cellClassArray.push('black-king-piece');
                        _boardArray[i][j].isAKing = true;
                        _pieceClicked.isAKing = false;
                        _pieceClicked.class = 'none';
                        _pieceClicked.piece = 'none';
                    }

                    else {
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
                if(_boardArray[i][j].status === 'available' && _toggleHighlightedCells) {
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
                    _boardArray[i][j].potentiallyJumped = false;

                }
            }
            document.getElementById(_boardArray[i][j].id).className = cellClassArray.join(' ');
            _potentiallyJumpedSquares = [];
        }
    }
    console.log(_boardArray);
    console.log(turnCount);

}

function resetGame() {
    document.getElementById('game-board').innerHTML = " ";
    document.getElementById('red-piece-prison').innerHTML = " ";
    document.getElementById('black-piece-prison').innerHTML = " ";
    _boardArray = [];
    _rpBoardArray = [];
    _bpBoardArray = [];
    setupRedPiecePrison ();
    setupBlackPiecePrison ();
    setupBoard ();
    _potentiallyJumpedSquares = [];
    _availableSquares= [];
    turnCount = 0;
    pieceClicked = {};
    _newDiagonal = false;
    _currentTrack = '';
    _evenTurnColor = '';
    _toggleHighlightedCells = true;
    whoseTurn();
}

//
// function whoseTurn(turnCount, cellObject) {
//     if (isEven(turnCount) && cellObject.piece === 'red') {
//         console.log("Turn: team red");
//     } else {
//         console.log("Turn: team black");
//     }
// }
// //

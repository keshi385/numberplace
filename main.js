{
  // CONSTANT VALUE
  const NUM_PLACE_QUEUE = 9
  const NUM_PLACE_SQRT = Math.sqrt(NUM_PLACE_QUEUE)

  const originalArray = [
    [1, 4, 7, 2, 5, 8, 3, 6, 9],
    [2, 5, 8, 3, 6, 9, 4, 7, 1],
    [3, 6, 9, 4, 7, 1, 5, 8, 2],
    [4, 7, 1, 5, 8, 2, 6, 9, 3],
    [5, 8, 2, 6, 9, 3, 7, 1, 4],
    [6, 9, 3, 7, 1, 4, 8, 2, 5],
    [7, 1, 4, 8, 2, 5, 9, 3, 6],
    [8, 2, 5, 9, 3, 6, 1, 4, 7],
    [9, 3, 6, 1, 4, 7, 2, 5, 8],
  ];

  let shuffledArray = [];

  let createdArray = [];

  // call create number table
    createNumberPlace();

  /**
   * create number place table
   */
  function createNumberPlace() {
    let gameLevels = document.getElementsByName("level");
    
    // shuffle array
    shuffledArray = shuffleArray();

    createdArray = structuredClone(shuffledArray);

    setEmptyCells(createdArray, gameLevels);

    showTable(createdArray, false);

  }

  /**
   * display number place in table
   * @param {shown array} array 
   * @param {answer flag} yAnswer 
   */
  function showTable(array, yAnswer) {
    const table = document.querySelector(".table");

    // initialize table element
    if (table.rows.length != 0) {
      clearTable(table);
    }

    // create table
    for (let i = 0; i < NUM_PLACE_QUEUE; i++) {
      // get element tr
      let tr = document.createElement("tr");
      for (let j = 0; j < NUM_PLACE_QUEUE; j++) {
        // get element td
        let td = document.createElement("td");
        tr.appendChild(td);
        if (array[i][j] != 0) {
          td.textContent = array[i][j];
        } else {
          if (yAnswer !== false) {
            td.style.color = "red";
            td.textContent = shuffledArray[i][j];
          } else {
            td.style.color = "black";
            td.textContent = null;
          }
        }
      }
      table.appendChild(tr);
    }
  }

  /**
   * shuffle function
   */
  function shuffleAnswer() {
    let shuffleButton = document.querySelector("#shuffle");

    // call create number table
    createNumberPlace();
  }

  function displayAnswer() {
    showTable(createdArray, true);
  }

  /**
   * clear table
   * @param {table} mainTable 
   */
  function clearTable(mainTable) {

    // clear table for all rows
    for (let i = (NUM_PLACE_QUEUE - 1); i >= 0; i--) {
      mainTable.deleteRow(i);
    }
  }

  /**
   * shuffle array
   */
  function shuffleArray(){
    let array = [];
    let instantArray = [];
    const transpose = a=> a[0].map((_, c) => a.map(r => r[c]));
    
    array = originalArray;

    // shuffle row
    instantArray = array;
    array = shuffleRow(instantArray);

    // replace (row -> column)
    instantArray = array;
    array = transpose(instantArray);

    // shuffle column
    instantArray = array;
    array = shuffleRow(instantArray);

    // replace back (column -> row)
    instantArray = array;
    array = transpose(instantArray);

    return array;
  }

  /**
   * shuffle row
   * @param {target array} array 
   * @returns shuffled row
   */
  function shuffleRow(array) {
    let retArray = [];

    // shuffle row
    retArray[0] = array.slice(0, 3);
    retArray[0] = randReplaceArray(0, 2, retArray[0]);
    retArray[1] = array.slice(3, 6);
    retArray[1] = randReplaceArray(0, 2, retArray[1]);
    retArray[2] = array.slice(6, 9);
    retArray[2] = randReplaceArray(0, 2, retArray[2]);

    retArray = randReplaceArray(0, 2, retArray);

    retArray = [...retArray[0], ...retArray[1], ...retArray[2]];

    return retArray;
  }

  /**
   * replace row with random
   * @param {start pos} start 
   * @param {end pos} end 
   * @param {original array} array 
   * @returns replaced array
   */
  function randReplaceArray(start, end, array) {
    let retArray = array;
    let num1, num2;

    num1 = Math.floor(Math.random() * (end + 1 - start)) + start;
    num2 = Math.floor(Math.random() * (end + 1 - start)) + start;

    [retArray[num1], retArray[num2]] = [retArray[num2], retArray[num1]];

    return retArray;
  }

  /**
   * set empty cells
   * @param {original array} array 
   * @param {game level} levels 
   */
  function setEmptyCells(array, levels) {
    let retArray = [];
    let preRow = 0;
    let preClm = 0;
    let iEmptyCount = 0;
    let iLoopCount = 0;

    retArray = array;
    //------------------------------------------------------//
    // 1. Empty cells randomly
    //------------------------------------------------------//
    // line by line
    for (let i = 0; i < NUM_PLACE_QUEUE - 1; i++) {
      retArray[i][Math.floor(Math.random() * (NUM_PLACE_QUEUE))] = 0;
    }

    //------------------------------------------------------//
    // 2. Empty decided cells for line absolutely
    //------------------------------------------------------//
    // decide cells
    for (let i = 0; i < levels.length; i++) {
      if (levels.item(i).checked) {
        if (levels.item(i).value == "hard") {
          iLoopCount = NUM_PLACE_QUEUE * NUM_PLACE_QUEUE;
        } else {
          iLoopCount = NUM_PLACE_QUEUE;
        }
      }
    }
    while (iEmptyCount++ < iLoopCount) {
      do {
        preRow = Math.floor(Math.random() * (NUM_PLACE_QUEUE));
        preClm = Math.floor(Math.random() * (NUM_PLACE_QUEUE));  
      } while (retArray[preRow][preClm] == 0)
      if (yCheckToEmtpy(preRow, preClm, retArray) !== false) {
        console.log(preRow, preClm, retArray[preRow][preClm]);
        retArray[preRow][preClm] = 0;
      } else {
        // nothing doing
      }
    }

    array = retArray;
  }

  /**
   * 
   * @param {tentative row} row 
   * @param {tentative column} clm 
   * @param {original array} array 
   */
  function yCheckToEmtpy(row, clm, array) {
    let yFound = false;
    let unitArrayRow = [];
    let unitArrayClm = [];
    let blockNum = 0;
    const transpose = a=> a[0].map((_, c) => a.map(r => r[c]));

    unitArrayRow = array[row];

    // search for line
    for (let i = 0; i < NUM_PLACE_QUEUE - 1; i++) {
      if ((unitArrayRow[i] == 0) && (i !== row)) {
        yFound = false;
        unitArrayClm = transpose(array.concat())[i];
        for (let j = 0; j < NUM_PLACE_QUEUE - 1; j++) {
          if (unitArrayClm[j] == array[row][clm]) {
            yFound = true;
            break;
          }
        }
        if (yFound !== true) {
          break;
        }
      }
    }

    // search for block
    if (yFound !== true) {
      blockNum = searchArrayBlock(row, clm);
      yFound = ySearchOverBlock(blockNum, row, clm, array);
    }

    return yFound;
  }
  /**
   * search array block
   * @param {row} row 
   * @param {column} clm 
   * @returns detected block number
   */
  function searchArrayBlock(row, clm) {
    let blockNum = 0;

    if (row < 3) {
      switch (true) {
      case clm < 3:
        blockNum = 0;
        break;
      case clm < 6:
        blockNum = 1;
        break;
      default:
        blockNum = 2;
        break;
      }
    } else if (row < 6) {
      switch (true) {
      case clm < 3:
        blockNum = 3;
        break;
      case clm < 6:
        blockNum = 4;
        break;
      default:
        blockNum = 5;
        break;
      }
    } else {
      switch (true) {
      case clm < 3:
        blockNum = 6;
        break;
      case clm < 6:
        blockNum = 7;
        break;
      default:
        blockNum = 8;
        break;
      }
    }
    
    return blockNum;
  }

  /**
   * search target number with block
   * @param {*} blockNum
   * @param {*} val
   * @param {*} array 
   * @returns 
   */
  function ySearchBlock(blockNum, val, array) {
    let yFound = false;
    let iBgnRow = 0;
    let iBgnClm = 0;
    let arrBlock = [];

    iBgnRow = blockNum - (blockNum % 3);
    iBgnClm = (blockNum % 3) * 3;
    arrBlock = array.slice(iBgnRow, iBgnRow + 3).map((row) => row.slice(iBgnClm, iBgnClm + 3));

    for (let i = 0; i < 3; i ++) {
      for (let j = 0; j < 3; j++) {
        if (arrBlock[i][j] == val) {
          yFound = true;
          break;
        }
      }
    }

    return yFound;
  }

  /**
   * 
   * @param {block number} blockNum 
   * @param {target row} row 
   * @param {target column} clm 
   * @param {input array} array 
   * @returns 
   */
  function ySearchOverBlock(blockNum, row, clm, array) {
    let yFound = false;
    let iFindFlag = 0;
    let iBgnRow = 0;
    let iBgnClm = 0;

    iBgnRow = Math.floor(blockNum / 3) * 3;
    iBgnClm = Math.floor(blockNum % 3) * 3;
    for (let i = iBgnRow; i < iBgnRow + 3; i++) {
      // i is not target row
      if (i !== row) {
        for (let j = iBgnClm; j < iBgnClm + 3; j++) {
          if (array[i][j] == 0) {
            iFindFlag -= 1;
            for (let k = 0; k < NUM_PLACE_QUEUE; k++) {
              if (array[i][k] == array[row][clm]) {
                iFindFlag += 1;
                break;
              }
            }
            if (iFindFlag < 0) {
              console.log('Not found!', iFindFlag);
            }
          }
        }
      } else {
        // i is target row
        for (let j = iBgnClm; j < iBgnClm + 3; j++) {
          if (array[i][j] == 0) {
            iFindFlag -= 1;
            for (let k = 0; k < NUM_PLACE_QUEUE; k++) {
              if (array[k][j] == array[row][clm]) {
                iFindFlag += 1;
                break;
              }
            }
            if (iFindFlag < 0) {
              console.log('Not found!', iFindFlag);}
            } else {
              break;
          }
        }
      }
    }

    if (iFindFlag >= 0) {
      yFound = true;
    }

    return yFound;
  }
}

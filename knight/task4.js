let squares = document.getElementsByClassName('square'); // собираем коллекцию клеток для доски
let coordMap = [];                                       // массив для координат клеток

function setField() {                                    // функция разметки, назначения координат и прикручивания onclick events

    coordMap = [];                                       // т.к. ф-ция будет вызываться при каждом клике, обнуляем содержимое массива (из-за push)
    let k = -1;                                          // специальный счётчик для индексов squares

    for (let i = 1; i < 9; i++) {
        for (let j = 1; j < 9; j++) {
            k++;

            coordMap.push([i, j]);                       // добавляем массивы пар координат в коллекцию для последующей сверки с массивом squares
            squares[k].style.background = "#fff";        // красим все клетки в белый при обновлении поля

            if ((i % 2 != 0 && j % 2 == 0) || (i % 2 == 0 && j % 2 != 0))  // смотрим по сочетаниям чётных/нечётных координат...
                squares[k].style.background = "#000";                      // ...и красим чёрные клетки

            let indexOfCell = k;
            squares[k].onclick = function () {
                startPosition(indexOfCell);
            }
        }
    }
}

function startPosition(index) {                            // функция, вызываемая при клике по конкретной клетке поля

    setField();                                            // обновляем поле
    squares[index].style.background = "#1220c3";           // помечаем кликнутое поле

    let coordinates = coordMap[index];                     // получаем координаты клетки из карты координат

    let moves = [];                                        // массив, который будет содержать пары координат конечных ходов
    let shiftings = [1, -1, 2, -2];                        // массив смещений координат при ходе
    const radiusOfMoves = 5;                               // "радиус дальности" хода коня в клетках

    let xNext, yNext, offsetY;                             // координаты конечного положения фигуры коня и величина смещения по Y
    for (let i = 0; i < shiftings.length; i++) {
        xNext = coordinates[0] + shiftings[i];             // получаем сдвиг по X
        offsetY = Math.sqrt(radiusOfMoves - Math.pow(shiftings[i], 2)); // смещение по Y со знаком +/-

        for (let j = 1; j < 3; j++) {
            yNext = coordinates[1] + Math.pow(-1, j) * offsetY;
            if (xNext > 0 && xNext < 9 && yNext > 0 && yNext < 9) { // проверяем попадание координат в размеры доски 8x8
                moves.push([xNext, yNext]);                         // добавляем координаты хода в массив результатов
            }
        }
    }    

    for (let i = 0; i < moves.length; i++) {
        for (let j = 0; j < coordMap.length; j++) {
            if (moves[i][0] == coordMap[j][0] && moves[i][1] == coordMap[j][1]) // нельзя просто взять и сравнить 2 массива координат...
                squares[j].style.background = "#12c329";                        // поэтому поэлементное сравнение и окрашивание клетки с ходом коня
        }
    }
}

setField();                                                                      // первоначальная инициализация игрового поля
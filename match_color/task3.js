let squares = document.getElementsByClassName('square'); // получаем коллекцию игровых элементов из DOM
let colors = ['red', 'orange', 'yellow', 'green', 'lime', 'lightblue', 'blue', 'violet',
    'red', 'orange', 'yellow', 'green', 'lime', 'lightblue', 'blue', 'violet'
];                      // базовый набор игровых цветов - 16 шт. из 8 пар повторяющихся
let hiddenColors = [];  // цвета, которые будут присвоены случайным образом игровым элементам, 
                        // но будут до клика скрыты
let previousColor = ''; // предыдущий цвет для сравнения и "раскраски"
let previousIndex;      // индекс предыдушего элемента

let countOfPairs = 0;   // количество пар - для отслеживания прогресса игрового раунда

let announceWindow;     // переменная, где будет ссылка на окно с объявлением результата

let startPressed = false; // переменная для контроля состояния кнопки "старт"

function startGame() {    // функция на кнопке "старт"
    // закроем модальное окно, если оно осталось с прошлого раунда
    if (announceWindow) {
        announceWindow.close();
        announceWindow = null;
    }
    // поменяем название кнопки "старт", если она была нажата в очередной раз
    if (startPressed) {
        document.getElementById('startButton').innerHTML = "СТАРТ";
        startPressed = false;
    } else {
        document.getElementById('startButton').innerHTML = "Стоп";
        startPressed = true;
    }

    countOfPairs = 0;   // если прошлый раунд был не завершён; хотя - можно было бы заблокировать кнопку "Старт" до конца игры
                        
    StartStop();        // запуск секундомера    
    // далее - подготовка игрового поля
    let randomColors = colors;                                        // создаём копию массива цветов
    for (let i = 0; i < squares.length; i++) {        
        let chosenIndex = getRandomInt(0, randomColors.length - 1);   // генерируем индекс

        hiddenColors.push(randomColors[chosenIndex]);                 // создаём карту цветов для текущего раунда
        randomColors.splice(chosenIndex, 1);                          // убираем уже выбранный цвет

        squares[i].style.background = '#fff';                         // задаём "рабочий" цвет для клетки и прикручиваем функцию клика
        squares[i].onclick = function () {
            showColor(i);
        };
    }
}
// функция для обработки клика по клетке с данным индексом
function showColor(index) {
    if (previousColor == '') {                                 // если перед этим не был открыт какой-либо одиночный цвет
        squares[index].style.background = hiddenColors[index]; // "красим" клетку
        previousColor = hiddenColors[index];                   // сохраняем параметры нажатой клетки
        previousIndex = index;

    } else if (previousColor == hiddenColors[index] && index != previousIndex) { // если цвета совпали, и это не одно и то же поле
        squares[index].style.background = hiddenColors[index];                   // "красим" данную клетку тоже
        countOfPairs++;                                                          // счётчик прогресса инкрементируется
        // далее меняем у обеих совпавших клеток функцию обработки клика - "выводим из игры"
        squares[index].onclick = function () {
            return false; 
        }
        squares[previousIndex].onclick = function () {
            return false;
        }
        //обнуляем данные для "предыдущей" клетки
        previousColor = '';
        previousIndex = -1; // -1 - чтобы избежать путаницы с первой игровой клеткой с индексом 0
        // обработка события завершения игры - остановка таймера, выдача результата, обнуление счётчиков и т.д.
        if (countOfPairs == 8) {
            StartStop();
            announceResult();
            countOfPairs = 0;

            document.getElementById('startButton').innerHTML = "Ещё!";
            startPressed = false;
        }

    } else if (previousColor != hiddenColors[index]) {          // если клетки не совпали, то...
        squares[index].style.background = hiddenColors[index];  // показываем на доли секунды текущий цвет
        setTimeout(function () {
            squares[index].style.background = '#fff';           // восстанавливаем игровое состояние клеток
            squares[previousIndex].style.background = '#fff';

            previousColor = '';                                 // обнуляем параметры "предыдущей" клетки
            previousIndex = -1;
        }, 200);                                                // увеличение времени задержки - читерство :), плюс выбивает ошибку,
    }                                                           // когда задержка ещё не кончилась, а пользователь уже прокликал ещё пару клеток
}
// функция генерации случайного индекса для массива цветов
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min; 
}
// функция вызова всплывающего окна средствами браузера
function announceResult() { 
    announceWindow = window.open("", "Result of Game",
        "resizable=no,scrollbars=no,width=350,height=150,copyhistory=1,top=100,left=10");

    announceWindow.document.write("<p style='margin:1em;font-size:1.5em;'>Вы выиграли!</p>");
    announceWindow.document.write("<p style='margin:1em;font-size:1.5em;'>Затраченное время: " +
        document.MyForm.stopwatch.value + "</p>");

    announceWindow.document.body.style.fontFamily = 'sans-serif';
}
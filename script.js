let data;
let currentIndex = 0;
let numWrong = 0;
let guessType;
let wrongAnswers = [];

function startQuiz() {
    guessType = document.getElementById('user-choice').value.trim().toUpperCase();
    
    if (guessType !== 'S' && guessType !== 'N') {
        alert('Invalid choice. Please enter "S" or "N".');
        return;
    }

    document.getElementById('prompt').style.display = 'none';
    fetchData();
}

function fetchData() {
    fetch("input.txt")
        .then(response => response.text())
        .then(csvData => {
            data = csvData.trim().split('\n').map(line => {
                const split = line.split(',');
                return {
                    symbol: split[0],
                    names: split.slice(1),
                };
            });
            data = shuffleArray(data); // Shuffle the array
            showQuestion();
        });
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function showQuestion() {
    if (currentIndex < data.length) {
        const pair = data[currentIndex];
        const question = (guessType === 'S') ? pair.names.join('/') : pair.symbol;
        document.getElementById('question').innerText = question;
        document.getElementById('user-input').value = ''; // Clear the user-input box
    } else {
        showResult();
    }
}

function checkAnswer() {
    const userAnswer = document.getElementById('user-input').value.trim().toUpperCase();
    const pair = data[currentIndex];
    const correctAnswer = (guessType === 'S') ? [pair.symbol] : pair.names;
    if (correctAnswer.map(answer => answer.toUpperCase()).includes(userAnswer)) {
        if(document.getElementById('result').innerText.includes('Incorrect')) {
            document.getElementById('result').innerText = '';
        }
        currentIndex++;
        showQuestion();
    } else {
        wrongAnswers[numWrong] = pair;
        numWrong++;
        document.getElementById('result').innerText = `Incorrect (${correctAnswer.join('/')})`;
        showQuestion();
    }
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        checkAnswer();
    }
}

/*
function showResult() {
    const accuracy = ((currentIndex - numWrong) / currentIndex) * 100 || 0;
    if (confirm(`Quiz completed!\nAccuracy: ${accuracy.toFixed(2)}%\nPlay again?`)) {
        location.reload();
    }
}
*/
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function showResult() {
    const accuracy = ((currentIndex - numWrong) / currentIndex) * 100 || 0;

    if (numWrong > 0) {
        const wrongAnswersContainer = document.getElementById('wrong-answers-container');
        const wrongAnswersList = document.getElementById('wrong-answers-list');

        wrongAnswers.forEach((pair, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${index + 1}. ${pair[0]} - ${pair[1]}`;
            wrongAnswersList.appendChild(listItem);
        });
        await sleep(10000);
        wrongAnswersContainer.style.display = 'block';
    }
    if (confirm(`Quiz completed!\nAccuracy: ${accuracy.toFixed(2)}%\nPlay again?`)) {
        location.reload();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('user-input').addEventListener('keypress', handleKeyPress);
});

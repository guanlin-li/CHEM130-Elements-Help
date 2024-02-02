let data;
let currentIndex = 0;
let numWrong = 0;
let guessType;
const wrongAnswers = new Map();

function startQuiz() {
    document.getElementById('result-container').style.display = "none";
    document.getElementById('quiz-container').style.display = "always";

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
    const userAnswer = document.getElementById('user-input').value.trim();
    const pair = data[currentIndex];
    const question = (guessType === 'S') ? pair.names.join('/') : pair.symbol;
    const correctAnswer = (guessType === 'S') ? [pair.symbol] : pair.names;

    if (!wrongAnswers.has(correctAnswer)) {
        wrongAnswers.set(question, {
            correctAnswer: correctAnswer.join('/'),
            incorrectAnswers: new Array(),
        });
    }

    if (correctAnswer.map(answer => answer.toUpperCase()).includes(userAnswer.toUpperCase())) {
        if(document.getElementById('result').innerText.includes('Incorrect')) {
            document.getElementById('result').innerText = '';
        }
        wrongAnswers.get(question).incorrectAnswers.push('');
        currentIndex++;
        showQuestion();
    } else {
        wrongAnswers.get(question).incorrectAnswers.push(userAnswer);

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

function showResult() {
    const accuracy = ((currentIndex - numWrong) / currentIndex) * 100 || 0;
    document.getElementById('accuracy-display').innerText = `${accuracy.toFixed(2)}%`;

    const table = document.getElementById('answers-display');
    wrongAnswers.forEach((answers, question) => {
        const templateClone = document.getElementById('answers-template').content.cloneNode(true);
        templateClone.querySelector('.question').innerText = question;
        templateClone.querySelector('.wrong-answers').innerText = answers.incorrectAnswers.join(', ');
        templateClone.querySelector('.correct-answer').innerText = answers.correctAnswer;

        table.appendChild(templateClone);
    })

    document.getElementById('result-container').style.display = "always";
    document.getElementById('quiz-container').style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('user-input').addEventListener('keypress', handleKeyPress);
});

let data;
let currentIndex = 0;
let numWrong = 0;
let guessType;
let wrongAnswers = new Map();

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
    const correctAnswer = (guessType === 'S') ? [pair.symbol] : pair.names;

    if (!wrongAnswers.has(correctAnswer)) {
        wrongAnswers[question] = {
            correctAnswer: correctAnswer.join('/'),
            incorrectAnswers: new Array(),
        };
    }

    if (correctAnswer.map(answer => answer.toUpperCase()).includes(userAnswer.toUpperCase())) {
        if(document.getElementById('result').innerText.includes('Incorrect')) {
            document.getElementById('result').innerText = '';
        }
        wrongAnswers[question].incorrectAnswers[wrongAnswers[question].incorrectAnswers.length] = '';
        currentIndex++;
        showQuestion();
    } else {
        const question = (guessType === 'S') ? pair.names.join('/') : pair.symbol;
        wrongAnswers[question].incorrectAnswers[wrongAnswers[question].incorrectAnswers.length] = userAnswer;

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

    wrongAnswers.forEach(([question, answers]) => {
        let templateClone = document.getElementById('answers-template').content.cloneNode(true);
        templateClone.getElementsByClassName('question')[0].innerText = question;
        templateClone.getElementsByClassName('wrong-answers')[0].innerText = answers.incorrectAnswers.join(', ');
        templateClone.getElementsByClassName('correct-answer')[0].innerText = answers.correctAnswer;

        document.getElementById('answers-display').appendChild(templateClone);
    })

    document.getElementById('result-container').style.display = "always";
    document.getElementById('quiz-container').style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('user-input').addEventListener('keypress', handleKeyPress);
});

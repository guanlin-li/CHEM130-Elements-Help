let data;
let currentIndex = 0;
let numWrong = 0;

function fetchData() {
    fetch("input-csv.txt")
        .then(response => response.text())
        .then(csvData => {
            data = csvData.trim().split('\n').map(line => line.split(','));
            data = shuffleArray(data); // Shuffle the array
            startQuiz();
        });
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function startQuiz() {
    showQuestion();
}

function showQuestion() {
    if (currentIndex < data.length) {
        const pair = data[currentIndex];
        const question = pair[1];
        document.getElementById('question').innerText = question;
        document.getElementById('user-input').value = ''; // Clear the user-input box
    } else {
        showResult();
    }
}

function checkAnswer() {
    const userAnswer = document.getElementById('user-input').value.trim().toUpperCase();
    const pair = data[currentIndex];
    const correctAnswer = pair[0].toUpperCase();

    if (userAnswer === correctAnswer) {
        currentIndex++;
        numWrong = 0; // Reset wrong attempts for the current question
        showQuestion();
    } else {
        document.getElementById('result').innerText = `Incorrect (${correctAnswer})`;
        numWrong++;
        if (numWrong >= 3) {
            currentIndex++;
            numWrong = 0; // Skip to the next question after 3 wrong attempts
        }
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
    alert(`Quiz completed!\nAccuracy: ${accuracy.toFixed(2)}%`);
}

document.addEventListener("DOMContentLoaded", () => {
    fetchData();
    document.getElementById('user-input').addEventListener('keypress', handleKeyPress);
});
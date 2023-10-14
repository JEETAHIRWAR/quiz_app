// Initialize an empty questions object
let questions = {
    HTML: [],
    CSS: [],
    JavaScript: [],
    MySQL: [],
};

// Load questions from the YAML file
fetch('questions.yaml')
    .then(response => response.text())
    .then(yamlText => {
        const loadedQuestions = jsyaml.load(yamlText);

        // Loop through each category (HTML, CSS, JavaScript, MySQL)
        for (const category in loadedQuestions) {
            if (loadedQuestions.hasOwnProperty(category)) {
                const categoryQuestions = loadedQuestions[category];

                // Loop through each question in the category
                for (const questionKey in categoryQuestions) {
                    if (categoryQuestions.hasOwnProperty(questionKey)) {
                        const question = categoryQuestions[questionKey];

                        // Push the question object into the corresponding category array
                        questions[category].push(question);
                    }
                }
            }
        }

        // Now 'questions' is an object where each property is an array of questions for a specific category.
    })
    .catch(error => {
        console.error('Error loading questions:', error);
    });

const startButton = document.querySelector('.start-button'); // Get the start button element from the HTML by its class name
const categoryContainer = document.querySelector('.category-container');  // Get the category container element from the HTML by its class name
const startQuizBtn = document.querySelector('.start-quiz-btn');  // Get the start quiz button element from the HTML by its class name
const textContainer = document.querySelectorAll('.text-container')[1];  // Get the text container elements (all of them) from the HTML and select the second one [1] (zero-based index)
const quizContainer = document.querySelector('.quiz-container');  // Get the quiz container element from the HTML by its class name
const nextButton = document.querySelector('.next-button');   // Get the next button element from the HTML by its class name
const alertModal = document.getElementById('alertModal');   // Get the alert modal element from the HTML by its ID
const closeModal = document.getElementById('closeModal');  // Get the close modal element from the HTML by its ID
const submitButton = document.querySelector('.submit-button');  // Get the submit button element from the HTML by its class name
const timerDisplay = document.querySelector('.timer');  // Get the timer display element from the HTML by its class name 

let selectedCard = null;  // Represents the currently selected category card, initially set to null
let currentCategory = "";  // Stores the name of the current quiz category, initially an empty string
let questionIndex = 0;  // Keeps track of the index of the current question within a category, initially set to 0
let timerInterval; // Stores the interval ID for the timer, used to manage the quiz timer
let correctAnswers = [];  // An array to store the indices of questions that the user has answered correctly

// Add a click event listener to the start button, calling the startQuiz function when clicked
startButton.addEventListener('click', startQuiz);

// Function to start the quiz
function startQuiz() {
    // Check if a category card has been selected
    if (selectedCard) {
        // Hide the category container, start button, and text container
        categoryContainer.style.display = 'none';
        startQuizBtn.style.display = 'none';
        textContainer.style.display = 'none';

        // Display the quiz container
        quizContainer.style.display = 'block';

        // Get the name of the selected category from the card
        const categoryName = selectedCard.querySelector('.course-name').textContent;
        currentCategory = categoryName;

        // Update the category title in the text container
        const categoryTitle = document.querySelector('.text-container p');
        categoryTitle.textContent = `Category: ${categoryName}`;

        // Add a CSS class to the quiz container for styling
        quizContainer.classList.add('start-quiz-btn-clicked');

        // Load the first question for the selected category
        loadQuestion(questionIndex, categoryName);

        // Start the quiz timer
        startTimer();
    } else {
        // Display an alert if no category is selected
        displayCustomAlert('Please select a category before starting the quiz.');
    }
}


// Function to start and manage the quiz timer
function startTimer() {
    let timeLeft = 20; // Initialize the timer with 20 seconds
    updateTimerDisplay(timeLeft); // Update the timer display on the UI

    // Set up an interval to update the timer every 2 seconds
    timerInterval = setInterval(() => {
        timeLeft--; // Decrement the remaining time by 1
        updateTimerDisplay(timeLeft); // Update the timer display on the UI with the new time

        // Check if the time has run out (reached 0 seconds)
        if (timeLeft === 0) {
            clearInterval(timerInterval); // Stop the timer interval

            // Check if no option has been selected when time runs out
            if (!isOptionSelected()) {
                displayCustomAlert('Time is up! Please select an option before proceeding.'); // Display an alert to prompt the user
                clearInterval(timerInterval); // Clear the interval (although it's already cleared)
                startTimer(); // Start the timer again (recursion) to handle the skipped question
            }

            clearInterval(timerInterval); // Clear the interval (although it's already cleared)
            startTimer(); // Start the timer again (recursion) to handle the skipped question
        }
    }, 2000); // Update the timer every 2 seconds (2000 milliseconds)
}


// Function to update the timer display on the UI
function updateTimerDisplay(seconds) {
    // Update the text content of the timerDisplay element with the remaining time
    timerDisplay.textContent = `Time left: ${seconds} seconds`;
}

// Function to select a category card and update its visual appearance
function selectCard(card) {
    // Check if there is a previously selected card
    if (selectedCard) {
        selectedCard.classList.remove('selected'); // Remove the 'selected' class to reset its appearance
    }

    selectedCard = card; // Set the currently selected card to the passed card element
    selectedCard.classList.add('selected'); // Add the 'selected' class to visually highlight the selected card
}


// Select all elements with the class 'card' and store them in the 'cards' NodeList
const cards = document.querySelectorAll('.card');

// Iterate through each card element in the NodeList
cards.forEach(card => {
    // Add a click event listener to each card
    card.addEventListener('click', () => {
        selectCard(card); // Call the selectCard function when a card is clicked
    });
});


// Add a click event listener to the next button, calling the handleNextQuestion function when clicked
nextButton.addEventListener('click', handleNextQuestion);

// Function to handle the action when the next button is clicked
function handleNextQuestion() {
    // Check if no option has been selected
    if (!isOptionSelected()) {
        displayCustomAlert('Please select an option before proceeding.'); // Display an alert to prompt the user
        return; // Exit the function if an option is not selected
    }

    // Get the index of the selected option
    const selectedOptionIndex = parseInt(document.querySelector('input[name="option"]:checked').value);

    // Get the index of the correct answer for the current question
    const correctAnswerIndex = questions[currentCategory][questionIndex - 1].correct - 1;

    // Check if the selected option index matches the correct answer index
    const isCorrect = selectedOptionIndex === correctAnswerIndex;

    // If the selected option is correct, add the question index to the correctAnswers array
    if (isCorrect) {
        correctAnswers.push(questionIndex);
    }

    // Check if there are more questions in the current category
    if (questionIndex < questions[currentCategory].length - 1) {

    } else {
        // Hide the next button and display the submit button when there are no more questions
        nextButton.style.display = 'none';
        submitButton.style.display = 'block';
    }

    // Load the next question (repeated for consistency)
    loadQuestion(questionIndex, currentCategory);
}

// Function to display a custom alert message to the user
function displayCustomAlert(message) {
    // Create a new div element for the alert modal
    const alertModal = document.createElement('div');
    alertModal.classList.add('custom-alert-modal'); // Add a CSS class for styling

    // Create a new div element for the alert content
    const alertContent = document.createElement('div');
    alertContent.classList.add('custom-alert-content'); // Add a CSS class for styling

    // Set the inner HTML of the alert content, including the message and an "OK" button
    alertContent.innerHTML = `
        <div class="alert-message">${message}</div>
        <button class="ok-button">OK</button>
    `;

    // Append the alert content to the alert modal
    alertModal.appendChild(alertContent);

    // Append the alert modal to the document's body, displaying it on the page
    document.body.appendChild(alertModal);

    // Find and select the "OK" button within the alert content
    const okButton = alertContent.querySelector('.ok-button');

    // Add a click event listener to the "OK" button
    okButton.addEventListener('click', () => {
        // When the "OK" button is clicked, remove the alert modal from the document, closing the alert
        document.body.removeChild(alertModal);
    });
}


// Function to check if a quiz option (radio button) has been selected by the user
function isOptionSelected() {
    // Select all elements with the class 'option-radio' and store them in the 'options' NodeList
    const options = document.querySelectorAll('.option-radio');

    // Iterate through each option element in the NodeList
    for (let i = 0; i < options.length; i++) {
        // Check if the current option is checked (selected)
        if (options[i].checked) {
            return true; // If at least one option is checked, return true
        }
    }

    // If none of the options are checked, return false
    return false;
}


// Function to load and display a quiz question
function loadQuestion(index, category) {
    // Check if the category exists in the questions object and is an array
    if (questions.hasOwnProperty(category) && Array.isArray(questions[category])) {
        const questionList = questions[category]; // Get the list of questions for the current category

        // Check if the index is within the bounds of the question list
        if (index >= 0 && index < questionList.length) {
            const question = questionList[index]; // Get the current question object

            // Update the category name element with the current category
            const categoryNameElement = document.querySelector('.category-name');
            categoryNameElement.textContent = (`Category: ${category}`);

            // Update the question text element with the current question's text
            const questionTextElement = document.querySelector('.question-text');
            questionTextElement.textContent = question.Question;

            // Get the options container element and clear its contents
            const optionsContainer = document.querySelector('.options-container');
            optionsContainer.innerHTML = "";

            // Loop through the options for the current question
            for (let i = 0; i < question.Options.length; i++) {
                const optionLabel = document.createElement('label');
                optionLabel.classList.add('options'); // Add a CSS class for styling

                const optionInput = document.createElement('input');
                optionInput.type = 'radio';
                optionInput.name = 'option'; // Ensure that radio buttons are grouped together
                optionInput.classList.add('option-radio'); // Add a CSS class for styling
                optionInput.value = i;

                const optionText = document.createTextNode(question.Options[i]);

                // Append the option input and text to the option label
                optionLabel.appendChild(optionInput);
                optionLabel.appendChild(optionText);

                // Append the option label to the options container
                optionsContainer.appendChild(optionLabel);
            }

            // Calculate the number of attempted questions and update the progress display
            const attemptedQuestions = questionIndex;
            const progressDisplay = document.querySelector('.question-index');
            progressDisplay.textContent = `Attempted ${attemptedQuestions} out of ${questions[category].length} questions`;

            // Additional code can be added here to update other elements as needed for the question...
        } else {
            // Handle the case where the index is out of bounds for the current category
            console.error(`Invalid question index for category ${category}: ${index}`);
        }
    } else {
        // Handle the case where the category does not exist or is not an array in the questions object
        console.error(`Invalid category: ${category}`);
    }

    questionIndex++; // Increment the question index for the next question
}


// Add a click event listener to the submit button, calling the handleQuizSubmission function when clicked
submitButton.addEventListener('click', handleQuizSubmission);

// Function to handle the submission of the quiz
function handleQuizSubmission() {
    // Calculate the user's score by multiplying the number of correct answers by 20 (assuming 20 points per correct answer)
    const userScore = correctAnswers.length * 20;

    // Get the total number of questions in the current category
    const totalQuestions = questions[currentCategory].length;

    // Calculate the percentage score
    const percentageScore = ((userScore + 20) / (totalQuestions * 20)) * 100;

    // Create a text message indicating the user's score and the total possible score
    const resultText = `${userScore + 20}/${totalQuestions * 20}!`;
    const resultText2 = `You Scored ${userScore + 20} Out of ${totalQuestions * 20}!`;

    // Get the result display element from the HTML
    const resultContainer = document.querySelector('.result-container');
    const resultParagraph = document.querySelector('#result-text');
    const resultParagraph2 = document.querySelector('#result-text2');


    // Update the result display text with the user's score message
    resultParagraph.textContent = resultText;
    resultParagraph2.textContent = resultText2;

    // Get the quiz container element from the HTML
    const quizContainer = document.querySelector('.quiz-container');

    // Get the medal images
    const medal1 = document.querySelector('.medal1');
    const medal2 = document.querySelector('.medal2');
    const medal3 = document.querySelector('.medal3');
    const sadEmoji = document.querySelector('.sadimojiimg');

    // Determine which image to display based on the user's score
    if (percentageScore >= 80) {
        medal1.style.display = 'block';
        medal2.style.display = 'none';
        medal3.style.display = 'none';
        sadEmoji.style.display = 'none';
    } else if (percentageScore >= 65) {
        medal1.style.display = 'none';
        medal2.style.display = 'block';
        medal3.style.display = 'none';
        sadEmoji.style.display = 'none';
    } else if (percentageScore >= 50) {
        medal1.style.display = 'none';
        medal2.style.display = 'none';
        medal3.style.display = 'block';
        sadEmoji.style.display = 'none';
    } else {
        medal1.style.display = 'none';
        medal2.style.display = 'none';
        medal3.style.display = 'none';
        sadEmoji.style.display = 'block';
    }

    // Hide the quiz container
    quizContainer.style.display = 'none';

    // Display the result container to show the user's score
    resultContainer.style.display = 'block';
}


const urlParams = new URLSearchParams(window.location.search);
const userName = urlParams.get("name");

if (userName) {
    // Update the user-name element with the user's name
    const userNameElement = document.getElementById('user-name');
    userNameElement.textContent = `Hello, ${userName}!`;
}

// Get a reference to the link element
const customLink = document.getElementById("custom-link");

// Add a click event listener to the link
customLink.addEventListener("click", function (event) {
    // Ask for confirmation using a dialog
    const isConfirmed = confirm("Are you sure you want to log out?");

    // If the user confirms, proceed with the redirection
    if (!isConfirmed) {
        event.preventDefault(); // Prevent the default behavior (following the link)
    }
});

var loadFile = function (event) {
    var image = document.getElementById("output");
    image.src = URL.createObjectURL(event.target.files[0]);
};

// Add event listeners to the restart and exit buttons
const restartButton = document.getElementById('restartButton');
const exitButton = document.getElementById('exitButton');

restartButton.addEventListener('click', restartQuiz);
exitButton.addEventListener('click', exitQuiz);

function restartQuiz() {
    // You can redirect the user to the category page or perform any other actions for restarting the quiz
    // For example, redirecting to a category page
    window.location.href = 'category.html';
}

function exitQuiz() {
    // Redirect the user to the category page when clicking the "Exit" button
    window.location.href = 'category.html';
}


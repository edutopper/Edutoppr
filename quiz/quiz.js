const progessBar = document.querySelector(".progress-bar"),
 progessText = document.querySelector(".progress-text");

 const progress = (value) => {
    const percentage = (value/time)*100;
    progessBar.style.width = `${percentage}%`;
    progessText.innerHTML = `${value}`;
 };

 let questions = [],
 time = 30,
 score = 0,
 currentQuestion,
 timer;

const startBtn = document.querySelector(".start"),
    numQuestions = document.querySelector("#num-questions"),
    category = document.querySelector("#category"),
    difficulty = document.querySelector("#difficulty"),
    timePerQuestion = document.querySelector("#time"),
    quiz = document.querySelector(".quiz"),
    startscreen = document.querySelector(".start-screen");

    const startQuiz = () => {
        const num = numQuestions.value;
        const cat = category.value;
        const diff = difficulty.value;
        fetch("/quiz/questions.json")
            .then((response) => response.json())
            .then((data) => {
                // Filter questions based on category and difficulty
                let filteredQuestions = data.results.filter((question) => {
                    return (
                        (cat === "" || question.category === cat) &&
                        question.difficulty === diff
                    );
                });
                // Shuffle the filtered questions
                filteredQuestions.sort(() => Math.random() - 0.5);
                // Slice the array to get only the specified number of questions
                questions = filteredQuestions.slice(0, num);
                startscreen.classList.add("hide");
                quiz.classList.remove("hide");
                currentQuestion = 1;
                showQuestion(questions[0]);
            })
            .catch((error) => console.error("Error fetching questions:", error));
    };

startBtn.addEventListener("click", startQuiz);

const submitBtn = document.querySelector(".submit"),
nextBtn = document.querySelector(".next");
nextBtn.style.display = "none"; // Initially hide the next button

// Disable next button initially
nextBtn.disabled = true;

// Function to enable and show the next button
const enableNextButton = () => {
    nextBtn.disabled = false;
    nextBtn.style.display = "block";
};

const showQuestion = (question) => {
    const questionText = document.querySelector(".question"),
    answersWrapper = document.querySelector(".answer-wrapper"),
    questionNumber = document.querySelector(".number"),
    submitBtn = document.querySelector(".submit"); // Select submit button

    // Disable submit button initially
    submitBtn.disabled = true;
    submitBtn.style.display = "block";

    questionText.innerHTML = question.question;

    //correct an wrong answers are seperate so let's mix them
    const answers = [...question.incorrect_answers, question.correct_answer.toString()];

    //Since correct are always at last 
    //So let's shuffle the array

    answers.sort(() => Math.random() - 0.5);
    answersWrapper.innerHTML= "";
    answers.forEach((answer) => {
        // Check if the answer is correct
        const isCorrect = answer === question.correct_answer;
        
        answersWrapper.innerHTML += `
        <div class="answer ">
                    <span class="text">${answer}</span>
                    <span class="checkbox">
                        <span class="icon">✓</span>
                    </span>
                </div>
        `
    });

    questionNumber.innerHTML = `
    Question <span class="current">${
        questions.indexOf(question) + 1
    }</span><span class="total">/${questions.length}</span>
    `;

    //Adding EventListeners on answers

    const answersDiv = document.querySelectorAll(".answer");
    answersDiv.forEach((answer) => {
        answer.addEventListener("click", () => {
            //if answer is not already submitted
            if(!answer.classList.contains("checked")) {
                //remove checked from other answer
                answersDiv.forEach((answer) => {
                    answer.classList.remove("selected")
                });
                //add selected on currently clicked
                answer.classList.add("selected");
                //after any answer is selected enable submit btn
                submitBtn.disabled = false;
            }
        });
    });

    //after updating question start timer
    time = timePerQuestion.value;
    startTimer(time);

};

const startTimer = (time)=>{
    clearInterval(timer);
    progress(time);
    timer = setInterval(()=>{
        if(time >=0){
            //if timer is more than 0 means time remaining
            //move progress
            progress(time);
            time--;
        } else{
            //if time finishes means less than 0
            checkAnswer();
            enableNextButton();
        }
    },1000);
};

submitBtn.addEventListener("click", () => {
    checkAnswer();
    enableNextButton();
});

const checkAnswer = () => {
    //firstclear the interval when clock answer triggered
    clearInterval(timer);
    
    const selectedAnswer = document.querySelector(".answer.selected");
    if(selectedAnswer) {
        const answer = selectedAnswer.querySelector(".text").textContent;
        if(answer === questions[currentQuestion -1].correct_answer){
            //if answer matched with current question correct answer
            //incresescore
            score++;
            //add correct class on selected
            selectedAnswer.classList.add("correct")
        } else{
            //if wrong selected
            //add wrong class on selected but then also add correct on correct answer
            selectedAnswer.classList.add("wrong")
            const correctAnswer = document.querySelectorAll(".answer").forEach((answer) => {
                if(answer.querySelector(".text").innerHTML === questions[currentQuestion -1].correct_answer) {
                    //only add correct class to correct answer
                    answer.classList.add("correct")
                }
            });
        }
    }
    //answer check will be also triggered when time reaches 0
    //if nothing is selected and time finishes
    //lets just add correct class on correct answer
    else{
        const correctAnswer = document.querySelectorAll(".answer").forEach((answer) => {
            if(answer.querySelector(".text").innerHTML === questions[currentQuestion -1].correct_answer) {
                //only add correct class to correct answer
                answer.classList.add("correct")
            }
        });
    }

    // let's block user to select further answers
    const answerDiv = document.querySelectorAll(".answer");
    answerDiv.forEach((answer)=>{
        answer.classList.add("checked");
        //add checked class on all answer as we check for it on click answer if it's present do nothing
        //also when checked let's don't add hover effect on checkbox
    });

    //after submit show next btn to go to next question
    submitBtn.style.display = "none";
    nextBtn.style.display = "block";
    
};

//on next btn click show next question

nextBtn.addEventListener("click", () => {
    nextQuestion();
    //also show submit btn on next question and hide next btn
    nextBtn.style.display = "none";
    submitBtn.style.display = "block";
});

const nextQuestion = () => {
    //if there is remaining question
    if(currentQuestion < questions.length){
        currentQuestion++;
        //show question
        showQuestion(questions[currentQuestion - 1])
    }
    else{
        //if no question remaining
        showScore();
    }
};

const endScreen = document.querySelector(".end-screen"),
finalScore = document.querySelector(".final-score"),
totalScore = document.querySelector(".total-score")

const showScore = () => {
    endScreen.classList.remove("hide");
    quiz.classList.add("hide");
    finalScore.innerHTML = score;
    totalScore.innerHTML = `/${questions.length}`;
};

const restartBtn = document.querySelector(".restart");
restartBtn.addEventListener("click", () => {
    // reload page on click
    window.location.reload();
})
let countSpan = document.querySelector(".count span");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let bullets = document.querySelector(".bullets");
let quizArea = document.querySelector(".quiz-area");
let answerArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let theResultContainer = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");

let currentIndex = 0;
let rightAnswer = 0;
let countdownInterval;

function getQuestion() {
  let myRequest = new XMLHttpRequest();
  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionObject = JSON.parse(this.responseText);
      let questionCount = questionObject.length;
      createBullets(questionCount);

      countdown(25, questionCount);

      addData(questionObject[currentIndex], questionCount);

      submitButton.onclick = () => {
        let theRightAnswer = questionObject[currentIndex].right_answer;

        currentIndex++;

        checkAnswer(theRightAnswer, questionCount);

        quizArea.innerHTML = "";
        answerArea.innerHTML = "";

        addData(questionObject[currentIndex], questionCount);

        handleBullets();
        clearInterval(countdownInterval);
        countdown(25, questionCount);

        showResult(questionCount);
      };
    }
  };

  myRequest.open("GET", "html_questions.json", true);
  myRequest.send();
}

getQuestion();
function createBullets(num) {
  countSpan.innerHTML = num;

  for (let i = 0; i < num; i++) {
    let theBullets = document.createElement("span");
    if (i === 0) {
      theBullets.className = "active";
    }
    bulletsSpanContainer.appendChild(theBullets);
  }
}

function addData(obj, count) {
  if (currentIndex < count) {
    let qTitle = document.createElement("h2");
    let qText = document.createTextNode(obj["title"]);

    qTitle.appendChild(qText);
    quizArea.appendChild(qTitle);

    for (let i = 1; i <= 4; i++) {
      let mainDiv = document.createElement("div");
      mainDiv.className = "answer";
      let radioInput = document.createElement("input");

      radioInput.name = "question";
      radioInput.type = "radio";
      radioInput.id = `answer_${i}`;
      radioInput.dataset.answer = obj[`answer_${i}`];

      if (i === 1) {
        radioInput.checked = true;
      }

      let theLabel = document.createElement("label");
      theLabel.htmlFor = `answer_${i}`;
      let theLabelText = document.createTextNode(obj[`answer_${i}`]);
      theLabel.appendChild(theLabelText);
      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(theLabel);

      answerArea.appendChild(mainDiv);
    }
  }
}

function checkAnswer(rAnswer, count) {
  let answers = document.getElementsByName("question");
  let theChoosenAnswer;
  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChoosenAnswer = answers[i].dataset.answer;
    }
  }

  if (rAnswer === theChoosenAnswer) {
    rightAnswer++;
  }
}

function handleBullets() {
  let bulletsSpan = document.querySelectorAll(".bullets .spans span");
  let arraryOfSpan = Array.from(bulletsSpan);
  arraryOfSpan.forEach((span, index) => {
    if (currentIndex === index) {
      span.className = "active";
    }
  });
}

function showResult(count) {
  let theResult;
  if (currentIndex === count) {
    quizArea.remove();
    answerArea.remove();
    submitButton.remove();
    bullets.remove();

    if (rightAnswer > count / 2 && rightAnswer < count) {
      theResult = `<span class="good">Good</span>, ${rightAnswer} from ${count}`;
    } else if (rightAnswer === count) {
      theResult = `<span class="perfect">Perfect</span>, All Answers is Good`;
    } else
      theResult = `<span class="bad">Bad</span>, ${rightAnswer} from ${count}`;

    theResultContainer.innerHTML = theResult;
  }
}

function countdown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    countdownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countdownElement.innerHTML = `${minutes} : ${seconds}`;

      if (--duration < 0) {
        clearInterval(countdownInterval);
        submitButton.click();
      }
    }, 1000);
  }
}

//# Imports hier:
import { IQuestion } from "./interfaces/IQuestions";

//# Links hier:
const ENG_EASY_URL =
  "https://vz-wd-24-01.github.io/typescript-quiz/questions/easy.json";
const ENG_HARD_URL =
  "https://vz-wd-24-01.github.io/typescript-quiz/questions/hard.json";
const GER_EASY_URL =
  "https://vz-wd-24-01.github.io/typescript-quiz/questions/leicht.json";
const GER_HARD_URL =
  "https://vz-wd-24-01.github.io/typescript-quiz/questions/schwer.json";

//# HTML Elemente abholen:

const formDiff = document.querySelector("#form-difficulty") as HTMLFormElement;
const selectLang = document.querySelector("#language") as HTMLSelectElement;
const selectDiff = document.querySelector("#difficulty") as HTMLFormElement;
const formQuest = document.querySelector("#form-question") as HTMLFormElement;
const cardCont = document.querySelector("#card-container") as HTMLDivElement;
const submitBtn = document.querySelector("#submit") as HTMLButtonElement;
const restartBtn = document.querySelector("#restart") as HTMLButtonElement;
const scoreTextEl = document.querySelector(
  "#score-text"
) as HTMLParagraphElement;

//# Rock 'n Roll

selectLang.addEventListener("change", () => {
  if (selectLang.value === "en") {
    submitBtn.textContent = "Submit";
    restartBtn.textContent = "Restart Quiz";
  } else if (selectLang.value === "de") {
    submitBtn.textContent = "Absenden";
    restartBtn.textContent = "Quiz wiederholen!";
  }
});

function getURL(): string {
  const lang = selectLang.value;
  const diff = selectDiff.value;

  if (lang === "de" && diff === "easy") {
    return GER_EASY_URL;
  } else if (lang === "de" && diff === "hard") {
    return GER_HARD_URL;
  } else if (lang === "en" && diff === "easy") {
    return ENG_EASY_URL;
  } else if (lang === "en" && diff === "hard") {
    return ENG_HARD_URL;
  } else {
    return "";
  }
}

formDiff.addEventListener("submit", async (event: Event) => {
  event.preventDefault();

  const URL = getURL();

  cardCont.innerHTML = "";
  try {
    const response = await fetch(URL);
    const data: IQuestion[] = await response.json();
    let questionCount = 0;
    for (const question of data) {
      questionCount++;
      const card = document.createElement("div") as HTMLDivElement;
      card.classList.add("card");
      const questionElement = document.createElement("b") as HTMLElement;
      questionElement.textContent = question.question;
      const answerDiv = document.createElement("div") as HTMLDivElement;
      for (let i = 0; i < 4; i++) {
        const answerInput = document.createElement("input") as HTMLInputElement;
        answerInput.type = "radio";
        answerInput.name = `answer${questionCount}`;
        answerInput.id = `answer: ${questionCount}_${i}`;
        answerInput.value = i.toString();
        const answerLabel = document.createElement("label") as HTMLLabelElement;
        answerLabel.setAttribute("for", `answer: ${questionCount}_${i}`);
        answerLabel.textContent = question.answers[i];
        const answerBox = document.createElement("div") as HTMLDivElement;
        answerBox.appendChild(answerInput);
        answerBox.appendChild(answerLabel);
        answerDiv.appendChild(answerBox);
      }
      card.appendChild(questionElement);
      card.appendChild(answerDiv);
      cardCont.appendChild(card);
      formQuest.style.display = "block";
    }
  } catch (error) {
    console.error(error);
  }
});

formQuest?.addEventListener("submit", async (event: Event) => {
  event.preventDefault();

  const URL = getURL();

  let score = 0;
  let answersGiven = 0;
  let data: IQuestion[] = [];
  try {
    const response = await fetch(URL);
    data = await response.json();

    let questionCount = 0;
    for (const question of data) {
      const correctAnswer = question.correct;
      questionCount++;
      const answer = document.querySelector(
        'input[name="answer' + questionCount.toString() + '"]:checked'
      ) as HTMLInputElement | any;
      if (!answer) {
        const answerBoxEl = document.querySelector(
          'input[name="answer' + questionCount.toString() + '"]'
        ) as HTMLInputElement | any;
        answerBoxEl.parentElement.parentElement.parentElement.style.border =
          "2px solid red";
      } else {
        const answerGiven = answer.value;
        answer.parentElement.parentElement.parentElement.style.border = "none";
        if (answerGiven) {
          answersGiven++;
        }
        if (Number(answerGiven) === correctAnswer) {
          score++;
          answer.parentElement.parentElement.parentElement.style.display =
            "none";
        } else {
          const answerBoxElements = document.querySelectorAll(
            'input[name="answer' + questionCount.toString() + '"]'
          ) as HTMLInputElement[] | any;
          answerBoxElements[correctAnswer].parentElement.style.backgroundColor =
            "lightgreen";
          answerBoxElements[
            Number(answerGiven)
          ].parentElement.style.backgroundColor = "darksalmon";
        }
      }
    }
  } catch (error) {
    console.error(error);
  } finally {
    const lang = selectLang.value;
    scrollToTop();
    if (answersGiven === data.length) {
      if (lang === "de") {
        scoreTextEl.textContent = `${score} von ${data.length} richtig beantwortet!`;
        document.getElementsByTagName("section")[1].style.display = "block";
      } else if (lang === "en") {
        scoreTextEl.textContent = `You have answered ${score} of ${data.length} questions correctly!`;
        document.getElementsByTagName("section")[1].style.display = "block";
      }
      submitBtn.style.display = "none";
    } else {
      window.alert(
        lang === "de"
          ? "Bitte zuerst alle Fragen beantworten!"
          : "Please answer all questions first!"
      );
    }
  }
});

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

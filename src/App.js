// eslint-disable-next-line
import React, { useState, useEffect } from "react"
import { nanoid } from "nanoid";
import Question from "./components/Question"
import './index.css';

export default function App() {
  const [gameStarted, setGameStarted] = useState(false)
  const [triviaData, setTriviaData] = useState([])
  const [showAnswer, setShowAnswer] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)

  const apiUrl = "https://opentdb.com/api.php?amount=5&type=multiple"

  useEffect(() => {
    if (gameStarted) {
      const completedTrivia = triviaData.every(element => (element.selected_answer !== ""))
      if (completedTrivia) {
        setCompleted(true)
        const correctArray = triviaData.filter(element => (element.selected_answer === element.correct_answer)
        )
        setCorrectCount(correctArray.length)
      }
    }
  }, [triviaData])

  function startGame() {
    getQuestions()
    setGameStarted(true)
  }

  function getQuestions() {
    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
      return array
    }

    fetch(apiUrl)
      .then(res => res.json())
      .then(data => data.results)
      .then(array => array.map(element => (
        {
          ...element
          , answers: shuffleArray(element.incorrect_answers.concat(element.correct_answer))
          , id: nanoid()
          , selected_answer: ""
        }
      )))
      .then(newArray => {
        console.log(newArray)
        setTriviaData(newArray)
      })
  }

  function handleSelectAnswer(questionId, selectedAnswer) {
    setTriviaData(prev => prev.map(question => {
      return (
        question.id === questionId ? { ...question, selected_answer: selectedAnswer } : question
      )
    }
    ))
  }

  function handleCheckAnswer() {
    setShowAnswer(true)
    setGameOver(true)
  }

  function handleResetGame() {
    setTriviaData([])
    setCompleted(false)
    setShowAnswer(false)
    setGameOver(false)
    setGameStarted(false)
  }

  const questionElements = triviaData.map(question => {
    return (
      <Question
        key={question.id}
        id={question.id}
        question={question.question}
        answers={question.answers}
        correct_answer={question.correct_answer}
        selected_answer={question.selected_answer}
        handleSelectAnswer={handleSelectAnswer}
        showAnswer={showAnswer}
      />
    )
  })

  return (
    <main>
      {gameStarted
        ? <section className="quiz-main">
          {questionElements}
          <div className="score-and-btn">
            {gameOver && <p className="game-score">You scored {correctCount}/5 correct answer{correctCount > 1 ? "s" : ""}</p>}
            <button
              className={`check-ans-btn ${completed ? "" : "btn-disabled"}`}
              onClick={gameOver ? handleResetGame : handleCheckAnswer}
            >{(triviaData.length > 0 && gameOver) ? "Play again" : "Check answers"}
            </button>
          </div>
        </section>
        : <section className="quiz-intro">
          <h1 >Trivia!</h1>
          <p className="title-desc">Tease your brain cells by answer these trivia questions!</p>
          <button className="start-quiz-btn" onClick={startGame}>Start quiz!</button>
        </section>
      }
    </main>
  )
}

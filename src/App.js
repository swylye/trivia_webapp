// eslint-disable-next-line
import React, { useState, useEffect } from "react"
import { nanoid } from "nanoid";
import Question from "./components/Question"
import './index.css';
import categoryObject from "./components/categoryObject"
import difficultyObject from "./components/difficultyObject"

export default function App() {

  const [gameStarted, setGameStarted] = useState(false)
  const [triviaData, setTriviaData] = useState([])
  const [showAnswer, setShowAnswer] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)

  const [triviaOptions, setTriviaOptions] = useState({ category: "", difficulty: "" })
  const [apiUrl, setApiUrl] = useState("https://opentdb.com/api.php?amount=5&type=multiple")

  useEffect(() => {
    setApiUrl(`https://opentdb.com/api.php?amount=5&type=multiple&category=${triviaOptions.category}&difficulty${triviaOptions.difficulty}`)
  }, [triviaOptions])

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

  function handleOptionSelection(e) {
    const { name, value } = e.target
    setTriviaOptions(prev =>
    ({
      ...prev
      , [name]: value
    }))
  }

  const triviaCategories = categoryObject.map(category => {
    return (
      <option className="select-options" value={category.value}>{category.name}</option>
    )
  })

  const triviaDifficulties = difficultyObject.map(element => {
    return (
      <option className="select-options" value={element.value}>{element.name}</option>
    )
  })


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
          <div className="select-container">
            <label className="category-label" htmlFor="category">Category:</label>
            <select
              name="category"
              id="category"
              className="category-select"
              value={triviaOptions.category}
              onChange={handleOptionSelection}
            >
              {triviaCategories}
            </select>
          </div>
          <div className="select-container">
            <label className="difficulty-label" htmlFor="difficulty">Difficulty:</label>
            <select
              name="difficulty"
              id="difficulty"
              className="difficulty-select"
              value={triviaOptions.difficulty}
              onChange={handleOptionSelection}
            >
              {triviaDifficulties}
            </select>
          </div>
          <button className="start-quiz-btn" onClick={startGame}>Start quiz!</button>
        </section>
      }
    </main>
  )
}

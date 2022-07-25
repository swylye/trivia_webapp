import React from "react"
import { decode } from 'html-entities';

export default function Question(props) {

    const question = props.question
    const answers = props.answers
    const correct_answer = props.correct_answer

    return (
        <div className="question">
            <h3>{decode(question)}</h3>
            <div className="answers-section">
                {answers.map(answer => {
                    return (
                        <button
                            className={`answer-btn 
                                        ${props.selected_answer === answer ? "answer-btn-selected" : "answer-btn-not-selected"} 
                                        ${props.showAnswer ? "answer-show" : ""}
                                        ${props.showAnswer
                                    ? answer === correct_answer
                                        ? "answer-btn-correct"
                                        : "answer-btn-wrong"
                                    : ""
                                }
                                        `}
                            onClick={() => props.handleSelectAnswer(props.id, answer)}
                        >
                            {decode(answer)}
                        </button>
                    )
                })}
            </div>
            <hr />
        </div>
    )
}
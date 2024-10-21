"use strict";

/***************************************************************************************************
 *	editQuestion.js
 *
 *	This file creates template for editing questions
 *
 ***************************************************************************************************/

( function () {

	window.Comp.EditQuestion = editQuestion;

	function editQuestion( question ) {
		let div = document.createElement( "div" );
		let title = "Edit Question";
		let deleteBtnContent = `<button class="delete-quiz" type="button">Delete</button>`;
		if( question === null ) {
			title = "Create Question";
			deleteBtnContent = "";
			question = { "text": "", "answers": [ "" ] };
			
		}
		div.classList.add( "create-quiz" );
		div.innerHTML = `
			<h2>${title}</h2>
			<form class="create-quiz-form">
				<input type="text" class="quiz-title" placeholder="Enter your question" value="${question.text}"/>
				<ul class="answers"></ul>
				<button class="add-answer-btn btn-light" type="button">Add Answer</button>
				<div class="btn-container">
					<button class="submit-quiz" type="submit">Save Changes</button>
					${deleteBtnContent}
				</div>
			</form>
		`;

		updateAnswersContent( div, quiz );
		div.querySelector( ".add-answer-btn" ).addEventListener( "click", () => addAnswer( div, question ) );

		return div;
	}

	function updateAnswersContent( div, question ) {
		const answers = div.querySelector( ".answers" );
		answers.innerHTML = createAnswersConent( question );
	}

	function createAnswersConent( question ) {
		let content = "";
		question.answers.forEach( ( answer, index ) => {
			content += `
				<li class="answer-${index}">
					<input type="text" class="answer-text" value="${answer.text}" />
					<div class="btn-container">
						<button type="button" class="toggle-btn question-correct">Correct</button>
						<button type="button" class="question-delete">&#128465;</button>
					</div>
				</li>
			`;
		} );
		return content;
	}

	function addAnswer( div, question ) {
		question.push( "" );
		updateAnswersContent( div, quiz );
	}

} )();

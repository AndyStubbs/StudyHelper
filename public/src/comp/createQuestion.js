"use strict";

/***************************************************************************************************
 *	createQuestion.js
 *
 *	This file creates template for editing questions
 *
 ***************************************************************************************************/

( function () {

	window.Comp.CreateQuestion = createQuestion;

	function createQuestion( question, questionUpdated ) {
		let div = document.createElement( "div" );
		let title = "Edit Question";
		if( question === null ) {
			title = "Create Question";
			deleteBtnContent = "";
			question = { "text": "", "answers": [ { "text": "", "correct": true } ] };
		}
		div.classList.add( "create-question" );

		// Create teh question form content
		div.innerHTML = `
			<h2>${title}</h2>
			<form class="create-question-form">
				<textarea
					class="question-text"
					placeholder="Enter your question"
					title="Enter the text for your question"
				>${question.text}</textarea>
				<div class="answer-error"></div>
				<ul class="answers"></ul>
				<div class="btn-container">
					<button class="add-answer-btn btn-light" type="button">Add Answer</button>
					<button class="submit-question" type="submit">Save Changes</button>
				</div>
			</form>
		`;

		updateAnswersContent( div, question );

		// Add a question button
		div.querySelector( ".add-answer-btn" ).addEventListener( "click", () => addAnswer( div, question ) );

		// Save question button
		div.querySelector( ".submit-question" ).addEventListener( "click", ( e ) => saveChanges( e, div, question, questionUpdated ) );

		const questionOriginal = JSON.stringify( question );
		return {
			"div": div,
			"onClose": () => onClose( div, question, questionUpdated, questionOriginal )
		};
	}

	function updateAnswersContent( div, question ) {
		const answers = div.querySelector( ".answers" );
		answers.innerHTML = "";
		question.answers.forEach( ( answer, index ) => {

			// Create the answers list
			const answerListItem = document.createElement( "li" );
			answerListItem.classList.add( `answer-${index}` );
			answerListItem.innerHTML = `
				<input
					type="text"
					class="answer-text"
					placeholder="Enter an answer"
					value="${answer.text}"
					title="Enter the text for the answer."
				/>
				<div class="btn-container">
					<button
						type="button"
						class="toggle-btn answer-correct ${answer.correct ? 'toggle-btn-on' : ''}"
						title="Select one correct answer from list."
					>${answer.correct ? 'Correct' : 'Incorrect'}</button>
					<button type="button" class="answer-delete" title="Remove answer">&#128465;</button>
				</div>
			`;

			// Answer Correct Toggle
			answerListItem.querySelector( ".toggle-btn" ).addEventListener( "click", ( e ) => {
				answers.querySelectorAll( ".toggle-btn" ).forEach( ( btn ) => {
					btn.classList.remove( "toggle-btn-on" );
					btn.innerText = "Incorrect";
					updateAnswers( div, question );
				} );
				e.currentTarget.classList.add( "toggle-btn-on" );
				e.currentTarget.innerText = "Correct";
			} );

			// Remove Answer Button Click
			const btnDeleteAnswer = answerListItem.querySelector( ".answer-delete" );
			btnDeleteAnswer.addEventListener( "click", () => {
				updateAnswers( div, question );
				question.answers.splice( index, 1 );
				updateAnswersContent( div, question );
			} );

			// Attach answer list item to the DOM
			answers.appendChild( answerListItem );
		} );
	}

	function addAnswer( div, question ) {
		updateAnswers( div, question );
		question.answers.push( { "text": "", "correct": false } );
		updateAnswersContent( div, question );
		div.querySelector( ".answers li:last-child .answer-text" ).focus();
	}

	function updateAnswers( div, question ) {
		question.answers = [];
		div.querySelectorAll( ".answers li" ).forEach( answerLi => {
			const answerValue = answerLi.querySelector( ".answer-text" ).value;
			const answerIsCorrect = answerLi.querySelector( ".answer-correct" ).classList.contains( "toggle-btn-on" );
			question.answers.push( { "text": answerValue, "correct": answerIsCorrect } );
		} );
	}

	function updateQuestion( div, question ) {
		const questionTextArea = div.querySelector( ".question-text" );
		question.text = questionTextArea.value;
	}

	function saveChanges( e, div, question, questionUpdated ) {
		if( e ) {
			e.preventDefault();
		}

		// Validate question
		const questionTextArea = div.querySelector( ".question-text" );
		let isValid = true;
		if( questionTextArea.value === "" ) {
			questionTextArea.classList.add( "invalid" );
			isValid = false;
		}

		// Validate Answers
		const allAnswerInputs =	div.querySelectorAll( ".answer-text" );
		allAnswerInputs.forEach( answerInput => {
			if( answerInput.value === "" ) {
				isValid = false;
				answerInput.classList.add( "invalid" );
				div.querySelector( ".answer-error" ).innerText = "The question must have an answer.";
			}
		} );
		if( allAnswerInputs.length === 0 ) {
			isValid = false;
		}

		// Validate Answer Toggle
		if( isValid && div.querySelectorAll( ".answers .toggle-btn-on" ).length === 0 ) {
			isValid = false;
			div.querySelector( ".answer-error" ).innerText = "You must select a correct answer.";
		}

		if( isValid ) {
			div.querySelector( ".answer-error" ).innerText = "";
			updateQuestion( div, question );
			updateAnswers( div, question );
			div.closest( ".modal" ).remove();
			questionUpdated( question );
		}
	}

	function onClose( div, question, questionUpdated, questionOriginal ) {
		updateAnswers( div, question );
		updateQuestion( div, question );

		// Check if question has been changed
		if( JSON.stringify( question ) !== questionOriginal ) {
			const answer = confirm( "Do you wish to save changes?" );
			if( answer ) {
				saveChanges( null, div, question, questionUpdated );
				return false;
			}
		}

		// Continue with closing modal
		return true;
	}

} )();

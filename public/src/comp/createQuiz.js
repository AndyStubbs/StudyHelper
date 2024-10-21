"use strict";

/***************************************************************************************************
 *	createQuiz.js
 *
 *	This file creates template for creating a new quiz
 *
 ***************************************************************************************************/

( function () {

	window.Comp.CreateQuiz = createQuiz;

	function createQuiz( topic, quiz ) {
		let div = document.createElement( "div" );
		let title = "Edit Quiz";
		let deleteBtnContent = `<button class="delete-quiz" type="button">Delete</button>`;
		let quizTitle = "";
		if( quiz === null ) {
			title = "Create Quiz";
			deleteBtnContent = "";
			quiz = {
				"title": "",
				"questions": [
					{ "text": "", "answers": [ { "text": "", "correct": true } ] }
				]
			};
		} else {
			quizTitle = topic.title;
		}
		div.classList.add( "create-quiz" );
		div.innerHTML = `
			<h2>${title}</h2>
			<form class="create-quiz-form">
				<input type="text" class="quiz-title" placeholder="Quiz Title" value="${quizTitle}"/>
				<ul class="questions"></ul>
				<button class="add-question-btn btn-light" type="button">Add Question</button>
				<div class="btn-container">
					<button class="submit-quiz" type="submit">Save Changes</button>
					${deleteBtnContent}
				</div>
			</form>
		`;

		updateQuestionsContent( div, quiz );
		div.querySelector( ".add-question-btn" ).addEventListener( "click", () => addQuestion( div, quiz ) );

		return div;
	}

	function updateQuestionsContent( div, quiz ) {
		const questionList = div.querySelector( ".questions" );
		questionList.innerHTML = "";
		quiz.questions.forEach( ( question, index ) => {
			let li = document.createElement( "li" );
			li.classList.add( `question-${index}` );
			let questionText = question.text;
			if( questionText === "" ) {
				questionText = "Question " + ( index + 1 );
			}
			li.innerHTML = `
				<div class="question-text">${questionText}</div>
				<div class="btn-container">
					<button type="button" class="question-edit">Edit</button>
					<button type="button" class="question-delete">&#128465;</button>
				</div>
			`;
			questionList.appendChild( li );
			questionList.querySelector( ".question-edit" ).addEventListener( "click", () => {
				let questionModal = Comp.Modal(
					window.Comp.EditQuestion( question, ( question ) => questionUpdated( div, quiz, index, question ) )
				);
				document.getElementById( "modals-container" ).appendChild( questionModal );
			} );
		} );
	}

	function addQuestion( div, quiz ) {
		quiz.questions.push( { "text": "", "answers": [ "" ] } );
		updateQuestionsContent( div, quiz );
	}

	function questionUpdated( div, quiz, questionIndex, question ) {
		quiz.questions[ questionIndex ] = question;
		updateQuestionsContent( div, quiz );
	}

} )();

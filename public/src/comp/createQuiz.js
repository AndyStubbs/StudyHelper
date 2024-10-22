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
				"questions": []
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
				<div class="btn-container">
					<button class="add-question-btn btn-light" type="button">Add Question</button>
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
			li.innerHTML = `
				<div class="question-text">${questionText}</div>
				<div class="btn-container">
					<button type="button" class="question-edit">Edit</button>
					<button type="button" class="question-delete">&#128465;</button>
				</div>
			`;
			li.querySelector( ".question-edit" ).addEventListener( "click", () => editQuestion( div, quiz, index, question ) );
			questionList.appendChild( li );
		} );
	}

	function editQuestion( div, quiz, index, question ) {
		let questionModal = Comp.Modal(
			window.Comp.CreateQuestion( question, ( newQuestionData ) => questionUpdated( div, quiz, index, newQuestionData ) )
		);
		document.getElementById( "modals-container" ).appendChild( questionModal );
	}

	function addQuestion( div, quiz ) {
		const question = { "text": "", "answers": [ { "text": "", "correct": true } ] };
		quiz.questions.push( question );
		editQuestion( div, quiz, quiz.questions.length - 1, question );
	}

	function questionUpdated( div, quiz, questionIndex, question ) {
		quiz.questions[ questionIndex ] = question;
		updateQuestionsContent( div, quiz );
	}

} )();

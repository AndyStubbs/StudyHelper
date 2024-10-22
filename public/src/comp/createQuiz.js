"use strict";

/***************************************************************************************************
 *	createQuiz.js
 *
 *	This file creates template for creating a new quiz
 *
 ***************************************************************************************************/

( function () {

	window.Comp.CreateQuiz = createQuiz;

	function createQuiz( quiz, quizUpdated ) {
		let div = document.createElement( "div" );
		let title = "Edit Quiz";
		let deleteBtnContent = `<button class="delete-quiz" type="button">Delete</button>`;
		let quizTitle = "";
		if( quiz === null ) {
			title = "Create Quiz";
			deleteBtnContent = "";
			quiz = DataAPI.createQuiz();
		} else {
			quizTitle = quiz.title;
		}
		div.classList.add( "create-quiz" );
		div.innerHTML = `
			<h2>${title}</h2>
			<form class="create-quiz-form">
				<input type="text" class="quiz-title" placeholder="Quiz Title" value="${quizTitle}"/>
				<div class="quiz-error item-error"></div>
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
		div.querySelector( ".submit-quiz" ).addEventListener( "click", ( e ) => saveChanges( e, div, quiz, quizUpdated ) );

		const quizOriginal = JSON.stringify( quiz );
		return {
			"div": div,
			"onClose": () => onClose( div, quiz, quizUpdated, quizOriginal )
		};
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
					<button type="button" class="question-delete btn-delete">&#128465;</button>
				</div>
			`;
			li.querySelector( ".question-edit" ).addEventListener( "click", () => editQuestion( div, quiz, index, question ) );
			questionList.appendChild( li );
		} );
	}

	function editQuestion( div, quiz, index, question ) {
		const questionData = structuredClone( question );
		const questionComp = window.Comp.CreateQuestion(
			questionData,
			( newQuestionData ) => questionUpdated( div, quiz, index, newQuestionData )
		);
		let questionModal = Comp.Modal( questionComp.div, questionComp.onClose );
		document.getElementById( "modals-container" ).appendChild( questionModal );
	}

	function addQuestion( div, quiz ) {
		editQuestion( div, quiz, quiz.questions.length, null );
	}

	function questionUpdated( div, quiz, questionIndex, questionData ) {
		if( questionIndex >= quiz.questions.length ) {
			quiz.questions.push( questionData );
		} else {
			quiz.questions[ questionIndex ] = questionData;
		}
		div.querySelector( ".quiz-error" ).innerText = "";
		updateQuestionsContent( div, quiz );
	}

	function saveChanges( e, div, quiz, quizUpdated ) {
		if( e !== null ) {
			e.preventDefault();
		}

		// Update the quiz title
		const quizTitleInput = div.querySelector( ".quiz-title" );
		quiz.title = quizTitleInput.value;

		// Validate the quiz title
		let isValid = true;
		if( quizTitleInput.value === "" ) {
			quizTitleInput.classList.add( "invalid" );
			isValid = false;
		}

		// Validate the questions
		if( quiz.questions.length === 0 ) {
			isValid = false;
			div.querySelector( ".quiz-error" ).innerText = "The quiz must have at least one question.";
		}

		// If valid close modal and save quiz
		if( isValid ) {
			div.querySelector( ".quiz-error" ).innerText = "";
			div.closest( ".modal" ).remove();
			quizUpdated( quiz );
		}
	}

	function onClose( div, quiz, quizUpdated, quizOriginal ) {

		const quizTitleInput = div.querySelector( ".quiz-title" );
		quiz.title = quizTitleInput.value;

		// Check if quiz has been changed
		if( JSON.stringify( quiz ) !== quizOriginal ) {
			const answer = confirm( "Do you wish to save changes?" );
			if( answer ) {
				saveChanges( null, div, quiz, quizUpdated );
				return false;
			}
		}

		// Continue with closing modal
		return true;
	}
} )();

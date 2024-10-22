"use strict";

/***************************************************************************************************
 *	studyTopic.js
 *
 *	This file creates the component for launching quizes or creating new quizes.
 *
 ***************************************************************************************************/

( function () {

	window.Comp.StudyTopic = studyTopic;

	function studyTopic( topic ) {
		const topicData = [ topic ];
		let div = document.createElement( "div" );
		div.classList.add( "study-topic" );
		div.innerHTML = `
			<h2>${topic.title} Quizzes</h2>
			<ul class="quiz-list"></ul>
			<div class="btn-container">
				<button class="study-topic-btn" type="button">Create New Quiz</button>
			</div>
		`;
		updateQuizList( div, topicData );
		div.querySelector( ".study-topic-btn" ).addEventListener( "click", () => createQuizBtnClick( div, topicData ) );
		return div;
	}

	function updateQuizList( div, topicData ) {
		const quizList = div.querySelector( ".quiz-list" );
		quizList.innerHTML = "";
		for( let i = 0; i < topicData[ 0 ].quizzes.length; i += 1 ) {
			let quiz = topicData[ 0 ].quizzes[ i ];
			const quizListItem = document.createElement( "li" );
			quizListItem.innerHTML = `
				<div class="quiz-title">${quiz.title}</div>
				<div class='btn-container'>
					<button type='button' class='btn-run-quiz'>&#9658; Run</button>
					<button type='button' class='btn-edit-quiz'>&#9998; Edit</button>
					<button type='button' class='btn-delete'>&#128465;</button>
				</div>
			`;
			quizListItem.querySelector( ".btn-edit-quiz" ).addEventListener( "click", () => createQuizComp( div, topicData, i ) );
			quizListItem.querySelector( ".btn-delete" ).addEventListener( "click", () => deleteQuiz( div, topicData, i ) );
			quizList.appendChild( quizListItem );
		}
	}

	function createQuizBtnClick( div, topicData ) {
		createQuizComp( div, topicData, null );
	}

	function createQuizComp( div, topicData, quizIndex ) {
		let quiz = null;
		if( quizIndex !== null ) {
			quiz = topicData[ 0 ].quizzes[ quizIndex ];
		}
		const quizData = structuredClone( quiz );
		const quizComp = Comp.CreateQuiz( quizData, ( newQuizData ) => quizUpdated( div, topicData, newQuizData ) );
		let createQuizModal = Comp.Modal( quizComp.div, quizComp.onClose );
		document.getElementById( "modals-container" ).appendChild( createQuizModal );
	}

	function deleteQuiz( div, topicData, quizIndex ) {
		const quiz = topicData[ 0 ].quizzes[ quizIndex ];
		const quizTitle = quiz.title.length > 16 ? quiz.title.substring( 0, 13 ) + "..." : quiz.title;
		const answer = confirm( `Are you sure you want to delete quiz "${quizTitle}"?` );
		if( answer ) {
			DataAPI.deleteQuiz( topicData[ 0 ].id, quiz );
			topicData[ 0 ] = DataAPI.getTopic( topicData[ 0 ].id );
			updateQuizList( div, topicData );
		}
	}

	function quizUpdated( div, topicData, newQuizData ) {
		DataAPI.saveQuiz( topicData[ 0 ].id, newQuizData );
		topicData[ 0 ] = DataAPI.getTopic( topicData[ 0 ].id );
		updateQuizList( div, topicData );
	}

	function runQuizBtnClick() {

	}

	function editQuizBtnClick() {

	}

})();

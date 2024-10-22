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
		let quizList = "<ul>";
		for( let i = 0; i < topic.quizzes.length; i += 1 ) {
			let quiz = topic.quizzes[ i ];
			quizList += "<li>";
			quizList += "<span>" + quiz.title + "</span>";
			quizList += "<div class='btn-container'>";
			quizList += "<button type='button' class='btn-run-quiz'>&#9658; Run</button>";
			quizList += "<button type='button' class='btn-edit-quiz'>&#9998; Edit</button>";
			quizList += "</div>";
			quizList += "</li>";
		}
		quizList += "</ul>";
		let div = document.createElement( "div" );
		div.classList.add( "edit-topic" );
		div.innerHTML = `
			<h2>${topic.title} Quizzes</h2>
			${quizList}
			<div class="btn-container">
				<button class="study-topic-btn" type="button">Create New Quiz</button>
			</div>
		`;
		div.querySelector( ".study-topic-btn" ).addEventListener( "click", () => createQuizBtnClick() );
		//div.querySelector( ".study-topic-btn" ).addEventListener( "click", ( e ) => runQuizBtnClick() );
		//div.querySelector( ".edit-topic-btn" ).addEventListener( "click", () => editQuizBtnClick() );
		return div;
	}

	function createQuizBtnClick() {
		let createQuizModal = Comp.Modal( window.Comp.CreateQuiz( null, () => closeQuizModal( editModal ) ), closeQuizModal );
		document.getElementById( "modals-container" ).appendChild( createQuizModal );
	}

	function closeQuizModal( div ) {
		div.remove();
		return false;
	}

	function runQuizBtnClick() {

	}

	function editQuizBtnClick() {

	}

})();

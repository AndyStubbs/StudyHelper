"use strict";

/***************************************************************************************************
 *	main.js
 *
 *	This file provides a Main API for managing the user interface of the StudyHelper application.
 *	It handles rendering topics, creating quizzes, and running quizzes.
 *
 ***************************************************************************************************/

(function () {

	// Define Main
	window.Main = {};

	/**************************
	 * API Methods
	 ***************************/

	window.Main.init = function () {
		setupEventListeners();
		const topics = DataAPI.getTopics();
		DataAPI.bind( window.DataAPI.TOPICS, topics => renderTopics( topics ) );
	};

	/**************************
	 * Private Methods
	 ***************************/

	function setupEventListeners() {
		document.getElementById("create-topic-btn").addEventListener("click", showCreateTopicModal);
		document.getElementById("search-input").addEventListener("input", handleSearch);
		document.querySelector(".close").addEventListener("click", closeModal);
	}

	function renderTopics( topics ) {
		const container = document.getElementById("topics-container");
		container.innerHTML = "";

		const template = document.getElementById("topic-box-template");

		topics.forEach( ( topic ) => {
			const topicBox = template.content.cloneNode(true);
			topicBox.querySelector("h3").textContent = topic.title;
			topicBox.querySelector("p").textContent = topic.description;

			const createQuizBtn = topicBox.querySelector(".create-quiz-btn");
			createQuizBtn.addEventListener("click", () => showCreateQuizModal(topic.id));

			const runQuizBtn = topicBox.querySelector(".run-quiz-btn");
			runQuizBtn.addEventListener("click", () => runQuiz(topic.id));

			container.appendChild(topicBox);
		} );
	}

	function handleSearch( event ) {
		const searchTerm = event.target.value.toLowerCase();
		const topicBoxes = document.querySelectorAll(".topic-box");

		topicBoxes.forEach((box) => {
			const title = box.querySelector("h3").textContent.toLowerCase();
			const description = box.querySelector("p").textContent.toLowerCase();

			if (title.includes(searchTerm) || description.includes(searchTerm)) {
				box.style.display = "block";
			} else {
				box.style.display = "none";
			}
		});
	}

	function showCreateTopicModal() {
		const modal = document.getElementById( "modal" );
		const modalBody = document.getElementById( "modal-body" );
		const topicBody = window.Comp.CreateNewTopic( closeModal );
		modalBody.innerHTML = "";
		modalBody.appendChild( topicBody );
		modal.style.display = "block";
	}

	function closeModal() {
		document.getElementById("modal").style.display = "none";
	}

	function showCreateQuizModal(topicId) {
		const modal = document.getElementById("modal");
		const modalBody = document.getElementById("modal-body");
		const template = document.getElementById("create-quiz-template");

		modalBody.innerHTML = "";
		modalBody.appendChild(template.content.cloneNode(true));

		modal.style.display = "block";

		addQuestionField();
		document.getElementById("add-question-btn").addEventListener("click", addQuestionField);
		document
			.getElementById("create-quiz-form")
			.addEventListener("submit", (event) => handleCreateQuiz(event, topicId));
	}

	function addQuestionField() {
		const container = document.getElementById("questions-container");
		const template = document.getElementById("question-field-template");
		container.appendChild(template.content.cloneNode(true));
	}

	async function handleCreateQuiz(event, topicId) {
		event.preventDefault();
		const title = document.getElementById("quiz-title").value;
		const questions = [];

		const questionElements = document.querySelectorAll(".question-text");
		const answerElements = document.querySelectorAll(".question-answer");

		for (let i = 0; i < questionElements.length; i++) {
			questions.push({
				question: questionElements[i].value,
				answer: answerElements[i].value,
			});
		}

		const quiz = { topic_id: topicId, title, questions };

		await DataAPI.addQuiz(quiz);

		closeModal();
	}

	async function runQuiz(topicId) {
		const quizzes = await DataAPI.getQuizzes(topicId);

		if (quizzes.length === 0) {
			alert("No quizzes available for this topic.");
			return;
		}

		const quiz = quizzes[Math.floor(Math.random() * quizzes.length)];
		showQuizModal(quiz);
	}

	function showQuizModal(quiz) {
		const modal = document.getElementById("modal");
		const modalBody = document.getElementById("modal-body");
		const template = document.getElementById("run-quiz-template");
		const questionTemplate = document.getElementById("quiz-question-template");

		modalBody.innerHTML = "";
		const quizContent = template.content.cloneNode(true);

		quizContent.querySelector("h2").textContent = quiz.title;
		const form = quizContent.querySelector("#quiz-form");

		quiz.questions.forEach((q, index) => {
			const questionElement = questionTemplate.content.cloneNode(true);
			questionElement.querySelector("p").textContent = q.question;
			const input = questionElement.querySelector("input");
			input.id = `answer-${index}`;
			form.appendChild(questionElement);
		});

		const submitButton = document.createElement("button");
		submitButton.type = "submit";
		submitButton.textContent = "Submit Quiz";
		form.appendChild(submitButton);

		modalBody.appendChild(quizContent);
		modal.style.display = "block";

		form.addEventListener("submit", (event) => handleQuizSubmission(event, quiz));
	}

	function handleQuizSubmission(event, quiz) {
		event.preventDefault();
		let score = 0;

		quiz.questions.forEach((q, index) => {
			const userAnswer = document
				.getElementById(`answer-${index}`)
				.value.trim()
				.toLowerCase();
			if (userAnswer === q.answer.trim().toLowerCase()) {
				score++;
			}
		});

		alert(`You scored ${score} out of ${quiz.questions.length}`);
		closeModal();
	}
})();

document.addEventListener("DOMContentLoaded", window.Main.init);

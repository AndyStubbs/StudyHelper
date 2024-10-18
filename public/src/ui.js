const UIAPI = (function () {
	"use strict";

	function init() {
		setupEventListeners();
		loadTopics();
	}

	function setupEventListeners() {
		document.getElementById("create-topic-btn").addEventListener("click", showCreateTopicModal);
		document.getElementById("search-input").addEventListener("input", handleSearch);
		document.querySelector(".close").addEventListener("click", closeModal);
	}

	async function loadTopics() {
		const topics = await DataAPI.getTopics();
		renderTopics(topics);
	}

	function renderTopics(topics) {
		const container = document.getElementById("topics-container");
		container.innerHTML = "";

		topics.forEach((topic) => {
			const topicBox = document.createElement("div");
			topicBox.className = "topic-box";
			topicBox.innerHTML = `
				<h3>${topic.title}</h3>
				<p>${topic.description}</p>
				<button onclick="UIAPI.showCreateQuizModal(${topic.id})">Create Quiz</button>
				<button onclick="UIAPI.runQuiz(${topic.id})">Run Quiz</button>
			`;
			container.appendChild(topicBox);
		});
	}

	function handleSearch(event) {
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
		const modal = document.getElementById("modal");
		const modalBody = document.getElementById("modal-body");
		modalBody.innerHTML = `
			<h2>Create New Topic</h2>
			<form id="create-topic-form">
				<input type="text" id="topic-title" placeholder="Topic Title" required>
				<textarea id="topic-description" placeholder="Topic Description" required></textarea>
				<button type="submit">Create Topic</button>
			</form>
		`;
		modal.style.display = "block";

		document.getElementById("create-topic-form").addEventListener("submit", handleCreateTopic);
	}

	async function handleCreateTopic(event) {
		event.preventDefault();
		const title = document.getElementById("topic-title").value;
		const description = document.getElementById("topic-description").value;

		const topic = { title, description };

		await DataAPI.addTopic(topic);

		closeModal();
		loadTopics();
	}

	function closeModal() {
		document.getElementById("modal").style.display = "none";
	}

	function showCreateQuizModal(topicId) {
		const modal = document.getElementById("modal");
		const modalBody = document.getElementById("modal-body");
		modalBody.innerHTML = `
			<h2>Create New Quiz</h2>
			<form id="create-quiz-form">
				<input type="text" id="quiz-title" placeholder="Quiz Title" required>
				<div id="questions-container"></div>
				<button type="button" onclick="UIAPI.addQuestionField()">Add Question</button>
				<button type="submit">Create Quiz</button>
			</form>
		`;
		modal.style.display = "block";

		addQuestionField();
		document
			.getElementById("create-quiz-form")
			.addEventListener("submit", (event) => handleCreateQuiz(event, topicId));
	}

	function addQuestionField() {
		const container = document.getElementById("questions-container");
		const questionIndex = container.children.length + 1;
		const questionField = document.createElement("div");
		questionField.innerHTML = `
			<input type="text" class="question-text" placeholder="Question ${questionIndex}" required>
			<input type="text" class="question-answer" placeholder="Answer" required>
		`;
		container.appendChild(questionField);
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
		modalBody.innerHTML = `
			<h2>${quiz.title}</h2>
			<form id="quiz-form">
				${quiz.questions
					.map(
						(q, index) => `
					<div>
						<p>${q.question}</p>
						<input type="text" id="answer-${index}" required>
					</div>
				`
					)
					.join("")}
				<button type="submit">Submit Quiz</button>
			</form>
		`;
		modal.style.display = "block";

		document
			.getElementById("quiz-form")
			.addEventListener("submit", (event) => handleQuizSubmission(event, quiz));
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

	return {
		init,
		showCreateQuizModal,
		runQuiz,
		addQuestionField,
	};
})();

window.UIAPI = UIAPI;
document.addEventListener("DOMContentLoaded", UIAPI.init);

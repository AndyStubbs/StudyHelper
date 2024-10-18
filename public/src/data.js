"use strict";

/***************************************************************************************************
 *	data.js
 *
 *	This file provides a DataAPI for managing topics and quizzes in the StudyHelper application.
 *	It uses MyIndexDB for local storage and provides methods for adding and retrieving data.
 *
 ***************************************************************************************************/

(function () {
	const DB_NAME = "StudyHelperDB";
	const STORE_NAME = "userData";

	// Define DataAPI
	window.DataAPI = {};

	/**************************
	 * API Methods
	 ***************************/

	window.DataAPI.getTopics = async function () {
		return filterData("topic");
	};

	window.DataAPI.addTopic = async function (topic) {
		return addItem("topic", topic);
	};

	window.DataAPI.getQuizzes = async function (topicId) {
		return filterData("quiz", (item) => item.value.topic_id === topicId);
	};

	window.DataAPI.addQuiz = async function (quiz) {
		return addItem("quiz", quiz);
	};

	/**************************
	 * Private Methods
	 ***************************/

	async function initDB() {
		return new Promise((resolve) => {
			MyIndexDB.init(DB_NAME, STORE_NAME);
			resolve();
		});
	}

	async function filterData(type, additionalFilter = null) {
		await initDB();
		const allData = await MyIndexDB.getAll();
		return allData.filter((item) => {
			const typeMatch = item.value.type === type;
			return additionalFilter ? typeMatch && additionalFilter(item) : typeMatch;
		});
	}

	async function addItem(type, data) {
		await initDB();
		const id = `${type}_${Date.now().toString()}`;
		return MyIndexDB.setItem(id, {
			type: type,
			...data,
		});
	}
})();

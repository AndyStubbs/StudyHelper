"use strict";

/***************************************************************************************************
 *	data.js
 *
 *	This file provides a DataAPI for managing topics and quizzes in the StudyHelper application.
 *	It uses MyIndexDB for local storage and provides methods for adding and retrieving data.
 *
 ***************************************************************************************************/

( function () {

	const TOPICS = "topics";
	const QUIZZES = "quizzes";
	const KEYWORDS = "keywords";

	// Define DataAPI
	window.DataAPI = {};

	/**************************
	 * API Methods
	 ***************************/

	window.DataAPI.TOPICS = TOPICS;
	window.DataAPI.addTopic = addTopic;
	window.DataAPI.addQuiz = addQuiz;
	window.DataAPI.getTopics = getTopics;
	window.DataAPI.getQuizzes = getQuizzes;
	window.DataAPI.bind = bindData;

	/***************************
	 * Initialization
	 ***************************/

	let m_topics = localStorage.getItem( TOPICS );
	if( m_topics === null ) {
		m_topics = [];
	} else {
		m_topics = JSON.parse( m_topics );
	}

	let m_quizzes = localStorage.getItem( QUIZZES );
	if( m_quizzes === null ) {
		m_quizzes = {};
	} else {
		m_quizzes = JSON.parse( m_quizzes );
	}

	let m_keywords = localStorage.getItem( KEYWORDS );
	if( m_keywords === null ) {
		m_keywords = [];
	} else {
		m_keywords = JSON.parse( m_keywords );
	}

	let m_dataBinds = {};
	m_dataBinds[ TOPICS ] = [];

	/**************************
	 * Private Methods
	 ***************************/

	function addQuiz( topic, questions, answers, keywords ) {

		// Create the quiz
		let quiz = {
			"id": crypto.randomUUID(),
			"questions": questions,
			"answers": answers,
			"keywords": keywords
		};
		m_quizzes[ quiz.id ] = quiz;

		// Add quiz to topic
		topic.quizzes.push( quiz.id );

		// Add quiz to keywords list
		for( let i = 0; i < m_keywords.length; i += 1 ) {
			if( !m_keywords[ keywords[ i ] ] ) {
				m_keywords[ keywords[ i ] ] = [];
			}
			m_keywords[ keywords[ i ] ].push( quiz.id );
		}

		saveAll();
	}

	function addTopic( title, description ) {
		let topic = {
			"title": title,
			"description": description,
			"quizzes": []
		};
		m_topics.push( topic );
		saveAll();
	}

	function getTopics() {
		return m_topics;
	}

	function getQuizzes( topic ) {
		return topic.quizzes.map( quizId => m_quizzes[ quizId ] );
	}

	function bindData( dataName, callback ) {
		m_dataBinds[ dataName ].push( callback );
		renderData();
	}

	function saveAll() {
		localStorage.setItem( TOPICS, JSON.stringify( m_topics ) );
		localStorage.setItem( QUIZZES, JSON.stringify( m_quizzes ) );
		localStorage.setItem( KEYWORDS, JSON.stringify( m_keywords ) );
		renderData();
	}

	function renderData() {
		Object.keys( m_dataBinds ).forEach( dataKey => {
			const dataItems = m_dataBinds[ dataKey ];
			for( let i = 0; i < dataItems.length; i += 1 ) {
				dataItems[ i ]( getTopics() );
			}
		} );
	}

})();

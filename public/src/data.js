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
	window.DataAPI.deleteTopic = deleteTopic;
	window.DataAPI.deleteQuiz = deleteQuiz;
	window.DataAPI.updateTopic = updateTopic;
	window.DataAPI.createQuiz = createQuiz;
	window.DataAPI.saveQuiz = saveQuiz;
	window.DataAPI.getTopics = getTopics;
	window.DataAPI.getTopic = getTopic;
	window.DataAPI.getQuizzes = getQuizzes;
	window.DataAPI.bind = bindData;

	/***************************
	 * Initialization
	 ***************************/

	// Load data from local storage
	let m_topics = getStoredItem( TOPICS, [] );
	let m_quizzes = getStoredItem( QUIZZES, {} );
	let m_keywords = getStoredItem( KEYWORDS, [] );

	// Create a databinds table
	let m_dataBinds = {};
	m_dataBinds[ TOPICS ] = [];

	/**************************
	 * Private Methods
	 ***************************/

	function getStoredItem( item, def ) {
		const storedText = localStorage.getItem( item );
		if( storedText === null ) {
			return def;
		}
		return JSON.parse( storedText );
	}

	function saveQuiz( topicId, quiz ) {

		// Create a new quiz
		if( quiz.id === "new" ) {
			quiz = structuredClone( quiz );
			quiz.id = crypto.randomUUID();
			const topic = m_topics.find( t => t.id === topicId );
			topic.quizzes.push( quiz.id );
		}
		m_quizzes[ quiz.id ] = quiz;

		saveAll();
	}

	function deleteQuiz( topicId, quiz ) {
		const topic = m_topics.find( t => t.id === topicId );
		const quizIndex = topic.quizzes.findIndex( q => q.id === quiz.id );
		topic.quizzes.splice( quizIndex, 1 );
		delete m_quizzes[ quiz.id ];
		saveAll();
	}

	function createQuiz() {
		const quiz = {
			"id": "new",
			"title": "",
			"questions": []
		};
		return quiz;
	}

	function addTopic( title, description ) {
		let topic = {
			"id": crypto.randomUUID(),
			"title": title,
			"description": description,
			"quizzes": []
		};
		m_topics.push( topic );
		saveAll();
	}

	function deleteTopic( topic ) {
		const index = m_topics.findIndex( t => t.id === topic.id );
		if( index > -1 ) {
			m_topics.splice( index, 1 );
			saveAll();
		}
	}

	function updateTopic( topic, title, description ) {
		const index = m_topics.findIndex( t => t.id === topic.id );
		if( index > -1 ) {
			m_topics[ index ].title = title;
			m_topics[ index ].description = description;
			saveAll();
		}
	}

	function getTopics() {
		return m_topics.map( topic => {
			return {
				"id": topic.id,
				"title": topic.title,
				"description": topic.description,
				"quizzes": getQuizzes( topic )
			};
		} );
	}

	function getTopic( topicId ) {
		const topic = m_topics.find( t => t.id === topicId );
		return {
			"id": topic.id,
			"title": topic.title,
			"description": topic.description,
			"quizzes": getQuizzes( topic )
		};
	}

	function getQuizzes( topic ) {
		return topic.quizzes.map( quizId => {
			return {
				"id": m_quizzes[ quizId ].id,
				"title": m_quizzes[ quizId ].title,
				"questions": getQuestions( m_quizzes[ quizId ] )
			};
		} );
	}

	function getQuestions( quiz ) {
		return quiz.questions.map( question => {
			return {
				"text": question.text,
				"answers": question.answers.slice()
			};
		} );
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

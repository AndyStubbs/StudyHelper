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

	let createNewTopicModal = null;

	/**************************
	 * API Methods
	 ***************************/

	window.Main.init = function () {
		setupEventListeners();
		DataAPI.bind( window.DataAPI.TOPICS, topics => renderTopics( topics ) );
	};

	/**************************
	 * Private Methods
	 ***************************/

	function setupEventListeners() {
		document.getElementById( "create-topic-btn" ).addEventListener( "click", showCreateTopicModal );
		document.getElementById( "search-input" ).addEventListener( "input", handleSearch );
	}

	function renderTopics( topics ) {
		const container = document.getElementById( "topics-container" );
		container.innerHTML = "";

		topics.forEach( ( topic ) => {
			const topicBox = Comp.TopicBox( topic );
			container.appendChild( topicBox );
		} );

		if ( container.scrollHeight > container.clientHeight ) {
			container.style.paddingRight = "8px";
		} else {
			container.style.paddingRight = "";
		}
	}

	function handleSearch( event ) {
		const searchTerm = event.target.value.toLowerCase();
		const topicBoxes = document.querySelectorAll(".topic-box");

		topicBoxes.forEach( ( box ) => {
			const title = box.querySelector( "h3" ).textContent.toLowerCase();
			const description = box.querySelector( "p" ).textContent.toLowerCase();

			if ( title.includes( searchTerm ) || description.includes( searchTerm ) ) {
				box.style.display = "block";
			} else {
				box.style.display = "none";
			}
		} );
	}

	function showCreateTopicModal() {
		if( createNewTopicModal === null ) {
			createNewTopicModal = Comp.Modal(
				window.Comp.CreateNewTopic( null, closeCreateTopicModal ),
				closeCreateTopicModal
			);
			document.getElementById( "modals-container" ).appendChild( createNewTopicModal );
		} else {
			createNewTopicModal.style.display = "block";
		}
	}

	function closeCreateTopicModal() {
		createNewTopicModal.style.display = "none";
		return false;
	}

})();

document.addEventListener( "DOMContentLoaded", window.Main.init );

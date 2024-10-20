"use strict";

/***************************************************************************************************
 *	createTopic.js
 *
 *	This file creates template for the create new topic modal window.
 *
 ***************************************************************************************************/

( function () {

	window.Comp.CreateNewTopic = createNewTopic;

	let div = null;

	function createNewTopic( onSubmit ) {
		if( div === null ) {
			div = document.createElement( "div" );
		} else {
			return div;
		}
		div.classList.add( "create-new-topic" );
		div.innerHTML = `
			<h2>Create New Topic</h2>
			<form class="create-topic-form">
				<input type="text" class="topic-title" placeholder="Topic Title" />
				<textarea
					class="topic-description"
					placeholder="Topic Description"
				></textarea>
				<button class="submit-topic" type="submit">Create Topic</button>
				<button class="cancel-topic" type="button">Cancel</button>
			</form>
		`;
		div.querySelector( ".submit-topic" ).addEventListener( "click", ( e ) => submitTopicButton( e, div, onSubmit ) );
		div.querySelector( ".cancel-topic" ).addEventListener( "click", () => cancel( onSubmit ) );
		return div;
	}

	function submitTopicButton( e, div, onSubmit ) {
		e.preventDefault();
		const titleDiv = div.querySelector( ".topic-title" );
		const descDiv = div.querySelector( ".topic-description" );
		const title = titleDiv.value;
		const description = descDiv.value;
		if( title === "" ) {
			titleDiv.classList.add( "invalid" );
			titleDiv.placeholder = "Please enter a title for the topic.";
		}
		if( description === "" ) {
			descDiv.classList.add( "invalid" );
			descDiv.placeholder = "Please enter a description for the topic.";
		}
		console.log( title, description );
		if( title === "" || description === "" ) {
			return;
		}
		DataAPI.addTopic( title, description );
		onSubmit();
		titleDiv.value = "";
		descDiv.value = "";
	}

	function cancel( onSubmit ) {
		const titleDiv = div.querySelector( ".topic-title" );
		const descDiv = div.querySelector( ".topic-description" );
		titleDiv.placeholder = "Topic Title";
		titleDiv.classList.remove( "invalid" );
		descDiv.placeholder = "Topic Description";
		descDiv.classList.remove( "invalid" );
		onSubmit();
	}

})();

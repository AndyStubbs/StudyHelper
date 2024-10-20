"use strict";

/***************************************************************************************************
 *	createTopic.js
 *
 *	This file creates template for the create new topic modal window.
 *
 ***************************************************************************************************/

( function () {

	window.Comp.CreateNewTopic = createNewTopic;

	function createNewTopic( topic, closeTopic ) {
		let div = document.createElement( "div" );
		let title = "Edit Topic";
		let createBtnText = "Update Topic";
		let deleteBtnContent = `<button class="delete-topic" type="button">Delete</button>`;
		let topicTitle = "";
		let topicDescription = "";
		if( topic === null ) {
			isUpdate = false;
			title = "Create New Topic";
			createBtnText = "Create Topic";
			deleteBtnContent = "";
		} else {
			topicTitle = topic.title;
			topicDescription = topic.description;
		}
		div.classList.add( "create-new-topic" );
		div.innerHTML = `
			<h2>${title}</h2>
			<form class="create-topic-form">
				<input type="text" class="topic-title" placeholder="Topic Title" value="${topicTitle}"/>
				<textarea
					class="topic-description"
					placeholder="Topic Description"
				>${topicTitle}</textarea>
				<div class="btn-container">
					<button class="submit-topic" type="submit">${createBtnText}</button>
					${deleteBtnContent}
					<button class="cancel-topic" type="button">Cancel</button>
				</div>
			</form>
		`;
		div.querySelector( ".submit-topic" ).addEventListener( "click", ( e ) => submitTopicButton( e, div, closeTopic, topic ) );
		div.querySelector( ".cancel-topic" ).addEventListener( "click", () => cancel( div, closeTopic ) );
		let deleteBtn = div.querySelector( ".delete-topic" );
		if( deleteBtn ) {
			deleteBtn.addEventListener( "click", () => {
				DataAPI.deleteTopic( topic );
				closeTopic();
			} );
		}
		return div;
	}

	function submitTopicButton( e, div, closeTopic, topic ) {
		e.preventDefault();
		const titleDiv = div.querySelector( ".topic-title" );
		const descDiv = div.querySelector( ".topic-description" );
		const title = titleDiv.value;
		const description = descDiv.value;
		if( title === "" ) {
			titleDiv.classList.add( "invalid" );
			titleDiv.placeholder = "Please enter a title for the topic.";
		}
		if( title === "" ) {
			return;
		}
		if( topic ) {
			DataAPI.updateTopic( topic, title, description );
		} else {
			DataAPI.addTopic( title, description );
		}
		closeTopic();
		titleDiv.value = "";
		descDiv.value = "";
	}

	function cancel( div, closeTopic ) {
		const titleDiv = div.querySelector( ".topic-title" );
		const descDiv = div.querySelector( ".topic-description" );
		titleDiv.placeholder = "Topic Title";
		titleDiv.classList.remove( "invalid" );
		descDiv.placeholder = "Topic Description";
		descDiv.classList.remove( "invalid" );
		closeTopic();
	}

} )();

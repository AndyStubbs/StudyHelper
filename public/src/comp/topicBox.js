"use strict";

/***************************************************************************************************
 *	topicBox.js
 *
 *	This file displays the current topic
 *
 ***************************************************************************************************/

( function () {

	window.Comp.TopicBox = topicBox;

	function topicBox( topic ) {
		let div = document.createElement( "div" );
		div.classList.add( "topic-box" );
		div.innerHTML = `
			<h3>${topic.title}</h3>
			<p>${topic.description}&nbsp;</p>
			<div class="btn-container">
				<button class="study-topic-btn" type="button">Study</button>
				<button class="edit-topic-btn" type="button">Edit</button>
			</div>
		`;
		div.querySelector( ".study-topic-btn" ).addEventListener( "click", ( e ) => studyBtnClick() );
		div.querySelector( ".edit-topic-btn" ).addEventListener( "click", () => editBtnClick( topic ) );
		return div;
	}

	function studyBtnClick() {

	}

	function editBtnClick( topic ) {
		let editModal = Comp.Modal( window.Comp.CreateNewTopic( topic, () => closeEditModal( editModal ) ), closeEditModal );
		document.getElementById( "modals-container" ).appendChild( editModal );
	}

	function closeEditModal( div ) {
		div.remove();
		return false;
	}

} )();

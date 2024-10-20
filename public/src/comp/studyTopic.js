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
		let div = document.createElement( "div" );
		div.classList.add( "edit-topic" );
		div.innerHTML = `
			
		`;
		//div.querySelector( ".study-topic-btn" ).addEventListener( "click", ( e ) => studyBtnClick() );
		//div.querySelector( ".edit-topic-btn" ).addEventListener( "click", () => editBtnClick() );
		return div;
	}

	function studyBtnClick() {

	}

	function editBtnClick() {

	}

})();

"use strict";

/***************************************************************************************************
 *	modal.js
 *
 *	This file creates the component for creating a modal window
 *
 ***************************************************************************************************/

( function () {

	window.Comp.Modal = modal;

	function modal( body, handleClose ) {
		let div = document.createElement( "div" );
		div.classList.add( "modal" );
		div.innerHTML = `
			<div class="modal-content">
				<span class="close">&times;</span>
				<div class="modal-body"></div>
			</div>
		`;
		div.querySelector( ".modal-body" ).appendChild( body );
		div.querySelector( ".close" ).addEventListener( "click", () => closeModal( div, handleClose ) );
		return div;
	}

	function closeModal( div, handleClose ) {
		if( typeof handleClose === "function" && !handleClose( div ) ) {
			return;
		}
		div.remove();
	}

} )();

;(function($, ctrl){
'use strict';

	/* Get answers and comments from JSON */
	/* 1st elements of commentMessage is comment on right answer, other - on false ones */

	// var commentMessage = ctrl.structure.pages[ctrl.bookmark].messages;

	/* Get info from DOM */

	var imgList = $(parent.frames['myframe'].document).find('.img-item');
	var textList = $(parent.frames['myframe'].document).find('.img-text');

	var audio = document.querySelector('.pageAudio');

	function pagePlay() {
		$('.audioCtrl_slider').slider('value', ctrl.volume*100).slider('enable');
		$('.audioCtrl_soundBtn').removeClass('disabled');
		audio.volume = ctrl.volume;
		audio.play();
	}

	ctrl.coursePage = {
		play: function() {
			pagePlay();
		},
		stop: function(){
			ctrl.coursePage = null;
		},
		restart: function(){
			// btnRestartHandler()
		},
		soundCtrl: function(command, val) {
			switch(command) {
				case 'play':
					audio.play();
					break;
				case 'pause':
					audio.pause();
					break;
				case 'volume':
				console.log('sound lvl = ',val)
					if (val == 0) {
						ctrl.volume = audio.volume = 0;
					} else {
						ctrl.volume = audio.volume = val/100;
					}
					
					break;
			}
		}
	}
})(parent.jQuery, parent.ctrl);
parent.ctrl.coursePage.play();
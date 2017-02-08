;(function($, ctrl){
'use strict';
	
	var pageDocument = $(parent.frames['myframe'].document),
		restartBtn = pageDocument.find('#test-restartBtn');

	//var currentQuest = 0;	// текущий номер вопроса

	function init() {
		// init btns
		restartBtn.on('click', restart);

		ctrl.makeMeTestQuestionList();
		ctrl.makeTask(window.document, ctrl.currentQuest);
	}

	function destroy() {
		restartBtn.off('click');
	}

	function restart() {
		ctrl.makeMeTestQuestionList();
		ctrl.makeTask(window.document, ctrl.currentQuest);
	}

	ctrl.coursePage = {
		play: function() {
			init();
		},
		stop: function(){
			destroy();
			ctrl.coursePage = null;
		},
		restart: function(){
			restart();
		}
	}
})(parent.jQuery, parent.ctrl);
parent.ctrl.coursePage.play();
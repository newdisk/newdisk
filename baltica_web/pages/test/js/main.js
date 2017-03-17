;(function($, ctrl){
'use strict';
	
	var pageDocument = $(parent.frames['myframe'].document),
		restartBtn = pageDocument.find('#test-restartBtn'),
		startBtn = pageDocument.find('.test-startBtn')

	//var currentQuest = 0;	// текущий номер вопроса

	function init() {
		// init btns
		restartBtn.on('click', restart);
		startBtn.on('click', showTest)

		ctrl.makeMeTestQuestionList();
		pageDocument.find('.pre-test_text__questions-quantity').text(ctrl.questionList.length)
	}

	function showTest() {
		pageDocument.find('.pre-test').css({'display':'none'})
		ctrl.makeTask(window.document, ctrl.currentQuest);
		pageDocument.find('#task-container').css({'display':'block'})
	}

	function destroy() {
		restartBtn.off('click');
		startBtn.off('click');
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
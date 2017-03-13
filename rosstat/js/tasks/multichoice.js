;(function($, ctrl, _){
'use strict';
	
	var pageDocument = $(parent.frames['myframe'].document),
		taskBody = pageDocument.find('#task-body'),
		itemList;

	var answersList = ctrl.structure.pages[ctrl.bookmark].answers,
		comments = ctrl.structure.pages[ctrl.bookmark].messages;

	var ansBtn = pageDocument.find('#btn--answer'),
		restartBtn = pageDocument.find('#btn--restart');

	var taskType = pageDocument.find('#task-container').attr('class') // ожидается multichoice или singlechoice
	

	// попытка №...
	var attemptNum = 1,
		score = 0,
		status = -1,
		msg = '',
		lastTry = false,
		answered = false;

	function buildTask() {
		ansBtn.on('click', checkAnswer).addClass('disabled').attr('disabled', true);
		restartBtn.on('click', restart);

		var tmpStr = ''
		
		answersList = _.shuffle(answersList);
		for (var i = 0; i < answersList.length; i++) {
			tmpStr += '<div class="page__item-wrapper1"><div class="page__item-wrapper2"><div class="page__item" right="'+answersList[i].right+'"><div class="page__item-before"></div><p>'+answersList[i].label+'</p>';
			if (answersList[i].image.length > 0) {
				tmpStr += '<img src="'+answersList[i].image+'" class="page__item-wrapper--image"></div></div></div>';
			} else {
				tmpStr += '</div></div></div>';
			}
	    }
	    taskBody.empty().append(tmpStr);

	    itemList = pageDocument.find('.page__item');
	    itemList.on('click', onItemClick);
	}

	function onItemClick(e) {

		if (!answered) {
			ansBtn.attr('disabled',false).removeClass('disabled');
		} else {
			return;
		}

		if (taskType == 'singlechoice') {

	        itemList.removeClass('selected');
	        $(this).addClass('selected');

	      } else {

	        if ($(this).hasClass('selected')) {
	          $(this).removeClass('selected');
	        } else {
	          $(this).addClass('selected');
	        }

	      }

	    var justAnswered = false;
	    itemList.each(function(i,v) {
	        if($(v).hasClass('selected')) {
	          justAnswered = true;
	        }
	    })
    	if (justAnswered) {
    		ansBtn.attr('disabled',false).removeClass('disabled');
    	} else {
    		ansBtn.attr('disabled',true).addClass('disabled');
    	}
    }
	

	function destroy() {
		ansBtn.off('click');
		restartBtn.off('click');
		itemList.off('click');
	}

	function restart() {
		
		answered = false;

		destroy();
		buildTask();
	}

	function checkAnswer() {

		answered = true;

		itemList.addClass('disabled');
		ansBtn.attr('disabled',true).addClass('disabled');

		var checker = true;
		var userAnswer = 0;
		var rightAnswer = 0;
		itemList.each(function (i,v) {
			if ($(v).attr('right') === 'true') {
				rightAnswer++;
			}
			if ($(v).hasClass('selected') && $(v).attr('right') !== 'true') {
				checker = false;
			}
			if ($(v).hasClass('selected') && $(v).attr('right') === 'true') {
				userAnswer++;
			}
		})

		if (checker && userAnswer == rightAnswer) {
			status = 1;
			score = 100;
			msg = comments[0];
			showRight();
			// ctrl.sendResult(1, 100, comments[0], false)
		} else {
			// ctrl.sendResult(-1, 0, comments[attemptNum], false)
			status = -1;
			score = 0;
			msg = comments[attemptNum];
			attemptNum++;

			if (attemptNum == comments.length) {
				score = 2;
				attemptNum = 1;
				lastTry = true;
				showRight();
			}
		}
		ctrl.sendResult(status, score, msg, lastTry)
	}

	/**
	*	Показывает правильные ответы,
	*	им присваевается класс, который можно стилизовать CSS
	*/
	function showRight() {
		itemList.each(function(i,v){
			$(v).removeClass('selected');
			if ($(v).attr('right') == 'true') {
				$(v).addClass('show-right');
			}
		})
	}


	ctrl.coursePage = {
		play: function() {
			buildTask();
		},
		stop: function(){
			destroy();
			ctrl.coursePage = null;
		},
		restart: function(){
			restart();
		}
	}
})(parent.jQuery, parent.ctrl, parent._);
parent.ctrl.coursePage.play();
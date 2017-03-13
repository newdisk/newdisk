;(function($, ctrl){
'use strict';

	/* Get comments and answers from JSON */
	/* 1st elements of commentMessage is comment on right answer, other - on false ones */
	var commentMessage = ctrl.structure.pages[ctrl.bookmark].messages;
	var rightAnswer = ctrl.structure.pages[ctrl.bookmark].answers;

	var blockList = $(parent.frames['myframe'].document).find('.single-choice__wrapper');
	var textList = $(parent.frames['myframe'].document).find('.single-choice__text');
	var variants = [];

	for (var i = 0; i < textList.length; i++) {
		variants[i] = {};
		variants[i].text = textList[i].innerText;
		variants[i].id = $(blockList[i]).prop('id');
	}

	var selectElem;

	var btnAns = $(parent.frames['myframe'].document).find('.btn--answer');
	var btnRestart = $(parent.frames['myframe'].document).find('.btn--restart');
	btnAns.attr('disabled',true)
			 .addClass('btn--disabled');

	var textContent = $(parent.frames['myframe'].document).find('.single-choice__text')
	textContent.on('click',enter);
	var radioBtn = $(parent.frames['myframe'].document).find('.single-choice__radio')
	radioBtn.on('click',enter);
	btnAns.on("click", btnAnsHandler);
	btnRestart.on("click", btnRestartHandler);

	function enter(e) {
		if (btnAns.prop('disabled') === true) {
			btnAns.attr('disabled',false)
				  .removeClass('btn--disabled');
		}

		if (selectElem !== undefined && selectElem.innerText !== e.target.innerText) {
			$(selectElem).find('.single-choice__radio').removeClass("selected").attr('style','');
			$(selectElem).find('.single-choice__text').attr('style','');
		};

		selectElem = e.target.parentNode;
		$(selectElem).find('.single-choice__radio').addClass("selected");
	}

	function btnAnsHandler() {
		btnAns.attr('disabled',true)
			   .addClass('btn--disabled');
			   
		var index = $(selectElem).prop('id');
		if (index == rightAnswer) {
			$(selectElem).find('.single-choice__radio').attr('style','background-position: 0 -72px');
			$(selectElem).find('.single-choice__text').attr('style','color: #4B9968;');
			return ctrl.sendResult(1,100,'<p class="feedback__text">' + commentMessage[index - 1] + '</p>')
		} else {
			return ctrl.sendResult(-1,0,'<p class="feedback__text">' + commentMessage[index - 1] + '</p>');
		}
	}

	function btnRestartHandler() {
		btnAns.attr('disabled',true)
				 .addClass('btn--disabled');
		$(selectElem).find('.single-choice__radio').removeClass("selected").attr('style','');
		$(selectElem).find('.single-choice__text').attr('style','');
		selectElem = '';
		for (var i = variants.length - 1; i > 0; i--) {
			var num = Math.floor(Math.random() * (i + 1));

			var d = variants[num].text;
			variants[num].text = variants[i].text;
			variants[i].text = d;

			var f = variants[num].id;
			variants[num].id = variants[i].id;
			variants[i].id = f;
		};

		for (var i = 0; i < blockList.length; i++) {
			$(blockList[i]).attr('id',variants[i].id);
			textList[i].innerHTML = variants[i].text;
		}
	}

ctrl.coursePage = {
	play: function() {
		btnRestartHandler();
	},
	stop: function(){
		textContent.off('click');
		radioBtn.off('click');
		btnAns.off("click");
		btnRestart.off("click");
		ctrl.coursePage = null;
	},
	restart: function(){
		btnRestartHandler()
	}
}
})(parent.jQuery, parent.ctrl);
parent.ctrl.coursePage.play();
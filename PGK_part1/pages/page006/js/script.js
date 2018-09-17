;(function($, ctrl){
'use strict';

	/* Get answers and comments from JSON */
	/* 1st elements of commentMessage is comment on right answer, other - on false ones */

	var rightAnswer = ctrl.structure.pages[ctrl.bookmark].answers;
	var commentMessage = ctrl.structure.pages[ctrl.bookmark].messages;

	/* Get info from DOM */

	var imgList = $(parent.frames['myframe'].document).find('.img-item');
	var textList = $(parent.frames['myframe'].document).find('.img-text');

	var cards = {
		text: [],
		src: []
	}
	for (var i = 0; i < imgList.length; i++) {
		cards.text[i] = textList[i].innerText;
		cards.src[i] = $(imgList[i]).prop('src');
	}

	var numAttempt = 0;
	var selectElem;
	var btnAns = $(parent.frames['myframe'].document).find('.btn--answer');
	var btnRestart = $(parent.frames['myframe'].document).find('.btn--restart');
	btnAns.attr('disabled',true)
			 .addClass('btn--disabled');

	var textImg = $(parent.frames['myframe'].document).find('.img-text');
	textImg.on('click',enter);
	var radioImg = $(parent.frames['myframe'].document).find('.img-top__radio');
	radioImg.on('click',enter);
	btnAns.on("click", btnAnsHandler);
	btnRestart.on("click", btnRestartHandler);

	function enter(e) {
		if (btnAns.prop('disabled') === true) {
			btnAns.attr('disabled',false)
				  .removeClass('btn--disabled');
		}

		if (selectElem !== undefined && selectElem.innerText !== e.target.innerText) {
			$(selectElem).attr('style','').find('.img-top__radio').removeClass("selected");
			$(selectElem).find('.img-top__radio').attr('style', '');
		};

		selectElem = e.target.parentNode;
		$(selectElem).find('.img-top__radio').addClass("selected");
	}

	function btnAnsHandler() {
		numAttempt++;
		btnAns.attr('disabled',true)
			   .addClass('btn--disabled');
		if ($.trim(selectElem.innerText) === $.trim(rightAnswer[0])) {
			numAttempt = 0;
			$(selectElem).attr('style','color: #4B9968');
			$(selectElem).find('.img-top__radio').attr('style', 'background-position: 0 -72px');
			return ctrl.sendResult(1,100,'<p class="feedback__text">' + commentMessage[0] + '</p>')
		} else {
			if (numAttempt !== 3) {
				return ctrl.sendResult(-1,0,'<p class="feedback__text">' + commentMessage[numAttempt] + '</p>');
			} else {
				for (var i = 0; i < textList.length; i++) {
					var button = $(textList[i].parentNode).find('.img-top__radio');
					button.removeClass('selected');
					if ($.trim(button.context.innerText) === $.trim(rightAnswer[0])) {
						button.addClass('selected');
						selectElem = textList[i].parentNode;
					};
				}
				$(selectElem).attr('style','color: #4B9968');
				$(selectElem).find('.img-top__radio').attr('style', 'background-position: 0 -72px');
				numAttempt = 0;
				return ctrl.sendResult(1,0,'<p class="feedback__text">' + 
					commentMessage[3] + '</p>',true);
			}
		}
	}

	function btnRestartHandler() {
		btnAns.attr('disabled',true)
				 .addClass('btn--disabled');
		$(selectElem).attr('style','');
		$(selectElem).find('.img-top__radio').attr('style', '').removeClass("selected");
		selectElem = '';
		for (var i = cards.src.length - 1; i > 0; i--) {
			var num = Math.floor(Math.random() * (i + 1));

			var d = cards.src[num];
			cards.src[num] = cards.src[i];
			cards.src[i] = d;

			var f = cards.text[num];
			cards.text[num] = cards.text[i];
			cards.text[i] = f;
		};

		for (var i = 0; i < imgList.length; i++) {
			$(imgList[i]).attr('src',cards.src[i]);
			textList[i].innerHTML = cards.text[i];
			if ($.trim(cards.text[i]) === 'отсутствие порядочности и честности.') {
				textList[i].className = 'img-text img-text__one-line';
			} else {
				textList[i].className = 'img-text';
			}
		}
	}

	ctrl.coursePage = {
		play: function() {
			//
		},
		stop: function(){
			textImg.off('click');
			radioImg.off('click');
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
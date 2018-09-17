;(function($, ctrl){
'use strict';

	var btnYes = $(parent.frames['myframe'].document).find('.btn--yes');
	var btnNo = $(parent.frames['myframe'].document).find('.btn--no');

	btnYes.attr('disabled',true);
	btnNo.attr('disabled',true);
	
	var animateList = $(parent.frames['myframe'].document).find('.animate');
	animateList.animate({opacity:0},0);
	for (var i = 0; i < animateList.length; i++) {
		$(animateList[i]).animate({opacity: 0},0).delay(1000*(i+1)).animate({opacity: 1},500);
	} 

	setTimeout(function(){
		btnYes.attr('disabled',false).removeClass('btn-disabled');
		btnNo.attr('disabled',false).removeClass('btn-disabled');
	},1000*animateList.length);

	btnYes.on('click',clickYes);
	btnNo.on('click',clickNo);

	function clickYes() {
		$(parent.frames['myframe'].document).find('.page__wrapper').removeClass('invisible');
		$(parent.frames['myframe'].document).find('.page__yes-block').removeClass('invisible');
		$(parent.frames['myframe'].document).find('.page__no-block').addClass('invisible');
	}

	function clickNo() {
		$(parent.frames['myframe'].document).find('.page__wrapper').removeClass('invisible');
		$(parent.frames['myframe'].document).find('.page__no-block').removeClass('invisible');
		$(parent.frames['myframe'].document).find('.page__yes-block').addClass('invisible');
	}

	ctrl.coursePage = {
		play: function() {

		},
		stop: function(){
			animateList.finish();
			btnYes.off('click');
			btnNo.off('click');
			ctrl.coursePage = null;
		}
	}
})(parent.jQuery, parent.ctrl);
parent.ctrl.coursePage.play();
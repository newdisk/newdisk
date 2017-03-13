;(function($, ctrl){
'use strict';

	/* Get comments from JSON */
	var commentMessage = ctrl.structure.pages[ctrl.bookmark].messages;
	var rightAnswer = ctrl.structure.pages[ctrl.bookmark].answers;

	var numClick = 0;
	var arrow = $(parent.frames['myframe'].document).find('.slide-block__arrow');
	arrow.on('click',btnArrowClicker);
	var sliderLine = $(parent.frames['myframe'].document).find('.slide-block__toggle');

	function btnArrowClicker(e) {
		if ($(arrow).hasClass('active')) {
			$(parent.frames['myframe'].document).find('.slide-block').slideDown();
			$(arrow).removeClass('active');
			$(sliderLine).removeClass('activated');
			$(parent.frames['myframe'].document).find('.dialog__wrapper').attr('style','display: none');
		} else {
			$(parent.frames['myframe'].document).find('.slide-block').slideUp();
			$(arrow).addClass('active');
			$(sliderLine).addClass('activated');
			$(parent.frames['myframe'].document).find('.dialog__wrapper').removeAttr('style');
		}
		if (numClick === 0) {
			animateThis();
		}; 
		numClick++;
	}

	function animateThis() {
		var animateList = $(parent.frames['myframe'].document).find('.animate');
		if (animateList.length !== 0) {
			for (var i = 0; i < animateList.length; i++){
				$(animateList[i]).animate({opacity: 0},0).delay(2000*(i+1)).animate({opacity: 1},500);
			}
		}
	}

	var itemList = $(parent.frames['myframe'].document).find('.item');
	itemList.draggable({
		zIndex: 2,
		containment: 'document',
		revert: true
	});

	var basketsList = $(parent.frames['myframe'].document).find(".basket");
	basketsList.droppable({
	    drop: handleDropEvent
	});

	var cloneDrag;
	var draggable;

	var btnRestart = $(parent.frames['myframe'].document).find('.btn--restart');
	btnRestart.on("click", btnRestartHandler);

	function handleDropEvent( event, ui ) {
	  draggable = ui.draggable;
	  cloneDrag = $(draggable[0]).clone()
	  								 .addClass('clone')
	  								 .appendTo($(parent.frames['myframe'].document).find('.dialog__wrapper'));
	  draggable.addClass('unvisible'); 
	  var basket = $(basketsList[0]).find('.dialog__item');
	  var clone = $(cloneDrag[0]).find('.dialog__item');
	  clone.context.style.position = 'absolute';
	  clone.context.style.top = basket.offset().top + 'px';
	  clone.context.style.left = basket.offset().left + 'px';

	  if ($(draggable).attr('id') == rightAnswer) {
	  	ctrl.sendResult(1,100,'<p class="feedback__text">' + commentMessage[parseFloat($(draggable).attr('id')) - 1] + '</p>')
	  } else {
	  	ctrl.sendResult(-1,0,'<p class="feedback__text">' + commentMessage[parseFloat($(draggable).attr('id')) - 1] + '</p>')
	  }
	  itemList.draggable({disabled: true});
	}

	function btnRestartHandler() {
		$(cloneDrag).remove();
		$(draggable).removeClass('unvisible'); 
		itemList = $(parent.frames['myframe'].document).find('.item');
		var numArray = [];
		for (var i = 0; i < itemList.length; i++) {
			if (Math.random() < 0.5 && i !== 0) {
				var d = $(itemList[i]).attr('src');
				var f = $(itemList[i]).attr('id');
				$(itemList[i]).attr('src',$.trim($(itemList[i-1]).attr('src'))).attr('id',$.trim($(itemList[i-1]).attr('id')));
				$(itemList[i-1]).attr('src',$.trim(d)).attr('id',$.trim(f));
			} else if(i !== itemList.length - 1) {
				var d = $(itemList[i]).attr('src');
				var f = $(itemList[i]).attr('id');
				$(itemList[i]).attr('src',$.trim($(itemList[i+1]).attr('src'))).attr('id',$.trim($(itemList[i+1]).attr('id')));
				$(itemList[i+1]).attr('src',$.trim(d)).attr('id',$.trim(f));
			};
		}

		itemList.draggable({disabled: false});
		itemList.load();
	}

ctrl.coursePage = {
	play: function() {
		btnRestartHandler()
	},
	stop: function(){
		$(arrow).off('click');
		btnRestart.off('click');
		itemList.draggable("destroy");
		basketsList.droppable("destroy");
		ctrl.coursePage = null;
	},
	restart: function(){
		btnRestartHandler()
	}
}
})(parent.jQuery, parent.ctrl);
parent.ctrl.coursePage.play();
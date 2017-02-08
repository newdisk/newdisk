;(function($, ctrl){
'use strict';

	/* Get comments form JSON */
	/* 1st elements of commentMessage is comment on right answer, other - on false ones */
	var commentMessage = ctrl.structure.pages[ctrl.bookmark].messages;

	var cards = [
		{
			src: "img/36_1.png",
			alt: "Набор бокалов",
			status: "Подарок"
		},{
			src: "img/36_2.png",
			alt: "Ежедневник",
			status: "Подарок"
		},
		{
			src: "img/36_3.png",
			alt: "Флеш-карта памяти",
			status: "Подарок"
		},
		{
			src: "img/36_4.png",
			alt: "Книга в кожаном переплете",
			status: "Подарок"
		},{
			src: "img/36_5.png",
			alt: "Набор канцелярских принадлежностей",
			status: "Подарок"
		},{
			src: "img/36_6.png",
			alt: "Бутылка хорошего алкоголя",
			status: "Подарок"
		},
		{
			src: "img/36_7.png",
			alt: "Билеты в Большой театр",
			status: "Подарок"
		},
		{
			src: "img/36_8.png",
			alt: "Корзина с фруктами",
			status: "Подарок"
		},{
			src: "img/36_9.png",
			alt: "Билеты на финал ЧМ по футболу",
			status: "Подкуп"
		},{
			src: "img/36_10.png",
			alt: "Щенок борзой",
			status: "Подкуп"
		},
		{
			src: "img/36_11.png",
			alt: "Годовая карта в фитнес-клуб",
			status: "Подкуп"
		},
		{
			src: "img/36_12.png",
			alt: "Прогулочная яхта",
			status: "Подкуп"
		},{
			src: "img/36_13.png",
			alt: "Золотые запонки",
			status: "Подкуп"
		},{
			src: "img/36_14.png",
			alt: "Портфель из кожи крокодила",
			status: "Подкуп"
		},
		{
			src: "img/36_15.png",
			alt: "Туристическая путевка в Майами",
			status: "Подкуп"
		},
		{
			src: "img/36_16.png",
			alt: "Шахматы из слоновой кости",
			status: "Подкуп"
		}
	]

	var giftList = [];
	var bribeList = [];
	var numberGift = 0;
	var numberBribe = 0;
	for (var i = 0; i < cards.length; i++) {
		if (cards[i]['status'] === "Подарок") {
			giftList[numberGift] = {};
			giftList[numberGift].src = cards[i].src;
			giftList[numberGift].alt = cards[i].alt;
			giftList[numberGift].status = cards[i].status;
			numberGift++;
		} else {
			bribeList[numberBribe] = {};
			bribeList[numberBribe].src = cards[i].src;
			bribeList[numberBribe].alt = cards[i].alt;
			bribeList[numberBribe].status = cards[i].status;
			numberBribe++;
		}
	}

	/* Create array with data about draggable cards */

	var imgList = [];
	createArr();

	function createArr() {
		giftList = addCards(giftList);
		bribeList = addCards(bribeList);

		for (var i = 0; i < 3; i++) {
			imgList[2*i] = {};
			imgList[2*i].src = giftList[i].src;
			imgList[2*i].alt = giftList[i].alt;
			imgList[2*i].status = giftList[i].status;
		}

		for (var i = 0; i < 2; i++) {
			imgList[2*i+1] = {};
			imgList[2*i+1].src = bribeList[i].src;
			imgList[2*i+1].alt = bribeList[i].alt;
			imgList[2*i+1].status = bribeList[i].status;
		}
	}

	function addCards(array) {
		var num = [];
		for (var i = 0; i < array.length; i++) {
			num[i] = i;
		}

		function compareRandom(a, b) {
		  return Math.random() - 0.5;
		}

		num.sort(compareRandom); 
		var arr = [];
		for (var i = 0; i < array.length; i++) {
			arr[i] = {};
			arr[i].src = array[num[i]].src;
			arr[i].alt = array[num[i]].alt;
			arr[i].status = array[num[i]].status;
		}
		return arr;
	}

	/* copy right answers to show them, if user will do 3 attempts and give incorrect answers */

	var ansTask = copyObj(imgList);

	function copyObj(obj) {
		if (obj == null || typeof(obj) != 'object')
			return obj;
		var temp = new obj.constructor();
		for (var key in obj)
			temp[key] = copyObj(obj[key]);
		return temp;
	}

	/* add information about draggable cards into DOM */

	var itemList = $(parent.frames['myframe'].document).find(".wrapper__cards-img");
	for (var i = 0; i < itemList.length; i++) {
		$(itemList[i]).attr('src',imgList[i].src);
		$(itemList[i]).attr('alt',imgList[i].alt);
	}

	/* drag'n drop */

	var ansList = [];
	var numAns = 0;

	$(itemList).draggable({
		containment: 'document',
		revert: true
	});

	var basketsList = $(parent.frames['myframe'].document).find(".wrapper__box-basket");
	$(basketsList).droppable({
	    drop: handleDropEvent
	});


	function handleDropEvent( event, ui ) {
	  var draggable = ui.draggable;
	  $(draggable).addClass('dropped');
	  var droppable = $(this);
	  if (droppable.hasClass('wrapper__box-basket--gifts')) {
	  	ansList[numAns] = {};
	  	ansList[numAns].status = "Подарок";
	  	ansList[numAns].alt = draggable.prop('alt');
	  } else {
	  	ansList[numAns] = {};
	  	ansList[numAns].status = "Подкуп";
	  	ansList[numAns].alt = draggable.prop('alt');
	  }
	  numAns++;
	  if (numAns === imgList.length) {
	  	btnAns.attr('disabled',false)
			 .removeClass('btn--disabled');
			 numAns = 0;
	  }
	}

	var btnAns = $(parent.frames['myframe'].document).find('.btn--answer');
	var btnRestart = $(parent.frames['myframe'].document).find('.btn--restart');
	btnAns.attr('disabled',true)
			 .addClass('btn--disabled');

	btnAns.on("click", btnAnsHandler);
	btnRestart.on("click", btnRestartHandler);
	var numAttempt = 0;

	function btnAnsHandler() {
		numAttempt++;
		btnAns.attr('disabled',true)
			   .addClass('btn--disabled');
		for (var i = 0; i < ansList.length; i++) {
			if (ansList[i].status === "Подарок") {
				if (!checkedAns(ansList[i].alt,giftList)) {
					if (numAttempt !== 3) {
						return ctrl.sendResult(-1,0,'<p class="feedback__text">' + commentMessage[numAttempt] + '</p>')
					} else {
						return ctrl.sendResult(-1,2,'<p class="feedback__text">' + commentMessage[numAttempt] + '</p>' 
																									+ showAnswers(ansTask), true);
					}
				};
			} else {
				if (!checkedAns(ansList[i].alt,bribeList)) {
					if (numAttempt !== 3) {
						return ctrl.sendResult(-1,0,'<p class="feedback__text">' + commentMessage[numAttempt] + '</p>')
					} else {
						return ctrl.sendResult(-1,2,'<p class="feedback__text">' + commentMessage[numAttempt] + '</p>' 
																											+ showAnswers(ansTask), true);
					}
				};
			}
		}
		ctrl.sendResult(1,100,'<p class="feedback__text">' + commentMessage[0] + '</p>');
		numAttempt = 0;
	}

	function checkedAns(elem,array) {
		for (var i = 0; i < array.length; i++) {
			if (array[i].alt === elem) {
				return true;
			}
		}
		return false;
	}

	function btnRestartHandler() {
		btnAns.attr('disabled',true)
				 .addClass('btn--disabled');
		imgList = addCards(imgList);
		for (var i = 0; i < itemList.length; i++) {
			$(itemList[i]).removeClass('dropped');
			$(itemList[i]).attr('src',imgList[i].src);
			$(itemList[i]).attr('alt',imgList[i].alt);
		}
		numAns = 0;
	}

	function showAnswers(array) {
		numAttempt = 0;
		var message = ''; 
		for (var i = 0; i < array.length; i++){
			message = message + '<div style="float: left; width: 210px; height: 120px; margin-top: 5px; text-align: center" class="feedback"><span class="feedback__item">' + '<img style="display:block; margin: 0 auto" class="feedback__img" width="100" src="pages/page034/' + 
					array[i].src + '" alt="' + array[i].alt +'"><span class="feedback__img-text">' + array[i].status + "</span></span></div>";
		}

		/**/
		createArr();

		/* copy right answers to show them, if user will do 3 attempts and give incorrect answers */

		ansTask = copyObj(imgList);

		/* add information about draggable cards into DOM */

		itemList = $(parent.frames['myframe'].document).find(".wrapper__cards-img");
		for (var i = 0; i < itemList.length; i++) {
			$(itemList[i]).attr('src',imgList[i].src);
			$(itemList[i]).attr('alt',imgList[i].alt);
		}

		/**/
		
		return '<div style="min-height: 230px">' + message + '</div>';
	}

ctrl.coursePage = {
	play: function() {
		//
	},
	stop: function(){
		$(btnAns).off("click");
		$(btnRestart).off("click");
		$(itemList).draggable("destroy");
		$(basketsList).droppable("destroy");
		ctrl.coursePage = null;
	},
	restart: function(){
		btnRestartHandler()
	}
}
})(parent.jQuery, parent.ctrl);
parent.ctrl.coursePage.play();
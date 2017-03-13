"use strict";

angular.module('questionnaire-home', ['ui.router'])
.controller('CtrlTask', ['$scope', '$state', 'myService', function($scope, $state, myService) {
	$scope.isStarted = false;

	$scope.actNavigation = function() {
		$scope.currentPageNav = myService.toggleNav();
	}

	$scope.actLegend = function() {
		$scope.chapterLegend = myService.toggleLegend();
		if ($scope.chapterLegend !== false) {
			$state.go("chapter_" + $scope.chapterLegend);
		}
	}
	
	$scope.scrollTo = function(scrollLocation) {
		myService.scroll(scrollLocation);
	}

	$scope.startTask = function() {
		$scope.isStarted = myService.start();
		$state.go("chapter_1");
	}

	$scope.checkAnswer = function() {
		myService.checkAnswers();
	}

	$scope.removeRestart = function() {
		myService.restartTask()
	}

	$scope.closeComment = function() {
		myService.removeComment();
	}
}])
.service('myService', function(){
	/**-------------------------------------------------
	*
	*			LIST of FUNCTIONS for 'myService'
	*
	*			0. Start task
	*			1. Find anchors and include data in array of objects
	*			2. Navigation menu toggle and page position
	*			3. Navigation menu, click buttons and scroll to page position
	*			4. Legend toggle and chapter position
	*			5. Check answers
	*			5.1 Remove comment
	*			6. Restart task
	*			7. Snippets
	*				 Number choice
	*				 Navigation through inputs, textareas using buttons 'left arrow' and 'right arrow' 
	*				 Click on empty field to close '.popup-navigation' 
	*
	*----------------------------------------------------*/

	// 0. Start task

	this.start = function() {
		$('.btn_start-task').css('display','none');
		$('.btn_navigation')[0].removeAttribute('disabled');
		$('.btn_legend')[0].removeAttribute('disabled');
		$('.btn_answer')[0].removeAttribute('disabled');
		return true;
	};

	/*
	* 1. Find all anchors and create such array of objects:
	*   anchors = [{
	* 	  number: 'number of page' or 'number of anchor',
	*		  position: 'top position for anchor',
	*		  chapter: 'chapter of page from navigation menu'
	*   }]
	*/

	var anchorList = $('.wrapper-title'),
			chapterList = [2,4,10,12,15,17,21],
			currentChapter = 0,
			anchors = [],
			i;

	for (i = 0; i < anchorList.length; i++) {
		anchors[i] = {};
		anchors[i].number = $(anchorList[i]).attr('id');
		anchors[i].position = $(anchorList[i]).position().top;
		if ($.inArray(parseInt(anchors[i].number), chapterList) !== -1) {
			currentChapter++;
		}
		anchors[i].chapter = currentChapter;
	}

	// 2. Navigation menu toggle and page position

	this.toggleNav = function() {
		if ($('.wrapper-legend').attr('style') !== 'display: none;') {
			$('.wrapper-legend').slideToggle();
		}; 
		$('.popup-navigation').slideToggle();
		var visitedList = $('.visited');

		return parseInt(anchors[visitedList.length - 1].number);
	}

	// 3. Navigation menu, click buttons and scroll to page position

  this.scroll = function(scrollLocation){
  	var index = null;
  	$('.popup-navigation').slideToggle();
  	for (var i = 0; i < anchors.length; i++) {
	    if (anchors[i].number === scrollLocation) {
        index = i;
        break;
	    }
		}
    $(document).find('.container').scrollTop(anchors[index].position);
  }

  // Track scroll position
  
  $('.container').bind('scroll', function() {
    $('.wrapper-title').each(function() {
      var post = $(this),
        bordT = post.outerWidth() - post.innerWidth(),
        paddT = post.innerWidth() - post.width(),
        margT = post.outerWidth(true) - post.outerWidth(),
        position = post.position().top - $('.container').position().top 
                                          - margT - bordT - paddT;
      if (position < 0) {
        post.addClass('visited');
      } else {
        post.removeClass('visited');
      }
    });        
  });

  // 4. Legend toggle and chapter position

  this.toggleLegend = function() {
  	var visitedList = $('.visited'),
        currentPage = 1,
        index;
    if (!$('.popup-navigation').attr('style')) {
  		$('.popup-navigation').slideToggle();
  	};
  	if ($('.wrapper-legend').attr('style') === 'display: none;') {
	    currentPage = visitedList.length + 1;

	  	for (var i = 0; i < anchors.length; i++) {
		    if (parseInt(anchors[i].number) === currentPage) {
	        index = i;
	        break;
		    }
			}
			$(document).find('.wrapper-legend').slideToggle();
	    return anchors[index].chapter;
  	}
  	$('.wrapper-legend').slideToggle();
  	return false;
  }

  // Arrays for answer checking

  var inputList = $(document).find('input'),
			textAreaList = $(document).find('textarea'),
			spanList = $(document).find('span');

	// 5. Check answers

	function toCommonType(value) {
		return $.trim(value.replace(/\s+/g, '').toLowerCase());
	}

	function checkFields(arr, indicatorRightAnswer) {
		for (i = 0; i < arr.length; i++) {
			if ($(arr[i]).attr('data-answer') || arr[i].value) {
				if (!$(arr[i]).attr('data-answer')) {
					$(arr[i]).addClass('false-ans_input');
					indicatorRightAnswer = false;
				} else if (toCommonType($(arr[i]).attr('data-answer')) !== toCommonType(arr[i].value)) {
					$(arr[i]).addClass('false-ans_input');
					indicatorRightAnswer = false;
				}
			} 
		}
		return indicatorRightAnswer;
	}

	this.checkAnswers = function() {
		var indicatorRightAnswer = true;

		$('.btn_restart')[0].removeAttribute('disabled');
		$('.btn_answer')[0].setAttribute('disabled','disabled');

		for (i = 0; i < spanList.length; i++) {
			if ($(spanList[i]).hasClass('visible-circle') || spanList[i].hasAttribute('data-answer')) {
				if ($(spanList[i]).hasClass('visible-circle') && spanList[i].hasAttribute('data-answer')) {				
				} else {
					$(spanList[i]).addClass('false-ans_circle');
					indicatorRightAnswer = false;
				}
			}
		}
		checkFields(inputList, indicatorRightAnswer);
		checkFields(textAreaList, indicatorRightAnswer);

		if (!$('.wrapper-legend').attr('style')) {
			$('.wrapper-legend').slideToggle();
		}
		if (!$('.popup-navigation').attr('style')) {
			$('.popup-navigation').slideToggle();
		}

		if (indicatorRightAnswer) {
			$('.popup-comment').css('display','block');
			$('.popup-comment__text').text('Задание выполнено абсолютно верно!');
		} else {
			$('.popup-comment').css('display','block');
			$('.popup-comment__text').text('Обратите внимание на элементы, выделенные красным цветом. В них допущены ошибки: либо неверно указано значение, либо элемент не должен быть выделен. Пройдите задание ещё раз, нажав кнопку "Начать заново".')
		}

		// Make disabled state on the pages
		$('.wrapper').css('pointer-events','none');
	};

	// 5.1 Remove comment

	this.removeComment = function() {
		$('.popup-comment').css('display','none');
		$('.popup-comment__text').text('');
	}

  // 6. Restart exercise

  function clearFields(arr) {
		for (i = 0; i < arr.length; i++) {
			arr[i].value = '';
			$(arr[i]).removeClass('false-ans_input');
		}
	}

	this.restartTask = function() {

		$('.btn_answer')[0].removeAttribute('disabled');
		$('.btn_restart')[0].setAttribute('disabled','disabled');
		$('.popup-comment').css('display','none');
		$('.popup-comment__text').text('');

		for (i = 0; i < spanList.length; i++) {
			$(spanList[i]).removeClass('false-ans_circle').removeClass('visible-circle');
		}
		clearFields(inputList);
		clearFields(textAreaList);

		// Make unebled state on the pages
		$('.wrapper').css('pointer-events','auto');
	}

	// 7. Snippets

	// Number choice

	spanList.on('click', circleAppear);

	function circleAppear(e) {
		var elem = $(e.target);
		elem.toggleClass('visible-circle');
	}

	// Navigation through inputs, textareas using buttons 'left arrow' and 'right arrow' 

	$('input, textarea').on('keydown', keyDownNav);

	function keyDownNav(e) {
		var elem = e.target.tagName === 'INPUT' ? $(e.target).parent() : $(e.target),
				elemList = elem.parent().find('textarea, input'),
				index = $.inArray(e.target, elemList);

		switch(e.keyCode) {
		  case 37:
		    // Key left.
		    if (index !== 0) {
		    	elemList[index - 1].focus();
		    }
		    break;
		  case 39:
		    // Key right.
				if (index !== elemList.length - 1) {
		    	elemList[index + 1].focus();
		    }
		    break;
	  }
	}

	// Click on empty field to close '.popup-navigation' 

	$('.container').on('mouseup', function (e) {
	    var container = $('.popup-navigation');
	    if (e.target !== container[0] && !container.has(e.target).length && !container.attr('style')){
	      container.slideToggle();
	    }
	});
})
.config(function($stateProvider, $urlRouterProvider) {

	$stateProvider
		.state('task', {
	    url: '/task',
	    template: '<p>Уважаемый коллега! Предлагаем вам проверить и закрепить свои знания, заполнив <em class="text_bold">Вопросник для домохозяйства</em>.</p>' +
								'<p>Перед началом работы внимательно ознакомьтесь с легендой. В учебных целях легенда разбита на разделы, в соответствии с Вопросником для домохозяйства. Открыть легенду вы сможете в любой момент, нажав кнопку <img class="paragraph-attention__img" height="26" src="img/mainPage_faq_icon.png" alt="Легенда"> &nbsp;&laquo;Легенда&raquo;. Для того чтобы скрыть легенду нажмите на кнопку еще раз.</p>' +
								'<p>В упражнении заполнение вопросника реализуется с помощью интерактивных полей. Достаточно нажать на место заполнения и поле ввода станет активным.</p>' +
								'<p>Для ввода текстового или числового значения в вопроснике нажмите на поле ввода (пример 1 на рисунке). Для редактирования (изменения, удаления) введенного значения снова нажмите на поле, которое требуется изменить. Установив в поле необходимое значение, для перехода к следующему полю можно воспользоваться клавишей табуляции.</p>' +
								'<p>В закрытых вопросах для осуществления выбора варианта ответа нажмите на нужный вариант (пример 2 на рисунке). Чтобы отменить сделанный выбор, нажмите на ранее выбранный ответ еще раз.</p>' +
								'<p class="paragraph-image"><img width="700" src="img/task_frame.png" alt="Пример выбора ответов"></p>' +
								'<p>Для перехода по страницам вопросника скроллируйте страницы вниз или вверх, или для быстрого перехода к необходимой странице воспользуйтесь кнопкой <img class="paragraph-attention__img" width="28" src="img/but_menu_icon.png" alt="Меню навигации"> &nbsp;&laquo;Меню навигации&raquo;.</p>' +
								'<p>После заполнения всего вопросника целиком, проверьте заполнение вопросника и нажмите кнопку &laquo;Принять ответ&raquo;.</p>' +
								'<div class="paragraph-attention">' +
									'<p class="paragraph-attention__text">Внимание!</p>' +
									'<p class="paragraph-attention__text">Исправить неверно введенные ответы после нажатия кнопки &laquo;Принять ответ&raquo; нельзя.</p>' +
								'</div>	' +
								'<p>В случае ошибок, допущенных при заполнении вопросника, неверно заполненные ответы будут отмечены красным цветом. Проанализируйте эти ответы, сверьтесь с легендой. Подумайте и посмотрите еще раз материал посвященный этому разделу(ам).</p>' +
								'<p>Кнопка &laquo;Начать заново&raquo; очищает весь вопросник от всех заполненных ответов, и вы сможете заполнить вопросник заново.</p>' +
								'<p>Желаем вам успехов!</p>' +
								'<div class="wrapper-legend__btn-block"><button class="btn btn_start-task" ng-click="startTask()" ng-hide="{{isStarted}}"></button></div>'							
	  })

		.state('chapter_1', {
	    url: '/chapter_1',
	    template: '<p>На вопросы отвечает Алла Александровна в возрасте 49 лет.</p>' +
								'<p>Алла Александровна с 1985 года состоит в зарегистрированном браке. Супруг - Иван Сергеевич в возрасте 50 лет. Иван Сергеевич проживал в домохозяйстве на момент опроса и может дать информацию о самом себе.</p>' +
								'<p>Супружеская пара имеет двоих детей: дочь &ndash; Веру Ивановну в возрасте 15 лет и сына &ndash; Дениса Ивановича в возрасте 25 лет.</p>' +
								'<p>На момент опроса Вера Ивановна находилась на отдыхе в спортивном лагере. Информацию о Вере Ивановне получим со слов ее матери Аллы Александровны.</p>' +
								'<p>Денис Иванович с 2012 года состоит в незарегистрированном браке с 23-летней Юлей Борисовной и имеет сына Степана Денисовича, которому на момент опроса исполнился 1 год. Денис Иванович проживал в домохозяйстве на момент опроса и может дать информацию о самом себе.</p>' +
								'<p>Юлия Борисовна проживала в домохозяйстве на момент опроса и может дать информацию о самой себе.</p>' +
								'<p>Степан Денисович является внуком Аллы Александровны и проживал на момент опроса в домохозяйстве, но не может дать информацию о самом себе в силу малолетнего возраста. Информация о Степане Денисовиче будет получена со слов его матери Юлии Борисовны.</p>' +
								'<p>Нина Павловна в возрасте 74 лет является матерью Ивана Сергеевича. Вдова. На момент опроса проживала в домохозяйстве и может дать информацию о себе.</p>' +
								'<p>Наибольший вклад в общий бюджет домохозяйства в прошлом году внес Иван Сергеевич.</p>'
	  })

	  .state('chapter_2', {
	    url: '/chapter_2',
	    template: '<p>В домохозяйстве проживает двое детей &ndash; в возрасте 15 лет и 11 месяцев (родился в январе 2016 года и на момент опроса ему исполнился 1 год).</p>' +
								'<p>Ребенок в возрасте 15 лет</p>' +
								'<p>Ребенок растет в полной семье и ежемесячных выплат в связи с отсутствием одного или обоих родителей, а также иных выплат в связи с отсутствием одного из родителей ребенок не получал.</p>' +
								'<p>Ребенок учится в школе, не получает стипендию (бывают случаи, что школьники получают стипендию в музыкальных или спортивных школах), обучение по базовой программе бесплатное.</p>' +
								'<p>Питается в школе и получает скидки при оплате обедов. Размер скидки составлял 425 рублей. Скидка предоставлялась 9 месяцев.</p>' +
								'<p>Льгот на оплату транспорта не имеет.</p>' +
								'<p>Так как ребенок является инвалидом, то ежемесячно он получает пенсию по инвалидности в размере 12&nbsp;234 рублей.</p>' +
								'<p>Также в прошлом году ребенок получал ежемесячную денежную выплату в размере 2397 рублей в течение 12 месяцев.</p>' +
								'<p>Единовременной денежной выплаты ребенок не получал.</p>' +
								'<p>В прошлом году в рамках набора социальных услуг ребенок получил бесплатную путевку на санаторно-курортное лечение.</p>' +
								'<p>Ежемесячное пособие (детское пособие для детей из малоимущих семей) и денежную помощь от органов социальной защиты ребенок не получал.</p>' +
								'<p>За прошедший год ребенок не занимался трудовой деятельностью. В связи с этим никакого дохода не получал.</p>' +
								'<p>Ребенок в возрасте 1 год</p>' +
								'<p>Ребенок растет в полной семье и ежемесячных выплат в связи с отсутствием одного или обоих родителей, а также иных выплат в связи с отсутствием одного из родителей ребенок не получал.</p>' +
								'<p>В прошлом году было получено единовременное пособие в связи с рождением ребенка в размере 15 513 рублей. Так как возраст ребенка не превышает 1,5 года, матери выплачивается пособие по уходу за ребенком, размер которого составляет 2&nbsp;909 рублей ежемесячно.</p>' +
								'<p>Так как ребенку еще нет 1,5 года, то ежемесячную денежную выплату по уходу за ребенком в возрасте от 1,5 до 3 лет родители не получали.</p>' +
								'<p>В течение 5 месяцев ребенок получал бесплатное питание с молочной кухни. Стоимость питания составляет 2000 рублей в месяц.</p>' +
								'<p>Ребенок не посещал в прошлом году дошкольную образовательную организацию. Выплат в связи с непосещением ребенком дошкольной образовательной организации и компенсации части родительской платы за содержание ребенка в дошкольной образовательной организации в прошлом году не было.</p>' +
								'<p>Ребенок не относится к категории лиц, имеющих право на получение мер социальной поддержки.</p>' +
								'<p>Ежемесячное пособие (детское пособие для детей из малоимущих семей) и денежную помощь от органов социальной защиты ребенок не получал.</p>'
	  })

	  .state('chapter_3', {
	    url: '/chapter_3',
	    template: '<p>В прошлом году от органов социальной защиты населения домохозяйство не получало никаких выплат. Однако домохозяйству была оказана денежная помощь родственниками в качестве отплаты путевки в санаторий самому пожилому члену домохозяйства в размере 30&nbsp;000 рублей.</p>' +
								'<p>В 2016 году домохозяйство по решению суда получило компенсацию в размере 15&nbsp;000 тысяч рублей в связи с затоплением с кровли.</p>' +
								'<p>Близкий родственник одного из членов домохозяйства проживает за границей и прислал денежные средства в размере 50&nbsp;000 тысяч рублей.</p>'
	  })

	  .state('chapter_4', {
	    url: '/chapter_4',
	    template: '<p>Домохозяйство проживает в отдельной квартире в многоквартирном доме, квартира в котором приобретена с использованием ипотечных средств.</p>' +
								'<p>Так как в домохозяйстве проживает пенсионер, домохозяйство получает законодательно установленные льготы на оплату ЖКУ, которые включены в счет на оплату жилищно-коммунальных услуг. Размер льгот составил 390 рублей ежемесячно.</p>' +
								'<p>В прошлом году домохозяйство также получало льготы при оплате счетов за электричество (180 рублей ежемесячно). Установленного телефона в домохозяйстве нет.</p>' +
								'<p>Фактические расходы на оплату ЖКУ в среднем за месяц первого квартала прошлого года составляли 5800 рублей, а в последнем квартале &ndash; 6000 рублей.</p>' +
								'<p>Домохозяйство оценило, что если бы им пришлось арендовать такую же квартиру, в которой они живут, то за нее они бы платили 8 тысяч рублей в месяц.</p>' +
								'<p>Единовременную помощь от государственных органов, органов местного самоуправления или других организаций на оплату расходов, связанных с жильем, домохозяйство не получало.</p>' +
								'<p>Так как домохозяйство является собственником жилья, то в прошлом году они уплатили налог на имущество в размере 3 500 рублей.</p>'
	  })

	  .state('chapter_5', {
	    url: '/chapter_5',
	    template: '<p>Помимо основного жилья в распоряжении домохозяйства имеется дача и гараж. В прошлом году был уплачен налог на имущество в размере 280 рублей. Перечисленную недвижимость домохозяйство в аренду не сдавало, отдыхающих и туристов не принимало.</p>' +
								'<p>Домохозяйство имеет в собственности автомобиль для личного пользования. В прошлом году был уплачен транспортный налог в размере 15&nbsp;300 рублей.</p>' +
								'<p>Дополнительной техники и оборудования, перечисленного в карточке 3, домохозяйство не имело и не использовало легковой автомобиль ни для оказания платных услуг, ни для сдачи его в аренду.</p>' +
								'<p>В прошлом году домохозяйство получило денежную сумму в наследство в размере 100 тысяч рублей.</p>'
	  })

	  .state('chapter_6', {
	    url: '/chapter_6',
	    template: '<p>В собственности домохозяйства находится садовый участок размером в 6 соток, налоги и платежи по страхованию за который в прошлом году не платились. В аренду домохозяйство участок не сдавало.</p>' +
								'<p>Домохозяйство занимается растениеводством, как для собственного потребления, так и для продажи. Домохозяйство реализовало картофель на 10&nbsp;000 рублей и свежие овощи на 7&nbsp;000 рублей. Эта сумма соответствует чистому доходу.</p>' +
								'<p>Количество самостоятельно выращенных овощей и фруктов, потребляемых домохозяйством в прошлом году:</p>' +
								'<table class="legend-table">' +
									'<tr>' +
										'<td class="legend-table__cell">' +
											'<ul class="legend-table__list">' +
										    '<li class="legend-table__item">' +
										    	'<span class="legend-table__item-product">Огурцы (свежие)</span>' +
									        '<span class="legend-table__item-number">8 кг</span>' +
										    '</li>' +
										    '<li class="legend-table__item">' +
										    	'<span class="legend-table__item-product">Огурцы (соленые, маринованные)</span>' +
									        '<span class="legend-table__item-number">5 кг</span>' +
										    '</li>' +
										    '<li class="legend-table__item">' +
										    	'<span class="legend-table__item-product">Капуста (свежая)</span>' +
									        '<span class="legend-table__item-number">5 кг</span>' +
										    '</li>' +
										    '<li class="legend-table__item">' +
										    	'<span class="legend-table__item-product">Помидоры (свежие)</span>' +
									        '<span class="legend-table__item-number">10 кг</span>' +
										    '</li>' +
										    '<li class="legend-table__item">' +
										    	'<span class="legend-table__item-product">Помидоры (соленые, маринованные)</span>' +
									        '<span class="legend-table__item-number">8 кг</span>' +
										    '</li>' +
										    '<li class="legend-table__item">' +
										    	'<span class="legend-table__item-product">Картофель</span>' +
									        '<span class="legend-table__item-number">11 кг</span>' +
										    '</li>' +
										    '<li class="legend-table__item">' +
										    	'<span class="legend-table__item-product">Кабачки, тыквы</span>' +
									        '<span class="legend-table__item-number">6 кг</span>' +
										    '</li>' +
											'</ul>' +
										'</td>' +
										'<td class="legend-table__cell">' +
											'<ul class="legend-table__list">' +
										   '<li class="legend-table__item">' +
										    	'<span class="legend-table__item-product">Лук репчатый</span>' +
									        '<span class="legend-table__item-number">2 кг</span>' +
										    '</li>' +
										    '<li class="legend-table__item">' +
										    	'<span class="legend-table__item-product">Перец, баклажаны</span>' +
									        '<span class="legend-table__item-number">3 кг</span>' +
										    '</li>' +
										    '<li class="legend-table__item">' +
										    	'<span class="legend-table__item-product">Свекла, редис, морковь и другие корнеплоды</span>' +
									        '<span class="legend-table__item-number">7 кг</span>' +
										    '</li>' +
										    '<li class="legend-table__item">' +
										    	'<span class="legend-table__item-product">Укроп, салат, лук, чеснок и др.</span>' +
									        '<span class="legend-table__item-number">1 кг</span>' +
										    '</li>' +
										    '<li class="legend-table__item">' +
										    	'<span class="legend-table__item-product">Яблоки, груши</span>' +
									        '<span class="legend-table__item-number">3 кг</span>' +
										    '</li>' +
										    '<li class="legend-table__item">' +
										    	'<span class="legend-table__item-product">Клубника</span>' +
									        '<span class="legend-table__item-number">7 кг</span>' +
										    '</li>' +
										    '<li class="legend-table__item">' +
										    	'<span class="legend-table__item-product">Другая свежая садовая ягода</span>' +
									        '<span class="legend-table__item-number">3 кг</span>' +
										    '</li>' +
											'</ul>' +
										'</td>' +
									'</tr>' +
								'</table>' +
								'<p>Скот и птицу в прошлом году домохозяйство не содержало.</p>' +
								'<p>Также домохозяйство занималось сбором грибов, ягод и рыбной ловлей для собственного потребления. Домохозяйство израсходовало на собственное потребление грибов свежих &ndash; 4 кг, переработанных грибов &ndash; 3 кг, ягод свежих &ndash; 5 кг, рыбы свежей и соленой &ndash; 3 кг.</p>' +
								'<p>Платежей и сборов, не связанных с жильем, землей и транспортными средствами, домохозяйство в прошлом году не платило.</p>'
	  })

	  .state('chapter_7', {
	    url: '/chapter_7',
	    template: '<p>Основными источникам средств к существованию домохозяйства являются: заработная плата; доходы от продажи личного подсобного хозяйства; пенсии и пособие на детей, а также различного рода компенсации и льготы; деньги и подарки от родственников.</p>' +
								'<p>Приблизительный доход домохозяйства составляет 68&nbsp;000 рублей в месяц, при этом у домохозяйства возникают небольшие затруднения при оплате всех необходимых ежедневных платежей. Минимальный доход для того, чтобы отплачивать все необходимые платежи, по мнению домохозяйства должен составлять 80&nbsp;000 рублей.</p>' +
								'<p>В домохозяйстве имеется вся необходимая бытовая техника.</p>' +
								'<p>Задолженностей по оплате жилищно-коммунальных услуг, ипотечного займа в прошлого году в домохозяйстве не имелось.</p>' +
								'<p>Домохозяйство может позволить питание из мяса, птицы через день; покупать новую одежду и обувь каждому члену семьи. Однако заменить старую мебель у домохозяйства возможности нет. Домохозяйство в состоянии приглашать гостей на семейное торжество и каждый год одну неделю отпуска проводить вне дома.</p>'
	  })

  $urlRouterProvider.otherwise('/task');
});
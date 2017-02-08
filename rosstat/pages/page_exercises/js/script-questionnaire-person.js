"use strict";

angular.module('questionnaire-person', ['ui.router'])
.controller('CtrlTask', ['$scope', '$state', 'myService', function($scope, $state, myService) {

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
	*			1. Find anchors and include data in array of objects
	*			2. Navigation menu toggle and page position
	*			3. Navigation menu, click buttons and scroll to page position
	*			4. Legend toggle and chapter position
	*			5. Check answers (add functionality for multiple answers)
	*			5.1 Remove comment
	*			6. Restart task
	*			7. Snippets
	*				 Number choice
	*				 Navigation through inputs, textareas using buttons 'left arrow' and 'right arrow' 
	*				 Click on empty field to close '.popup-navigation' 
	*
	*----------------------------------------------------*/

	/*
	* 1. Find all anchors and create such array of objects:
	*   anchors = [{
	* 	  number: 'number of page' or 'number of anchor',
	*		  position: 'top position for anchor',
	*		  chapter: 'chapter of page from navigation menu'
	*   }]
	*/

	var anchorList = $('.wrapper-title'),
			chapterList = [2,6,10],
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
  	if ($('.btn_restart').attr('disabled') || $('.btn_answer').attr('disabled')) {
  		$('.btn_answer')[0].removeAttribute('disabled');
  	}
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

	function checkFieldsMultipleAns(elem, indicatorRightAnswer) {
		var inputAnsList = $(elem).attr('data-answer').split(';'),
				i;
		for (i = 0; i < inputAnsList.length; i++) {
			if (toCommonType(inputAnsList[i]) === toCommonType(elem.value)) {
				return indicatorRightAnswer;
			}
		}
		$(elem).addClass('false-ans_input');
		return indicatorRightAnswer = false;
	};

	function checkFields(arr, indicatorRightAnswer) {
		for (i = 0; i < arr.length; i++) {
			if ($(arr[i]).hasClass('check-multiple')) {
				indicatorRightAnswer = checkFieldsMultipleAns(arr[i],indicatorRightAnswer);
			} else if ($(arr[i]).attr('data-answer') || arr[i].value) {
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
		$('.btn_navigation')[0].setAttribute('disabled','disabled');
		$('.btn_legend')[0].setAttribute('disabled','disabled');

		if (indicatorRightAnswer) {
			$('.popup-comment').css('display','block');
			$('.popup-comment__text').text('Задание выполнено абсолютно верно!');
		} else {
			$('.popup-comment').css('display','block');
			$('.popup-comment__text').text('Обратите внимание на элементы, выделенные красным цветом. В них допущены ошибки: либо неверно указано значение, либо элемент не должен быть выделен. Пройдите задание ещё раз, нажав кнопку "Начать заново".')
		}
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
		$('.btn_navigation')[0].removeAttribute('disabled');
		$('.btn_legend')[0].removeAttribute('disabled');

		for (i = 0; i < spanList.length; i++) {
			$(spanList[i]).removeClass('false-ans_circle').removeClass('visible-circle');
		}
		clearFields(inputList);
		clearFields(textAreaList);
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
	    template: '<p>Уважаемый коллега!</p>' +
								'<p>Предлагаем вам проверить и закрепить свои знания, заполнив <em class="text_bold">Индивидуальный вопросник</em> по данным, описанным в легенде.</p>' +
								'<p>Перед началом работы внимательно ознакомьтесь с легендой. Вернуться к ней вы сможете в любой момент, нажав кнопку &laquo;Легенда&raquo;.</p>' +
								'<p>Для перехода по страницам используйте колесо мыши или для быстрого перехода к необходимой странице воспользуйтесь кнопкой &laquo;Навигация&raquo;.</p>' +
								'<p>После заполнения всех полей нажмите кнопку &laquo;Проверить&raquo;.</p>' +
								'<p>В случае ошибок, допущенных при заполнении вопросника, неверно заполненные поля будут отмечены красным цветом. Проанализируйте эти вопросы, сверьтесь с легендой. Подумайте и посмотрите еще раз материал посвященный этому разделу(ам).</p>' +
								'<p>Кнопка &laquo;Начать заново&raquo; очищает все заполненные поля и ошибки, и вы сможете заполнить вопросник заново.</p>' +
								'<p>Желаем вам успехов!</p>' +
								'<div class="wrapper-legend__btn-block"><button class="btn btn_start-course" ng-click="actLegend()"></button></div>'							
	  })

		.state('chapter_1', {
	    url: '/chapter_1',
	    template: '<p>Мужчина, 41 год, проживает в Тульской области (код 401364000), совместно с супругой в домохозяйстве, работает в издательском центре специалистом по компьютерным сетям, имеет высшее образование.</p>' +
								'<p>В 2016 году отработал полный год.</p>' +
								'<p>В 2016 году нигде не обучался, посещал курсы иностранного языка, за которые оплатил не полностью из своих средств. Близкие родственники выделили 10&nbsp;000 рублей на оплату курсов иностранного языка.</p>' +
								'<p>Респондент имеет возможность регулярно отдыхать вне дома (несколько раз за определенный период времени &ndash; месяц, год). Имеет возможность хотя бы раз в месяц встречаться с друзьями, но не может тратить небольшую сумму денег на себя, не согласовывая с супругой.</p>'
	  })

	  .state('chapter_2', {
	    url: '/chapter_2',
	    template: '<p>Респондент не является пенсионером, но принадлежит к льготной категории граждан &laquo;ветеран боевых действий&raquo; (получал ежемесячную денежную выплату (ЕДВ) в соответствии с федеральным законодательством в размере 2638 рублей). Также в соответствии с региональным законодательством получал регулярную денежную выплату в размере 1300 рублей.</p>' +
								'<p>Получал денежное возмещение набора социальных услуг (995 рублей в месяц).</p>' +
								'<p>Льготами в соответствии с региональным законодательством не пользовался.</p>' +
								'<p>Единовременные выплаты к праздничным датам не получал в 2016 году.</p>' +
								'<p>Выплаты от органов соцзащиты по уходу за другими лицами не получал.</p>'
	  })

	  .state('chapter_3', {
	    url: '/chapter_3',
	    template: '<p>Респондент работал в 2016 году в издательском центре, который имеет статус юридического лица, в должности специалиста по компьютерным сетям (в качестве наемного работника за заработную плату). Трудовой договор заключен на неопределенный срок.</p>' +
								'<p>В среднем сумма заработной платы составляла 35&nbsp;000 рублей в месяц, выплачивалась ежемесячно.</p>' +
								'<p>Респондент имеет нормальную продолжительность рабочей недели, в среднем за месяц число рабочих дней составляет 21 день, число рабочих часов (без учета обеденного перерыва и времени на дорогу на работу и обратно) составляет 8 часов в день.</p>' +
								'<p>В 2016 году был в оплачиваемом отпуске 28 календарных дней.</p>' +
								'<p>Получил в 2016 году материальную помощь к отпуску (12&nbsp;000 рублей) и премию по случаю торжества (5000 рублей).</p>' +
								'<p>Организация приобрела для респондента полис добровольного страхования (ДМС) за 30&nbsp;000 рублей.</p>' +
								'<p>Респондент работал в том же регионе, в котором проживает.</p>' +
								'<p>Дополнительной работы наряду с основной респондент не имел.</p>' +
								'<p>В 2016 году полностью все 12 месяцев работал на основной работе.</p>' +
								'<p>Случайной подработки в 2016 году у респондента не было.</p>' +
								'<p>Процентное распределение среднемесячного заработка в течение года было неравномерным. Заработок изменился в сторону повышения во втором и четвертом кварталах. Респондент определил его следующим образом: 1 квартал &ndash; 20 %, 2 и 3 кварталы &ndash; 25 %, 4 квартал &ndash; 30 %.</p>' +
								'<p>Респонденту никто не остался должен за выполненную работу в 2016 году.</p>' +
								'<p>В 2016 году респондент получил социальный налоговый вычет (на оказанные платные медицинские услуги) в размере 12&nbsp;400 рублей.</p>'
	  })

  $urlRouterProvider.otherwise('/task');
});
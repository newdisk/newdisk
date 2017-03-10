"use strict";

angular
.module('app', ['ui.router'])
.config(function($stateProvider, $urlRouterProvider) {

	$stateProvider
		.state('contents', {
			url: '/contents',
			views: {
        'header': {
          templateUrl: 'js/components/header/headerContentsTmpl.html',
          controller: function(staticService) {
          	var self = this;

          	self.courseTitle = staticService.getCourseName();
          },
          controllerAs: '$ctrl'    
        },
        'content': {
          templateUrl: 'pages/contents/index.html'
        }
      }			
		})
		.state('page', {
      url: '/chapter/:module/page/:path',
      views: {
        'header': {
          templateUrl: 'js/components/header/headerTmpl.html',
          controller: 'HeaderCtrl',
          controllerAs: '$ctrl'  
        },
        'content': {
          templateUrl: function ($stateParams){
		      	var chapterName = Number($stateParams.module) > 9 ? 'chapter' + $stateParams.module 
		      																										: 'chapter0' + $stateParams.module,
		      			pageName = Number($stateParams.path) > 9 ? 'page' + $stateParams.path 
		      																							 : 'page0' + $stateParams.path;

		        return 'pages/' + chapterName + '/' + pageName + '/index.html';
		      },
		      controller: 'PageCtrl',
		      controllerAs: '$ctrl'
        },
        'footer': {
        	templateUrl: 'js/components/footer/footerTmpl.html',
        	controller: 'FooterCtrl',
        	controllerAs: '$ctrl'
        }
      }
    })

  $urlRouterProvider.otherwise('/contents');
})
.controller('HeaderCtrl', function($scope, $stateParams, staticService) {
	var self = this;

	$scope.showMenu = false;

	self.chapterPages = staticService.getChapterObj(Number($stateParams.module) - 1);

	self.title = {
									module: self.chapterPages.title,
									exercise: self.chapterPages.pages[Number($stateParams.path) - 1].title
								}

	self.toggleGlossary = function() {
		alert('Здесь появится окно глоссария. Сейчас этот элемент находится в разработке');
	}

	self.toggleStatistics = function() {
		alert('Здесь появится окно статистики. Сейчас этот элемент находится в разработке');
	}
})
.controller('PageCtrl', function() {
	var self = this;

	self.showAddInfo = false;
})
.controller('FooterCtrl', function($state, $stateParams, staticService) {
	var self = this;

	self.curPageNum = $stateParams.path;
	self.pageAmount = staticService.getPageAmount(Number($stateParams.module) - 1)

	self.toBack = function() {
		self.prevPage = staticService.turnPage($stateParams.path, -1);
		if (self.prevPage !== false) {
			$state.go('page', {module: $stateParams.module, path: self.prevPage});
		}
	}

	self.toForward = function() {
		self.nextPage = staticService.turnPage($stateParams.path, 1);
		if (self.nextPage !== false) {
			$state.go('page', {module: $stateParams.module, path: self.nextPage});
		}
	}
})
.controller('IndexCtrl', function($scope, $state, $stateParams, staticService) {
	var self = this;

	$scope.curPageNum = $stateParams.path;

	self.togglePopup = function() {
		$('.course-popup-menu_menu').toggle();
		$scope.courseObj = staticService.getCourseObj();
		console.log($scope.courseObj.chapters);
	}
})
.service('staticService', function($http) {
	var coursePageList = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28'];
	var courseDataObj;

	// Include courseStructure.json
	$http({
		method: 'GET',
		url: 'js/courseStructure.json'
	}).then(function successCallback(response) {
		console.log(response.data);
		courseDataObj = response.data;
	}, function errorCallback(response) {
		alert('Error! Failure with courseStructure.json loading.')
	});

	// this.getTitle = function(prop) {
	// 	if (prop === 'course') return courseDataObj[prop];
	// }

	this.getCourseObj = function() {
		return courseDataObj;
	};

	this.getData = function($stateParams, prop) {
		console.log('here', courseDataObj.chapters[$stateParams.module - 1].pages[$stateParams.path - 1].data['' + prop]);
		return courseDataObj.chapters[$stateParams.module - 1].pages[$stateParams.path - 1].data[prop];
	}

	this.getMessage = function($stateParams, num) {
		return courseDataObj.chapters[$stateParams.module - 1].pages[$stateParams.path - 1].messages[num];
	}

	/**
	*	1. Navigation through pages using buttons
	*
	*
	*
	*
	*/

	this.getCurrentPageNumber = function(pageNum) {
		return pageNum;
	}

	// 1. Navigation through pages using buttons
	this.turnPage = function(currentPage, dir) {
		if (currentPage !== '1' && dir === -1) {
			return Number(currentPage) - 1;
		} else if (currentPage !== '' + coursePageList.length && dir === 1) {
			return Number(currentPage) + 1;
		} else {
			return false;
		}
	}

	this.getCourseName = function() {
		console.log(courseDataObj.course, courseDataObj.description)
		return {
							course: courseDataObj.course,
							description: courseDataObj.description
						}
	}

	this.getChapterObj = function(moduleNum) {
		return courseDataObj.chapters[moduleNum];
	}

	this.getPageAmount = function(num) {
		return courseDataObj.chapters[num].pages.length;
	}
});
angular
.module('app')
.controller('AccordionController', function($scope, $element, $attrs) {

  var self = this;
  var panels = [];
  // here we take the panel and add to our list of panels
  // to preselect the first panel we call turnOn function on the first panel
  self.addPanel = function(panel) {
    panels.push(panel);
    if ($attrs.firstOpen === 'true' && panel === panels[0]) {
      return false;
    }
    return true;
  };
  // when a panel is selected we would want to open the content
  // here we take the panel find it in our array and turn if on if not selected
  // and off it.
  self.selectPanel = function(panel,isCollapsed) {
    for (var i in panels) {
      if (panel === panels[i]) {
        if (isCollapsed) {
          panels[i].turnOn();
        } else {
          panels[i].turnOff();
        }
      } else {
        panels[i].turnOff();
      }
    }
  };
})
.component('accordion', {
  transclude: true,
  template:'<div class="accordion" ng-transclude></div>',
  controller: 'AccordionController'
})
.controller('AccordionPanelCtrl', function($scope, $element, $attrs) {
  
  var self = this;
  $scope.isCollapsed = true;
  
  // register the panel in init
  self.$onInit = function () {
    $scope.isCollapsed = self.parent.addPanel(self);
  };
  
  // Turns on the panel 
  self.turnOn = function () {
    $scope.isCollapsed = false;
  };
  
  // Turns off the panel 
  self.turnOff = function () {
    $scope.isCollapsed = true;
  };
  
  $scope.toggle = function() {
    // $scope.isCollapsed = !$scope.isCollapsed;
    self.parent.selectPanel(self,$scope.isCollapsed);
  };
})
.component('accordionPanel', {
  require: {
    'parent': '^accordion'
  },
  bindings: {
    heading: '@'
  },
  transclude: true,
  templateUrl: 'js/components/accordion/accordionPanelTmpl.html',
  controller: 'AccordionPanelCtrl'
})
.controller('MyCtrl', function($scope, $element, $attrs) {
  var element = $element[0];
  
  $scope.$watch($attrs.collapse, function (collapse) {
    
    var newHeight = collapse ? 0 : getElementAutoHeight();

		element.style.height = newHeight + 'px';
  })
  
  function getElementAutoHeight() {
    var currentHeight = getElementCurrentHeight();
    
    element.style.height = 'auto';
    var autoHeight = getElementCurrentHeight();
    
    element.style.height = currentHeight;
    // Force the browser to recalc height after moving it back to normal
    getElementCurrentHeight(); 
    
    return autoHeight;
  }
  
  function getElementCurrentHeight() {
    return element.offsetHeight
  }
})

angular
.module('app')
.component('popupMenuComment', {
	bindings: {
		title: '@',
		text: '@',
		visible: '='
	},
	templateUrl: 'js/components/popup-menu-comment/popupMenuCommentTmpl.html',
	controller: function() {
		var self = this;

		self.closeWindow = function() {
			self.visible = false;
		}
	},
	controllerAs: '$ctrl'
})
angular.module('app')
  .component('taskImageCheck', {
    templateUrl: 'js/components/task-image-check/taskImageCheckTmpl.html',
    controller: 'taskImageCheckCtrl'
  })
  .controller('taskImageCheckCtrl', function($stateParams, staticService) {
    var self = this;

    self.taskText = staticService.getData($stateParams, 'taskText');
    self.bunnerStart = staticService.getData($stateParams, 'bunnerStart');
    self.bunnerEnd = staticService.getData($stateParams, 'bunnerEnd');
    self.imageList = staticService.getData($stateParams, 'imageList');

    self.bunner = self.bunnerStart;
    self.attemptNum = 0;
    self.showComment = false;

    angular.element(document).ready(function() {

      var blockList = $('.gallery-item'),
          i;

      self.check = function(index) {
        self.imageList[index].checkedBlock = !self.imageList[index].checkedBlock;
      }

      // Click function on button "Check answer"
      self.checkAnswer = function(){
        if (self.attemptNum === 3) {
          self.attemptNum = 0;
        }  
        self.attemptNum = self.attemptNum + 1;

       for (i = 0; i < blockList.length; i++) {
        var index = Number($(blockList[i]).attr('data-number'));

         if (self.imageList[index].checkedBlock !== self.imageList[index].needCheckedAns) {
          self.commentTitle = 'Неправильный ответ';
          self.commentText = staticService.getMessage($stateParams, self.attemptNum);
          self.showComment = !self.showComment;
          return false;
         }
       }
       self.bunner = self.bunnerEnd;
       self.commentTitle = 'Правильный ответ';
       self.commentText = staticService.getMessage($stateParams, 0);
       self.showComment = !self.showComment;
      };
      
      // Click function on buttom "Restart"
      self.removeRestart = function(){

        self.bunner = self.bunnerStart;
        
        var numberArr = [],
            currentElemIndex;
        for (var i = 0; i < blockList.length; i++) {
            numberArr.push(i);
        }
        
        Array.prototype.shuffle = function() {
        	for (var i = this.length - 1; i > 0; i--) {
        		var num = Math.floor(Math.random() * (i + 1));
        		var d = this[num];
        		this[num] = this[i];
        		this[i] = d;
        	};
        };
  
        numberArr.shuffle();

        for (i = 0; i < self.imageList.length; i++) {
          self.imageList[i].checkedBlock = false;
        }
        
        // Element displacement
        currentElemIndex = numberArr[0];
        for (i = 1; i < blockList.length; i++) {
          $(blockList[currentElemIndex]).after(blockList[numberArr[i]]);
          currentElemIndex = numberArr[i];
        }
      };
    });
  });
angular.module('app')
  .component('taskRangeBlocksWithShelves', {
    templateUrl: 'js/components/task-range-blocks-with-shelves/taskRangeBlocksWithShelvesTmpl.html',
    controller: 'TaskRangeMovingBlocksCtrl',
    controllerAs: '$ctrl'
  })
  .controller('TaskRangeMovingBlocksCtrl', function($stateParams, staticService) {
    var self = this;
    
    self.state = false;
    self.attemptNum = 0;
    self.showComment = false;
    
    /**
    * Task: There are shelves with boxes. User needs to sort it on sections.
    *
    * Logic: 1. Fill blocks with true answers (add elements content and attribute [data-section])
    *        2. Start restart function to shuffle blocks with answers
    *        3. After click on the arrow change state arrow (they become disabled) during animation
    *        4. After "Check answer" we cover task new layer so events become disabled
    *        5. After "Restart" shuffle blocks with answers and stash covered layer
    */
    
    self.taskText = staticService.getData($stateParams, 'taskText');
    self.answerList = staticService.getData($stateParams, 'answerList');    
    
    angular.element(document).ready(function() {
    
      var blockList = $('.moving-blocks__item'),
          arrowUpList = $('.arrow_up'),
          arrowDownList = $('.arrow_down'),
          i;
      
      function animate(dir, thisH, thatH, thisStyle, thatStyle, thisElem, thatElem ) {
  
      	var duration = dir === -1 && thatStyle !== 0 || dir === 1 && thisStyle !== 0 ? 500 : 300,
          thisTik = thisH/duration,
      		thatTik = thatH/duration,
          thisStyleTik = thisStyle / duration,
          thatStyleTik = thatStyle / duration,
      		start = Date.now();
      	
      	// Disabled user actions, events during animation
      	var wrapper = $('.moving-blocks').css('pointer-events','none');
      	
      	// Add z-index to clicked element moves above another
      	thisElem.css('z-index','1');
      
      	var timer = setInterval(function() {
      	  
      	  var timePassed = Date.now() - start;
      
      	  if (timePassed >= duration) {
      	    clearInterval(timer);
      	    thisElem[0].style.top = '0px';
      	  	thatElem[0].style.top = '0px';
      	    if (dir > 0) {
      	    	thisElem.after( thatElem );
      	    } else {
      	    	thisElem.before( thatElem );
      	    }
      	    blockList = $('.moving-blocks__item');
      	    thisElem.css('z-index','0');
      	    wrapper = $('.moving-blocks').css('pointer-events','auto');
            thisElem.css('margin-top', thatStyle + 'px');
            thatElem.css('margin-top', thisStyle + 'px');
      	    return;
      	  }
      
      	  if (dir > 0) {
            thisElem[0].style.top = -timePassed * (thatTik + thisStyleTik) + 'px';
            thatElem[0].style.top = timePassed * (thisTik + thisStyleTik) + 'px';
      	  } else {
            thisElem[0].style.top = timePassed * (thatTik + thatStyleTik) + 'px';
            thatElem[0].style.top = -timePassed * (thisTik + thatStyleTik) + 'px';
      	  }      
      	}, 20);
      }
      
      // Function for block vertical size correction
      function findVerticalSize(elem) {
        var bordT = elem.outerWidth() - elem.innerWidth(),
            paddT = elem.innerWidth() - elem.width(),
            margT = elem.outerWidth(true) - elem.outerWidth(),
            height = elem.height();
            
        return {size: bordT + paddT + margT + height,
                style: Number($(elem).css('margin-top').split('px')[0])};
      }
      
      // Click function on arrows "Up"
      self.toArrowUp = function($event){
        var elem = $event.currentTarget,
            indexArrow = $.inArray(elem,arrowUpList);
  
        // not the top arrow
        if (indexArrow === 0 || indexArrow === -1) {
          return false;
        }
        
        animate(1, findVerticalSize(blockList.eq(indexArrow)).size, findVerticalSize(blockList.eq(indexArrow - 1)).size,
                             findVerticalSize(blockList.eq(indexArrow)).style, findVerticalSize(blockList.eq(indexArrow - 1)).style,
                             blockList.eq(indexArrow), blockList.eq(indexArrow - 1));
      }
      
      // Click function on arrows "Down"
      self.toArrowDown = function($event){
        var indexArrow = $.inArray($event.currentTarget,arrowDownList);
        
        // not the bottom arrow
        if (indexArrow === (arrowDownList.length - 1) || indexArrow === -1) {
          return;
        }
        animate(-1, findVerticalSize(blockList.eq(indexArrow)).size, findVerticalSize(blockList.eq(indexArrow + 1)).size,
                              findVerticalSize(blockList.eq(indexArrow)).style, findVerticalSize(blockList.eq(indexArrow + 1)).style,
                              blockList.eq(indexArrow), blockList.eq(indexArrow + 1));
      }
      
      // Click function on button "Check answer"
      self.checkAnswer = function(){
        if (self.attemptNum === 3) {
          self.attemptNum = 0;
        }  
        self.attemptNum = self.attemptNum + 1;

       for (i = 0; i < blockList.length; i++) {
         if ($(blockList[i]).attr('data-section') !== self.answerList[i].section) {
          self.commentTitle = 'Неправильный ответ';
          self.commentText = staticService.getMessage($stateParams, self.attemptNum);
          self.showComment = !self.showComment;
          if (self.attemptNum === 3) self.setRightOrder();
          return false;
         }
        }
        self.commentTitle = 'Правильный ответ';
        self.commentText = staticService.getMessage($stateParams, 0);
        self.showComment = !self.showComment;
      };
      
      // Click function on buttom "Restart"
      self.removeRestart = function(){
        
        var numberArr = [],
            currentElemIndex;
        for (var i = 0; i < blockList.length; i++) {
            numberArr.push(i);
        }
        
        Array.prototype.shuffle = function() {
        	for (var i = this.length - 1; i > 0; i--) {
        		var num = Math.floor(Math.random() * (i + 1));
        		var d = this[num];
        		this[num] = this[i];
        		this[i] = d;
        	};
        };
  
        numberArr.shuffle();
        
        // Element displacement
        currentElemIndex = numberArr[0];
        for (i = 1; i < blockList.length; i++) {
          $(blockList[currentElemIndex]).after(blockList[numberArr[i]]);
          currentElemIndex = numberArr[i];
        }
        
        // Add inline styles to place them on the true place
        blockList = $('.moving-blocks__item');
        for (i = 0; i < blockList.length; i++) {
          $(blockList[i]).css('margin-top', self.answerList[i].marginTop);
        }
      };

      self.setRightOrder = function () {
      //   for (var i = 0; i < self.answerList.length; i++) {
      //     blockList = $('.moving-blocks__item');
      //     for (var j = 0; j < self.answerList.length; j++) {
      //       console.log($(blockList[j]).attr('data-section') === self.answerList[i].section)
      //       if ($(blockList[j]).attr('data-section') === self.answerList[i].section) {
      //         $(blockList[j]).after(blockList[self.answerList.length - 1]);
      //       }
      //     }
      //   }   
      //   blockList = $('.moving-blocks__item');
      //   for (i = 0; i < blockList.length; i++) {
      //     $(blockList[i]).css('margin-top', self.answerList[i].marginTop);
      //   }     
      }
    });
  });
angular.module('app')
  .component('taskRangeTextBlocks', {
    templateUrl: 'js/components/task-range-text-blocks/taskRangeTextBlocksTmpl.html',
    controller: 'TaskRangeTextBlocksCtrl',
    controllerAs: '$ctrl'
  })
  .controller('TaskRangeTextBlocksCtrl', function($stateParams, staticService) {
    var self = this;
    
    self.state = false;
    
    /**
    * Task: There are shelves with boxes. User needs to sort it on sections.
    *
    * Logic: 1. Fill blocks with true answers (add elements content and attribute [data-section])
    *        2. Start restart function to shuffle blocks with answers
    *        3. After click on the arrow change state arrow (they become disabled) during animation
    *        4. After "Check answer" we cover task new layer so events become disabled
    *        5. After "Restart" shuffle blocks with answers and stash covered layer
    */
    
    self.taskText = staticService.getData($stateParams, 'taskText');
    self.answerList = staticService.getData($stateParams, 'answerList');    
    
    angular.element(document).ready(function() {
    
      var blockList = $('.moving-blocks__item'),
          arrowUpList = $('.arrow_up'),
          arrowDownList = $('.arrow_down'),
          i;
      
      function animate(dir, thisH, thatH, thisStyle, thatStyle, thisElem, thatElem ) {
  
      	var duration = dir === -1 && thatStyle !== 0 || dir === 1 && thisStyle !== 0 ? 500 : 300,
          thisTik = thisH/duration,
      		thatTik = thatH/duration,
          thisStyleTik = thisStyle / duration,
          thatStyleTik = thatStyle / duration,
      		start = Date.now();
      	
      	// Disabled user actions, events during animation
      	var wrapper = $('.moving-blocks').css('pointer-events','none');
      	
      	// Add z-index to clicked element moves above another
      	thisElem.css('z-index','1');
      
      	var timer = setInterval(function() {
      	  
      	  var timePassed = Date.now() - start;
      
      	  if (timePassed >= duration) {
      	    clearInterval(timer);
      	    thisElem[0].style.top = '0px';
      	  	thatElem[0].style.top = '0px';
      	    if (dir > 0) {
      	    	thisElem.after( thatElem );
      	    } else {
      	    	thisElem.before( thatElem );
      	    }
      	    blockList = $('.moving-blocks__item');
      	    thisElem.css('z-index','0');
      	    wrapper = $('.moving-blocks').css('pointer-events','auto');
            thisElem.css('margin-top', thatStyle + 'px');
            thatElem.css('margin-top', thisStyle + 'px');
      	    return;
      	  }
      
      	  if (dir > 0) {
            thisElem[0].style.top = -timePassed * (thatTik + thisStyleTik) + 'px';
            thatElem[0].style.top = timePassed * (thisTik + thisStyleTik) + 'px';
      	  } else {
            thisElem[0].style.top = timePassed * (thatTik + thatStyleTik) + 'px';
            thatElem[0].style.top = -timePassed * (thisTik + thatStyleTik) + 'px';
      	  }      
      	}, 20);
      }
      
      // Function for block vertical size correction
      function findVerticalSize(elem) {
        var bordT = elem.outerWidth() - elem.innerWidth(),
            paddT = elem.innerWidth() - elem.width(),
            margT = elem.outerWidth(true) - elem.outerWidth(),
            height = elem.height();
            
        return {size: bordT + paddT + margT + height,
                style: Number($(elem).css('margin-top').split('px')[0])};
      }
      
      // Click function on arrows "Up"
      self.toArrowUp = function($event){
        var elem = $event.currentTarget,
            indexArrow = $.inArray(elem,arrowUpList);
  
        // not the top arrow
        if (indexArrow === 0 || indexArrow === -1) {
          return false;
        }
        
        animate(1, findVerticalSize(blockList.eq(indexArrow)).size, findVerticalSize(blockList.eq(indexArrow - 1)).size,
                             findVerticalSize(blockList.eq(indexArrow)).style, findVerticalSize(blockList.eq(indexArrow - 1)).style,
                             blockList.eq(indexArrow), blockList.eq(indexArrow - 1));
      }
      
      // Click function on arrows "Down"
      self.toArrowDown = function($event){
        var indexArrow = $.inArray($event.currentTarget,arrowDownList);
        
        // not the bottom arrow
        if (indexArrow === (arrowDownList.length - 1) || indexArrow === -1) {
          return;
        }
        animate(-1, findVerticalSize(blockList.eq(indexArrow)).size, findVerticalSize(blockList.eq(indexArrow + 1)).size,
                              findVerticalSize(blockList.eq(indexArrow)).style, findVerticalSize(blockList.eq(indexArrow + 1)).style,
                              blockList.eq(indexArrow), blockList.eq(indexArrow + 1));
      }
      
      // Click function on button "Check answer"
      self.checkAnswer = function(){
       for (i = 0; i < blockList.length; i++) {
         if ($(blockList[i]).attr('data-section') !== self.answerList[i].section) {
           return alert('False');
         }
       }
       return alert('True');
      };
      
      // Click function on buttom "Restart"
      self.removeRestart = function(){
        
        var numberArr = [],
            currentElemIndex;
        for (var i = 0; i < blockList.length; i++) {
            numberArr.push(i);
        }
        
        Array.prototype.shuffle = function() {
        	for (var i = this.length - 1; i > 0; i--) {
        		var num = Math.floor(Math.random() * (i + 1));
        		var d = this[num];
        		this[num] = this[i];
        		this[i] = d;
        	};
        };
  
        numberArr.shuffle();
        
        // Element displacement
        currentElemIndex = numberArr[0];
        for (i = 1; i < blockList.length; i++) {
          $(blockList[currentElemIndex]).after(blockList[numberArr[i]]);
          currentElemIndex = numberArr[i];
        }
        
        // Add inline styles to place them on the true place
        blockList = $('.moving-blocks__item');
        for (i = 0; i < blockList.length; i++) {
          $(blockList[i]).css('margin-top', self.answerList[i].marginTop);
        }
      };
    });
  });
angular
.module('app')
.component('taskSingleChoice', {
  templateUrl: 'js/components/task-single-choice/taskSingleChoiceTmpl.html',
  controller: 'SingleChoiceCtrl',
  controllerAs: '$ctrl'
})
.controller('SingleChoiceCtrl', function($stateParams, staticService) {
  var self = this;

  self.taskText = staticService.getData($stateParams, 'taskText');
  self.questionList = staticService.getData($stateParams, 'questionList');
  
  self.active = [];
  self.state = 0;
  self.attemptNum = 0;

  for (var i = 0; i < self.questionList.length; i++) {
    self.active[i] = {};
    self.active[i].state = false;
    self.active[i].answer = '';
  }

  self.showComment = false;

  angular.element(document).ready(function() {

    var blockList = $('.task__single-choice-block'),
        itemList = [];

    for (var i = 0; i < blockList.length; i++) {
      itemList[i] = $(blockList[i]).find('.task__single-choice-item');
    }
    
    self.getNumber = function($event, index, parentIndex) {
      if (self.active[parentIndex].state === false) {
        self.state = self.state + 1;
        self.active[parentIndex].state = true;
      }
      self.active[parentIndex].answer = index;
    }

    self.checkAnswer = function() {
      if (self.attemptNum === 3) {
        self.attemptNum = 0;
      }  
      self.attemptNum = self.attemptNum + 1;

      for (var i = 0; i < self.questionList.length; i++) {
        if (self.questionList[i].rightAnswer !== Number(self.active[i].answer)) {
          self.commentTitle = 'Неправильный ответ';
          self.commentText = staticService.getMessage($stateParams, self.attemptNum);
          self.showComment = !self.showComment;
          if (self.attemptNum === 3) {
            for(var j = 0; j < self.questionList.length; j++) {
              self.active[j].state = true;
              self.active[j].answer = self.questionList[j].rightAnswer;
            }
          }
          return false;
        }
      }
      self.commentTitle = 'Правильный ответ';
      self.commentText = staticService.getMessage($stateParams, 0);
      self.showComment = !self.showComment;
      
    }

    self.removeRestart = function() {

    //   var numberArr,
    //       currentElemIndex;

      for (var i = 0; i < self.active.length; i++) {
        self.active[i].state = false;
        self.active[i].answer = '';
      }
      self.state = 0;
      
    //   Array.prototype.shuffle = function() {
    //     for (var i = this.length - 1; i > 0; i--) {
    //       var num = Math.floor(Math.random() * (i + 1));
    //       var d = this[num];
    //       this[num] = this[i];
    //       this[i] = d;
    //     };
    //   };

    //   for (var i = 0; i < blockList.length; i++) {
    //       numberArr.push(i);
    //   }

    //   numberArr.shuffle();
      
    //   // Element displacement
    //   currentElemIndex = numberArr[0];
    //   for (var j = 0; j < blockList.length; j++) {
    //     for (var i = 0; i < itemList[j].length; i++) {
    //       $(itemList[currentElemIndex]).after(itemList[numberArr[i]]);
    //     }
    //   }
    //   for (i = 1; i < blockList.length; i++) {
    //     $(blockList[currentElemIndex]).after(blockList[numberArr[i]]);
    //     currentElemIndex = numberArr[i];
    //   }
      
    //   // Add inline styles to place them on the true place
    //   blockList = $('.moving-blocks__item');
    //   for (i = 0; i < blockList.length; i++) {
    //     $(blockList[i]).css('margin-top', self.answerList[i].marginTop);
    //   }
    }

  });
})
angular
.module('app')
.component('taskSingleChoiceImg', {
	templateUrl: 'js/components/task-single-choice-img/taskSingleChoiceImg.html',
	controller: 'TaskSingleChoiceImgCtrl',
	controllerAs: '$ctrl'
})
.controller('TaskSingleChoiceImgCtrl', function($stateParams, staticService) {
	var self = this;

  self.answerList = staticService.getData($stateParams, 'answerList');
  self.bannerStart = staticService.getData($stateParams, 'bannerStart');
  self.bannerEnd = staticService.getData($stateParams, 'bannerEnd');

  self.banner = {},
  self.banner.src = self.bannerStart.src;
  self.banner.alt = self.bannerStart.alt;

  self.active = [];
  self.state = 0;
  self.attemptNum = 0;

  for (var i = 0; i < self.answerList.length; i++) {
    self.active[i] = {};
    self.active[i].state = false;
    self.active[i].answer = '';
  }

  self.showComment = false;

  angular.element(document).ready(function() {

    // var blockList = $('.task__single-choice-block'),
    //     itemList = [];

    // for (var i = 0; i < blockList.length; i++) {
    //   itemList[i] = $(blockList[i]).find('.task__single-choice-item');
    // }
    
    self.setColor = function($event, index, parentIndex) {
    	console.log($event, index, parentIndex)
      if (self.active[parentIndex].state === false) {
        self.state = self.state + 1;
        self.active[parentIndex].state = true;
      }
      self.active[parentIndex].answer = index;
    }

    self.checkAnswer = function() {
      if (self.attemptNum === 3) {
        self.attemptNum = 0;
      }  
      self.attemptNum = self.attemptNum + 1;

      for (var i = 0; i < self.answerList.length; i++) {
        if (self.answerList[i].rightAnswer !== Number(self.active[i].answer)) {
          self.commentTitle = 'Неправильный ответ';
          self.commentText = staticService.getMessage($stateParams, self.attemptNum);
          self.showComment = !self.showComment;
          if (self.attemptNum === 3) {
            for(var j = 0; j < self.questionList.length; j++) {
              self.active[j].state = true;
              self.active[j].answer = self.questionList[j].rightAnswer;
            }
          }
          return false;
        }
      }
      self.commentTitle = 'Правильный ответ';
      self.commentText = staticService.getMessage($stateParams, 0);
      self.showComment = !self.showComment;
      self.banner.src = self.bannerEnd.src;
		  self.banner.alt = self.bannerEnd.alt;
    }

    self.removeRestart = function() {

    //   var numberArr,
    //       currentElemIndex;

      for (var i = 0; i < self.active.length; i++) {
        self.active[i].state = false;
        self.active[i].answer = '';
      }
      self.state = 0;
      self.banner.src = self.bannerStart.src;
      self.banner.alt = self.bannerStart.alt;
      
    //   Array.prototype.shuffle = function() {
    //     for (var i = this.length - 1; i > 0; i--) {
    //       var num = Math.floor(Math.random() * (i + 1));
    //       var d = this[num];
    //       this[num] = this[i];
    //       this[i] = d;
    //     };
    //   };

    //   for (var i = 0; i < blockList.length; i++) {
    //       numberArr.push(i);
    //   }

    //   numberArr.shuffle();
      
    //   // Element displacement
    //   currentElemIndex = numberArr[0];
    //   for (var j = 0; j < blockList.length; j++) {
    //     for (var i = 0; i < itemList[j].length; i++) {
    //       $(itemList[currentElemIndex]).after(itemList[numberArr[i]]);
    //     }
    //   }
    //   for (i = 1; i < blockList.length; i++) {
    //     $(blockList[currentElemIndex]).after(blockList[numberArr[i]]);
    //     currentElemIndex = numberArr[i];
    //   }
      
    //   // Add inline styles to place them on the true place
    //   blockList = $('.moving-blocks__item');
    //   for (i = 0; i < blockList.length; i++) {
    //     $(blockList[i]).css('margin-top', self.answerList[i].marginTop);
    //   }
    }
  })
})
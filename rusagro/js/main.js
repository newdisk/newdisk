'use strict';

(function () {
  'use strict';

  config.$inject = ["$stateProvider", "$urlRouterProvider"];
  run.$inject = ["$rootScope", "$timeout", "$state", "staticService"];
  angular.module('app', ['ui.router', 'ngSanitize', 'ngAnimate']).constant('courseDataObj', courseStructure).constant('testDataObj', testStructure).config(config).run(run);

  /* @ngInject */
  function config($stateProvider, $urlRouterProvider) {

    $stateProvider.state('contents', {
      url: '/contents',
      views: {
        'header': {
          templateUrl: 'js/components/header/headerContentsTmpl.html',
          controller: 'HeaderContentsCtrl',
          controllerAs: '$ctrl'
        },
        'content': {
          templateUrl: 'pages/contents/index.html'
        }
      }
    }).state('page', {
      url: '/chapter/:module/page/:path',
      views: {
        'header': {
          templateUrl: 'js/components/header/headerTmpl.html',
          controller: 'HeaderCtrl',
          controllerAs: '$ctrl'
        },
        'content': {
          templateUrl: function templateUrl($stateParams) {
            var chapterName = Number($stateParams.module) > 9 ? 'chapter' + $stateParams.module : 'chapter0' + $stateParams.module,
                pageName = Number($stateParams.path) > 9 ? 'page' + $stateParams.path : 'page0' + $stateParams.path;

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
    });

    $urlRouterProvider.otherwise('/contents');
  }

  /* @ngInject */
  function run($rootScope, $timeout, $state, staticService) {
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, options) {

      // close all open modal
      staticService.closeModal();

      // stop audio
      staticService.stopAudio(true);

      // replace current position of audio slider to zero
      staticService.setAudioTime(0);
    });
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams, options) {
      $timeout(function () {
        // stop audio
        staticService.stopAudio(false);
      }, 100);
    });
  }
})();
(function () {
  'use strict';

  staticService.$inject = ["$document", "$timeout", "courseDataObj", "testDataObj"];
  angular.module('app').service('staticService', staticService);

  /* @ngInject */
  function staticService($document, $timeout, courseDataObj, testDataObj) {

    var modalWindow = [{
      type: "navModal",
      state: false
    }, {
      type: "glossaryModal",
      state: false
    }, {
      type: "statisticsModal",
      state: false
    }, {
      type: "exerciseModal",
      state: false,
      title: '',
      answer: '',
      comment: '',
      img: ''
    }, {
      type: "addInfoModal",
      state: false,
      content: ''
    }, {
      type: "zoomImg",
      state: false,
      src: '',
      alt: ''
    }];

    var audioTime = 0,
        stopAudio = false;

    /***************************************************************
    /	 For app Header
    /**************************************************************/

    // call getCourseName() from 'HeaderContentsCtrl' controller
    this.getCourseName = function () {
      return {
        course: courseDataObj.course,
        description: courseDataObj.description
      };
    };

    // call getChapterObj() from 'HeaderCtrl' controller
    this.getChapterObj = function (moduleNum) {
      return courseDataObj.chapters[moduleNum];
    };

    // show modal 
    this.showModal = function (type, commentNum, answer, module, page) {
      var element = modalWindow.filter(function (elem, index, array) {
        return elem.type === type;
      }),
          index = modalWindow.indexOf(element[0]);
      modalWindow[index].state = !modalWindow[index].state;
      if (typeof commentNum !== 'undefined') {
        modalWindow[index].title = answer ? 'Правильный ответ' : 'Неправильный ответ';
        modalWindow[index].answer = '';
        modalWindow[index].comment = courseDataObj.chapters[module].pages[page].messages[commentNum];
        if (commentNum === courseDataObj.chapters[module].pages[page].data.attempts) {
          modalWindow[index].img = 'last-attempt';
        } else if (answer) {
          modalWindow[index].img = 'true';
        } else {
          modalWindow[index].img = 'false';
        }
      }
    };

    this.getExerciseData = function () {
      return {
        title: modalWindow[3].title,
        comment: modalWindow[3].comment,
        img: modalWindow[3].img
      };
    };

    // send answer on query from HeaderCtrl
    this.getModalState = function (index) {
      return modalWindow[index].state;
    };

    // close modals on query from .run() on $stateChangeStart 
    this.closeModal = function () {
      modalWindow.forEach(function (elem, index, array) {
        elem.state = false;
      });
    };

    /***************************************************************
    /	 For app Footer
    /**************************************************************/

    this.getPageAmount = function (num) {
      return courseDataObj.chapters[num].pages.length;
    };

    /***************************************************************
    /	 For addInfo modal
    /**************************************************************/

    this.addInfo = function (content, state, heading) {
      modalWindow[4].content = content;
      modalWindow[4].state = state;
      modalWindow[4].heading = heading;
    };

    this.getAddInfo = function () {
      return modalWindow[4];
    };

    /***************************************************************
    /	 For <zoom-img></zoom-img> component
    /**************************************************************/

    this.zoomPicture = function (src, alt, state) {
      modalWindow[5].src = src;
      modalWindow[5].alt = alt;
      modalWindow[5].state = state;
    };

    this.getZoomPicture = function () {
      return modalWindow[5];
    };

    /***************************************************************
    /	 For <custom-audio></custom-audio>
    /**************************************************************/

    this.setAudioTime = function (time) {
      audioTime = time;
    };

    this.getAudioTime = function () {
      return audioTime;
    };

    this.stopAudio = function (bool) {
      stopAudio = bool;
    };

    this.getStopAudio = function () {
      return stopAudio;
    };

    var waitAudio = false;
    this.startAudio = function (toggler) {
      if (arguments.length === 0) {
        return waitAudio;
      };
      waitAudio = toggler;
    };

    /***************************************************************
    /	 For app Exercises
    /**************************************************************/

    // get exercise data object
    this.getExerciseObject = function ($stateParams) {
      return courseDataObj.chapters[$stateParams.module - 1].pages[$stateParams.path - 1].data;
    };

    // get exercise data array
    this.getData = function ($stateParams, prop) {
      return courseDataObj.chapters[$stateParams.module - 1].pages[$stateParams.path - 1].data[prop];
    };

    // get test data array
    this.getTestData = function ($stateParams) {
      return testDataObj.chapters[$stateParams.module - 1].pages.filter(function (elem) {
        return elem.id === Number($stateParams.path);
      })[0].data;
      // console.log(testDataObj.chapters[$stateParams.module - 1].pages.filter(function(elem) {
      // 	console.log(elem.id, $stateParams.path, 'elem.id' === $stateParams.path)
      // 	return 'elem.id' === $stateParams.path;
      // })
      // return testDataObj.chapters[$stateParams.module - 1].pages.filter(function(elem) {
      // 	return elem.id === $stateParams.path;
      // })
    };

    // get message array
    this.getMessage = function ($stateParams, num) {
      return courseDataObj.chapters[$stateParams.module - 1].pages[$stateParams.path - 1].messages[num];
    };
  }
})();
(function () {
  'use strict';

  userService.$inject = ["courseDataObj", "$document"];
  angular.module('app').service('userService', userService);

  /* @ngInject */
  function userService(courseDataObj, $document) {
    var userDataObj = courseDataObj.chapters.map(function (elem) {
      return {
        id: elem.id,
        visited: 1,
        completed: false,
        pages: elem.pages.map(function (item, index) {
          return {
            id: item.id,
            type: item.type,
            title: item.title,
            visited: index === 0 ? true : false,
            completed: ''
          };
        })
      };
    });

    /***************************************************************
    /	 For contents page
    /**************************************************************/
    this.getPageProgress = function (module) {
      return {
        visited: userDataObj[module].visited,
        completed: userDataObj[module].completed
      };
    };

    this.getPageVisit = function (module, page) {
      return userDataObj[module].pages[page].visited;
    };

    this.setPageVisit = function (module, page) {
      userDataObj[module].pages[page].visited = true;
      userDataObj[module].visited = userDataObj[module].visited > page ? userDataObj[module].visited : page + 1;
    };

    this.getExerciseArray = function (module) {
      return userDataObj[module].pages.filter(function (elem) {
        if (elem.type === 'complex_page' || elem.type === 'exercise' || elem.type === 'test') {
          return true;
        } else {
          return false;
        }
      });
    };

    /***************************************************************
    /	 Answer from exercise
    /**************************************************************/
    this.setUserProgress = function (completed, module, page) {
      userDataObj[module].pages[page].completed = completed;

      // Check amount of unsolved tasks
      var unsolvedTaskNum = _.filter(userDataObj[module].pages, function (elem) {
        if (elem.type === 'complex_page' || elem.type === 'exercise' || elem.type === 'test') {
          if (elem.completed !== true) return true;
        }
      }).length;
      if (unsolvedTaskNum === 0) userDataObj[module].completed = true;
    };
  }
})();
(function () {
  'use strict';

  CourseCtrl.$inject = ["$http", "$sce", "$stateParams", "staticService", "userService"];
  angular.module('app').controller('CourseCtrl', CourseCtrl);

  /* @ngInject */
  function CourseCtrl($http, $sce, $stateParams, staticService, userService) {
    var self = this;

    // add external svg sprite to app index.html
    self.$onInit = function () {
      $http({
        method: 'GET',
        url: 'img/svg-sprite.svg',
        cache: true
      }).then(function successCallback(response) {
        self.svgSprite = $sce.trustAsHtml(response.data);
      }, function errorCallback(response) {
        console.log("error svg sprite didn't load...");
      });
    };

    // get modal states to add disabled background or not
    self.showModal = function (index) {
      return staticService.getModalState(index);
    };

    // get the last visited page in the modules
    self.visitedPage = function (module) {
      return userService.getPageProgress(Number(module) - 1).visited;
    };

    // get the module progress state
    self.completedPage = function (module) {
      return userService.getPageProgress(Number(module) - 1).completed;
    };
  }
})();
(function () {
  'use strict';

  PageCtrl.$inject = ["$document", "staticService"];
  angular.module('app').controller('PageCtrl', PageCtrl);

  /* @ngInject */
  function PageCtrl($document, staticService) {
    var self = this;

    self.tabNum = 1;

    // uses for sync of audio and content changes (some kind of animation)
    self.getAudioTime = function () {
      return staticService.getAudioTime();
    };

    self.startAnimation = function () {
      staticService.startAudio(true);
      return self.animationBtnState = !self.animationBtnState;
    };
  }
})();
(function () {
  'use strict';

  AccordionCtrl.$inject = ["$scope", "$element", "$attrs"];
  AccordionPanelCtrl.$inject = ["$scope", "$element", "$attrs"];
  AccordionContentCtrl.$inject = ["$document", "$scope", "$element", "$attrs"];
  angular.module('app').component('accordion', {
    transclude: true,
    template: '<div class="accordion" ng-transclude></div>',
    controller: 'AccordionCtrl',
    controllerAs: '$ctrl'
  }).controller('AccordionCtrl', AccordionCtrl).component('accordionPanel', {
    require: {
      'parent': '^accordion'
    },
    bindings: {
      heading: '@'
    },
    transclude: true,
    templateUrl: 'js/components/accordion/accordionPanelTmpl.html',
    controller: 'AccordionPanelCtrl',
    controllerAs: '$ctrl'
  }).controller('AccordionPanelCtrl', AccordionPanelCtrl).controller('AccordionContentCtrl', AccordionContentCtrl);

  /* @ngInject */
  function AccordionCtrl($scope, $element, $attrs) {
    var self = this;

    var panels = [];
    // here we take the panel and add to our list of panels
    // to preselect the first panel we call turnOn function on the first panel
    self.addPanel = function (panel) {
      panels.push(panel);
      if ($attrs.firstOpen === 'true' && panel === panels[0]) {
        return false;
      }
      return true;
    };
    // when a panel is selected we would want to open the content
    // here we take the panel find it in our array and turn if on if not selected
    // and off it.
    self.selectPanel = function (panel, isCollapsed) {
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
  }

  /* @ngInject */
  function AccordionPanelCtrl($scope, $element, $attrs) {

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

    $scope.toggle = function () {
      // $scope.isCollapsed = !$scope.isCollapsed;
      self.parent.selectPanel(self, $scope.isCollapsed);
    };
  }

  /* @ngInject */
  function AccordionContentCtrl($document, $scope, $element, $attrs) {
    var element = $element[0];
    var start = 0;

    $scope.$watch($attrs.collapse, function (collapse) {

      var newHeight = collapse ? 0 : 1;
      if (newHeight === 1) {
        if (start === 0) {

          start = 1;
          // document.addEventListener("DOMContentLoaded",function() {
          (function (elem) {
            setTimeout(function () {
              console.log($(elem).height());
              return element.style.height = getElementAutoHeight() + 'px';
            }, 50);
          })(element);
        } else {
          return element.style.height = getElementAutoHeight() + 'px';
        }
        // })
      }
      return element.style.height = newHeight + 'px';
      console.log(newHeight);
      // var newHeight = collapse ? 0 : getElementAutoHeight();

      // element.style.height = newHeight + 'px';
    });

    function getElementAutoHeight() {
      console.log($(element).find('img').height());
      var currentHeight = getElementCurrentHeight();

      element.style.height = 'auto';
      var autoHeight = getElementCurrentHeight();

      element.style.height = currentHeight;
      // Force the browser to recalc height after moving it back to normal
      getElementCurrentHeight();

      return autoHeight;
    }

    function getElementCurrentHeight() {
      return element.offsetHeight;
    }
  }
})();
(function () {
  'use strict';

  AddInfoCtrl.$inject = ["$attrs", "$element", "staticService"];
  angular.module('app').component('addInfo', {
    bindings: {
      heading: '@',
      position: '@'
    },
    transclude: true,
    templateUrl: './js/components/add-info/addInfoTmpl.html',
    controller: 'AddInfoCtrl',
    controllerAs: '$ctrl'
  }).controller('AddInfoCtrl', AddInfoCtrl);

  /* @ngInject */
  function AddInfoCtrl($attrs, $element, staticService) {
    var self = this;

    self.getAddInfo = function () {
      staticService.addInfo($element.find('ng-transclude').prop('outerHTML'), true, $attrs.heading);
    };
  }
})();
(function () {
  'use strict';

  angular.module('app').component('buttons', {
    template: '<div class="btn-box">' + '<button class="btn btn_restart" ng-click="$ctrl.removeRestart()">Начать заново</button>' + '<button class="btn btn_answer" ng-click="$ctrl.checkAnswer()">Принять ответ</button>' + '</div>'
  });
})();
(function () {
  'use strict';

  carouselCtrl.$inject = ["$scope", "$stateParams", "staticService", "userService"];
  angular.module('app').component('carousel', {
    transclude: true,
    template: '<div class="carousel">\n\t\t              <button class="carousel__toggler carousel__toggler_left" ng-click="toPrevItem($event)">\n\t\t              \t<svg viewBox="0 0 50 60" width="50" height="60">\n\t\t\t\t\t\t\t\t\t\t\t<use xmlns:xlink="http://www.w3.org/1999/xlink" \n\t\t\t\t\t\t\t\t\t\t\t\t\t xlink:href="#carousel_arrow-left">\n\t\t\t\t\t\t\t\t\t\t\t</use>\n\t\t\t\t\t\t\t\t\t\t</svg>\n\t\t              </button>\n\t\t                <ul class="carousel__list" ng-transclude>\n\t\t                </ul>\n\t\t              <button class="carousel__toggler carousel__toggler_right" ng-click="toNextItem($event)">\n\t\t              \t<svg viewBox="0 0 50 60" width="50" height="60">\n\t\t\t\t\t\t\t\t\t\t\t<use xmlns:xlink="http://www.w3.org/1999/xlink" \n\t\t\t\t\t\t\t\t\t\t\t\t\t xlink:href="#carousel_arrow-right">\n\t\t\t\t\t\t\t\t\t\t\t</use>\n\t\t\t\t\t\t\t\t\t\t</svg>\n\t\t              </button>\n\t\t             </div>',
    controller: 'carouselCtrl'
  }).component('carouselItem', {
    bindings: {
      src: '@',
      alt: '@',
      title: '@'
    },
    transclude: true,
    template: '<li class="carousel__item">\n\t\t                <img class="carousel__img" ng-src="{{$ctrl.src}}" alt="{{$ctrl.alt}}" width="100%">\n\t\t                <div class="carousel__caption">\n\t\t                  <h3 class="carousel__caption-title">{{$ctrl.title}}</h3>\n\t\t                  <p class="carousel__caption-text" ng-transclude></p>\n\t\t                </div>\n\t\t              </li>'
  }).controller('carouselCtrl', carouselCtrl);

  /* @ngInject */
  function carouselCtrl($scope, $stateParams, staticService, userService) {
    var self = this;

    angular.element(document).ready(function () {
      var duration = 700;

      //move the last list item before the first item. The purpose of this is if the user clicks to slide left he will be able to see the last item.
      $('carousel-item:first').before($('carousel-item:last'));

      $scope.toPrevItem = function ($event) {
        var btn = $($event.currentTarget);
        btn.css('pointer-events', 'none');

        var itemWidth = $('carousel-item').outerWidth();

        /* same as for sliding right except that it's current left indent + the item width (for the sliding right it's - item_width) */
        var leftIndent = parseInt($('.carousel__list').css('left')) + itemWidth;

        $('.carousel__list:not(:animated)').animate({ 'left': leftIndent }, duration, function () {

          /* when sliding to left we are moving the last item before the first list item */
          $('carousel-item:first').before($('carousel-item:last'));

          /* and again, when we make that change we are setting the left indent of our unordered list to the default -210px */
          $('.carousel__list').css({ 'left': '-' + itemWidth + 'px' });

          btn.css('pointer-events', 'auto');
        });
      };

      $scope.toNextItem = function ($event) {
        var btn = $($event.currentTarget);
        btn.css('pointer-events', 'none');

        var itemWidth = $('carousel-item').outerWidth();

        //calculae the new left indent of the unordered list
        var leftIndent = parseInt($('.carousel__list').css('left')) - itemWidth;

        //make the sliding effect using jquery's anumate function '
        $('.carousel__list:not(:animated)').animate({ 'left': leftIndent }, duration, function () {

          //get the first list item and put it after the last list item (that's how the infinite effects is made) '
          $('carousel-item:last').after($('carousel-item:first'));

          //and get the left indent to the default -210px
          $('.carousel__list').css({ 'left': '-' + itemWidth + 'px' });

          btn.css('pointer-events', 'auto');
        });
      };

      $(window).resize(function () {
        $('.carousel__list').css({ 'left': '-' + $('carousel-item').outerWidth() + 'px' });
      });
    });
  }
})();

(function () {
  'use strict';

  CustomAudioCtrl.$inject = ["$document", "$interval", "staticService"];
  angular.module('app').component('customAudio', {
    bindings: {
      module: '@',
      page: '@'
    },
    templateUrl: 'js/components/custom-audio/customAudioTmpl.html',
    controller: 'CustomAudioCtrl',
    controllerAs: '$ctrl'
  }).controller('CustomAudioCtrl', CustomAudioCtrl);

  /* @ngInject */
  function CustomAudioCtrl($document, $interval, staticService) {
    var self = this;

    self.play = '#play'; // variable for play/pause btn that toggle icons
    self.mute = '#unmute'; // variable for mute/unmute btn that toggle icons
    self.volume = 1; // define volume in volume slider

    self.$onInit = function () {

      /* It's a better way to use createElement than create new Audio(), 
      /  because such object is easier to remove
       **/
      self.audio = $document[0].createElement('audio');
      self.audio.src = 'pages/chapter' + self.module + '/page' + self.page + '/audio/page-' + self.module + '-' + self.page + '.mp3';

      self.audio.oncanplaythrough = function () {

        self.changePlayPause = function () {

          if (self.audio.paused) {
            self.audio.play();
            self.play = '#pause';
          } else {
            self.audio.pause();
            self.play = '#play';
          }
        };

        self.updateSeekSlider = function () {
          var seekNewPos = self.audio.currentTime * (100 / self.audio.duration),
              // position in seek slider
          curmins = Math.floor(self.audio.currentTime / 60),
              // current minutes value
          cursecs = Math.floor(self.audio.currentTime - curmins * 60),
              // current seconds value
          durmins = Math.floor(self.audio.duration / 60),
              // audio duration in minutes
          dursecs = Math.floor(self.audio.duration - durmins * 60); // audio duration in rest seconds

          self.seekPos = Math.floor(seekNewPos);

          if (curmins < 10) {
            curmins = '0' + curmins;
          };
          if (cursecs < 10) {
            cursecs = '0' + cursecs;
          };
          if (durmins < 10) {
            durmins = '0' + durmins;
          };
          if (dursecs < 10) {
            dursecs = '0' + dursecs;
          };

          self.curTime = curmins + ':' + cursecs; // display current time in the audio player
          self.durTime = durmins + ':' + dursecs; //  display audio duration time in the audio player
          if (self.audio.currentTime === self.audio.duration) {
            self.play = '#play';
          }
        };

        self.changeSeekPos = function () {
          self.audio.currentTime = self.audio.duration * (self.seekPos / 100);
        };

        $interval(function () {

          if (!self.audio) return;
          self.updateSeekSlider();

          // set audio time position in staticService to animate images in pages
          staticService.setAudioTime(self.audio.currentTime);

          // listen call from staticService at page state change
          if (staticService.getStopAudio()) {
            self.audio.pause();
            self.audio = null;
            return;
          }

          // start audio after click on btn_animation
          if (staticService.startAudio()) {
            self.audio.play();
            self.play = '#pause';
            staticService.startAudio(false);
          }
        }, 100);

        self.changeMuteState = function () {
          self.mute = '#unmute';

          if (self.audio.muted) {
            self.audio.muted = false;
            self.mute = '#unmute';
          } else {
            self.audio.muted = true;
            self.mute = '#mute';
          }
        };

        self.changeVolume = function () {
          self.audio.volume = self.volume;
        };

        self.restart = function () {
          self.audio.currentTime = 0;
          self.audio.play();
          self.play = '#pause';
        };
      };
    };
  }
})();
(function () {
  'use strict';

  FooterCtrl.$inject = ["$state", "$stateParams", "staticService", "userService"];
  angular.module('app').controller('FooterCtrl', FooterCtrl);

  /* @ngInject */
  function FooterCtrl($state, $stateParams, staticService, userService) {
    var self = this;

    self.moduleNum = $stateParams.module > 9 ? $stateParams.module : '0' + $stateParams.module;
    self.pageNum = $stateParams.path > 9 ? $stateParams.path : '0' + $stateParams.path;

    self.curPageNum = $stateParams.path;
    self.pageAmount = '' + staticService.getPageAmount(Number($stateParams.module) - 1);

    self.toBack = function () {
      if (self.curPageNum !== '1') {
        $state.go('page', { module: $stateParams.module, path: Number(self.curPageNum) - 1 });
      }
    };

    self.toForward = function () {
      if (self.curPageNum !== self.pageAmount) {
        userService.setPageVisit(Number($stateParams.module) - 1, Number(self.curPageNum));
        $state.go('page', { module: $stateParams.module, path: Number(self.curPageNum) + 1 });
      }
    };
  }
})();
(function () {
  'use strict';

  HeaderContentsCtrl.$inject = ["staticService"];
  angular.module('app').controller('HeaderContentsCtrl', HeaderContentsCtrl);

  /* @ngInject */
  function HeaderContentsCtrl(staticService) {
    var self = this;

    //get course and description data
    self.courseTitle = staticService.getCourseName();
  }
})();
(function () {
  'use strict';

  HeaderCtrl.$inject = ["$stateParams", "staticService", "userService"];
  angular.module('app').controller('HeaderCtrl', HeaderCtrl);

  /* @ngInject */
  function HeaderCtrl($stateParams, staticService, userService) {
    var self = this;

    // get module data
    self.chapterPages = staticService.getChapterObj(Number($stateParams.module) - 1);

    self.title = {
      module: self.chapterPages.title,
      exercise: self.chapterPages.pages[Number($stateParams.path) - 1].title
    };

    // remain state one button active and others disabled
    self.showModal = function (index) {
      return staticService.getModalState(index);
    };

    self.getExerciseData = function () {
      return staticService.getExerciseData();
    };

    self.closeModal = function () {
      staticService.closeModal();
    };

    /* functions for modal windows appearing */

    self.toggleNavigation = function () {
      if ($(this).hasClass('btn_nav-active')) {
        staticService.closeModal();
      } else {
        staticService.showModal('navModal');
      };
    };

    self.toggleGlossary = function () {
      if ($(this).hasClass('btn_nav-active')) {
        staticService.closeModal();
      } else {
        staticService.showModal('glossaryModal');
      };
    };

    self.toggleStatistics = function () {
      if ($(this).hasClass('btn_nav-active')) {
        staticService.closeModal();
      } else {
        staticService.showModal('statisticsModal');
      };
    };

    self.getUserObj = function () {
      return userService.getExerciseArray(Number($stateParams.module) - 1);
    };

    /* show number of completed tasks in statistics modal */
    self.getCompletedTaskNumber = function () {
      return userService.getExerciseArray(Number($stateParams.module) - 1).filter(function (elem) {
        if (elem.completed) {
          return true;
        } else {
          return false;
        }
      });
    };

    self.getPageVisit = function (page) {
      return userService.getPageVisit(Number($stateParams.module) - 1, Number(page));
    };

    /* for addInfo modal */

    self.addInfo = function () {
      return staticService.getAddInfo();
    };

    /* for <zoom-img></zoom-img> component */

    self.value = 100;

    self.picture = function () {
      return staticService.getZoomPicture();
    };

    self.definition = [{
      term: '5S',
      description: 'система организации и поддержания в порядке вашего рабочего места.'
    }, {
      term: 'RACI-матрица ответственности',
      description: 'общая схема распределения персональной ответственности.'
    }, {
      term: 'SOP',
      description: 'стандартные операционные процедуры, в которых описана последовательность конкретных шагов в рамках той или иной активности.'
    }, {
      term: 'Карта процессов',
      description: 'это схематичный документ, отображающий процессы шаг за шагом, в структурированном виде, разбитый на несколько уровней.'
    }, {
      term: 'Макропроцессы',
      description: 'это бизнес-процессы, которые организуют деятельность предприятия на самом высоком уровне. Главный макропроцесс должен быть обязательно связан с продуктом, который производит предприятие.'
    }, {
      term: 'Процесс',
      description: 'это любые действия, которые являются средством для превращения входных данных/материалов в продукцию/услуги с целью удовлетворения нужд потребителя/внутреннего клиента.'
    }];
  }
})();
(function () {
  'use strict';

  TaskFillingFieldsCtrl.$inject = ["$stateParams", "$document", "staticService", "userService"];
  angular.module('app').controller('TaskFillingFieldsCtrl', TaskFillingFieldsCtrl);

  /* @ngInject */
  function TaskFillingFieldsCtrl($stateParams, $document, staticService, userService) {
    var self = this,
        attemptNum = 0; // attempt number

    self.taskData = staticService.getExerciseObject($stateParams);

    /* 
    *  self.taskData - the main object for this exercise
    *
    *  self.taskData = {
    *    attempts: 3,                                 amount of attempt
    *    showAnswer: true/false,                      show/not show right answer after final attempt
    *    answerList: ["",...,""]                      answers in string format
    *  }
    */

    self.taskData.userList = [];
    self.btnDisabledState = {
      restart: false,
      answer: false
    };

    angular.element($document).ready(function () {

      self.getBtnState = function () {
        return self.btnDisabledState;
      };

      // check answers
      self.checkAnswer = function () {
        var answer;
        self.btnDisabledState.answer = true;
        attemptNum = attemptNum + 1;

        for (var i = 0; i < self.taskData.answerList.length; i++) {
          if (self.taskData.answerList[i] !== $.trim(self.taskData.userList[i]).replace('.', ',')) {
            answer = false;
          }
        };

        if (answer === false) {
          if (attemptNum === self.taskData.attempts) {
            if (self.taskData.showAnswer) {
              for (var i = 0; i < self.taskData.answerList.length; i++) {
                self.taskData.userList[i] = self.taskData.answerList[i];
              }
            }
            attemptNum = 0;
            self.btnDisabledState.restart = true;

            // send data to userService (needs for statistics), query to staticService to show modal with comment
            userService.setUserProgress(false, Number($stateParams.module) - 1, Number($stateParams.path) - 1);
            return staticService.showModal('exerciseModal', self.taskData.attempts, false, Number($stateParams.module) - 1, Number($stateParams.path) - 1);
          }

          // send data to userService (needs for statistics), query to staticService to show modal with comment
          userService.setUserProgress(false, Number($stateParams.module) - 1, Number($stateParams.path) - 1);
          return staticService.showModal('exerciseModal', attemptNum, false, Number($stateParams.module) - 1, Number($stateParams.path) - 1);
        }
        self.btnDisabledState.restart = true;

        // send data to userService (needs for statistics), query to staticService to show modal with comment
        userService.setUserProgress(true, Number($stateParams.module) - 1, Number($stateParams.path) - 1);
        return staticService.showModal('exerciseModal', 0, true, Number($stateParams.module) - 1, Number($stateParams.path) - 1);
      };

      self.removeRestart = function () {
        self.btnDisabledState.answer = false;
        self.taskData.userList = [];
      };
    });
  };
})();
(function () {
  'use strict';

  TaskRangingCtrl.$inject = ["$stateParams", "staticService", "userService"];
  angular.module('app').controller('TaskRangingCtrl', TaskRangingCtrl);

  /* @ngInject */
  function TaskRangingCtrl($stateParams, staticService, userService) {
    var self = this;

    self.state = false;
    self.attemptNum = 0;
    self.showComment = false;

    /**
    * Task: There are shelves with boxes. User needs to sort them on sections.
    *
    * Logic: 1. Fill blocks with true answers (add elements content and attribute [data-section])
    *        2. Start restart function to shuffle blocks with answers
    *        3. After click on the arrow change state arrow (they become disabled) during animation
    *        4. After "Check answer" we cover task new layer so events become disabled
    *        5. After "Restart" shuffle blocks with answers and stash covered layer
    */

    self.taskText = staticService.getData($stateParams, 'taskText');
    self.answerList = staticService.getData($stateParams, 'answerList');

    angular.element(document).ready(function () {

      var blockList = $('.ranging-blocks__item'),
          arrowUpList = $('.arrow_up'),
          arrowDownList = $('.arrow_down'),
          i;

      function animate(dir, thisH, thatH, thisStyle, thatStyle, thisElem, thatElem) {

        var duration = dir === -1 && thatStyle !== 0 || dir === 1 && thisStyle !== 0 ? 500 : 300,
            thisTik = thisH / duration,
            thatTik = thatH / duration,
            thisStyleTik = thisStyle / duration,
            thatStyleTik = thatStyle / duration,
            start = Date.now();

        // Disabled user actions, events during animation
        var wrapper = $('.ranging-blocks').css('pointer-events', 'none');

        // Add z-index to clicked element moves above another
        thisElem.css('z-index', '1');

        var timer = setInterval(function () {

          var timePassed = Date.now() - start;

          if (timePassed >= duration) {
            clearInterval(timer);
            thisElem[0].style.top = '0px';
            thatElem[0].style.top = '0px';
            if (dir > 0) {
              thisElem.after(thatElem);
            } else {
              thisElem.before(thatElem);
            }
            blockList = $('.ranging-blocks__item');
            thisElem.css('z-index', '0');
            wrapper = $('.ranging-blocks').css('pointer-events', 'auto');
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

        return { size: bordT + paddT + margT + height,
          style: Number($(elem).css('margin-top').split('px')[0]) };
      }

      // Click function on arrows "Up"
      self.toArrowUp = function ($event) {
        var elem = $event.currentTarget,
            indexArrow = $.inArray(elem, arrowUpList);

        // not the top arrow
        if (indexArrow === 0 || indexArrow === -1) {
          return;
        }

        animate(1, findVerticalSize(blockList.eq(indexArrow)).size, findVerticalSize(blockList.eq(indexArrow - 1)).size, findVerticalSize(blockList.eq(indexArrow)).style, findVerticalSize(blockList.eq(indexArrow - 1)).style, blockList.eq(indexArrow), blockList.eq(indexArrow - 1));
      };

      // Click function on arrows "Down"
      self.toArrowDown = function ($event) {
        var indexArrow = $.inArray($event.currentTarget, arrowDownList);

        // not the bottom arrow
        if (indexArrow === arrowDownList.length - 1 || indexArrow === -1) {
          return;
        }
        animate(-1, findVerticalSize(blockList.eq(indexArrow)).size, findVerticalSize(blockList.eq(indexArrow + 1)).size, findVerticalSize(blockList.eq(indexArrow)).style, findVerticalSize(blockList.eq(indexArrow + 1)).style, blockList.eq(indexArrow), blockList.eq(indexArrow + 1));
      };

      // Click function on button "Check answer"
      self.checkAnswer = function () {
        if (self.attemptNum === 3) {
          self.attemptNum = 0;
        }
        self.attemptNum = self.attemptNum + 1;

        for (i = 0; i < blockList.length; i++) {
          if ($(blockList[i]).attr('data-section') !== self.answerList[i].section) {
            if (self.attemptNum === 3) self.setRightOrder();
            userService.setUserProgress(false, Number($stateParams.module) - 1, Number($stateParams.path) - 1);
            return staticService.showModal('exerciseModal', self.attemptNum, false, Number($stateParams.module) - 1, Number($stateParams.path) - 1);
          }
        }
        userService.setUserProgress(true, Number($stateParams.module) - 1, Number($stateParams.path) - 1);
        staticService.showModal('exerciseModal', 0, true, Number($stateParams.module) - 1, Number($stateParams.path) - 1);
      };

      // Click function on buttom "Restart"
      self.removeRestart = function () {

        var numberArr = [],
            currentElemIndex;
        for (var i = 0; i < blockList.length; i++) {
          numberArr.push(i);
        }

        numberArr = _.shuffle(numberArr);

        // Element displacement
        currentElemIndex = numberArr[0];
        for (i = 1; i < blockList.length; i++) {
          $(blockList[currentElemIndex]).after(blockList[numberArr[i]]);
          currentElemIndex = numberArr[i];
        }

        // Add inline styles to place them on the true place
        blockList = $('.ranging-blocks__item');
        for (i = 0; i < blockList.length; i++) {
          $(blockList[i]).css('margin-top', self.answerList[i].marginTop);
        }
      };

      self.removeRestart();

      self.setRightOrder = function () {
        //   for (var i = 0; i < self.answerList.length; i++) {
        //     blockList = $('.ranging-blocks__item');
        //     for (var j = 0; j < self.answerList.length; j++) {
        //       console.log($(blockList[j]).attr('data-section') === self.answerList[i].section)
        //       if ($(blockList[j]).attr('data-section') === self.answerList[i].section) {
        //         $(blockList[j]).after(blockList[self.answerList.length - 1]);
        //       }
        //     }
        //   }   
        //   blockList = $('.ranging-blocks__item');
        //   for (i = 0; i < blockList.length; i++) {
        //     $(blockList[i]).css('margin-top', self.answerList[i].marginTop);
        //   }     
      };
    });
  }
})();
(function () {
  'use strict';

  TaskRangingSortCtrl.$inject = ["$stateParams", "$element", "$document", "staticService", "userService"];
  angular.module('app').controller('TaskRangingSortCtrl', TaskRangingSortCtrl);

  /* @ngInject */
  function TaskRangingSortCtrl($stateParams, $element, $document, staticService, userService) {
    var self = this,
        attemptNum = 0,
        // attempt number
    sortArr = $($element).find('.sort__content');

    self.taskData = staticService.getExerciseObject($stateParams);

    self.btnDisabledState = {
      restart: false,
      answer: false
    };

    $($element).find('.sort').sortable({
      containment: '.sort-wrapper'
    });
    $('.sort').disableSelection();

    angular.element($document).ready(function () {

      self.getBtnState = function () {
        return self.btnDisabledState;
      };

      // check answers
      self.checkAnswer = function () {
        var answerList = $($element).find('.sort__content');

        self.btnDisabledState.answer = true;
        attemptNum = attemptNum + 1;

        for (var i = 0; i < sortArr.length; i++) {
          if ($.trim(answerList[i].innerHTML) !== $.trim(sortArr[i].innerHTML)) {

            // use data from courseStructure. Property .attempts need to show comment and show correct answers if this option is activated in courseStructure
            if (attemptNum === self.taskData.attempts) {
              if (self.taskData.showAnswer) {
                showAnswer();
              };
              attemptNum = 0;
              self.btnDisabledState.restart = true;

              // send data to userService (needs for statistics), query to staticService to show modal with comment
              userService.setUserProgress(false, Number($stateParams.module) - 1, Number($stateParams.path) - 1);
              return staticService.showModal('exerciseModal', self.taskData.attempts, false, Number($stateParams.module) - 1, Number($stateParams.path) - 1);
            }

            // send data to userService (needs for statistics), query to staticService to show modal with comment
            userService.setUserProgress(false, Number($stateParams.module) - 1, Number($stateParams.path) - 1);
            return staticService.showModal('exerciseModal', attemptNum, false, Number($stateParams.module) - 1, Number($stateParams.path) - 1);
          }
        }
        self.btnDisabledState.restart = true;

        // send data to userService (needs for statistics), query to staticService to show modal with comment
        userService.setUserProgress(true, Number($stateParams.module) - 1, Number($stateParams.path) - 1);
        return staticService.showModal('exerciseModal', 0, true, Number($stateParams.module) - 1, Number($stateParams.path) - 1);
      };

      // show answer on the final attempt
      function showAnswer() {

        // Element displacement
        for (var i = 1; i < sortArr.length; i++) {
          $(sortArr[i - 1]).after(sortArr[i]);
        }
      }

      // restart
      self.removeRestart = function () {
        var sortList = $($element).find('.sort__content'),
            numberArr = [],
            currentElemIndex;

        self.btnDisabledState.answer = false;

        for (var i = 0; i < sortList.length; i++) {
          numberArr.push(i);
        }

        if (self.taskData.shuffle) numberArr = _.shuffle(numberArr);

        // Element displacement
        currentElemIndex = numberArr[0];
        for (i = 1; i < sortList.length; i++) {
          $(sortList[currentElemIndex]).after(sortList[numberArr[i]]);
          currentElemIndex = numberArr[i];
        }
      };

      // restart test before user start 
      self.removeRestart();
    });
  };
})();
(function () {
  'use strict';

  TaskRangingSwapableCtrl.$inject = ["$stateParams", "staticService", "userService"];
  angular.module('app').controller('TaskRangingSwapableCtrl', TaskRangingSwapableCtrl);

  /* @ngInject */
  function TaskRangingSwapableCtrl($stateParams, staticService, userService) {
    var self = this,
        rightOrder = $('.sort').find('div'),
        fixedBlockList = $('.fixed'),
        fixedBlockPos = [],
        attemptNum = 0;

    self.taskData = staticService.getExerciseObject($stateParams);
    self.disabledBtn = false;

    if (fixedBlockList.length) {
      for (var i = 0; i < rightOrder.length; i++) {
        if ($(rightOrder[i]).hasClass('fixed')) fixedBlockPos.push(i);
      }
    }
    console.log(fixedBlockPos);

    $(".swapable").draggable({
      zIndex: 2,
      containment: '.sort-wrapper',
      start: function start(e, ui) {},
      stop: function stop(e, ui) {
        console.log(ui);
        ui.helper[0].style.top = '0px';
        ui.helper[0].style.left = '0px';
      }
    }).droppable({
      drop: function drop(event, ui) {
        // console.log('куда =>',$(this).get(0))
        //  console.log('что =>',$(ui.draggable).get(0))
        swapNodes($(this).get(0), $(ui.draggable).get(0));
      } });

    function swapNodes(a, b) {
      if (a.classList.contains('fixed')) {
        console.warn('drop on fixed');
        return;
      }
      var aparent = a.parentNode;
      var asibling = a.nextSibling === b ? a : a.nextSibling;
      b.parentNode.insertBefore(a, b);
      aparent.insertBefore(b, asibling);

      b.style.left = '0px';
      b.style.top = '0px';
    }

    // check answers
    self.checkAnswer = function () {
      var answerList = $('.sort').find('div');

      attemptNum = attemptNum + 1;
      for (var i = 0; i < rightOrder.length; i++) {
        if ($(answerList[i]).index($(rightOrder)) !== i) {
          // use data from courseStructure. Property .attempts need to show comment and show correct answers if this option is activated in courseStructure
          if (attemptNum === self.taskData.attempts) {
            if (self.taskData.showAnswer) {
              self.disabledBtn = true;
              showAnswer();
            };
            attemptNum = 0;
            // send data to userService (needs for statistics), query to staticService to show modal with comment
            userService.setUserProgress(false, Number($stateParams.module) - 1, Number($stateParams.path) - 1);
            return staticService.showModal('exerciseModal', self.taskData.attempts, false, Number($stateParams.module) - 1, Number($stateParams.path) - 1);
          }
          // send data to userService (needs for statistics), query to staticService to show modal with comment
          userService.setUserProgress(false, Number($stateParams.module) - 1, Number($stateParams.path) - 1);
          return staticService.showModal('exerciseModal', attemptNum, false, Number($stateParams.module) - 1, Number($stateParams.path) - 1);
        }
      }
      self.disabledBtn = true;
      // send data to userService (needs for statistics), query to staticService to show modal with comment
      userService.setUserProgress(true, Number($stateParams.module) - 1, Number($stateParams.path) - 1);
      return staticService.showModal('exerciseModal', 0, true, Number($stateParams.module) - 1, Number($stateParams.path) - 1);
    };

    // show answer on the final attempt
    function showAnswer() {

      // Element displacement
      var currentElemIndex = 0;
      for (i = 1; i < rightOrder.length; i++) {
        $(rightOrder[currentElemIndex]).after(rightOrder[i]);
        currentElemIndex = i;
      }
    }

    // restart
    self.removeRestart = function () {
      var
      // sortObj = {
      //   initialArr: $($element).find('.sort').find('.sort__content, .sort__static'),
      //   staticBlockPos: [],
      //   finalArr: []
      // },
      numberArr = [],
          currentElemIndex;

      // for (var i = 0; i < sortObj.initialArr.length; i++) {
      //   if ($(sortObj.initialArr[i]).hasClass('sort__static')) sortObj.staticBlockPos.push(i);
      // }

      for (var i = 0; i < rightOrder.length; i++) {
        numberArr.push(i);
      }

      if (self.taskData.shuffle) numberArr = _.shuffle(numberArr);

      // Element displacement
      currentElemIndex = numberArr[0];
      for (i = 1; i < rightOrder.length; i++) {
        $(rightOrder[currentElemIndex]).after(rightOrder[numberArr[i]]);
        currentElemIndex = numberArr[i];
      }

      var newOrder = $('.sort').find('div');

      if (fixedBlockList.length) {
        for (var i = 0; i < fixedBlockList.length; i++) {
          $(newOrder[newOrder.length - 1]).after(fixedBlockList[i]);
        }
        newOrder = $('.sort').find('div');
        for (var i = 0; i < fixedBlockList.length; i++) {
          $(newOrder[fixedBlockPos[i]]).before(fixedBlockList[i]);
          newOrder = $('.sort').find('div');
        }
      };

      // sortObj.finalArr = $($element).find('.sort').find('.sort__content, .sort__static');
      // if (sortObj.staticBlockPos.length > 1) {
      //   for (var i = 1; i < sortObj.finalArr.length; i++) {
      //     $(sortObj.initialArr[sortObj.staticBlockPos[i]]).after(sortObj.finalArr[sortObj.staticBlockPos[i] - 1]);
      //   }
      // }
    };

    // restart test before user start 
    self.removeRestart();
  };
})();
(function () {
  'use strict';

  angular.module('app').component('taskRangingText', {
    bindings: {
      shuffle: '@',
      lastAttempt: '@',
      showAnswer: '@'
    },
    templateUrl: 'js/components/task-ranging/taskRangingTextTmpl.html',
    controller: 'TaskRangingCtrl',
    controllerAs: '$ctrl'
  });
})();
(function () {
  'use strict';

  TaskRangingTextCtrl.$inject = ["$stateParams", "staticService", "userService"];
  angular.module('app').component('taskRangingTextOl', {
    bindings: {
      shuffle: '@',
      lastAttempt: '@',
      showAnswer: '@'
    },
    templateUrl: 'js/components/task-ranging/taskRangingTextOlTmpl.html',
    controller: 'TaskRangingTextCtrl',
    controllerAs: '$ctrl'
  }).controller('TaskRangingTextCtrl', TaskRangingTextCtrl);

  /* @ngInject */
  function TaskRangingTextCtrl($stateParams, staticService, userService) {
    var self = this;

    self.state = false;
    self.attemptNum = 0;
    self.showComment = false;

    /**
    * Task: There are shelves with boxes. User needs to sort them on sections.
    *
    * Logic: 1. Fill blocks with true answers (add elements content and attribute [data-section])
    *        2. Start restart function to shuffle blocks with answers
    *        3. After click on the arrow change state arrow (they become disabled) during animation
    *        4. After "Check answer" we cover task new layer so events become disabled
    *        5. After "Restart" shuffle blocks with answers and stash covered layer
    */

    self.taskText = staticService.getData($stateParams, 'taskText');
    self.answerList = staticService.getData($stateParams, 'answerList');

    angular.element(document).ready(function () {

      var blockList = $('.ranging-blocks__item'),
          arrowUpList = $('.arrow_up'),
          arrowDownList = $('.arrow_down'),
          i;

      function animate(dir, thisH, thatH, thisStyle, thatStyle, thisElem, thatElem) {

        var duration = dir === -1 && thatStyle !== 0 || dir === 1 && thisStyle !== 0 ? 500 : 300,
            thisTik = thisH / duration,
            thatTik = thatH / duration,
            thisStyleTik = thisStyle / duration,
            thatStyleTik = thatStyle / duration,
            start = Date.now();

        // Disabled user actions, events during animation
        var wrapper = $('.ranging-blocks').css('pointer-events', 'none');

        // Add z-index to clicked element moves above another
        thisElem.css('z-index', '1');

        var timer = setInterval(function () {

          var timePassed = Date.now() - start;

          if (timePassed >= duration) {
            clearInterval(timer);
            thisElem[0].style.top = '0px';
            thatElem[0].style.top = '0px';
            if (dir > 0) {
              thisElem.after(thatElem);
            } else {
              thisElem.before(thatElem);
            }
            blockList = $('.ranging-blocks__item');
            thisElem.css('z-index', '0');
            wrapper = $('.ranging-blocks').css('pointer-events', 'auto');
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

        return { size: bordT + paddT + margT + height,
          style: Number($(elem).css('margin-top').split('px')[0]) };
      }

      // Click function on arrows "Up"
      self.toArrowUp = function ($event) {
        var elem = $event.currentTarget,
            indexArrow = $.inArray(elem, arrowUpList);

        // not the top arrow
        if (indexArrow === 0 || indexArrow === -1) {
          return;
        }

        animate(1, findVerticalSize(blockList.eq(indexArrow)).size, findVerticalSize(blockList.eq(indexArrow - 1)).size, findVerticalSize(blockList.eq(indexArrow)).style, findVerticalSize(blockList.eq(indexArrow - 1)).style, blockList.eq(indexArrow), blockList.eq(indexArrow - 1));
      };

      // Click function on arrows "Down"
      self.toArrowDown = function ($event) {
        var indexArrow = $.inArray($event.currentTarget, arrowDownList);

        // not the bottom arrow
        if (indexArrow === arrowDownList.length - 1 || indexArrow === -1) {
          return;
        }
        animate(-1, findVerticalSize(blockList.eq(indexArrow)).size, findVerticalSize(blockList.eq(indexArrow + 1)).size, findVerticalSize(blockList.eq(indexArrow)).style, findVerticalSize(blockList.eq(indexArrow + 1)).style, blockList.eq(indexArrow), blockList.eq(indexArrow + 1));
      };

      // Click function on button "Check answer"
      self.checkAnswer = function () {
        if (self.attemptNum === 3) {
          self.attemptNum = 0;
        }
        self.attemptNum = self.attemptNum + 1;

        for (i = 0; i < blockList.length; i++) {
          if ($(blockList[i]).attr('data-section') !== self.answerList[i].section) {
            if (self.attemptNum === 3) self.setRightOrder();
            userService.setUserProgress(false, Number($stateParams.module) - 1, Number($stateParams.path) - 1);
            return staticService.showModal('exerciseModal', self.attemptNum, false, Number($stateParams.module) - 1, Number($stateParams.path) - 1);
          }
        }
        userService.setUserProgress(true, Number($stateParams.module) - 1, Number($stateParams.path) - 1);
        staticService.showModal('exerciseModal', 0, true, Number($stateParams.module) - 1, Number($stateParams.path) - 1);
      };

      // Click function on buttom "Restart"
      self.removeRestart = function () {

        var numberArr = [],
            currentElemIndex;
        for (var i = 0; i < blockList.length; i++) {
          numberArr.push(i);
        }

        numberArr = _.shuffle(numberArr);

        // Element displacement
        currentElemIndex = numberArr[0];
        for (i = 1; i < blockList.length; i++) {
          $(blockList[currentElemIndex]).after(blockList[numberArr[i]]);
          currentElemIndex = numberArr[i];
        }

        // Add inline styles to place them on the true place
        blockList = $('.ranging-blocks__item');
        for (i = 0; i < blockList.length; i++) {
          $(blockList[i]).css('margin-top', self.answerList[i].marginTop);
        }
      };

      self.removeRestart();

      self.setRightOrder = function () {
        var rightOrderedList = blockList.map(function (i, elem) {
          return {
            index: i,
            rightIndex: $(elem).attr('data-section')
          };
        });
        rightOrderedList.sort(function (a, b) {
          return a.rightIndex - b.rightIndex;
        });
        console.log('rightOrderedList', rightOrderedList);
        // Element displacement
        var currentElemIndex = rightOrderedList[0].index;
        for (i = 1; i < blockList.length; i++) {
          console.log(blockList[rightOrderedList[i].index]);
          $(blockList[currentElemIndex]).after(blockList[rightOrderedList[i].index]);
          currentElemIndex = rightOrderedList[i].index;
        }
        //   for (var i = 0; i < self.answerList.length; i++) {
        //     blockList = $('.ranging-blocks__item');
        //     for (var j = 0; j < self.answerList.length; j++) {
        //       console.log($(blockList[j]).attr('data-section') === self.answerList[i].section)
        //       if ($(blockList[j]).attr('data-section') === self.answerList[i].section) {
        //         $(blockList[j]).after(blockList[self.answerList.length - 1]);
        //       }
        //     }
        //   }   
        //   blockList = $('.ranging-blocks__item');
        //   for (i = 0; i < blockList.length; i++) {
        //     $(blockList[i]).css('margin-top', self.answerList[i].marginTop);
        //   }     
      };
    });
  }
})();
(function () {
  'use strict';

  angular.module('app').component('taskRangingWithShelves', {
    bindings: {
      shuffle: '@',
      lastAttempt: '@',
      showAnswer: '@'
    },
    templateUrl: 'js/components/task-ranging/taskRangingWithShelvesTmpl.html',
    controller: 'TaskRangingCtrl',
    controllerAs: '$ctrl'
  });
})();

(function () {
  'use strict';

  TaskImageCheckCtrl.$inject = ["$element", "$document", "$stateParams", "staticService", "userService"];
  angular.module('app').component('taskImageCheck', {
    bindings: {
      shuffle: '@',
      lastAttempt: '@',
      showAnswer: '@'
    },
    templateUrl: 'js/components/task-image-check/taskImageCheckTmpl.html',
    controller: 'TaskImageCheckCtrl',
    controllerAs: '$ctrl'
  }).controller('TaskImageCheckCtrl', TaskImageCheckCtrl);

  /* @ngInject */
  function TaskImageCheckCtrl($element, $document, $stateParams, staticService, userService) {
    var self = this,
        bannerStart = staticService.getData($stateParams, 'bannerStart'),
        bannerEnd = staticService.getData($stateParams, 'bannerEnd'),
        attemptNum = 0;

    self.taskText = staticService.getData($stateParams, 'taskText');
    self.imageList = staticService.getData($stateParams, 'imageList');
    self.banner = bannerStart;

    self.$onInit = function () {
      self.lastAttempt = $($element).attr('lastAttempt');
    };

    angular.element($document).ready(function () {

      var blockList = $('.gallery-item'),
          i;

      // Change item state on checked/unchecked
      self.check = function (index) {
        self.imageList[index].checkedBlock = !self.imageList[index].checkedBlock;
      };

      // Click function on button "Check answer"
      self.checkAnswer = function () {
        if (self.lastAttempt === 'none' || attemptNum === Number(self.lastAttempt)) {
          attemptNum = 0;
        }
        attemptNum = attemptNum + 1;

        for (i = 0; i < blockList.length; i++) {
          var index = Number($(blockList[i]).attr('data-number'));

          if (self.imageList[index].checkedBlock !== self.imageList[index].needCheckedAns) {
            userService.setUserProgress(false, Number($stateParams.module) - 1, Number($stateParams.path) - 1);
            return staticService.showModal('exerciseModal', attemptNum, false, Number($stateParams.module) - 1, Number($stateParams.path) - 1);
          }
        }
        self.banner = bannerEnd;
        userService.setUserProgress(true, Number($stateParams.module) - 1, Number($stateParams.path) - 1);
        staticService.showModal('exerciseModal', 0, true, Number($stateParams.module) - 1, Number($stateParams.path) - 1);
      };

      // Click function on buttom "Restart"
      self.removeRestart = function () {

        self.banner = bannerStart;

        var numberArr = [],
            currentElemIndex;
        for (var i = 0; i < blockList.length; i++) {
          numberArr.push(i);
        }

        numberArr = _.shuffle(numberArr);

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

      // Restart before start of the task
      self.removeRestart();
    });
  }
})();

(function () {
  'use strict';

  SingleChoiceCtrl.$inject = ["$stateParams", "$document", "$element", "staticService", "userService"];
  angular.module('app').component('taskSingleChoice', {
    templateUrl: 'js/components/task-single-choice/taskSingleChoiceTmpl.html',
    controller: 'SingleChoiceCtrl',
    controllerAs: '$ctrl'
  }).controller('SingleChoiceCtrl', SingleChoiceCtrl);

  /* @ngInject */
  function SingleChoiceCtrl($stateParams, $document, $element, staticService, userService) {
    var self = this,
        attemptNum = 0; // attempt number

    self.taskData = staticService.getExerciseObject($stateParams);

    /* 
    *  self.taskData - the main object for this exercise
    * 
    *  self.taskData = {
    *    attempts: 3,                                 amount of attempt
    *    shuffle: true/false,                         shuffle or not answers variants
    *    showAnswer: true/false,                      show/not show right answer after final attempt
    *    type: "single-choice",                       info only for convinience of filling data in courseStructure
    *    taskText: "",                                text of the exercise
    *    questionList: [{                
    *      question: "",                              question of exercise block
    *      state: true/false                          * activated or not activated exercise block
    *      variant: [{                                variants for answers
    *          content: "",              
    *          rightAnswer: true/false                from courseStructure
    *          answer: true/false (false on default)  * active or not active variant
    *        }]
    *    }]
    *  }
    */

    self.taskText = self.taskData.taskText; // text for the exercise
    self.questionList = self.taskData.questionList; // build exercise block    
    self.stateNum = 0; // number of activated exercise block
    self.btnDisabledState = {
      restart: false,
      answer: false
    };

    self.questionList.forEach(function (element) {
      element.state = false;
      element.variant.forEach(function (elem) {
        elem.answer = false;
      });
    });

    // self.taskData is prepared!

    angular.element($document).ready(function () {

      self.checkVariant = function (index, parentIndex) {
        if (self.questionList[parentIndex].state === false) {
          self.stateNum = self.stateNum + 1;
          self.questionList[parentIndex].state = true;
        }
        self.questionList[parentIndex].variant.forEach(function (elem) {
          elem.answer = false;
        });
        self.questionList[parentIndex].variant[index].answer = true;
      };

      self.getBtnState = function () {
        return self.btnDisabledState;
      };

      // check answers
      self.checkAnswer = function () {
        self.stateNum = 0;
        self.btnDisabledState.answer = true;
        attemptNum = attemptNum + 1;

        for (var i = 0; i < self.questionList.length; i++) {
          for (var j = 0; j < self.questionList[i].variant.length; j++) {
            if (self.questionList[i].variant[j].rightAnswer !== self.questionList[i].variant[j].answer) {
              // use data from courseStructure. Property .attempts need to show comment and show correct answers if this option is activated in courseStructure
              if (attemptNum === self.taskData.attempts) {
                if (self.taskData.showAnswer) {
                  self.questionList.forEach(function (element) {
                    element.variant.forEach(function (elem) {
                      elem.answer = elem.rightAnswer;
                    });
                  });
                }
                attemptNum = 0;
                self.btnDisabledState.restart = true;

                // send data to userService (needs for statistics), query to staticService to show modal with comment
                userService.setUserProgress(false, Number($stateParams.module) - 1, Number($stateParams.path) - 1);
                return staticService.showModal('exerciseModal', self.taskData.attempts, false, Number($stateParams.module) - 1, Number($stateParams.path) - 1);
              }

              // send data to userService (needs for statistics), query to staticService to show modal with comment
              userService.setUserProgress(false, Number($stateParams.module) - 1, Number($stateParams.path) - 1);
              return staticService.showModal('exerciseModal', attemptNum, false, Number($stateParams.module) - 1, Number($stateParams.path) - 1);
            }
          }
        }
        self.btnDisabledState.restart = true;

        // send data to userService (needs for statistics), query to staticService to show modal with comment
        userService.setUserProgress(true, Number($stateParams.module) - 1, Number($stateParams.path) - 1);
        return staticService.showModal('exerciseModal', 0, true, Number($stateParams.module) - 1, Number($stateParams.path) - 1);
      };

      // restart
      self.removeRestart = function () {
        var blockList = $($element).find('.task__single-choice-block');

        self.btnDisabledState.answer = false;
        // clean user answers
        self.questionList.forEach(function (element) {
          element.state = false;
          element.variant.forEach(function (elem) {
            elem.answer = false;
          });
        });

        // shuffle variants if options "shuffle" === true (we define it in courseStructure.js)
        if (self.taskData.shuffle) {

          /* 
          *  replacement answers variants in DOM
          *  1. find exercise blocks
          *  2. find variants -> create integer array "numberList" -> shuffle elements of "numberList" -> replace variants in DOM
          */

          for (var i = 0; i < blockList.length; i++) {
            var itemList = $(blockList[i]).find('.task__single-choice-item'),
                numberList = [],
                currentElemIndex;

            for (var j = 0; j < itemList.length; j++) {
              numberList[j] = j;
            };

            numberList = _.shuffle(numberList);

            currentElemIndex = numberList[0];
            for (var j = 1; j < itemList.length; j++) {
              $(itemList[currentElemIndex]).after(itemList[numberList[j]]);
              currentElemIndex = numberList[j];
            }
          }
        }
      };

      // restart test before user start 
      self.removeRestart();
    });
  }
})();
(function () {
  'use strict';

  taskTestCtrl.$inject = ["$attrs", "$stateParams", "staticService"];
  angular.module('app').component('taskTest', {
    bindings: {
      score: '@'
    },
    templateUrl: './js/components/task-test/taskTestTmpl.html',
    controller: 'taskTestCtrl',
    controllerAs: '$ctrl'
  }).controller('taskTestCtrl', taskTestCtrl);

  /* @ngInject */
  function taskTestCtrl($attrs, $stateParams, staticService) {
    var self = this,
        scoreList = $attrs.score.split(','),
        i;

    self.currentQuestNum = 0; // number of current question
    /* 
    * self.taskList - the main array of exercise
    * self.taskList = [{
    *   question: '',
    *   state: false/true,            need for statistics (correct answered question or not)
    *   type: 'single-choice'/'multi-choice',
    *   variant: [{
    *     content: '',                text or content of the question
    *     rightAnswer: false/true,    from couseStructure 
    *     answer: false (on default)  number of the element in array (need to compare futher with exercise right data)  
    *   }]
    * }]
    */
    self.taskList = staticService.getTestData($stateParams); // the main exercise array 
    console.log(self.taskList);
    self.taskList.forEach(function (element) {
      element.variant.forEach(function (elem) {
        return elem.answer = false;
      });
      return element.state = false;
    });
    self.state = 0; // show that exercise block was activated (checked answers number > 9)

    // function that displays number of current question [0 ... taskList.length]  
    self.getCurrentQuestNum = function () {
      return self.currentQuestNum;
    };

    // function that displays number of current question  
    self.checkItem = function (index, parentIndex) {
      if (self.taskList[parentIndex].type === 'single-choice') {
        self.taskList[parentIndex].variant.forEach(function (elem) {
          return elem.answer = false;
        });
      };
      self.taskList[parentIndex].variant[index].answer = !self.taskList[parentIndex].variant[index].answer;
      if (self.taskList[parentIndex].variant.filter(function (elem) {
        return elem.answer === true;
      }).length !== 0) {
        return self.state = 1;
      } else {
        return self.state = 0;
      }
    };

    // check answers
    self.checkAnswer = function () {
      var compareList, // if compareList.length === 0 => user answer is correct
      totalScore; // count user progress in points at the end of the test

      compareList = self.taskList[self.currentQuestNum].variant.filter(function (elem) {
        return elem.answer !== elem.rightAnswer;
      });
      if (compareList.length === 0) {
        self.taskList[self.currentQuestNum].state = true;
        totalScore = testProgress(totalScore, true);
      } else {
        self.taskList[self.currentQuestNum].state = false;
        totalScore = testProgress(totalScore, false);
      };
    };

    // count totalScore (amount of correct completed tasks)
    function testProgress(totalScore, answer) {
      if (self.currentQuestNum < self.taskList.length - 1) {
        self.currentQuestNum++;
      } else {
        // count totalScore on the last question
        totalScore = self.taskList.filter(function (elem) {
          return elem.state === true;
        }).length;
        for (i = 0; i < scoreList.length; i++) {
          if (totalScore / self.taskList.length * 100 >= Number(scoreList[i])) {
            return console.log(totalScore / self.taskList.length * 100, scoreList[i]);
          }
        };
      };
      return totalScore;
    }

    // restart
    self.removeRestart = function () {
      self.currentQuestNum = 0;

      self.taskList = _.shuffle(self.taskList);
      self.taskList.forEach(function (elem) {
        elem.state = false;
        elem.variant.forEach(function (element) {
          return element.answer = false;
        });
        return elem.variant = _.shuffle(elem.variant);
      });
    };

    // restart test before user start 
    self.removeRestart();
  };
})();
(function () {
  'use strict';

  TaskSingleChoiceImgCtrl.$inject = ["$stateParams", "staticService", "userService"];
  angular.module('app').component('taskSingleChoiceImg', {
    bindings: {
      shuffle: '@',
      lastAttempt: '@',
      showAnswer: '@'
    },
    templateUrl: 'js/components/task-single-choice-img/taskSingleChoiceImgTmpl.html',
    controller: 'TaskSingleChoiceImgCtrl',
    controllerAs: '$ctrl'
  }).controller('TaskSingleChoiceImgCtrl', TaskSingleChoiceImgCtrl);

  /* @ngInject */
  function TaskSingleChoiceImgCtrl($stateParams, staticService, userService) {
    var self = this;

    self.answerList = staticService.getData($stateParams, 'answerList');
    self.bannerStart = staticService.getData($stateParams, 'bannerStart');
    self.bannerEnd = staticService.getData($stateParams, 'bannerEnd');

    self.banner = {}, self.banner.src = self.bannerStart.src;
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

    angular.element(document).ready(function () {

      self.setColor = function ($event, index, parentIndex) {
        console.log($event, index, parentIndex);
        if (self.active[parentIndex].state === false) {
          self.state = self.state + 1;
          self.active[parentIndex].state = true;
        }
        self.active[parentIndex].answer = index;
      };

      self.checkAnswer = function () {
        if (self.attemptNum === 3) {
          self.attemptNum = 0;
        }
        self.attemptNum = self.attemptNum + 1;

        for (var i = 0; i < self.answerList.length; i++) {
          if (self.answerList[i].rightAnswer !== Number(self.active[i].answer)) {
            if (self.attemptNum === 3) {
              for (var j = 0; j < self.questionList.length; j++) {
                self.active[j].state = true;
                self.active[j].answer = self.questionList[j].rightAnswer;
              }
            }
            userService.setUserProgress(false, Number($stateParams.module) - 1, Number($stateParams.path) - 1);
            return staticService.showModal('exerciseModal', self.attemptNum, false, Number($stateParams.module) - 1, Number($stateParams.path) - 1);
          }
        }
        userService.setUserProgress(true, Number($stateParams.module) - 1, Number($stateParams.path) - 1);
        staticService.showModal('exerciseModal', 0, true, Number($stateParams.module) - 1, Number($stateParams.path) - 1);
        self.banner.src = self.bannerEnd.src;
        self.banner.alt = self.bannerEnd.alt;
      };

      self.removeRestart = function () {

        for (var i = 0; i < self.active.length; i++) {
          self.active[i].state = false;
          self.active[i].answer = '';
        }
        self.state = 0;
        self.banner.src = self.bannerStart.src;
        self.banner.alt = self.bannerStart.alt;
      };
    });
  }
})();
(function () {
  'use strict';

  TaskSortableBoxesCtrl.$inject = ["$element", "$stateParams", "staticService", "userService"];
  angular.module('app').component('taskSortableBoxes', {
    templateUrl: 'js/components/task-sortable-boxes/taskSortableBoxesTmpl.html',
    controller: 'TaskSortableBoxesCtrl',
    controllerAs: '$ctrl'
  }).controller('TaskSortableBoxesCtrl', TaskSortableBoxesCtrl);

  /* @ngInject */
  function TaskSortableBoxesCtrl($element, $stateParams, staticService, userService) {
    var self = this;

    self.attemptNum = 0;
    self.showComment = false;

    /**
    * Task: There are shelves with boxes. User needs to sort them on sections.
    *
    * Logic: 1. Fill blocks with true answers (add elements content and attribute [data-section])
    *        2. Start restart function to shuffle blocks with answers
    *        3. After click on the arrow change state arrow (they become disabled) during animation
    *        4. After "Check answer" we cover task new layer so events become disabled
    *        5. After "Restart" shuffle blocks with answers and stash covered layer
    */

    self.taskText = staticService.getData($stateParams, 'taskText');
    self.cards = staticService.getData($stateParams, 'cards');

    angular.element(document).ready(function () {
      self.state = false;
      var itemList = $($element).find('img');
      var basketsList = $($element).find(".sortable-box");
      console.log($element, itemList, basketsList);

      $($element).find('.sortable-box').sortable({
        containment: '.task-sortable',
        connectWith: $($element).find('.sortable-box'),
        start: function start(event, ui) {
          ui.item.attr('number', $.inArray(this, $($element).find('.sortable-box')));
        },
        update: function update(event, ui) {
          if ($(this).find('img').length > 1 && !$(this).hasClass('variant-field')) {
            ui.item.appendTo($($element).find('.sortable-box')[ui.item.attr('number')]);
          }
          if ($($element).find('.variant-field').find('.task-sortable__img').length === 0) {
            self.state = true;
          }
        }
      });

      self.checkAnswer = function () {
        self.state = false;

        var basketsList = $($element).find('.box-field').find('.sortable-box');
        for (var i = 0; i < basketsList.length; i++) {
          console.log($(basketsList[i]).find('img').attr('src'), self.cards[i].src);
          if ($.trim($(basketsList[i]).find('img').attr('src')) !== $.trim(self.cards[i].src)) {
            userService.setUserProgress(false, Number($stateParams.module) - 1, Number($stateParams.path) - 1);
            return staticService.showModal('exerciseModal', 1, false, Number($stateParams.module) - 1, Number($stateParams.path) - 1);
          }
        }
        userService.setUserProgress(true, Number($stateParams.module) - 1, Number($stateParams.path) - 1);
        staticService.showModal('exerciseModal', 0, true, Number($stateParams.module) - 1, Number($stateParams.path) - 1);
      };

      // restart
      self.removeRestart = function () {

        var itemList = $($element).find('img');
        var block = $($element).find('.variant-field');

        for (var i = 1; i < itemList.length; i++) {
          $(itemList[i]).appendTo(block);
        };
        // prepare shuffling
        var numberArr = [],
            // integer array for index filling
        currentElemIndex; // need to replace element to the end of elements list 
        for (i = 0; i < self.cards.length; i++) {
          numberArr[i] = i;
        }
        numberArr = _.shuffle(numberArr); // use lodash library

        // element displacement in DOM
        currentElemIndex = numberArr[0];
        for (i = 1; i < itemList.length; i++) {
          $(itemList[currentElemIndex]).after(itemList[numberArr[i]]);
          currentElemIndex = numberArr[i];
        }
      };

      // // shuffle variants before exercise start
      self.removeRestart();

      // if (droppable.hasClass('wrapper__box-basket--gifts')) {
      //   ansList[numAns] = {};
      //   ansList[numAns].status = "Подарок";
      //   ansList[numAns].alt = draggable.prop('alt');
      // } else {
      //   ansList[numAns] = {};
      //   ansList[numAns].status = "Подкуп";
      //   ansList[numAns].alt = draggable.prop('alt');
      // }
      // numAns++;
      // if (numAns === imgList.length) {
      //   //scope.accept();
      //   numAns = 0;
      // }

      // for (var i = 0; i < itemList.length; i++) {
      // if ($(itemList[i]).position().top > $(itemList[i].parentNode).height()) {
      //   var src = $($(ui.draggable)[0]).attr('src');
      //   var alt = $($(ui.draggable)[0]).attr('alt');
      //   $($(ui.draggable)[0]).attr('src',$(itemList[i]).attr('src')).attr('alt',$(itemList[i])
      //                                   .attr('alt')).attr('style', '');
      //   $(itemList[i]).attr('src', src).attr('alt', alt).attr('style', 'display:none');
      //   break;
      //   } else {
      //     // $(ui.draggable)[0].style.visibility = 'hidden';
      //   }
      // }
    });

    // angular.element(document).ready(function() {

    //   var blockList = $('.ranging-blocks__item'),
    //       arrowUpList = $('.arrow_up'),
    //       arrowDownList = $('.arrow_down'),
    //       i;

    //   function animate(dir, thisH, thatH, thisStyle, thatStyle, thisElem, thatElem ) {

    //     var duration = dir === -1 && thatStyle !== 0 || dir === 1 && thisStyle !== 0 ? 500 : 300,
    //       thisTik = thisH/duration,
    //       thatTik = thatH/duration,
    //       thisStyleTik = thisStyle / duration,
    //       thatStyleTik = thatStyle / duration,
    //       start = Date.now();

    //     // Disabled user actions, events during animation
    //     var wrapper = $('.ranging-blocks').css('pointer-events','none');

    //     // Add z-index to clicked element moves above another
    //     thisElem.css('z-index','1');

    //     var timer = setInterval(function() {

    //       var timePassed = Date.now() - start;

    //       if (timePassed >= duration) {
    //         clearInterval(timer);
    //         thisElem[0].style.top = '0px';
    //         thatElem[0].style.top = '0px';
    //         if (dir > 0) {
    //           thisElem.after( thatElem );
    //         } else {
    //           thisElem.before( thatElem );
    //         }
    //         blockList = $('.ranging-blocks__item');
    //         thisElem.css('z-index','0');
    //         wrapper = $('.ranging-blocks').css('pointer-events','auto');
    //         thisElem.css('margin-top', thatStyle + 'px');
    //         thatElem.css('margin-top', thisStyle + 'px');
    //         return;
    //       }

    //       if (dir > 0) {
    //         thisElem[0].style.top = -timePassed * (thatTik + thisStyleTik) + 'px';
    //         thatElem[0].style.top = timePassed * (thisTik + thisStyleTik) + 'px';
    //       } else {
    //         thisElem[0].style.top = timePassed * (thatTik + thatStyleTik) + 'px';
    //         thatElem[0].style.top = -timePassed * (thisTik + thatStyleTik) + 'px';
    //       }      
    //     }, 20);
    //   }

    //   // Function for block vertical size correction
    //   function findVerticalSize(elem) {
    //     var bordT = elem.outerWidth() - elem.innerWidth(),
    //         paddT = elem.innerWidth() - elem.width(),
    //         margT = elem.outerWidth(true) - elem.outerWidth(),
    //         height = elem.height();

    //     return {size: bordT + paddT + margT + height,
    //             style: Number($(elem).css('margin-top').split('px')[0])};
    //   }

    //   // Click function on arrows "Up"
    //   self.toArrowUp = function($event){
    //     var elem = $event.currentTarget,
    //         indexArrow = $.inArray(elem,arrowUpList);

    //     // not the top arrow
    //     if (indexArrow === 0 || indexArrow === -1) {
    //       return;
    //     }

    //     animate(1, findVerticalSize(blockList.eq(indexArrow)).size, findVerticalSize(blockList.eq(indexArrow - 1)).size,
    //                          findVerticalSize(blockList.eq(indexArrow)).style, findVerticalSize(blockList.eq(indexArrow - 1)).style,
    //                          blockList.eq(indexArrow), blockList.eq(indexArrow - 1));
    //   }

    //   // Click function on arrows "Down"
    //   self.toArrowDown = function($event){
    //     var indexArrow = $.inArray($event.currentTarget,arrowDownList);

    //     // not the bottom arrow
    //     if (indexArrow === (arrowDownList.length - 1) || indexArrow === -1) {
    //       return;
    //     }
    //     animate(-1, findVerticalSize(blockList.eq(indexArrow)).size, findVerticalSize(blockList.eq(indexArrow + 1)).size,
    //                           findVerticalSize(blockList.eq(indexArrow)).style, findVerticalSize(blockList.eq(indexArrow + 1)).style,
    //                           blockList.eq(indexArrow), blockList.eq(indexArrow + 1));
    //   }

    //   // Click function on button "Check answer"
    //   self.checkAnswer = function(){
    //     if (self.attemptNum === 3) {
    //       self.attemptNum = 0;
    //     }  
    //     self.attemptNum = self.attemptNum + 1;

    //    for (i = 0; i < blockList.length; i++) {
    //      if ($(blockList[i]).attr('data-section') !== self.answerList[i].section) {
    //       if (self.attemptNum === 3) self.setRightOrder();
    //       userService.setUserProgress(false, Number($stateParams.module) - 1, Number($stateParams.path) - 1);
    //       return staticService.showModal('exerciseModal', self.attemptNum, false, Number($stateParams.module) - 1, Number($stateParams.path) - 1);
    //      }
    //     }
    //     userService.setUserProgress(true, Number($stateParams.module) - 1, Number($stateParams.path) - 1);
    //     staticService.showModal('exerciseModal', 0, true, Number($stateParams.module) - 1, Number($stateParams.path) - 1);
    //   };

    //   // Click function on buttom "Restart"
    //   self.removeRestart = function(){

    //     var numberArr = [],
    //         currentElemIndex;
    //     for (var i = 0; i < blockList.length; i++) {
    //         numberArr.push(i);
    //     }

    //     numberArr = _.shuffle(numberArr);

    //     // Element displacement
    //     currentElemIndex = numberArr[0];
    //     for (i = 1; i < blockList.length; i++) {
    //       $(blockList[currentElemIndex]).after(blockList[numberArr[i]]);
    //       currentElemIndex = numberArr[i];
    //     }

    //     // Add inline styles to place them on the true place
    //     blockList = $('.ranging-blocks__item');
    //     for (i = 0; i < blockList.length; i++) {
    //       $(blockList[i]).css('margin-top', self.answerList[i].marginTop);
    //     }
    //   };

    //   self.removeRestart();

    //   self.setRightOrder = function () {
    //   //   for (var i = 0; i < self.answerList.length; i++) {
    //   //     blockList = $('.ranging-blocks__item');
    //   //     for (var j = 0; j < self.answerList.length; j++) {
    //   //       console.log($(blockList[j]).attr('data-section') === self.answerList[i].section)
    //   //       if ($(blockList[j]).attr('data-section') === self.answerList[i].section) {
    //   //         $(blockList[j]).after(blockList[self.answerList.length - 1]);
    //   //       }
    //   //     }
    //   //   }   
    //   //   blockList = $('.ranging-blocks__item');
    //   //   for (i = 0; i < blockList.length; i++) {
    //   //     $(blockList[i]).css('margin-top', self.answerList[i].marginTop);
    //   //   }     
    //   }
    // });
  }
})();
(function () {
  'use strict';

  ZoomImgCtrl.$inject = ["staticService"];
  angular.module('app').component('zoomImg', {
    bindings: {
      src: '@',
      alt: '@'
    },
    templateUrl: './js/components/zoom-img/zoomImgTmpl.html',
    controller: 'ZoomImgCtrl',
    controllerAs: '$ctrl'
  }).controller('ZoomImgCtrl', ZoomImgCtrl);

  /* @ngInject */
  function ZoomImgCtrl(staticService) {
    var self = this;

    self.zoomImg = function () {
      staticService.zoomPicture(self.src, self.alt, true);
    };
  }
})();
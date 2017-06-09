;(function() {
  'use strict';

  angular
    .module('courseApp', [
                          'ui.router',
                          'ngAnimate',
                          // 'ngTouch',
                          // 'ngSanitize',
                          'vjs.video'
                          // 'com.2fdevs.videogular'
                          // 'com.2fdevs.videogular.plugins.controls',
                          // 'com.2fdevs.videogular.plugins.poster'
                        ])
    .constant('courseDataObj', courseStructure)
    .constant('testDataObj', testStructure)
    .constant('courseInfo', 
      {
        bookmark:{ 
          page:1,
          chapterPage:1,
          chapter:1
        },
        exercises:[],
        testScore:0
      })
    .config(config)
    .run(run)

    /* @ngInject */
    function config ($stateProvider, $urlRouterProvider, courseDataObj) {

      $stateProvider
        .state('page', {
          url: '/chapter/:chapter/page/:page',
          views: {
            'header': {
              templateUrl: 'js/components/header/headerTmpl.html',
              controller: 'HeaderCtrl',
              controllerAs: '$ctrl'
            },
            'content': {
              templateUrl: $stateParams => {

                // переход по кастомным папкам типа «page04a»
                let chapterLocation = courseDataObj.chapters[$stateParams.chapter-1].chapter_location,
                    pageLocation = courseDataObj.chapters[$stateParams.chapter-1].pages[$stateParams.page-1].location;
                // console.log('::main:: confog:', chapterLocation, pageLocation)
                return `pages/${chapterLocation}/${pageLocation}/index.html`;
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
        // .state('test', {})

      // $urlRouterProvider.otherwise('/chapter/1/page/1')
    }

    /* @ngInject */
    function run ($state, $rootScope, $timeout, staticService, userService, scormWrapper, courseInfo, courseDataObj) {
      
      scormWrapper.setAPIVersion("1.2");
      scormWrapper.doLMSInitialize();

      if ( scormWrapper.LMSIsInitialized() ) {
        console.info('<:: Load from LMS ::>')
        let suspend_data = scormWrapper.doLMSGetValue('cmi.suspend_data');
        alert('suspend_data >> '+suspend_data)
        if ( suspend_data.length > 0 ) {
          courseInfo = JSON.parse(scormWrapper.doLMSGetValue('cmi.suspend_data'));
          window.bookmark = courseInfo.bookmark;
          window.bookmark.loaded = false;
          window.exercises = courseInfo.exercises;
          window.exercises.loaded = false;
          userService.loadExs(courseInfo.exercises);
          // alert('load data '+JSON.stringify(courseInfo.bookmark))
        }
        
        console.info('main:: courseInfo', courseInfo)
      } 
      
      // alert('start change bookmark')
      $state.go('page', ({chapter: courseInfo.bookmark.chapter, page: courseInfo.bookmark.chapterPage}));

      $rootScope.$on('$stateChangeStart', (event, toState, toParams, fromState) => {

        // stop audio
        staticService.stopAudio(true);
        // replace current position of audio slider to zero
        staticService.setAudioTime(0);
        
        staticService.setBookmark(Number(toParams.page), Number(toParams.chapter));
        
        userService.sendToLMS();
      })

      $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams, options) {
        $timeout(function() {
          // stop audio
          staticService.stopAudio(false);
        }, 100);
      })


    }
})();
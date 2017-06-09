;(function() {
  'use strict';

  angular
    .module('courseApp')
    .controller('PageCtrl', PageCtrl);

    /* @ngInject */
    function PageCtrl($document, staticService, $scope, courseInfo) {

      this.tabNum = 1;

      $scope.getModalState = (index) => staticService.getModalState(index);
      $scope.closeModals = () => staticService.closeModals();

      this.swipeLeft = () => {
        console.log('swipeLeft')
      }
      this.swipeRight = () => {
        console.log('swipeRight')
      }
      // $scope.testState;
      // console.warn('PageCtrl::')

      // uses for sync of audio and content changes (some kind of animation)
      this.time = () => staticService.getAudioTime()


    }
})();
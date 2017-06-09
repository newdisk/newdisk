;(function() {
  'use strict';

  angular
    .module('courseApp')
    .controller('CourseCtrl', CourseCtrl);

    /* @ngInject */
    function CourseCtrl($http, $sce, $stateParams, staticService, userService) {
      var self = this;

      // add external svg sprite to app index.html
      self.$onInit = function() {
        $http({
          method: 'GET',
          url: 'img/svg-sprite.svg',
          cache: true
        }).then(function successCallback(response) {
            self.svgSprite = $sce.trustAsHtml(response.data);
          }, function errorCallback(response) {
            console.log("error svg sprite didn't load...");
          });
      }

      // get modal states to add disabled background or not
      self.showModal = function(index) {
        return staticService.getModalState(index);
      } 

      // get the last visited page in the modules
      self.visitedPage = function(module) {
        return userService.getPageProgress(Number(module) - 1).visited
      }

      // get the module progress state
      self.completedPage = function(module) {
        return userService.getPageProgress(Number(module) - 1).completed
      }
    }
})();
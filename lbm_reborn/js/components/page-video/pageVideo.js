;(function() {
  'use strict';

  angular
    .module('courseApp')
    .component('pageVideo', {
      bindings: {
        videourl: '@',
        videoposter: '@',
        videowidth: '@',
        videoheight: '@'
      },
      templateUrl: 'js/components/page-video/pageVideoTmpl.html',
      controller: 'pageVideoCtrl',
      controllerAs: '$ctrl'
    })
    .controller('pageVideoCtrl', pageVideoCtrl);

    /* @ngInject */
    function pageVideoCtrl(staticService) {

      this.openVideo = () => {
        let videoElement = document.querySelector('.modal_video__body'),
            videoStr = `<video class="video-js vjs-default-skin video-element" controls preload="auto"
                               width="${this.videowidth}" height="${this.videoheight}" poster="${this.videoposter}" vjs-video>
                            <source src="${this.videourl}" type="video/mp4">
                        </video>`;
      staticService.showModal(5);
      videoElement.innerHTML = videoStr;
      }
    }
})();
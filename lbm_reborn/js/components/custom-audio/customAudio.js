;(function() {
  'use strict';

  angular
    .module('courseApp')
    .component('customAudio', {
      bindings: {
        chapter: '@',
        page: '@',
        hassound: '@'
      },
      templateUrl: 'js/components/custom-audio/customAudioTmpl.html',
      controller: 'CustomAudioCtrl',
      controllerAs: '$ctrl'
    })
    .controller('CustomAudioCtrl', CustomAudioCtrl); 

    /* @ngInject */
    function CustomAudioCtrl($document, $interval, staticService) {

      this.play = '#play'; // variable for play/pause btn that toggle icons
      this.mute = '#unmute'; // variable for mute/unmute btn that toggle icons
      this.volume = 1; // define volume in volume slider
      this.seekPos = 0;

      this.$onInit = () => {
        // console.warn('AudioCtrl:: hasSound', this.hassound)
        if ( this.hassound != 'false') { init(); }
      }

      const init = () => {
        console.warn('customAudio:: init')
        /* It's a better way to use createElement than create new Audio(), 
        /  because such object is easier to remove
         **/
        this.audio = $document[0].createElement('audio');
        this.audio.src = `pages/${this.chapter}/${this.page}/audio/page-${this.chapter}-${this.page}.mp3`; 

        this.audio.oncanplaythrough = () => {

          this.changePlayPause = () => {

            if (this.audio.paused) {
                  this.audio.play();
                  this.play = '#pause';
              } else {
                  this.audio.pause();
                  this.play = '#play';
              }
          }

          this.updateSeekSlider = () => {
            var seekNewPos = this.audio.currentTime * (100 / this.audio.duration), // position in seek slider
                curmins = Math.floor(this.audio.currentTime / 60), // current minutes value
                cursecs = Math.floor(this.audio.currentTime - curmins * 60), // current seconds value
                durmins = Math.floor(this.audio.duration / 60), // audio duration in minutes
                dursecs = Math.floor(this.audio.duration - durmins * 60); // audio duration in rest seconds

            this.seekPos = Math.floor(seekNewPos);

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

            this.curTime = curmins + ':' + cursecs; // display current time in the audio player
            this.durTime = durmins + ':' + dursecs; //  display audio duration time in the audio player
            if (this.audio.currentTime === this.audio.duration) {
              this.play = '#play';
            }
          }

          this.changeSeekPos = () => {
              this.audio.currentTime = this.audio.duration * (this.seekPos / 100);
          }

          $interval(() => {
            
            if (!this.audio) return;
            this.updateSeekSlider();

            // set audio time position in staticService to animate images in pages
            staticService.setAudioTime(this.audio.currentTime);

            // listen call from staticService at page state change
            if (staticService.getStopAudio()) {
              this.audio.pause();
              this.audio = null;
              return;
            }
            
          },100);

          this.changeMuteState = () => {
            this.mute = '#unmute';

            if (this.audio.muted) {
              this.audio.muted = false;
              this.mute = '#unmute';
            } else {
              this.audio.muted = true;
              this.mute = '#mute';
            }
          }

          this.changeVolume = () => {
            this.audio.volume = this.volume;
          }

          this.restart = () => {
            this.audio.currentTime = 0;
            this.audio.play();
            this.play = '#pause';
          }
        };
      };
      
    
    }
})();
;(function() {
  'use strict';

  angular
    .module('courseApp')
    .component('taskMarkerChoice', {
      templateUrl: 'js/components/task-marker-choice/taskMarkerChoiceTmpl.html',
      controller: 'MarkerChoiceCtrl',
      controllerAs: '$ctrl'
    })
    .controller('MarkerChoiceCtrl', MarkerChoiceCtrl);

    /* @ngInject */
    function MarkerChoiceCtrl($scope, $stateParams, staticService, userService) {
      // Вопрос упражнения
      this.taskText = staticService.getData($stateParams, 'taskText');
      // составляем список ответов и мешаем ег
      if (staticService.getData($stateParams, 'shuffle')) {
        this.questionList = _.shuffle(staticService.getData($stateParams, 'questionList'));
      } else {
        this.questionList = staticService.getData($stateParams, 'questionList');
      }

      this.useVideo = staticService.getData($stateParams, 'useVideo');
      this.videoPoster = staticService.getData($stateParams, 'videoPoster');

      // массив для работы с ответами
      this.active = [];
      // состояние упражнения:
      // 0 - ответа ещё нет, 1 - есть ответ, 2 - нажата кнопка «проверить»
      this.state = 0;
      // выделенный маркер
      this.marker = -1;
      // кол-во попыток
      this.attemptNum = staticService.getData($stateParams, 'attempts');
      this.userAttempt = 0;

      for (var i = 0; i < this.questionList.length; i++) {
        this.active[i] = {};
        this.active[i].selected = 0;
        this.active[i].marker = -1;
      }

      angular.element(document).ready(()=> {
        if (this.useVideo) {
          // set video bg
          document.getElementsByClassName('btn_task-video')[0].style.background = 'url('+ this.videoPoster +')';
        }

        /**
        *   Выбор цвета маркера
        */
        this.selectMarker = marker => {
          this.marker = marker;
        }

        /**
        *   Подкрашиваем вариант
        */
        this.selectAnswer = (index, $event) => {
          if (this.marker == -1 || this.state == 2) { return; }
          
          this.active[index].selected = 1;
          this.active[index].marker = this.marker;
          $event.currentTarget.setAttribute('data', 'marker'+this.marker);
          this.state = 1;
        }
      })

      this.checkAnswer = (e) => {

        if (this.userAttempt === this.attemptNum) {
          this.userAttempt = 0;
        }  
        this.userAttempt ++;
        this.state = 2;

        for (let i = 0; i < this.questionList.length; i++) {
          // console.log('rightAnswer:', this.questionList[i].rightAnswer, 'userAnswer:', this.active[i].marker)
          if ( this.questionList[i].rightAnswer != this.active[i].marker ) {
            //упражнение провалено
            if (this.userAttempt === 3) {
              console.log('taskSingleChoice:: attempt 3')
            }
            // to userService (баллы, статус, глава, страница)
            userService.setUserProgress(0, 0, Number($stateParams.chapter) - 1, Number($stateParams.page) - 1);
            staticService.showModal(1, this.userAttempt, false, Number($stateParams.chapter) - 1, Number($stateParams.page) - 1);
            return;
          }
        }
        console.log('taskSingleChoice:: упражнение верно')
        userService.setUserProgress(100, 1, Number($stateParams.chapter) - 1, Number($stateParams.page) - 1);
        staticService.showModal(1, 0, true, Number($stateParams.chapter) - 1, Number($stateParams.page) - 1);
      }
      this.removeRestart = () => {
        let aItems = document.getElementsByClassName('task__marker-choice-item')

        for (var i = 0; i < this.active.length; i++) {
          this.active[i].selected = false;
          this.active[i].marker = -1;
          aItems[i].setAttribute('data', '');
        }
        this.state = 0;
        this.marker = -1;

        this.questionList = _.shuffle(this.questionList);
      }

      this.showVideo = ()=> {
        let videoElement = document.querySelector('.modal_video__body');

        this.videoUrl = staticService.getData($stateParams, 'videoUrl');
        console.warn('HeaderCtrl:: this.videoUrl:', this.videoUrl)
        this.videoPoster = staticService.getData($stateParams, 'videoPoster');
        this.videoWidth = staticService.getData($stateParams, 'videoWidth');
        this.videoHeight = staticService.getData($stateParams, 'videoHeight');

        staticService.showModal(5);
        let videoStr = `<video class="video-js vjs-default-skin video-element" controls preload="auto"
                               width="${this.videoWidth}" height="${this.videoHeight}" poster="${this.videoPoster}" vjs-video>
                            <source src="${this.videoUrl}" type="video/mp4">
                        </video>`
        videoElement.innerHTML = videoStr;

      }
    }
})();
;(function() {
  'use strict';

  angular
    .module('courseApp')
    .component('taskSingleChoice', {
      templateUrl: 'js/components/task-single-choice/taskSingleChoiceTmpl.html',
      controller: 'SingleChoiceCtrl',
      controllerAs: '$ctrl'
    })
    .controller('SingleChoiceCtrl', SingleChoiceCtrl);

    /* @ngInject */
    function SingleChoiceCtrl($scope, $stateParams, $attrs, staticService, userService) {
  
      this.test = $attrs.test;
      this.currentTestQuestion = userService.currentTestQuestion;
      
      // составляем список вопросов и мешаем его
      // если запущено из теста
      if ( this.test ) {
        // console.log('SingleCCtrl:: test mode on')
        this.taskText = this.currentTestQuestion.question;
        // console.log('Question:',this.taskText)
        // TODO shuffle sync
        // this.questionList = _.shuffle(this.currentTestQuestion.answers);
        this.questionList = this.currentTestQuestion.answers;
        console.log('SingleCCtrl:: Answers:', this.questionList)
      } else {
        // Вопрос упражнения
        this.taskText = staticService.getData($stateParams, 'taskText');
        this.questionList = _.shuffle(staticService.getData($stateParams, 'questionList'));
      }
      
      // массив для работы с ответами
      this.active = [];

      // состояние упражнения:
      // 0 - ответа ещё нет, 1 - есть ответ, 2 - нажата кнопка «проверить»
      this.state = 0;

      // кол-во попыток
      if ( this.test ) {
        this.attemptNum = -1;
      } else {
        this.attemptNum = staticService.getData($stateParams, 'attempts');
      }
      
      this.userAttempt = 0;

      for (var i = 0; i < this.questionList.length; i++) {
        this.active[i] = {};
        this.active[i].selected = 0;
      }

      this.showComment = false;

      angular.element(document).ready(() => {

        this.selectAnswer = (index) => {
          this.active.forEach((item) => {
            item.selected = 0;
          })
          this.active[index].selected = 1;
          if ( this.test ) {
            $scope.$emit('myTestState', 1)
          }
          this.state = 1;
        }

        this.checkAnswer = (e) => {
          if (e.target.classList.contains('btn_disabled')) { return; }

          if (this.userAttempt === this.attemptNum) {
            this.userAttempt = 0;
          }  
          this.userAttempt ++;
          this.state = 2;

          for (var i = 0; i < this.questionList.length; i++) {
            console.log('taskSingleChoice:: упражнение не верно')
            if (this.questionList[i].right !== this.active[i].selected) {
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

          for (var i = 0; i < this.active.length; i++) {
            this.active[i].selected = false;
          }
          this.state = 0;

          this.questionList = _.shuffle(this.questionList);
        }

      });
    }
})();
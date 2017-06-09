;(function() {
  'use strict';

  angular
    .module('courseApp')
    .component('finalTest', {
      templateUrl: 'js/components/final-test/finalTestTmpl.html',
      controller: 'TestCtrl',
      controllerAs: '$ctrl'
    })
    .controller('TestCtrl', TestCtrl);

    /* @ngInject */
    function TestCtrl($scope, $state, $compile, $stateParams, testDataObj, staticService, userService, courseInfo) {
      /**
      *   tasks:
      *     single, multi, sortab
      */

      // составляем список вопросов и мешаем его
      this.questionList = _.shuffle(JSON.parse(JSON.stringify(testDataObj.tests[0].groups[0].questions)));

      //номер вопроса
      this.currentQuest = 0;

      // состояния теста: 
      this.state = 0;
      $scope.$on('myTestState', (e, data)=>{
        this.state = data;
      })

      this.testScore = 0;

      this.testTask = document.getElementsByClassName('test-task')[0];

      this.buildQuestion = ()=> {

        userService.setCurrentTestQuestion(this.questionList[this.currentQuest]);

        // console.warn('TestCtrl:: buildQuestion:',this.questionList[this.currentQuest])

        let tmpstr = '';
        switch(this.questionList[this.currentQuest].type) {
          case 'single':
            tmpstr = '<task-single-choice test="true"></task-single-choice>';
            break;
          case 'multi':
            tmpstr = '<task-multi-choice test="true"></task-multi-choice>';
            break;
        }
        

        this.testTask.appendChild($compile(tmpstr)($scope)[0]);
        // console.warn($compile(tmpstr)($scope))
      }

      this.nextQuestion = (e)=> {
        if (e.target.classList.contains('btn_disabled')) { return; }

        this.checkAnswer()

        this.currentQuest++;
        if ( this.currentQuest < this.questionList.length) {
          this.state = 0;
          this.testTask.innerHTML = '';
          this.buildQuestion();
        } else {
          this.state = 2;
          // console.log('TEST::>', this.testScore/(this.questionList.length))
          courseInfo.testScore = this.testScore/(this.questionList.length);
          // alert('konec')
          // show result window
          // to showModal: modal id, head comment, text comment
          staticService.showModal(4, 'Ваш результат: '+courseInfo.testScore+' баллов', '<p>Комментарий к результату<p>');
          userService.sendToLMS();
        }
      }

      this.checkAnswer = ()=> {
        let answersElements = document.getElementsByClassName('task-question')
        // console.warn('answersElements', answersElements) 
        // console.warn('questionList', this.questionList[this.currentQuest].answers) 
        
        for (let i = 0; i < answersElements.length; i++) {
          let answer = this.questionList[this.currentQuest].answers[i].right,
              question = answersElements[i].classList.contains('radio-selected');

          // console.warn('check answers', answer, question)
          if ( answer !== question ) {
            // неверный ответ
            // console.warn('ответ на вопрос теста неверен')
            // console.info('score', this.testScore)
            return;
          }
        }
        // console.warn('ответ на вопрос верен')
        this.testScore +=100;
        // console.info('score', this.testScore)
        // 
      }

      this.removeRestart = ()=> {
        this.state = 0;
        this.testScore = 0;
        this.currentQuest = 0;
        this.questionList = _.shuffle(JSON.parse(JSON.stringify(testDataObj.tests[0].groups[0].questions)));
        this.testTask.innerHTML = '';
        this.buildQuestion();
      }

      angular.element(document).ready(() => {
        // console.log(this.questionList)
        this.buildQuestion();
      })
    }
})();
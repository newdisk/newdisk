;(function($, ctrl, _){
  'use strict';

  var pageDocument = $(parent.frames['myframe'].document),
      bubble_user_name = pageDocument.find('.user_name'),
      questionNum = pageDocument.find('.number_question'),
      questionText = pageDocument.find('.question_question'),
      btn_yes = pageDocument.find('.ans_btn_left'),
      btn_no = pageDocument.find('.ans_btn_right'),
      feedback = pageDocument.find('#feedback_ex');


  var answersList = ctrl.structure.pages[ctrl.bookmark].answers;
  var comments = ctrl.structure.pages[ctrl.bookmark].messages;
  var headComments = ctrl.structure.pages[ctrl.bookmark].headComment;
  var headComment = 'Комментарий к ответу';
  var ansNum = 0;

  var pageDocument = $(parent.frames['myframe'].document),
      animatedList = pageDocument.find('.animated');

  function play() {
    $(animatedList[0]).animate({opacity: 1},{duration:3000, complete: function(){
        $(animatedList[1]).animate({opacity: 1},{queue: false, duration: 2000, complete: function(){
            $(animatedList[2]).animate({opacity: 1},{queue: false, duration: 2000, complete: function(){
                $(animatedList[3]).animate({opacity: 1},{queue: false, duration: 2000, complete: function(){
                  $(animatedList).css('pointer-events', 'auto');
                    
                }});
            }});    
        }});
    }});
  }

  function addQuestion() {
    questionText.html(answersList[ansNum].label);
    questionNum.html(ansNum + 1);
  }
  function getAns(answer) {
    if (answer === answersList[ansNum].right) {
      var btn = pageDocument.find('.continueBtn');

      if (ansNum === answersList.length - 1) {
        return ctrl.sendResult(1,100,'Задание выполнено успешно!', false,'Результат');
      } else {
        pageDocument.find('.social-block-wrapper').css('pointer-events','none');
        feedback.find('.feedback_headComment').html('Правильное решение!').css('color','rgb(43, 124, 0)');
        feedback.find('#feedback-body').html(answersList[ansNum].trueAnsComment);
        btn.toggle();
        btn.on('click', function() {
          ansNum = ansNum + 1;
          addQuestion(ansNum);
          pageDocument.find('.social-block-wrapper').css('pointer-events','auto');
          btn.toggle();
          feedback.toggle();
          btn.off();
        })
      }      
    } else {
      var btn = pageDocument.find('.politicBtn'),
          btnAgain = pageDocument.find('.againBtn');
      pageDocument.find('.social-block-wrapper').css('pointer-events','none');
      feedback.find('.feedback_headComment').html('Это неправильный ответ!').css('color','rgb(124,0,47)');
      feedback.find('#feedback-body').html(answersList[ansNum].falseAnsComment);
      if (answersList[ansNum].linkDoc) {
        btn.toggle();
        btn.on('click', function() {
          pageDocument.find('.social-block-wrapper').css('pointer-events','auto');
          btn.toggle();
          feedback.toggle();
          ctrl.openPolitics(answersList[ansNum].linkDoc,answersList[ansNum].linkParagr);
          btn.off();
        })
      } else {
        btnAgain.toggle();
        btnAgain.on('click', function() {
          pageDocument.find('.social-block-wrapper').css('pointer-events','auto');
          btnAgain.toggle();
          feedback.toggle();
          btnAgain.off();
        })
      };      
    }
    feedback.toggle();
  }

  function removeRestart() {
    answersList =_.shuffle(answersList);
  }  

  btn_yes.on("click", function() {
    getAns(true);
  });
  btn_no.on("click", function() {
    getAns(false);
  });

  bubble_user_name.html(ctrl.learner);


  ctrl.coursePage = {
    play: function() {
      removeRestart();
      addQuestion();
      $(animatedList).css('pointer-events', 'none');
      $(animatedList).animate({opacity:0},{duration:0});
      play();
    },
    stop: function(){
      ctrl.coursePage = null;
    },
    restart: function(){
    }
  }
})(parent.jQuery, parent.ctrl, parent._);
parent.ctrl.coursePage.play();
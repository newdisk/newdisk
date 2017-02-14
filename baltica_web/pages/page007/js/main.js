;(function($, ctrl, _){
  'use strict';

  var bubble_user_name = $(parent.frames['myframe'].document).find('.user_name');
  var bubble_number_question = $(parent.frames['myframe'].document).find('.number_question');
  var bubble_question_question = $(parent.frames['myframe'].document).find('.question_question');
  var btn_yes = $(parent.frames['myframe'].document).find('.ans_btn_left');
  var btn_no = $(parent.frames['myframe'].document).find('.ans_btn_right');


  var answersList = ctrl.structure.pages[ctrl.bookmark].answers;
  var comments = ctrl.structure.pages[ctrl.bookmark].messages;
  var headComments = ctrl.structure.pages[ctrl.bookmark].headComment;
  var random_question;
  var attemptNum = 0;// попытка №...
  var msg = '';
  var headComment = 'Комментарий к ответу';
  var valio__number_question; // поле - номер вопроса
  var valio__question_question;// поле - вопрос
  var counter_random_question;
  var lastTry =0;



  function buildTask() {
    lastTry =0;
    attemptNum++;
    var checkered =0;
    var status =0;// -1,1,0
    var scope =0; // 0-100

    random_question =_.shuffle(answersList); // рандомный массив вопросов
    var counter =0;
   // var ansverArray;
    var valio__number_question;
    var valio__question_question;
    var valio__question_right;
    valio__number_question = counter + 1;
    valio__question_question=random_question[counter].label;
    valio__question_right =random_question[counter].right;
    bubble_number_question.html(valio__number_question);
    bubble_question_question.html(valio__question_question);

    btn_yes.on("click",{checker:true},handler);
    btn_no.on("click",{checker:false},handler);


    function handler(event){

      //console.info("event.data.checker- ",event.data.checker);
      if(event.data.checker === valio__question_right){
        console.info("правильно");
        checkered++;

      }
      counter++;
      console.info("random_question.length",random_question.length);
      if(counter < random_question.length){
        valio__number_question= counter +1;
        valio__question_question=random_question[counter].label;
        valio__question_right =random_question[counter].right;
        bubble_number_question.html(valio__number_question);
        bubble_question_question.html(valio__question_question);
      }else {

        if(checkered==random_question.length){
          console.info("правильно сОВСЕМ");
          status =1;
          scope = 100;
          msg = comments[0];
          headComment = headComments[0];
        }else{
          console.info("нЕПРАВИЛЬНО");
          if(attemptNum==2){
            lastTry =1;
          }
          status = -1;
          scope = 0;
          msg = comments[attemptNum];
          headComment = headComments[1];
        }
        console.info("checkered++ ",checkered);
        console.info("counter - ",counter);

        ctrl.sendResult(status,scope,msg,lastTry, headComment);

        btn_yes.off('click');
        btn_no.off('click');
        ctrl.coursePage.taskAttemp++;
        console.info("taskAttemp- ",ctrl.coursePage.taskAttemp);
      }
    }

  }



  // valio__number_question="1";
  //valio__question_question=random_question[valio__number_question].label;

  buildTask();
  bubble_user_name.html(ctrl.learner);
  //bubble_number_question.html(valio__number_question);
  //bubble_question_question.html(valio__question_question);


  ctrl.coursePage = {
    play: function() {
      //
    },
    stop: function(){
      ctrl.coursePage = null;
    },
    restart: function(){

      buildTask();
    },
    taskAttemp:1
  }
})(parent.jQuery, parent.ctrl, parent._);
parent.ctrl.coursePage.play();
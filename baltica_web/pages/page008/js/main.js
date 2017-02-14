;(function($, ctrl, _){
  'use strict';


  var pageDocument = $(parent.frames['myframe'].document);
  var answersList = ctrl.structure.pages[ctrl.bookmark].answers,
      comments = ctrl.structure.pages[ctrl.bookmark].messages,
      headComments = ctrl.structure.pages[ctrl.bookmark].headComment;

  var ansBtn = pageDocument.find('#btn--answer'),
      restartBtn = pageDocument.find('#btn--restart');
  againBtn
  var dark =$('#dark');
  //dark.css('display', 'block');
  //dark.css('opacity', '.4');

  var feedback = pageDocument.find('#feedback_ex');
  var feedbackHeadComment = pageDocument.find('.feedback_headComment');
  var againBtn = pageDocument.find('.againBtn');
  var politicBtn = pageDocument.find('.politicBtn');
  var continueBtn = pageDocument.find('.continueBtn');
  feedback.css({ display :'none'} );
  $(againBtn,continueBtn,politicBtn).addClass("disabled");


  function success(){
    feedback .find(".feedback_headComment").html(headComment);
    feedback .find("#feedback-body").html(msg);
    continueBtn.removeClass("disabled");
    feedback.css({ display :'block'} );
    feedbackHeadComment.css({"color":"rgb(43, 124, 0)"})
    continueBtn.off().on("click",function(){
      continueBtn.addClass("disabled");
      feedback.css({ display :'none'} );


     // tascNum++;
      restart();
      buildTasks();
      //buildTask2();
      restartBtn.addClass("disabled");
      restartBtn.off('click', restart);
    });
  }
  function unsuccessful(){
    feedback .find(".feedback_headComment").html(headComment);
    feedback .find("#feedback-body").html(msg);
      attemptNum =0;
      politicBtn.removeClass("disabled");
      feedback.css({ display :'block'} );
      feedbackHeadComment.css({"color":"rgb(124, 0, 47)"})
      politicBtn.off().on("click",function(){
        politicBtn.addClass("disabled");
        feedback.css({ display :'none'} );
        restart();
        openPolitics();
        //ctrl.openPolitics(0,"#p0-1");
      });
  }

  function openPolitics(){
    if(tascNum == 1){
      ctrl.openPolitics(0,"#p0-1");
    }
    if(tascNum == 2){
      ctrl.openPolitics(0,"#p0-2");
    }
    if(tascNum == 3){
      ctrl.openPolitics(0,"#p0-2");
    }
    if(tascNum == 4){
      ctrl.openPolitics(0,"#p0-3");
    }
  }

  var help1 = pageDocument.find('.page__question_container_clarify1');
  var help2 = pageDocument.find('.page__question_container_clarify2');
  var help3 = pageDocument.find('.page__question_container_clarify3');
  var help4 = pageDocument.find('.page__question_container_clarify4');
  var foto_0 = pageDocument.find('.foto_0');
  var foto_1 = pageDocument.find('.foto_1');
  var foto_2 = pageDocument.find('.foto_2');
  var foto_3 = pageDocument.find('.foto_3');

  var MyContainer1 = pageDocument.find('#question_container1');
  var MyElemList1 = pageDocument.find('#myElem_list_the_name');
  var btnMyElemList1 = pageDocument.find('#myBtn_question_1');  //myBtn
  var mAnswer1 = pageDocument.find('.m_answer_1');
  var m_AnswerId_1;
  btnMyElemList1.addClass('disabled');

  var MyContainer2 = pageDocument.find('#question_container2');
  var MyElemList2 = pageDocument.find('#myElem_list_place_of_work');
  var btnMyElemList2 = pageDocument.find('#myBtn_question_2');  //myBtn
  var mAnswer2 = pageDocument.find('.m_answer_2');
  var m_AnswerId_2;
 btnMyElemList2.addClass('disabled');

  var MyContainer3 = pageDocument.find('#question_container3');
  var MyElemList3 = pageDocument.find('#myElem_list_name_about_me');
  var btnMyElemList3 = pageDocument.find('#myBtn_question_3');  //myBtn
  var mAnswer3 = pageDocument.find('.m_answer_3');
  var m_AnswerId_3;
  btnMyElemList3.addClass('disabled');

  var ans1= false;
  help2.addClass("disabled");
  help3.addClass("disabled");
  help4.addClass("disabled");
  restartBtn.addClass("disabled");


  var attemptNum = 0;//
  var msg = '';
  var headComment = 'Comment';
  var score = 0;// 0-100
  var status = -1;// -1,1,0
  var lastTry = false;
  var tascNumCounter;

  var tascNum;
      //tascNum2 = 0,
      //tascNum3 = 0,
      //tascNum4 = 0;


  function OnClik(){
    ansBtn.removeClass("disabled");
    ansBtn.on('click', checkAnswerTask);
    restartBtn.removeClass("disabled");
    restartBtn.on('click', restart);
   // restartBtn.remove("disabled");
  }

  function destroy() {
    attemptNum=0;
    ansBtn.off('click', checkAnswerTask);
    restartBtn.off('click', restart);
    console.log("destroy -");
    ansBtn.addClass("disabled");
    //restartBtn.addClass("disabled");
    ansBtn.remove('click', checkAnswerTask);
    //restartBtn.remove('click', restart);
    
  }

  function destroy1() {
    attemptNum=0;
    ans1=false;
    help1.addClass("disabled");
    help2.removeClass("disabled");
    help3.addClass("disabled");
    help4.addClass("disabled");
    foto_0.css('background', 'url("img/8_2_3.png") no-repeat');
    foto_1.addClass("disabled");
    foto_2.addClass("disabled");
    foto_3.addClass("disabled");
    console.log("destroy1 -");
  }

  function destroy2() {
    attemptNum=0;
    ans1= false;

   // btnMyElemList1.addClass('disabled');
   btnMyElemList1.removeClass('disabled');
    MyContainer1.addClass("active");


   var bubble_user_name = pageDocument.find('#ansWerT1');
    console.log(bubble_user_name)
    bubble_user_name.text('Выберите вариант ответа.');

    console.log("destroy2 -");
  }

  function destroy3() {
    attemptNum=0;
    ans1= false;
    btnMyElemList1.removeClass('active');
    btnMyElemList3.removeClass('active');
    btnMyElemList2.removeClass('disabled');
    MyContainer2.addClass("active");
    var bubble_user_job = pageDocument.find('#ansWerT2');
    bubble_user_job.text('Выберите вариант ответа.');
  }

  function destroy4() {
    attemptNum=0;
    ans1= false;
    btnMyElemList1.removeClass('active');
    btnMyElemList2.removeClass('active');
    btnMyElemList3.removeClass('disabled');
    MyContainer3.addClass("active");
    var user_yourself = pageDocument.find('#ansWerT3');
    user_yourself.text('Выберите вариант ответа.');
  }

  buildTask1();

  tascNumCounter =0;

  function buildTasks(){
    if(tascNum == 2){
      console.log("buildTasks_tascNum == 2 -");
       buildTask2();
    }
    if(tascNum == 3){
      help2.addClass("disabled");
      help3.removeClass("disabled");
      console.log("buildTasks_tascNum == 3 -");
      buildTask3();
    }
    if(tascNum == 4){
      help3.addClass("disabled");
      help4.removeClass("disabled");
      console.log("buildTasks_tascNum == 4 -");
      buildTask4();
    }

  }

  function restart() {
    console.log("restart() -");
    if(tascNum == 1){
      console.log("tascNum == 1 -");
      destroy();
      buildTask1();
    }
    if(tascNum == 2){
      console.log("tascNum == 2 -");
      destroy();
      destroy1();
      destroy2();
    }
    if(tascNum == 3){
      console.log("tascNum == 3 -");
      destroy();
      destroy3();
    }
    if(tascNum == 4){
      console.log("tascNum == 4 -");
      destroy();
      destroy4();
    }

  }

  function checkAnswerTask() {
    destroy();
    var counterSendSucsess = tascNumCounter;
    var counterSend = counterSendSucsess + 1;
    console.log("tascNumCounter -",tascNumCounter);

    if (ans1 === true) {
      status =1;
      score = 100;
      msg = comments[counterSendSucsess];
      headComment = headComments[counterSendSucsess];

      console.log("counterSendSucsess + ",counterSendSucsess);
      //console.log("+++++++++++++++++++",counterSend);
        if(tascNum == 4){
          restartBtn.off('click', restart);
          restartBtn.addClass("disabled");
          ctrl.sendResult(status,score,msg, lastTry, headComment);
        }else{
          tascNum++;
          success();
        }
      //restart();

    } else {
      //counterSend++;
      status = -1;
      score = 0;
      msg = comments[counterSend];
      headComment = headComments[counterSend];
      console.log("-----------------",counterSend);
      unsuccessful();
    }
    if(attemptNum ==1){
      attemptNum =0;
    }
   // ctrl.sendResult(status,score,msg, lastTry, headComment);
  }


  function buildTask1(){
    tascNumCounter =0;
    attemptNum++;
    tascNum =1;
    foto_0.css('background', 'url("img/8_2_1.png") no-repeat');
    foto_1.css('background', 'url("img/8_2_2.png") no-repeat');
    foto_2.css('background', 'url("img/8_2_3.png") no-repeat');
    foto_3.css('background', 'url("img/8_2_4.png") no-repeat');
    help1.removeClass('disabled');
    foto_0.removeClass('disabled');
    foto_1.removeClass("disabled");
    foto_2.removeClass("disabled");
    foto_3.removeClass("disabled");
    ansBtn.addClass("disabled");
    foto_0.on("click",handler0);
    foto_1.on("click",handler1);
    foto_2.on("click",handler2);
    foto_3.on("click",handler3);

    //OnClik();

    function Task1DisabledFoto(){
      //foto_0.remove("click",handler0); �� �������� ����� �����
      foto_0.off("click",handler0);
      foto_1.off("click",handler1);
      foto_2.off("click",handler2);
      foto_3.off("click",handler3);
      foto_0.addClass("disabled");
      foto_1.addClass("disabled");
      foto_2.addClass("disabled");
      foto_3.addClass("disabled");
      ansBtn.removeClass('disabled');
      restartBtn.removeClass('disabled');
      OnClik();
    }

    function handler0() {
      foto_0.css('background', 'url("img/8_2_1.png") no-repeat');
      ans1 = false;
      Task1DisabledFoto();
    }
    function handler1() {
      foto_0.css('background', 'url("img/8_2_2.png") no-repeat');
      ans1 = false;
      Task1DisabledFoto();
    }
    function handler2() {
      foto_0.css('background', 'url("img/8_2_3.png") no-repeat');
      ans1 = true;
      Task1DisabledFoto();
    }
    function handler3() {
      foto_0.css('background', 'url("img/8_2_4.png") no-repeat');
      ans1 = false;
      Task1DisabledFoto();
    }
  }

  function buildTask2(){
    console.log("buildTask2");
    tascNumCounter =2;
    attemptNum++;
    tascNum =2;
    btnMyElemList1.removeClass('disabled');
    MyContainer1.addClass("active");
    mAnswer1.removeClass("disabled");
    mAnswer1.on('click',btnListClicker1);

    //#myBtn_question_1 = btnMyElemList1

    function btnListClicker1(e) {
        btnMyElemList1.find('#ansWerT1').html($(e.target).closest('.m_answer_1').text());
      console.log("btnMyElemList1 -",btnMyElemList1);
        m_AnswerId_1 = $(e.target).closest('.m_answer_1').attr("useAttempt");
        if(m_AnswerId_1 == 0){ ans1= true;  }
        console.log("m_AnswerId_1 _ ans1 -",ans1);
        btnMyElemList1.removeClass('active');
        MyElemList1.toggle('slide',{direction:'up'},200)
        btnMyElemList1.addClass('disabled');
        OnClik();
      }

    btnMyElemList1.on("click",function(){
            if($(this).hasClass("disabled")){
              return;
              }
        MyElemList1.toggle('slide',{direction:'up'},200);
      });
  }

  function buildTask3(){
    console.log("buildTask3");
    tascNumCounter =4;
    attemptNum++;
    tascNum =3;
    btnMyElemList2.removeClass('disabled');
    MyContainer2.addClass("active");
    mAnswer2.removeClass("disabled");
    mAnswer2.on('click',btnListClicker2);

    function btnListClicker2(e) {
      btnMyElemList2.find('#ansWerT2').html($(e.target).closest('.m_answer_2').text());
      //btnMyElemList2.find('div').html($(e.target).closest('.m_answer_2').html());
      console.log("btnMyElemList2 -",btnMyElemList2);
      m_AnswerId_2 = $(e.target).closest('.m_answer_2').attr("useAttempt");
      if(m_AnswerId_2 == 0){ ans1= true;  }
      console.log("m_AnswerId_2 _ ans1 -",ans1);
      btnMyElemList2.removeClass('active');
      MyElemList2.toggle('slide',{direction:'up'},200)
      btnMyElemList2.addClass('disabled');
      OnClik();
    }

    btnMyElemList2.on("click",function(){
      if($(this).hasClass("disabled")){
        return;
      }
      MyElemList2.toggle('slide',{direction:'up'},200);
    });
  }

  function buildTask4(){
    console.log("buildTask3");
    tascNumCounter =6;
    attemptNum++;
    tascNum =4;
    btnMyElemList3.removeClass('disabled');
    MyContainer3.addClass("active");
    mAnswer3.removeClass("disabled");
    mAnswer3.on('click',btnListClicker2);

    function btnListClicker2(e) {
      btnMyElemList3.find('#ansWerT3').html($(e.target).closest('.m_answer_3').text());
     // btnMyElemList3.find('div').html($(e.target).closest('.m_answer_3').html());
      console.log("btnMyElemList3 -",btnMyElemList3);
      m_AnswerId_3 = $(e.target).closest('.m_answer_3').attr("useAttempt");
      if(m_AnswerId_3 == 0){ ans1= true;  }
      console.log("m_AnswerId_3 _ ans1 -",ans1);
      btnMyElemList3.removeClass('active');
      MyElemList3.toggle('slide',{direction:'up'},200)
      btnMyElemList3.addClass('disabled');
      OnClik();
    }

    btnMyElemList3.on("click",function(){
      if($(this).hasClass("disabled")){
        return;
      }
      MyElemList3.toggle('slide',{direction:'up'},200);
    });
  }


  //MyContainer3.addClass("active");
  //mAnswer3.removeClass("disabled");
 // mAnswer3.on('click',btnListClicker);
 //
 // function btnListClicker(e) {
 //   console.log("e - ",e);
 //   btnMyElemList3.find('div').html($(e.target).closest('.m_answer_3').html());
 //   m_AnswerId_3 = $(e.target).closest('.m_answer_3').attr("id");
 //   btnMyElemList3.removeClass('active');
 //   MyElemList3.toggle('slide',{direction:'up'},200)
 //   btnMyElemList3.addClass('disabled');
 // }
 //
 //btnMyElemList3.on("click",handler4);
 //
 // function handler4() {
 //   console.log("handler4");
 //   if($(this).hasClass("disabled")){
 //     return;
 //   }
 //   MyElemList3.toggle('slide',{direction:'up'},200);
 //
 // }








  ctrl.coursePage = {
    play: function() {
      //
    },
    stop: function(){
      ctrl.coursePage = null;
    },
    restart: function(){

      restart();
    },
    taskAttemp:1
  }
})(parent.jQuery, parent.ctrl, parent._);
parent.ctrl.coursePage.play();
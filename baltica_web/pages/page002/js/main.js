;(function($, ctrl){
  'use strict';

  var pageBlock2Btn = $(parent.frames['myframe'].document).find('.page__block_2_btn');
  var inputField = $(parent.frames['myframe'].document).find('.page__block_2_input');
  //var user_name;
  pageBlock2Btn.attr('disabled', true);

 function check_user_name_length(){
   if ( ctrl.learner.length !=0){
     inputField[0].value = ctrl.learner;
   }
 }
  check_user_name_length();

  inputField.on('input',function(){
    var a = inputField[0].value;
    console.log("inputField********",inputField[0].value)
    console.log("inputField_length - ", a.length)
    if(a.length>=2){
      pageBlock2Btn.attr('disabled', false);
    }

  })

  pageBlock2Btn.on('click',function(){
    ctrl.learner =inputField[0].value;
    console.log("pageBlock2Btn.on",ctrl.user_name)

    ctrl.sendResult(1,100,'',0,'privet');
    ctrl.goToPage(ctrl.bookmark+1);
  })

  ctrl.coursePage = {
    play: function() {
      //
    },
    stop: function(){
      pageBlock2Btn.off('click');
      inputField.off('click');
      ctrl.coursePage = null;
    }
  }
})(parent.jQuery, parent.ctrl);
parent.ctrl.coursePage.play();
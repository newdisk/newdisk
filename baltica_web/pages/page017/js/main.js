;(function($, ctrl){
  'use strict';
  var bable1 = $(parent.frames['myframe'].document).find('.del');





  var pageBlock2Btn = $(parent.frames['myframe'].document).find('.contactBtn');
  var pageContainer = $(parent.frames['myframe'].document).find('.container');
  var pageContainer1 = $(parent.frames['myframe'].document).find('.container_page1');
 //var pageContainer2 = $(parent.frames['myframe'].document).find('.container_page2');
  var bubble_user_name = $(parent.frames['myframe'].document).find('.user_name');
  bubble_user_name.html(ctrl.learner);

  pageBlock2Btn.on("click",handler);

  function handler(){

    $(pageContainer).css('background', 'url("img/14_2.jpg") no-repeat');
    $(pageContainer1).css('display', 'none');
    $(bable1).css('display', 'none');
  }



  ctrl.coursePage = {
    play: function() {
      //
    },
    stop: function(){
      //pageBlock2Btn.off('click');
      ctrl.coursePage = null;
    }
  }
})(parent.jQuery, parent.ctrl);
parent.ctrl.coursePage.play();
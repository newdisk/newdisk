;(function($, ctrl){
  'use strict';
  var bable1 = $(parent.frames['myframe'].document).find('.del');

  var pageBlock2Btn = $(parent.frames['myframe'].document).find('.contactBtn');
  var pageContainer = $(parent.frames['myframe'].document).find('.container');
  var pageContainer1 = $(parent.frames['myframe'].document).find('.container_page1');
 //var pageContainer2 = $(parent.frames['myframe'].document).find('.container_page2');
  var bubble_user_name = $(parent.frames['myframe'].document).find('.user_name');
  var pageDocument = $(parent.frames['myframe'].document),
      animatedList = pageDocument.find('.animated');

  function play() {
    $(animatedList[0]).animate({opacity: 1},{duration:1000, complete: function(){
        $(animatedList[1]).animate({opacity: 1},{queue: false, duration: 1000, complete: function(){
            $(animatedList[2]).animate({opacity: 1},{queue: false, duration: 2000, complete: function(){
                $(animatedList[3]).animate({opacity: 1},{queue: false, duration: 2000, complete: function(){
                  $(animatedList[4]).animate({opacity: 1},{queue: false, duration: 3000, complete: function(){
                    $(animatedList).css('pointer-events', 'auto');
                    pageBlock2Btn.css('pointer-events', 'auto').addClass('contactBtn_active');
                    pageBlock2Btn.on("click",handler);
                  }});
                }});
            }});    
        }});
    }});
  }

  bubble_user_name.html(ctrl.learner);  

  function handler(){
    ctrl.sendResult(1,100,'');
    $(pageContainer).css('background', 'url("img/14_2.jpg") no-repeat');
    $(pageContainer1).css('display', 'none');
    $(bable1).css('display', 'none');
  }



  ctrl.coursePage = {
    play: function() {
      $(animatedList).css('pointer-events', 'none');
      $(animatedList).animate({opacity:0},{duration:0});
      pageBlock2Btn.css('pointer-events', 'none');
      play();
    },
    stop: function(){
      //pageBlock2Btn.off('click');
      ctrl.coursePage = null;
    }
  }
})(parent.jQuery, parent.ctrl);
parent.ctrl.coursePage.play();
;(function($, ctrl){
  'use strict';

  var userName = $(parent.frames['myframe'].document).find('.user-name'),
      pageDocument = $(parent.frames['myframe'].document),
      animatedList = pageDocument.find('.animated');

  function play() {
    $(animatedList[0]).animate({opacity: 1},{duration: 1000, complete: function(){
      setTimeout(function() {
        $(animatedList[1]).animate({opacity: 1},{queue: false, duration: 1000, complete: function(){
          setTimeout(function() {
            $(animatedList[2]).animate({opacity: 1},{queue: false, duration: 1000, complete: function(){
                $(animatedList[3]).animate({opacity: 1},{queue: false, duration: 1000, complete: function(){
                  $(animatedList).css('pointer-events', 'auto');
                }});
            }});   
          }, 2000);   
        }});
      }, 1000);        
    }});
  }

  userName.html(ctrl.learner)

  ctrl.coursePage = {
    play: function() {
      $(animatedList).css('pointer-events', 'none');
      $(animatedList).animate({opacity:0},{duration:0});
      play();
    },
    stop: function(){
      ctrl.coursePage = null;
    }
  }
})(parent.jQuery, parent.ctrl);
parent.ctrl.coursePage.play();
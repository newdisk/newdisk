;(function($, ctrl){
  'use strict';

  var bubble_user_name = $(parent.frames['myframe'].document).find('.user_name');
  var pageDocument = $(parent.frames['myframe'].document),
      animatedList = pageDocument.find('.animated');

  function play() {
    $(animatedList[0]).animate({opacity: 1},{duration: 1000, complete: function(){
      setTimeout(function() {
        $(animatedList[1]).animate({opacity: 1},{queue: false, duration: 1000, complete: function(){
          setTimeout(function() {
            $(animatedList[2]).animate({opacity: 1},{queue: false, duration: 1000, complete: function(){
              setTimeout(function() {
                $(animatedList[3]).animate({opacity: 1},{queue: false, duration: 1000, complete: function(){
                  $(animatedList[4]).animate({opacity: 1},{queue: false, duration: 1000, complete: function(){
                    $(animatedList).css('pointer-events', 'auto');
                  }});  
                }});
              }, 1000);
            }});   
          }, 1000);   
        }});
      }, 1000);        
    }});
  }

  bubble_user_name.html(ctrl.learner)

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
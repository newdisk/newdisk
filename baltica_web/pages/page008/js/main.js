;(function($, ctrl){
  'use strict';

  var bubble_user_name = $(parent.frames['myframe'].document).find('.user_name');

  bubble_user_name.html(ctrl.learner)

  ctrl.coursePage = {
    play: function() {
      //
    },
    stop: function(){
      ctrl.coursePage = null;
    }
  }
})(parent.jQuery, parent.ctrl);
parent.ctrl.coursePage.play();
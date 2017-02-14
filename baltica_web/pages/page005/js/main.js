;(function($, ctrl){
  'use strict';

  //var pageBlock2Btn = $(parent.frames['myframe'].document).find('.page__block_2_btn');



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
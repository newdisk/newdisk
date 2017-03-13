;(function($, ctrl){
  'use strict';

  var clickNumber = 0;
  var header = $(parent.frames['myframe'].document).find('.slider-header');
  var block = $(parent.frames['myframe'].document).find('.slider-block');

  block.on('click',function(){
    block.slideToggle();
    header.removeClass('slider-active');
  })

  header.on('click', function(){
    if (clickNumber === 0) {
      parent.ctrl.sendResult(1,100,"Просмотрено");
      clickNumber++;
    }
    if (!header.hasClass('slider-active')) {
      header.addClass('slider-active');
    } else {
      header.removeClass('slider-active')
    }
    block.slideToggle();
  })

  ctrl.coursePage = {
    play: function() {
      //
    },
    stop: function(){
      block.off('click');
      header.off('click');
      ctrl.coursePage = null;
    }
  }
})(parent.jQuery, parent.ctrl);
parent.ctrl.coursePage.play();
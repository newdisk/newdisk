;(function($, ctrl){
  'use strict';

  var visitSimple = false;
  var visitCommercial = false;
  var btnSimple = $(parent.frames['myframe'].document).find('.btn--simple');
  var btnCommercial = $(parent.frames['myframe'].document).find('.btn--commercial');
  var blockSimple = $(parent.frames['myframe'].document).find('.slider-block--simple');
  var blockCommercial = $(parent.frames['myframe'].document).find('.slider-block--commercial');

  btnSimple.on('click',function(){
    visitSimple = true;
    if (visitCommercial === true) parent.ctrl.sendResult(1,100,"Просмотрено");
    if (!btnSimple.hasClass('slider-active')) {
      btnSimple.addClass('slider-active');
      if (btnCommercial.hasClass('slider-active')) {
        btnCommercial.removeClass('slider-active');
        blockCommercial.slideToggle();
      }
    } else {
      btnSimple.removeClass('slider-active')
    }
    blockSimple.slideToggle();
  })

  btnCommercial.on('click',function(){
    visitCommercial = true;
    if (visitSimple === true) parent.ctrl.sendResult(1,100,"Просмотрено");
    if (!btnCommercial.hasClass('slider-active')) {
      btnCommercial.addClass('slider-active');
      if (btnSimple.hasClass('slider-active')) {
        btnSimple.removeClass('slider-active');
        blockSimple.slideToggle();
      }
    } else {
      btnCommercial.removeClass('slider-active')
    }
    blockCommercial.slideToggle();
  })

  blockSimple.on('click', function(){
    blockSimple.slideToggle();
    btnSimple.removeClass('slider-active');
  })

  blockCommercial.on('click', function(){
    blockCommercial.slideToggle();
    btnCommercial.removeClass('slider-active');
  })

  ctrl.coursePage = {
    play: function() {
      //
    },
    stop: function(){
      btnSimple.off('click');
      btnCommercial.off('click');
      blockSimple.off('click');
      blockCommercial.off('click');
      ctrl.coursePage = null;
    }
  }
})(parent.jQuery, parent.ctrl);
parent.ctrl.coursePage.play();
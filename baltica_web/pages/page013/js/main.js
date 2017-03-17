;(function($, ctrl){
  'use strict';

  var leftCarouselControl = $(parent.frames['myframe'].document).find('.left');
  var rightCarouselControl = $(parent.frames['myframe'].document).find('.right');

  var carousel = $(parent.frames['myframe'].document).find('#carousel-example-generic');

  function checkItem() {
    if ($(parent.frames['myframe'].document).find('#carousel-example-generic .carousel-inner .item:first').hasClass('active')) {
      carousel.children('.left').hide();
      carousel.children('.right').show();
    } else if ($(parent.frames['myframe'].document).find('#carousel-example-generic .carousel-inner .item:last').hasClass('active')) {
      ctrl.sendResult(1,100,'');
      carousel.children('.right').hide();
      carousel.children('.left').show();
    } else {
      carousel.children('.carousel-control').show();
    }
  }

  leftCarouselControl.on("click",handlerCarousel);
  rightCarouselControl.on("click",handlerCarousel);

  function handlerCarousel(){
    setTimeout(function() {
      checkItem()
    }, 1000);    
  }
  
  ctrl.coursePage = {
    play: function() {
      checkItem();
    },
    stop: function(){
      leftCarouselControl.off("click");
      rightCarouselControl.off("click");
      ctrl.coursePage = null;
    }
  }
})(parent.jQuery, parent.ctrl);
parent.ctrl.coursePage.play();
;(function($, ctrl){
  'use strict';

  var linkToDoc = $(parent.frames['myframe'].document).find('.link_to_doc');
  var pageContainer = $(parent.frames['myframe'].document).find('.container');
  var pageContainer1 = $(parent.frames['myframe'].document).find('.container_page1');
  var pageContainer2 = $(parent.frames['myframe'].document).find('.container_page2');
  var carousel = $(parent.frames['myframe'].document).find('.carousel');
  var leftCarouselControl;
  var rightCarouselControl;

  linkToDoc.on("click",handler);

  function handler(){
    pageContainer.css('background', 'url("img/6_1.jpg") no-repeat');
    pageContainer1.css('display', 'none');
    pageContainer2.css('display', 'block');

    //carousel.carousel('pause');

    leftCarouselControl = $(parent.frames['myframe'].document).find('.left');
    rightCarouselControl = $(parent.frames['myframe'].document).find('.right');

    leftCarouselControl.on("click",handlerCarousel);
    rightCarouselControl.on("click",handlerCarousel);

    function handlerCarousel(){

      ctrl.sendResult(1,100,'');
      leftCarouselControl.off("click",handlerCarousel);
      rightCarouselControl.off("click",handlerCarousel);

    }

    ctrl.openPolitics(1,"");

  }


//ctrl.openPolitics(0,"#id"); открытие политики с индексом 0 и с id ="id"

  ctrl.coursePage = {
    play: function() {
      //
    },
    stop: function(){
      linkToDoc.off("click");
     // handler.leftCarouselControl.off("click");
      //handler.rightCarouselControl.off("click");
      //pageBlock2Btn.off('click');
      ctrl.coursePage = null;
    }
  }
})(parent.jQuery, parent.ctrl);
parent.ctrl.coursePage.play();
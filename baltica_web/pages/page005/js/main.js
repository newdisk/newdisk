;(function($, ctrl){
  'use strict';

  var linkToDoc = $(parent.frames['myframe'].document).find('.link_to_doc');
  var pageContainer = $(parent.frames['myframe'].document).find('.container');
  var pageContainer1 = $(parent.frames['myframe'].document).find('.container_page1');
  var pageContainer2 = $(parent.frames['myframe'].document).find('.container_page2');
  var carousel = $(parent.frames['myframe'].document).find('.carousel');
  var leftCarouselControl = $(parent.frames['myframe'].document).find('.left'),
    rightCarouselControl = $(parent.frames['myframe'].document).find('.right');
  var viewChapter2, viewChapter6;
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

  linkToDoc.on("click", openDocs);

  function openDocs(e) {
    if ($(e.target).hasClass('link_to_doc_chapter2')) {
      ctrl.openPolitics(1,"");
      viewChapter2 = true;
    } else if ($(e.target).hasClass('link_to_doc_chapter6')) {
      ctrl.openPolitics(5,"");
      viewChapter6 = true;
    }
    if (viewChapter2 && viewChapter6) {
      handler();
    }
  }

  function handler(){
    pageContainer.css('background', 'url("img/6_1.jpg") no-repeat');
    pageContainer1.css('display', 'none');
    pageContainer2.css('display', 'block');

    leftCarouselControl.on("click",handlerCarousel);
    rightCarouselControl.on("click",handlerCarousel);

    function handlerCarousel(){
      setTimeout(function() {
        checkItem()
      }, 1000);    
    }
  }


//ctrl.openPolitics(0,"#id"); открытие политики с индексом 0 и с id ="id"

  ctrl.coursePage = {
    play: function() {
      checkItem();
    },
    stop: function(){
      linkToDoc.off("click");
      leftCarouselControl.off("click");
      rightCarouselControl.off("click");
      ctrl.coursePage = null;
    }
  }
})(parent.jQuery, parent.ctrl);
parent.ctrl.coursePage.play();
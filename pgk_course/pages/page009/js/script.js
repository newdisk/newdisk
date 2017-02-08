;(function($, ctrl){
'use strict';

    var arrow = $(parent.frames['myframe'].document).find('.slide-block__arrow');
    var sliderLine = $(parent.frames['myframe'].document).find('.slide-block__toggle');
    sliderLine.attr('style','display: none');

    var pageDocument = $(parent.frames['myframe'].document),
        animatedList = pageDocument.find('.animated');

    function play() {
        $(animatedList[0]).animate({opacity:0},{duration:1000, complete: function(){
            $(animatedList[1]).animate({opacity: 1},{queue: false, duration: 1500}).animate({top: 64},{duration: 1200, complete: function(){
                $(animatedList[2]).animate({opacity: 1},{queue: false, duration: 1500}).animate({top: 177,left: 380},{duration: 1200, complete: function(){
                    $(animatedList[3]).animate({opacity: 1},{queue: false, duration: 1500}).animate({top: 355,left: 318},{duration: 1200, complete: function(){
                        $(animatedList[4]).animate({opacity: 1},{queue: false, duration: 1500}).animate({top: 355,left: 123},{duration: 1200, complete: function(){
                            $(animatedList[5]).animate({opacity: 1},{queue: false, duration: 1500}).animate({top: 177,left: 64},{duration: 1200, complete: function(){
                                startArrow();
                            }});
                        }});
                    }});
                }});    
            }});
        }});
    }

    function startArrow() {
        $(animatedList[6]).animate({opacity: 1},{duration: 500, complete: function(){
            $(animatedList[7]).animate({opacity: 1},{duration: 500, complete: function(){
                $(animatedList[8]).animate({opacity: 1},{duration: 500, complete: function(){
                    $(animatedList[9]).animate({opacity: 1},{duration: 500, complete: function(){
                        $(animatedList[10]).animate({opacity: 1},{duration: 500, complete: function(){
                            startBlocks();
                        }});
                    }});
                }});
            }});    
        }});
    };

    function startBlocks() {
        $(animatedList[11]).animate({opacity: 1},{duration: 2000, complete: function(){
            $(animatedList[12]).animate({opacity: 1},{duration: 1000, complete: function(){
                sliderLine.removeAttr('style');
            }});    
        }});
    };

    arrow.on('click',btnArrowClicker);

    function btnArrowClicker(e) {
        if ($(arrow).hasClass('active')) {
            $(parent.frames['myframe'].document).find('.page010__scheme').slideDown();
            $(arrow).removeClass('active');
            $(sliderLine).removeClass('activated');
            $(parent.frames['myframe'].document).find('.page010__main-text').attr('style','display: none');
        } else {
            $(parent.frames['myframe'].document).find('.page010__scheme').slideUp();
            $(arrow).addClass('active');
            $(sliderLine).addClass('activated');
            $(parent.frames['myframe'].document).find('.page010__main-text').removeAttr('style');
        }
        ctrl.sendResult(1,100,"Все посмотренно");
    }

    // function init() {}

    // function destroy() {}

    function restart() {}

    ctrl.coursePage = {
        play: function() {
            $(animatedList[0]).animate({opacity:1},{duration:0});
            pageDocument.find('.page010__arrow, .page010__big-arrow, .page010__big-circle')
                        .animate({opacity:0},{duration:0, complete: function(){               
                            play();
                        }});
        },
        stop: function(){
            arrow.off('click');
            animatedList.stop(true);
            ctrl.coursePage = null;
        },
        restart: function(){
            //
        }
    }

    ctrl.coursePage.play();
})(parent.jQuery, parent.ctrl);
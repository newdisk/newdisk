;(function($, ctrl){
    'use strict';

    var animateList = $(parent.frames['myframe'].document).find('.animate');

    animateList.animate({opacity:0},0)

    for (var i = 0; i < animateList.length; i++){
        $(animateList[i]).animate({opacity: 0},0).delay(1000*(i+1)).animate({opacity: 1},500);
    }

ctrl.coursePage = {    
    play: function(){
        
    },
    stop: function() {
        animateList.finish();
        ctrl.coursePage = null;
    }

}

ctrl.coursePage.play();
})(parent.jQuery, parent.ctrl);

;(function($, ctrl){
'use strict';

    /* Get comments from JSON */
    var commentMessage = ctrl.structure.pages[ctrl.bookmark].messages;
    var commentAnswer = ctrl.structure.pages[ctrl.bookmark].answers;

    var ansList = commentAnswer.split(',');
    var numAttempt = 0;
    var showAns = false;

    var selectList;
    var itemList = $(parent.frames['myframe'].document).find('.page__item');
    itemList.on("click", selectedElem);

    var btnAns = $(parent.frames['myframe'].document).find('.btn--answer');
    var btnRestart = $(parent.frames['myframe'].document).find('.btn--restart');
    btnAns.attr('disabled',true)
             .addClass('btn--disabled');
    btnAns.on("click", function() {
        btnAns.attr('disabled',true)
                     .addClass('btn--disabled');
        btnAnsHandler();
    });
    btnRestart.on("click", btnRestartHandler);

    function selectedElem(e) {
        if (showAns === true) {
            $(parent.frames['myframe'].document).find('.page__item').removeClass('selected').attr('style','');
            showAns = false;
        };
        var selectObj = e.target;

        if ($(selectObj).hasClass("selected")){
            $(selectObj).removeClass("selected");
        } else {
            $(selectObj).addClass("selected");
        }
        
        selectList = $(parent.frames['myframe'].document).find('.selected');
        if (selectList.length !== 0) {
            btnAns.attr('disabled',false)
             .removeClass('btn--disabled');
        }
    }

    function btnAnsHandler() {
        numAttempt++;
        selectList = $(parent.frames['myframe'].document).find('.selected');
        selectList.attr('style','');
        if (selectList.length !== ansList.length && numAttempt !== 3) {
            return ctrl.sendResult(-1,0,'<p class="feedback__text">' + commentMessage[numAttempt] + '</p>')  
        };
        for (var i = 0; i < ansList.length; i++) {
            if ($.inArray($(selectList[i]).attr('id'),ansList) === -1) {
                if (numAttempt !== 3){
                    return ctrl.sendResult(-1,0,'<p class="feedback__text">' + commentMessage[numAttempt] + '</p>')
                } else {
                    itemList = $(parent.frames['myframe'].document).find('.page__item');
                    for (var j = 0; j < itemList.length; j++){
                        if ($(ansList).index($(itemList[j]).attr('id')) === -1) {
                            $(itemList[j]).removeClass("selected");
                        } else {
                            $(itemList[j]).addClass("selected");
                        }
                    }
                    for (var k = 0; k < ansList.length; k++) {
                        $(parent.frames['myframe'].document).find('#' + ansList[k]).addClass("selected")
                                                                                    .attr('style','background: #4B9968');
                    }
                    numAttempt = 0;
                    showAns = true;
                    return ctrl.sendResult(-1,2,'<p class="feedback__text">' + commentMessage[3] + '</p>',true)
                }
            }
        }
        selectList.attr('style','background: #4B9968;');
        return ctrl.sendResult(1,100,'<p class="feedback__text">' + commentMessage[0] + '</p>')
    }

    function btnRestartHandler() {
        selectList = $(parent.frames['myframe'].document).find('.selected');
        selectList.attr('style','');
        for (var i = 0; i < selectList.length; i++) {
            $(selectList[i]).removeClass("selected");
        }
        btnAns.attr('disabled',true)
             .addClass('btn--disabled');
    }

ctrl.coursePage = {
    play: function() {
        //
    },
    stop: function(){
        itemList.off("click");
        btnAns.off("click");
        btnRestart.off("click");
        ctrl.coursePage = null;
    },
    restart: function(){
        btnRestartHandler()
    }
}
})(parent.jQuery, parent.ctrl);
parent.ctrl.coursePage.play();
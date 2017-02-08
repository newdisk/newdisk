;(function($, ctrl){
'use strict';

    /* Get comments from JSON */
    var commentMessage = ctrl.structure.pages[ctrl.bookmark].messages;
    var commentAnswer = ctrl.structure.pages[ctrl.bookmark].answers;

    var selectList;
    var itemList = $(parent.frames['myframe'].document).find('.page__item-wrapper');
    itemList.on("click", selectedElem);

    var btnAns = $(parent.frames['myframe'].document).find('.btn--answer');
    var btnRestart = $(parent.frames['myframe'].document).find('.btn--restart');
    btnAns.attr('disabled',true)
             .addClass('btn--disabled');
    btnAns.on("click", btnAnsHandler);
    btnRestart.on("click", btnRestartHandler);

    function selectedElem(e) {
        if ($(e.target).hasClass('page__item-wrapper')) {
            var selectObj = e.target;
        } else {
            var selectObj = e.target.parentNode;
        };

        selectList = $(parent.frames['myframe'].document).find('.selected');
        if (selectList.length !== 0) {
            selectList.removeClass("selected").attr('style','');
        }

        var selectTitle = $(selectObj).find('.item');
        selectTitle.addClass("selected");
        btnAns.attr('disabled',false)
             .removeClass('btn--disabled');     
    }

    function btnAnsHandler() {
        btnAns.attr('disabled',true)
             .addClass('btn--disabled');
        selectList = $(parent.frames['myframe'].document).find('.selected');
        var index = $(selectList[0].parentNode.parentNode).attr('id');
        if (index == commentAnswer) {
            $(selectList[0]).attr('style','background: #4B9968');
            return ctrl.sendResult(1,100,'<p class="feedback__text">' + commentMessage[index-1] + '</p>')
        } else {
            return ctrl.sendResult(-1,0,'<p class="feedback__text">' + commentMessage[index-1] + '</p>')
        }
    }

    function btnRestartHandler() {
        btnAns.attr('disabled',true)
             .addClass('btn--disabled');
        selectList = $(parent.frames['myframe'].document).find('.selected');
        selectList.removeClass("selected").attr('style','');

        var cellList = $(parent.frames['myframe'].document).find('.page__item-wrapper');
        for (var i = cellList.length - 1; i > 0; i--) {
            var num = Math.floor(Math.random() * (i + 1));

            var d = cellList[i].innerHTML;
            var dID = $(cellList[i]).attr('id');
            var f = cellList[num].innerHTML;
            var fID = $(cellList[num]).attr('id');
            $(cellList[i]).attr('id',fID).html(f);
            $(cellList[num]).attr('id',dID).html(d);
        };
    }

ctrl.coursePage = {
    play: function() {
        //
    },
    stop: function(){
        $(itemList).off("click");
        $(btnAns).off("click");
        $(btnRestart).off("click");
        ctrl.coursePage = null;
    },
    restart: function(){
        btnRestartHandler()
    }
}
})(parent.jQuery, parent.ctrl);
parent.ctrl.coursePage.play();
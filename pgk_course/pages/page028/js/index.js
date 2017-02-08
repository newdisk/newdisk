;(function($, ctrl){
  'use strict';

  /* Get comments from JSON */
  /* 1st elements of commentMessage is comment on right answer, other - on false ones */
  var commentMessage = ctrl.structure.pages[ctrl.bookmark].messages;

  $(parent.frames['myframe'].document).find( "#accordion" ).accordion({
    heightStyle: "content",
    icons: false,
    activate: function( event, ui ) {
      ui.newPanel.show('blind',400);

    },
    beforeActivate: function( event, ui ) {
      ui.oldPanel.hide('blind',400)
      ui.newPanel.css('display','none')

    }
  });

  var btnAns = $(parent.frames['myframe'].document).find('.btn--answer');
  var btnRestart = $(parent.frames['myframe'].document).find('.btn--restart');

  btnAns.on('click', btnClickAns);
  btnRestart.on('click', btnClickRestart);
  var numAttempt = 0;

  var checkList = $(parent.frames['myframe'].document).find('.check-item');

  checkList.on('click', clickCheck);

  function clickCheck(e) {
    var elem = $(e.target).closest('.check-item')[0];
    if ($(elem).hasClass('checked')) {
      $(elem).removeClass('checked');
    } else {
      $(elem).addClass('checked');
    }
  };

  function btnClickAns() {
    var inputList = $(parent.frames['myframe'].document).find('.accordion-input');
    checkList = $(parent.frames['myframe'].document).find('.check-item');
    var inputFilled = true,
        checkboxFilled = false; 
    for (var j = 0; j < checkList.length; j++) {
      if ($(checkList[j]).hasClass('checked')) {
        checkboxFilled = true;
        break;
      }
    }
    for (var i = 0; i < inputList.length; i++) {
      if (!inputList[i].value) {
        inputFilled = false;
        break;
      }
    }
    if (!inputFilled || !checkboxFilled) {
      inputFilled = inputFilled ? '' : 'Заполните все текстовые поля.';
      checkboxFilled = checkboxFilled ? '' : 'Выберите варианты ответа в VIII разделе. <br><br>';
      return ctrl.sendResult(-1,0,'<p class="feedback__text">' + inputFilled + ' ' + checkboxFilled + 
                    '</p>', true);
    }

    numAttempt++;
    btnAns.attr('disabled',true).addClass('btn--disabled');
    for (var i = 0; i < inputList.length; i++) {
      $(inputList[i]).attr('readonly',true);
    }

    var rightAnsAmount = 0;
    for (var i = 0; i < inputList.length; i++) {
      if ($.trim(inputList[i].value).toLowerCase() === $.trim($(inputList[i]).attr("data-answer").toLowerCase())) {
        rightAnsAmount++;
        inputList[i].style.borderBottom = "2px solid #4B9968";
      } else {
        inputList[i].style.borderBottom = "2px solid rgb(124,0,47)";
        if (numAttempt !== 3) $(inputList[i]).parent().find('.answer-comment').attr('style','display: inline');
      }
    }
    var choiceResponse = true;
    for (var i = 0; i < checkList.length; i++) {

      if ($(checkList[i]).hasClass('checked') && $(checkList[i]).attr('data-answer') == '0' ||
          $(checkList[i]).attr('data-answer') == '1' && !$(checkList[i]).hasClass('checked')) {
        choiceResponse = false;
      } 
      $(checkList[i]).attr('style','pointer-events: none');
    }
    if (choiceResponse === true) {
      rightAnsAmount++;
    } else if (numAttempt !== 3) {
      $(checkList[0]).parent().parent().find('.answer-comment').attr('style','display: inline');
    }

    if (rightAnsAmount === inputList.length + 1) {
      btnRestart.attr('disabled',true)
         .addClass('btn--disabled');
      parent.ctrl.sendResult(1,100,commentMessage[0]);
    } else {
      if (numAttempt !== 3) {
          return ctrl.sendResult(-1,0,'<p class="feedback__text">' + commentMessage[1] + 
            '</p>',true)
        } else {
          inputList = $(parent.frames['myframe'].document).find('.accordion-input');
          for (var i = 0; i < inputList.length; i++) {
            inputList[i].value = $(inputList[i]).attr('data-answer');
            inputList[i].style.borderBottom = "2px solid #4B9968";
          }
          for (var i = 0; i < checkList.length; i++) {
            if ($(checkList[i]).attr('data-answer') == '1') {
              $(checkList[i]).addClass('checked');
            } else {
              $(checkList[i]).removeClass('checked');
            }
          }
          numAttempt = 0;
          return ctrl.sendResult(-1,2,'<p class="feedback__text">' + commentMessage[2] + 
                    '</p>',true);
        };
    }
  }

  function btnClickRestart() {
    if (numAttempt === 3) return;
    btnAns.attr('disabled',false).removeClass('btn--disabled');
    var inputList = $(parent.frames['myframe'].document).find('.accordion-input');
    var answerCommentList = $(parent.frames['myframe'].document).find('.answer-comment');
    checkList = $(parent.frames['myframe'].document).find('.check-item');
    for (var i = 0; i < inputList.length; i++) {
      $(inputList[i]).attr('readonly',false);
      inputList[i].value = '';
      inputList[i].removeAttribute("style");
      answerCommentList[i].removeAttribute("style");
    }
    for (var i = 0; i < checkList.length; i++) {
      $(checkList[i]).removeClass('checked').attr('style','');
    }
    answerCommentList[inputList.length].removeAttribute("style");
  }

ctrl.coursePage = {
  play: function() {
    //
  },
  stop: function(){
    checkList.off('click');
    btnAns.off('click');
    btnRestart.off('click');
    ctrl.coursePage = null;
  },
  restart: function(){
    btnClickRestart()
  }
}
})(parent.jQuery, parent.ctrl);
parent.ctrl.coursePage.play();
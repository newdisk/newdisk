;(function($, ctrl, _){
  'use strict';

  var pageDocument = $(parent.frames['myframe'].document),
      feedback = pageDocument.find('#feedback_ex'),
      selectList = pageDocument.find('.social-network-block__select'),
      commentList = ctrl.structure.pages[ctrl.bookmark].messages,
      headCommentList = ctrl.structure.pages[ctrl.bookmark].headComment,
      glossaryArticleList = ctrl.structure.pages[ctrl.bookmark].linkParagr,
      linkDoc = ctrl.structure.pages[ctrl.bookmark].linkDoc;
  var avatarAnswer = '2',
      answer = '1',
      taskNumberAccess = 4,
      successNumber = 0,
      defaultAvatarSrc;

  pageDocument.find('.avatar-block__img_variants').on('click', chooseAvatar);
  pageDocument.find('.slider-block__title').on('click', slideSelect);
  pageDocument.find('.slider-block__item').on('click', chooseSelectOption);

  function success(successNumber, indexBlock, comment, msg) {
    var btn = pageDocument.find('.continueBtn'),
        hintList = pageDocument.find('.hint');

    feedback.find('.feedback_headComment').html(comment).css('color','rgb(43, 124, 0)');
    feedback.find('#feedback-body').html(msg);
    btn.toggle();
    
    successNumber++;
    if (successNumber === taskNumberAccess) {
      btn.on('click', function() {
        pageDocument.find('.social-block-wrapper').css('pointer-events','auto');
        btn.toggle();
        feedback.toggle();
        $(hintList[indexBlock]).toggle();
        ctrl.sendResult(1,100,'Задание выполнено успешно!', false,'Результат');
        btn.off();
      })
    } else {
      btn.on('click', function() {
        pageDocument.find('.social-block-wrapper').css('pointer-events','auto');
        btn.toggle();
        feedback.toggle();
        $(hintList[indexBlock]).toggle();
        btn.off();
      })
    }
    return successNumber;
  }

  function failure(indexBlock, comment, msg) {
    var btn = pageDocument.find('.politicBtn');

    feedback.find('.feedback_headComment').html(comment).css('color','rgb(124,0,47)');
    feedback.find('#feedback-body').html(msg);
    btn.toggle();
    btn.on('click', function() {
      pageDocument.find('.social-block-wrapper').css('pointer-events','auto');
      btn.toggle();
      feedback.toggle();
      if (indexBlock === 0) {
        pageDocument.find('.avatar-block__img_main').attr('src', defaultAvatarSrc);
        pageDocument.find('.avatar-block__img_variants').parent().removeAttr('style');
      } else {
        $(pageDocument.find('.slider-block__title')[indexBlock - 1]).html('Выберите вариант ответа.');
      }
      ctrl.openPolitics(linkDoc,glossaryArticleList[indexBlock]);
      btn.off();
    })
  }

  function chooseAvatar(e) {
    pageDocument.find('.social-block-wrapper').css('pointer-events','none');
    defaultAvatarSrc = pageDocument.find('.avatar-block__img_main').attr('src');
    pageDocument.find('.avatar-block__img_main').attr('src',$(e.target).attr('src'));
    pageDocument.find('.avatar-block__img_variants').parent().css('display','none');
    if ($(e.target).attr('data-answer') === avatarAnswer) {
      feedback.toggle();
      successNumber = success(successNumber, 0, headCommentList[0], commentList[0]);
    } else {
      feedback.toggle();
      failure(0, headCommentList[1], commentList[1]);
    } 
  }

  function slideSelect(e) {
    var activeSelectList = pageDocument.find('.active'),
        elem = e.target ? e.target : $(e).parents('.social-network-block__select').find('.slider-block__title');
    
    if ($(elem).parents('.social-network-block__select').find('.slider-block')[0].style.display === 'none') {
      if (activeSelectList.length) return;
      $(elem).addClass('active');
    } else {
      $(elem).removeClass('active');
    }
    $(elem).parents('.social-network-block__select').find('.slider-block').slideToggle('fast');
  }

  function chooseSelectOption(e) {
    var index,
        i;
    
    for (i = 0; i < selectList.length; i++) {
      if ($(e.target).parents('.social-network-block__select').position().top === $(selectList[i]).position().top) {
        index = i;
      }
    }

    pageDocument.find('.social-block-wrapper').css('pointer-events','none');
    $(e.target).parents('.social-network-block__select').find('.slider-block__title').html($(e.target).text());
    slideSelect(e.target);
    if ($(e.target).attr('data-answer') === answer) {
      feedback.toggle();
      successNumber = success(successNumber, index + 1, headCommentList[2*(index + 1)], commentList[2*(index + 1)]);
      $(e.target).parents('.social-network-block__select').find('.slider-block__title').css('pointer-events','none');
    } else {
      feedback.toggle();
      failure(index + 1, headCommentList[2*(index + 1) + 1], commentList[2*(index + 1) + 1]);
    } 
  }

  ctrl.coursePage = {
    play: function() {
      //
    },
    stop: function(){
      ctrl.coursePage = null;
    },
    restart: function(){
      restart();
    },
    taskAttemp:1
  }
})(parent.jQuery, parent.ctrl, parent._);
parent.ctrl.coursePage.play();
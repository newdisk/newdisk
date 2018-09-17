;(function($, ctrl){
'use strict';


	var pageDocument = $(parent.frames['myframe'].document);

	var	comments = ctrl.structure.pages[ctrl.bookmark].messages;
	var ansBtn = pageDocument.find('#myBtnAnswer');

	ansBtn.on('click', checkAnswer)
		.addClass('disabled')
		.attr('disabled', true);

	var	restartBtn = pageDocument.find('#myBtnRestart');

	var myBtn = pageDocument.find('#myBtn');

	var myElem_list = pageDocument.find('#myElem_list');
	var m_answer = pageDocument.find('.m_answer');
	var m_answerId;


	myBtn.on('click', function(){

		if(myElem_list.css('display') === 'block' ){
			myBtn.removeClass('active');
		}else{
			myBtn.addClass('active');
		}

		myElem_list.toggle('slide',{direction:'down'},300);
	})

	m_answer.on('click',btnListClicker);

	function btnListClicker(e) {

		myBtn.find('div').html($(e.target).closest('.m_answer').html());
		m_answerId = $(e.target).closest('.m_answer').attr("id");

		myBtn.removeClass('active');
		ansBtn.attr('disabled',false).removeClass('disabled');
		myElem_list.toggle('slide',{direction:'down'},300)
	}

	restartBtn.on('click',restartBtnClicker);

	function restartBtnClicker(){

		if(myElem_list.css('display') === 'block' ){
			myBtn.removeClass('active');
			myElem_list.toggle('slide',{direction:'down'},300);
		}
		myBtn.find('div').html('<p  id="ansWerT" class="page__text">Выберите вариант ответа.</p>')
		ansBtn.attr('disabled',true)
				.addClass('disabled');
	}

	function checkAnswer() {
		ansBtn.attr('disabled',true).addClass('disabled');

		if (m_answerId == 0) {
			ctrl.sendResult(1,100,comments[0])
		} else {
			ctrl.sendResult(-1,0,comments[m_answerId])
		}
	}


	ctrl.coursePage = {
		play: function() {
			//
		},
		stop: function(){
			ansBtn.off('click');
			myBtn.off('click');
			m_answer.off('click');
			restartBtn.off('click');
			ctrl.coursePage = null;
		},
		restart: function(){
			restartBtnClicker();
		}
	}
})(parent.jQuery, parent.ctrl);
parent.ctrl.coursePage.play();
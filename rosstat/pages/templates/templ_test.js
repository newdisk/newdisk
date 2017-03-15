;(function() {

	ctrl.templates.test = 	'<div class="prefinaltestpage">'+
								'<p class="prefinaltestpage_head">Перед прохождением итогового тестирования заполните все поля:</p>'+
								'<div class="prefinaltestpage_region">'+
									'<p>Наименование субъекта Российской Федерации</p>'+
									'<input type="text">'+
								'</div>'+
								'<div class="prefinaltestpage_surname">'+
									'<p>Фамилия</p>'+
									'<input type="text">'+
								'</div>'+
								'<div class="prefinaltestpage_name">'+
									'<p>Имя</p>'+
									'<input type="text">'+
								'</div>'+
								'<div class="prefinaltestpage_patronymiс">'+
									'<p>Отчество</p>'+
									'<input type="text">'+
								'</div>'+
								'<div class="prefinaltestpage_age">'+
									'<p>Возраст</p>'+
									'<input type="number" placeholder="0" min="0">'+
								'</div>'+
								'<div class="prefinaltestpage_btns">'+
									'<button class="prefinaltestpage_readyBtn"></button>'+
								'</div>'+
								'<div class="prefinaltestpage_warn"></div>'+
							'</div>'+
							'<div id="task-container">'+
								'<p class="testTitle">Тестирование по лекции</p>'+
								'<div id="task-body">'+
								'</div>'+
								'<div id="task-btns">'+
									'<button class="test_answBtn"></button>'+
									'<button class="test_restartBtn"></button>'+
									'<button class="test_passBtn"></button>'+
								'</div>'+
								'<div class="test_questions_panel">'+
									'<button class="test_questions_panel_btn"></button>'+
									'<div class="test_questions_panel_body"></div>'+
								'</div>'+
							'</div>';

})();
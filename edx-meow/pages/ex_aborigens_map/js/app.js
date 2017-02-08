/**
 * Created by ralic on 23.03.2016.
 *
 * Заготовка под встраиваемые упражнения.
 * --------------------------------------------------------------
 * Упражнение должно находится в контейнере <div id="task"></div>
 * Вся html страница будет встроена в iframe.
 * Ниже приведен минималистичный пример задания.
 * Необходимо придерживаться пунктов, помеченных как обязательные.
 *
 */

'use strict';

//Обязательное создание экземпляра task============================
var task = new Task();

/**
 * Класс для упражнения
 * Инициализация по команде init()
 * После проверки ответа,
 *      taskContainer отправляет событие 'task:result',
 *      содержащее объект с результатом.
 *
 * @constructor
 */
function Task(){
    var cls = this;

    cls.taskContainer = $('#task');
    cls.answerBtn = cls.taskContainer.find('#answer-btn');
    cls.message = cls.taskContainer.find('.result-info');

    //Обязательная инициализация упражнения через cls.init() =======
    cls.init = function(){
        initialize();
    };

    function initialize(){
        //some init code
       
        startEx.restart();

    }


    cls.sendResult = function(val){
        console.log('Hura! '+val)
        //Обязательная отправка события с набранным баллом=======
        cls.taskContainer.trigger('task:result',{result:val});
        //=======================================================
    }
}
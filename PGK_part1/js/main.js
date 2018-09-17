var ctrl = new Ctrl();

// $('#intro-play').on('click',  ctrl.startCourse);

function Ctrl() {
  var cls = this;

  cls.structure;
  cls.bookmark = 0;
  cls.successScore = 80;
  cls.pageSuccessScore = 1;
  cls.strongNavigation = true;
  cls.learner = 'Имя обучаемого';

  /**
  *   Получает результаты прохождения упражнения из файла страницы
  *   ожидается:
  *   status -1/0/1
  *   score от 0 до 100
  *   msg сообщение, отображамое в окне фидбека, можно в формате html
  *   lastTry являеется ли этот результат последней попыткой
  */
  cls.sendResult = function(status, score, msg, lastTry) {
    // console.log('Получены данные:', status, score, msg);
    // console.log('Закладка:', cls.bookmark);

    suspend.pages[cls.bookmark].status = status;
    // if (suspend.pages[cls.bookmark].type == 'e' || suspend.pages[cls.bookmark].type == 't') {
      suspend.pages[cls.bookmark].score = score;
    // }

    updateProgressBar();
    
    if (suspend.pages[cls.bookmark].type != 'c') {
      if (suspend.pages[cls.bookmark].type != 't') {
        pipwerks.SCORM.set('cmi.interactions.'+cls.interactions[cls.bookmark]+'.result', String(score));
      }
      openFeedBack(status, score, msg, lastTry);
    }

    if (suspend.pages[cls.bookmark].type == 't') {
      if (suspend.pages[cls.bookmark].score > cls.SuccessScore) {
        nextBtn.removeClass('disabled').removeAttr('jqtitle');
      }
    } else if (suspend.pages[cls.bookmark].score > cls.pageSuccessScore) {
      nextBtn.removeClass('disabled').removeAttr('jqtitle');
    } else {
      nextBtn.addClass('disabled').attr('jqtitle', disabledBtnMsg);
    }

    sendData();
  }
  cls.makeMeTestQuestionList = function() {

    var gr2 = 4,
        gr3 = 4,
        gr4 = 6,
        gr5 = 6;
    // console.log(testData)

    var questionList =  [];
    questionList = questionList.concat(_.shuffle(testData.test1.group1), _.sample(testData.test1.group2, gr2), _.sample(testData.test1.group3, gr3), _.sample(testData.test1.group4, gr4), _.sample(testData.test1.group5, gr5));

    cls.questionList = questionList;
    cls.currentQuest = 0;
    cls.testScore = 0;
    // console.info('questionList', cls.questionList)
  }

  cls.makeTask = function(task, qNum) {
    // console.info('makeTask', task)

    var taskBody = $(task).find('#task-body'),
        taskType = cls.questionList[qNum].type,
        taskPhrase = '';
    // clear task body
    taskBody.empty();
    
    taskBody.append('<p id="test-quest-num">'+Number(qNum+1)+'/'+cls.questionList.length+'</p>')
    if (taskType == 'single') {
      taskPhrase = 'Выберите один ответ.';
    } else {
      taskPhrase = 'Выберите один или несколько ответов.';
    }
    taskBody.append('<p id="test-quest-txt">'+cls.questionList[qNum].question+'<br/><span>'+taskPhrase+'</span></p>')

    switch(taskType) {
      case 'single':
        taskType = 'radio';
        makeAnswerList();
        cls.makeTestSingleTask(task);
        break;
      case 'multi':
        taskType = 'box';
        makeAnswerList();
        cls.makeTestMultiTask(task);
        break;
    }

    function makeAnswerList(){
      var answersList = cls.questionList[qNum].answers;
      answersList = _.shuffle(answersList);
      for (var i = 0; i < answersList.length; i++) {
        taskBody.append('<div class="answer" right="'+answersList[i].right+'">'+answersList[i].label+'<div class="check-item '+taskType+'"></div></div>');
      }
    }
    
  }

  cls.makeTestSingleTask = function(task) {

    var ansBtn = $(task).find('#test-answBtn'),
        itemList = $(task).find('.answer');

    ansBtn.off('click').on('click', function() { checkAnswer(task, itemList) } ).addClass('disabled').attr('disabled', true);
    itemList.off('click').on('click', selectItem);

    function selectItem() {

      itemList.removeClass('selected');
      $(this).addClass('selected');

      var answered = false;
      itemList.each(function(i,v) {
        if($(v).hasClass('selected')) {
          answered = true;
        }
      })
      if (answered) {
        ansBtn.attr('disabled',false).removeClass('disabled');
      } else {
        ansBtn.attr('disabled',true).addClass('disabled');
      }
    }
  }
  cls.makeTestMultiTask = function(task) {

    var ansBtn = $(task).find('#test-answBtn'),
        itemList = $(task).find('.answer');

    ansBtn.off('click').on('click', function() { checkAnswer(task, itemList) } ).addClass('disabled').attr('disabled', true);
    itemList.off('click').on('click', selectItem);

    function selectItem() {

      if ($(this).hasClass('selected')) {
        $(this).removeClass('selected');
      } else {
        $(this).addClass('selected');
      }

      var answered = false;
      itemList.each(function(i,v) {
        if($(v).hasClass('selected')) {
          answered = true;
        }
      })
      if (answered) {
        ansBtn.attr('disabled',false).removeClass('disabled');
      } else {
        ansBtn.attr('disabled',true).addClass('disabled');
      }
    }
  }
  // вспомогательная функция теста
  function checkAnswer(task, itemList) {

    itemList.addClass('disabled');

    var result = 0,
        testStatus = 0,
        testMsg = '';

    var checker = true;
    var userAnswer = 0;
    var rightAnswer = 0;
    itemList.each(function (i,v) {
      if ($(v).attr('right') === 'true') {
        rightAnswer++;
      }
      if ($(v).hasClass('selected') && $(v).attr('right') !== 'true') {
        checker = false;
      }
      if ($(v).hasClass('selected') && $(v).attr('right') === 'true') {
        userAnswer++;
      }

    })

    if (checker && userAnswer == rightAnswer) {
      //cls.questionList[cls.currentQuest].score = 100; // если нужен будет функционал пропускать вопросы
      cls.testScore += 100;
    }

    cls.currentQuest++;
    if (cls.currentQuest >= cls.questionList.length) {

      if(cls.testScore > 0) {
        result = Math.floor(cls.testScore/cls.questionList.length);
      }  

      testMsg = '<p class="big-size"><span>Ваш результат: '+result+'%</span></p>';
        
      testStatus = result >= cls.successScore ? 1 : -1;  

      if (testStatus < 0) {
        testMsg+= '<p>Вам не удалось ответить на вопросы итогового тестирования в достаточном объеме.</p>'+
                  '<p>'+result+'%  - это недостаточный результат.</p>'+
                  '<p>Может быть, вы были невнимательны или что-то отвлекло вас.</p>'+
                  '<p>Для возврата к разделам курса воспользуйтесь кнопкой «МЕНЮ», повторите материалы и попробуйте пройти тестирование еще раз.</p>'
      } else {
        if (cls.success) {
          cls.learner = pipwerks.SCORM.get('cmi.learner_name');
        }
        testMsg+= '<p>Поздравляем!</p>'+
                  '<p>Вы успешно прошли итоговое тестирование учебного курса «Антикоррупционная политика АО «ПГК».</p>'
      }
      
      cls.sendResult(testStatus, result, testMsg);
    } else {
      cls.makeTask(task, cls.currentQuest);
    }
  };

  cls.printCert = function(){
    var urlPath = window.location.origin + window.location.pathname.split('index.html')[0] + 'pages/cert/index.html'
    var newWin = window.open(urlPath, 'printPage', 'width=1024, height=768');
  }

  cls.startCourse = function() {

    document.getElementById('intro').style.display = 'none';
    document.getElementById('container').style.display = 'block';

    pipwerks.SCORM.version = "2004";

    cls.success = pipwerks.SCORM.init();
    // load course data from LMS
    if (cls.success) {
      document.getElementById('hello').innerHTML = '';//'Hello SCORM!'
      // loadStructure()

      var tmp = pipwerks.SCORM.get('cmi.completion_status');
      // alert('LS '+tmp)
      if (tmp) { less_status = tmp; }

      tmp = pipwerks.SCORM.get('cmi.location');
      // alert('Get bookmark:: '+tmp)
      if (tmp || tmp != undefined || tmp != 'undefinded' || tmp != 'NaN') {
        cls.bookmark = Number(tmp);
      }

      tmp = pipwerks.SCORM.get('cmi.suspend_data');
      if (tmp && tmp.length > 0) {
        suspend = JSON.parse(tmp);
      } 
      // alert('suspend_data::\n'+tmp)

      tmp = pipwerks.SCORM.get('cmi.score.raw');
      if (tmp && tmp.length > 0) {
        courseScore = tmp;
      }

      if (courseScore >= cls.successScore) {
        cls.learner = pipwerks.SCORM.get('cmi.learner_name');
      }

    } else {
      document.getElementById('hello').innerHTML = 'No LMS detected.'
    }
    // сейчас грузит структуру независимо найдено апи или нет
    loadStructure();
  }

    // triggers
    var assetOpened = false,
        menuOpened = false,
        statsOpened = false,
        feedOpened = false,
        helpOpened = false;
    // kache vars
    var pageCont = document.getElementById('page-container'),
        pageTitle = document.getElementById('page-title'),
        paginator = $('.paginator'),
        courseMenu = $('#menu'),
        courseStats = $('#stats'),
        courseFeed = $('#feedback'),
        courseHelp = $('#help'),
        // courseGloss = $('#glossary'),
        dark = $('#dark'),
        progressBar = $( "#progress-bar" ),
        statsProgress = $('#stats-progress'),
        testsProgress = $('#tests-progress'),
        nextBtn = $('.nextBtn'),
        prevBtn = $('.prevBtn'),
        againBtn = $('#againBtn'),              // feedback
        continueBtn = $('#continueBtn'),        // feedback
        pagePreloader = $('#page-preloader'),
        preloadWheel = $('.preload-wheel');
    // options
    var frameName = 'myframe',
        disabledBtnMsg = '<p>После выполнения</p>'+
                         '<p>обязательных действий</p>'+
                         '<p>кнопка станет активной.</p>'
        
    // 
    var testData,
        suspend = '',
        courseScore = 0,
        less_status = 'incomplete',
        preload,
        angle = 0;


    preload = setInterval( animatePreloader ,50); 
    // start here
    if (window.addEventListener) {
        window.addEventListener('load', onLoadCourse, false);
      } else if (window.attachEvent) {
        window.attachEvent('onload', onLoadCourse);
      } else {
        window.onload = onLoadCourse;
      }
    function onLoadCourse() {
      clearInterval(preload);
      document.getElementById('main-preloader').style.display = 'none';
      document.getElementById('intro').style.display = 'block';
    } 

    function loadStructure() {
      $.getJSON('js/courseStructure.json', function(data) {
        //console.log(data)
        cls.structure = data;
        init(); 
      }).fail(function(jqxhr, textStatus, error){
        var err = textStatus + ", " + error;
        // console.log( "Request Failed (courseStructure.json): " + err );
      });
      $.getJSON('js/test.json', function(tData) {
        testData = tData;
        
      }).fail(function(jqxhr, textStatus, error){
        var err = textStatus + ", " + error;
        // console.log( "Request Failed (test.json): " + err );
      })
    }

    function init() {
      // полоса прогресса
      progressBar.slider({
        range: 'min',
        min: 0,
        max: cls.structure.pages.length,
        animate: "slow"
      }).slider( "disable" );

      dark.animate({opacity:0},0); // <= bug fix

      // tooltip
      $('#container').tooltip({
        items:'[jqtitle]',
        content: function() {
          return $(this).attr('jqtitle');
        }
      })

      // set main course name
      $('#course-title').find('p').text(cls.structure.course)

      // set btns
      //
      nextBtn.on('click', function(){
        goToPage(cls.bookmark+1)
        // console.log(suspend);
      })
      prevBtn.on('click', function(){
        goToPage(cls.bookmark-1)
      })
      $('#menuBtn').on('click', function(){
        if (assetOpened) { return; }
        assetOpened = true;
        menuOpened = true;

        updateList('menu');

        courseMenu.css('display', 'block')
          .animate({ left: '0px'}, 400);
      })
      $('#statsBtn').on('click', function(){
        if (assetOpened) { return; }
        assetOpened = true;
        statsOpened = true;

        updateList('stats');

        courseStats.fadeToggle(400)
      })
      $('#helpBtn').on('click', function(){
        openHelp();
      })

      $('#menuBtn, #statsBtn, #helpBtn').on('click', function() {

        dark.css('display', 'block')
          .animate({
            opacity: .4
          }, 400, function() {
            $(this).on('click', function(){
                      closeAsset();
                    })
            });
      })

      $('.closeAssetBtn').on('click', function(){
        closeAsset();
      })
      againBtn.on('click', function() {
        cls.coursePage.restart();
        closeAsset();
      })
      continueBtn.on('click', function(){
        goToPage(cls.bookmark+1);
      })
      $('#exitBtn').on('click', function(){
        sendData();
        $('#container').empty().append('<div id="end"></div>');
        setTimeout( function() { window.close() }, 2000)
      })

      buildSuspend(cls.structure.pages);

      createInteractions(cls.structure.pages);

      buildList(cls.structure.pages);
      goToPage(cls.bookmark);
    }

    function animatePreloader() {
      angle+=8;
      $(".preload-wheel").rotate(angle);
    }
    /**
    * Ф-ия создаёт объект, который будет храниться в СДО как suspend_data
    */
    function buildSuspend(list) {
      if (suspend || suspend.length > 0) { return; }
      suspend = {};
      suspend.pages = [];
      // ex, test, simple_page, complex_page
      // page obj sample: { status: 0, order: i, type: 'p' }
      // ex obj sample: { status: 0, order: i, type: 'e', score: -1 }
      // Сатусы: 0 - не проходил, 1 - страница\тест\упражнение пройдено, -1 - тест\упражнение провалено
      for (var i = 0; i < list.length; i++) {
        var obj = {};

        obj.score = 0;

        if (i==0) {
          obj.status = 1;
          obj.score = 100;
        } else {
          obj.status = 0;
        }
        
        obj.order = i;
        // берём первую букву из типа: e, t, s, c
        obj.type = list[i].type[0];


        if (list[i].type == 'ex' || list[i].type == 'test') {
          obj.score = -1;
        }
        suspend.pages.push(obj)
      }
      // console.log(suspend)
    }

    /**
    *   Создание задач (interactions) курса для СДО 
    */
    function createInteractions(list) {
      cls.interactions = [];
      var count = 0;
      for (var i = 0; i < list.length; i++) {
        if (list[i].type == 'ex') {
          cls.interactions[i] = count;
          pipwerks.SCORM.set('cmi.interactions.'+count+'.id', list[i].title);
          pipwerks.SCORM.set('cmi.interactions.'+count+'.type', 'choice');
          count++;
        }
      }
    }

    /**
    *   Создание списка меню и статы
    */
    function buildList(list) {
      var tmpStrMenu = '<ul id="menu-list">';
      var tmpStrStats = '<ul id="stats-list">';

      for (var i = 0; i < suspend.pages.length; i++) {

        tmpStrMenu += '<li order="'+suspend.pages[i].order+'" type ="'+suspend.pages[i].type+'" ';
        if (i == cls.bookmark) {
          tmpStrMenu += 'class="current"'
        }

        tmpStrMenu += '><div class="menu-item-status"> </div> <div class="menu-item-num">'+Number(i+1)+'.</div><p>'+list[i].title+'</p> </li>';
    
        if (suspend.pages[i].type == 'e') {
          tmpStrStats += '<li order="'+suspend.pages[i].order+'" type ="'+suspend.pages[i].type+'"> <div class="stats-item-status"> </div> <p>'+list[i].title+'</p> </li>';
        }
      }

      tmpStrMenu += '</ul>';
      tmpStrStats += '</ul>';

      $('#menu-body').append(tmpStrMenu);
      $('#stats-exs').append(tmpStrStats);

      $('#menu-list li, #stats-list li').on('click', function(e){
        goToPage($(e.target).closest('li').attr('order'));
      })

      $('#stats-progress, #tests-progress').progressbar({
        max: 100
      })
    }

    /**
    *   Обновление статусов списка меню и окна статы
    */
    function updateList(target) {

      switch(target) {
        case 'menu':
          var targetList = $('#menu-list').find('li');
          targetList.removeClass('current');
          var targetItemStatus = '.menu-item-status';
          break;
        case 'stats':
          var targetList = $('#stats-list').find('li');
          var targetItemStatus = '.stats-item-status';
          var cProgress = calculateProgress();

          if (cProgress.exs.done > 0 ) {
            $('#stats-msg').text('Упражнений выполнено: '+cProgress.exs.done+ ' из '+cProgress.exs.num);
          }
          
          statsProgress.progressbar('value', cProgress.exs.res);
          statsProgress.find('.progress-label')[0].innerHTML = Math.floor(cProgress.exs.res)+'%';

          // testsProgress.progressbar('value', cProgress.tests.res);
          // testsProgress.find('.progress-label')[0].innerHTML = Math.floor(cProgress.tests.res)+'%';
          break;
      }
      
      var tmpTarget;
      for (var i = 0; i < targetList.length; i++) {
        tmpTarget = $(targetList[i]);

        if (i == cls.bookmark) {
          tmpTarget.addClass('current');
        }

        if ((tmpTarget.attr('type') == 's' || tmpTarget.attr('type') == 'c') && suspend.pages[Number(tmpTarget.attr('order'))].status == 1) {
          tmpTarget.find(targetItemStatus).addClass('visited');
        }

        if (tmpTarget.attr('type') == 'e' || tmpTarget.attr('type') == 't') {
          if (suspend.pages[Number(tmpTarget.attr('order'))].status == 1) {
            tmpTarget.find(targetItemStatus).addClass('complited');
          } else if(suspend.pages[Number(tmpTarget.attr('order'))].status == -1) {
            tmpTarget.find(targetItemStatus).addClass('failed');
            tmpTarget.find(targetItemStatus).removeClass('complited');
          }
        }

      }
      
    }

    /**
    *   Считает % выполненых заданий и тестов,
    *   возвращает объект вида:
    *   {exs: { num: numExs,              всего заданий
    *           res: resExs,              результат в % за все задания
    *           done: complitedExs        всего выполнено
    *         }, 
    *   tests: {num: numTests,            всего тестов
    *           res: resTests,            результат в % за все тесты
    *           done: complitedTests }}   всего выполнено
    */
    function calculateProgress() {

      var summExs = 0,
          numExs = 0,
          resExs = 0,
          complitedExs = 0,
          summTests = 0,
          numTests = 0,
          resTests = 0,
          complitedTests = 0,
          visPages = 0,
          numPages = 0;

      for (var i = 0; i < suspend.pages.length; i++) {
        if (suspend.pages[i].type == 'e') {

          if (suspend.pages[i].score > 0) {
            summExs += suspend.pages[i].score;
          }
          if (suspend.pages[i].status == 1 ) {
            complitedExs++;
          }
          numExs++;
        }

        if (suspend.pages[i].type == 's') {
          visPages += suspend.pages[i].score;
          numPages++;
        }

        if (suspend.pages[i].type == 't') {
           if (suspend.pages[i].score > 0) {
            summTests += suspend.pages[i].score;
          }
          if (suspend.pages[i].status == 1 ) {
            complitedTests++;
          }
          numTests++;
        }

      }
      visPages = visPages/numPages;

      if (numExs > 0 ) {resExs = summExs/numExs;}
      
      if (numTests > 0 ){resTests = summTests/numTests;}
      else { resTests = (resExs + visPages)/2}

      return {exs:{num: numExs, res: resExs, done: complitedExs}, tests:{num: numTests, res: resTests, done: complitedTests }};

    }

    function closeMenu() {
      courseMenu.animate({
        left: -$('#menu').width()
      }, 400, function() { $(this).css('display', 'none'); })

      menuOpened = false;
    }

    function closeStats() {

      courseStats.fadeToggle(400);
      statsOpened = false;

    }

    function closeFeedBack() {

      courseFeed.fadeToggle(400);
      feedOpened = false;

    }

    function closeHelp() {

      courseHelp.fadeToggle(400);
      helpOpened = false;

    }

    /**
    *   Закрывает все открытые доп окна
    */
    function closeAsset() {
      if (menuOpened) { closeMenu(); }
      
      if (statsOpened) { closeStats(); }

      if (feedOpened) { closeFeedBack(); }

      if (helpOpened) { closeHelp(); }

      dark.animate({
        opacity: 0
      }, 400, function() { $(this).css('display', 'none').off(); });
      
      assetOpened = false;
    }

    function openFeedBack(status,score,msg,lastTry) {
      if (assetOpened) { closeAsset(); }
      feedOpened = true;
      assetOpened = true;
      
      if (status > 0) {
        againBtn.css('display','none');
        continueBtn.css('display','inline-block');
        $('#feedback-head p').css({'color':'#2B7C00'})
      } else {
        againBtn.css('display','inline-block');
        continueBtn.css('display','none');
        $('#feedback-head p').css({'color':'#7C002F'})
      }
      if (lastTry) {
        againBtn.css('display','none');
        continueBtn.css('display','none');
      }

      courseFeed.stop().fadeToggle(400).find('#feedback-body').html(msg);

        dark.css('display', 'block')
          .animate({
            opacity: .4
          }, 400, function() {
            $(this).on('click', function(){
                      closeAsset();
                    })
            });
    }

    function openHelp() {
      if (assetOpened) { return; }
      assetOpened = true;
      helpOpened = true;

      courseHelp.fadeToggle(400);

      dark.css('display', 'block')
          .animate({
            opacity: .4
          }, 400, function() {
            $(this).on('click', function(){
                      closeAsset();
                    })
            });
    }

    function updateProgressBar(){
      // считает прохождение по порядку
      var progress = 0;
      for (var i = 0; i < suspend.pages.length; i++) {
        if (suspend.pages[i].status < 1) {
          break;
        } else {
          progress++;
        }
      }
      progressBar.slider( "value", progress );
    }

    function goToPage(page) {
      var page = Number(page);
      // console.warn('Load page:', page);
      // проверка на страницу меньше первой и больше последней
      if (page < 0 || page > cls.structure.pages.length-1) { return; }
      // 
      // строгая навигация
      if (page > 0) {
        if (cls.strongNavigation && suspend.pages[page-1].score < cls.pageSuccessScore) { return; }
      }
      // статус «пройдено» для не упражнений
      if (suspend.pages[page].type == 's') {
        suspend.pages[page].status = 1;
        suspend.pages[page].score = 100;
      }
      if (page == 0) {
        prevBtn.addClass('disabled');
        nextBtn.removeClass('disabled');
      } else if (page == cls.structure.pages.length-1) {  // если последняя
        nextBtn.addClass('disabled').removeAttr('jqtitle');
        prevBtn.removeClass('disabled');
      } else if (suspend.pages[page].score < cls.pageSuccessScore) { // блокировка nextBtn, если страница не пройдена
        nextBtn.addClass('disabled').attr('jqtitle', disabledBtnMsg);
        prevBtn.removeClass('disabled');
      } else {
        if (suspend.pages[cls.bookmark].type == 't') {
          if (suspend.pages[cls.bookmark].score > cls.SuccessScore) {
            nextBtn.removeClass('disabled').removeAttr('jqtitle');
          }
        } else {
          nextBtn.removeClass('disabled').removeAttr('jqtitle');
          prevBtn.removeClass('disabled');
        }
        
      }
      
      if (assetOpened) { closeAsset(); }

      paginator.text(String(page+1) +'/'+ String(cls.structure.pages.length));

      // стоп анимации на странице и удаление слушателей
      // подразумевается, что на странице санимацией есть метод, который экстренно её завершает
      if (ctrl.coursePage) { ctrl.coursePage.stop(); };

      // удаление прошлой страницы из DOM
      var delPage =  document.getElementById(frameName);
      if (delPage) {
        pageCont.removeChild(delPage);
      }
      pageCont.innerHTML = '';
      
      cls.bookmark = page;
      // alert('page:: '+ page);
      $(pageTitle).find('p').text(cls.structure.pages[page].title);

      updateProgressBar();

      // показываем загрузку
      clearInterval(preload);
      preloadWheel.stop(true);
      preload = setInterval( animatePreloader ,50);
      pagePreloader.css('display','block');

      var iframe = document.createElement('iframe');
      // добавление iframe события по загрузке
      if (iframe.addEventListener) {
        iframe.addEventListener('load', doLoad, false);
      } else if (iframe.attachEvent) {
        iframe.attachEvent('onload', doLoad);
      } else {
        iframe.onload = doLoad;
      }
      function doLoad() {
        clearInterval(preload);
        pagePreloader.css('display','none');
        // if (ctrl.coursePage) { ctrl.coursePage.play(); };

        // показывать окно помощи на 1 странице
        if (page == 0) {
          openHelp()
        }
      }
        
      iframe.src = 'pages/' + cls.structure.pages[page].location + '/index.html';
      iframe.name = frameName;
      iframe.width = iframe.height = '100%';
      iframe.frameBorder = "0";
      pageCont.appendChild(iframe);

      sendData();
      
    }

    function sendData () {
      // alert('send')
      if (cls.success) {
        // set cls.bookmark
        pipwerks.SCORM.set('cmi.location', String(cls.bookmark));

        pipwerks.SCORM.set('cmi.suspend_data', JSON.stringify(suspend));

        courseScore = calculateProgress().tests.res;
        pipwerks.SCORM.set('cmi.score.raw', String(courseScore));

        if (courseScore >= cls.successScore) {
          pipwerks.SCORM.set('cmi.completion_status', 'completed');
        } else {
          pipwerks.SCORM.set('cmi.completion_status', 'incomplete');
        }
        
        pipwerks.SCORM.save();
      }
        
    }
    
  }
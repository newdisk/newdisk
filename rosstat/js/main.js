var ctrl = new Ctrl();

// $('#intro-play').on('click',  ctrl.startCourse);

function Ctrl() {
  var cls = this;

  cls.structure;
  cls.bookmark = 0;     // основная переменная закладки
  cls.bookmark_main = 0;  // закладка основного курса
  cls.bookmark_intro = 0; // закладка раздела введение
  cls.successScore = 80;
  cls.pageSuccessScore = 1;
  cls.strongNavigation = false;
  cls.volume = .75;
  cls.learner = 'Имя обучаемого';
  cls.learner_age = 0;
  cls.templates = {};

  cls.pdfvars = {};
  cls.pdfvars.region = '';
  cls.pdfvars.surname = '';
  cls.pdfvars.name = '';
  cls.pdfvars.patronymiс = '';
  cls.pdfvars.age = '';

  /**
  *   Получает результаты прохождения упражнения из файла страницы
  *   ожидается:
  *   status -1/0/1
  *   score от 0 до 100
  *   msg сообщение, отображамое в окне фидбека, можно в формате html
  *   lastTry являеется ли этот результат последней попыткой
  *   headComment Заголовок комментария к ответу
  */
  cls.sendResult = function(status, score, msg, lastTry, headComment) {
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
      
      openFeedBack(status, score, msg, lastTry, headComment);
    }

    if (suspend.pages[cls.bookmark].type == 't') {
      if (suspend.pages[cls.bookmark].score > cls.SuccessScore) {
        nextBtn.removeClass('disabled').removeAttr('jqtitle');
      }
    } else if (suspend.pages[cls.bookmark].score > cls.pageSuccessScore) {
      nextBtn.removeClass('disabled').removeAttr('jqtitle');
    }

    sendData();
  }
  cls.makeMeTestQuestionList = function() {
    
    // копирование объекта без ссылок
    function cloneObj(original) {
      var cloned = {};
      return $.extend(true, cloned, original);
    }

    var questionList =  [];
    
    for (var i = 0; i < testData.tests.length; i++) {
      // test number - i
      questionList[i] = {questions:[]};

      for (var j = 0; j < testData.tests[i].groups.length; j++) {
        // group number - j
        var qUse = '';

        if (testData.tests[i].groups[j].qUse == 'all') {
          qUse = testData.tests[i].groups[j].questions.length;
        } else {
          qUse = testData.tests[i].groups[j].qUse;
        }

        questionList[i].questions = questionList[i].questions.concat(_.map(_.sample(testData.tests[i].groups[j].questions, qUse), cloneObj));
        questionList[i].givenAnswer = [];
      }
    }

    cls.questionList = questionList.slice(0,questionList.length);
    cls.currentQuest = 0;
    cls.testScore = 0;
    // console.info('questionList', cls.questionList)
  }

  /**
  *   Собирает задание для тестов
  */
  cls.makeTask = function(task, qNum, testOff) {
    // console.info('makeTask', task)

    var taskBody = $(task).find('#task-body'),
        qList = cls.questionList[cls.structure.pages[cls.bookmark].testId].questions,
        taskType = qList[qNum].type,
        taskPhrase = '',
        testQuestionsPanel = $(task).find('.test_questions_panel'),
        testQuestionsPanelBody = testQuestionsPanel.find('.test_questions_panel_body')

    switch(taskType) {
      case 'single':
        taskType = 'radio';
        break;
      case 'multi':
        taskType = 'box';
        break;
    }

    // clear task body
    taskBody.empty();
    
    taskBody.append('<p id="test-quest-num">Вопрос '+Number(qNum+1)+' из '+qList.length+'</p>')
    if (taskType == 'radio') {
      taskPhrase = 'Выберите один ответ.';
    } else {
      taskPhrase = 'Выберите один или несколько ответов.';
    }
    taskBody.append('<p id="test-quest-txt">'+qList[qNum].question+'<br/><span>'+taskPhrase+'</span></p>')

    // make list of questions
    testQuestionsPanelBody.empty();

    var tmpList = '';
    for (var i = 0; i < qList.length; i++) {

      tmpList += '<div class="test_questions_panel_question '+qList[i].status;
      if (qNum == i) {
        tmpList += ' current';
      }
      tmpList += '" order="'+i+'">Вопрос № '+Number(i+1);

      if (testOff) {
        tmpList +='<div class="test_questions_panel_question_status ';

        if (qList[i].score == 100) {
          tmpList += 'completed">';
        } else {
          tmpList += 'incomplete">';
        }
        
      }
      tmpList += '</div></div>';
    }
    testQuestionsPanelBody.append(tmpList);

    if (!testOff) {
      // слушатель клика для кнопок панели вопросов
      $(task).find('.test_questions_panel_question').off().on('click', function() {
        var order = Number($(this).attr('order'));

        if(order == cls.currentQuest || qList[order].status == 'answered') { return; }

        qList[cls.currentQuest].status = 'passed';
        goToQuestion(task, order)
      })
      $(task).find('.test_questions_panel_btn').off().on('click', function() {
        $('.test_questions_panel').toggleClass('active')
      })

      // мешаем варианты ответов
      var answersList = _.shuffle(qList[qNum].answers);
      // answersList = _.shuffle(answersList);
      for (var i = 0; i < answersList.length; i++) {
        taskBody.append('<div class="answer" right="'+answersList[i].right+'">'+answersList[i].label+'<div class="check-item '+taskType+'"></div></div>');
      }
    } else {
      // не мешаем
      var answersList = cls.questionList[cls.structure.pages[cls.bookmark].testId].givenAnswer[qNum].answers;
      console.log('не мешаем', answersList)
      for (var i = 0; i < answersList.length; i++) {
        taskBody.append('<div class="answer" right="'+answersList[i].right+'">'+answersList[i].label+'<div class="check-item '+taskType+'"></div></div>');
      } 
    }

    // pre final-test page
    $('.prefinaltestpage_readyBtn').click(function() {
      var check = true,
          warnMsg = '',
          inputs = $('.prefinaltestpage').find('input');

      inputs.each(function(i,v) {
        
        if (v.value == '') {
          $('.prefinaltestpage_warn').text('Заполнены не все поля.')
          check = false;
          $(v).css({ 'box-shadow': '0 0 5px red' });
        }
      }).off('change').on('change', function() {
        $(this).removeAttr('style');
      })

      if (check) {
        cls.pdfvars.region = inputs.eq(0)[0].value;
        cls.pdfvars.surname = inputs.eq(1)[0].value;
        cls.pdfvars.name = inputs.eq(2)[0].value;
        cls.pdfvars.patronymiс = inputs.eq(3)[0].value;
        cls.pdfvars.age = inputs.eq(4)[0].value;

        $('.prefinaltestpage').css('display','none');
        $('#task-container').css('display','block');
      }
        
    })

    cls.makeTestTask(task, taskType);
    
  }

  cls.makeTestTask = function(task, type) {

    var ansBtn = $(task).find('.test_answBtn'),
        passBtn = $(task).find('.test_passBtn'),
        restartBtn = $(task).find('.test_restartBtn'),
        itemList = $(task).find('.answer');

    ansBtn.off('click').on('click', function() { checkAnswer(task, itemList) } ).addClass('disabled').attr('disabled', true);
    
    passBtn.off('click').on('click', function() {
      cls.questionList[cls.structure.pages[cls.bookmark].testId].questions[cls.currentQuest].status = 'passed';
      cls.currentQuest++;
      goToQuestion(task, -1);
    })

    restartBtn.off('click').on('click', function() {
      ctrl.makeMeTestQuestionList();
      ctrl.makeTask(window.document, ctrl.currentQuest, false);

      passBtn.removeClass('disabled').removeAttr('disabled');
    })

    itemList.off('click').on('click', selectItem);

    function selectItem() {

      if (type == 'radio') {

        itemList.removeClass('selected');
        $(this).addClass('selected');

      } else {

        if ($(this).hasClass('selected')) {
          $(this).removeClass('selected');
        } else {
          $(this).addClass('selected');
        }

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

  // вспомогательная функция теста, проверяет правильно ли дан ответ
  function checkAnswer(task, itemList) {

    itemList.addClass('disabled');

    var checker = true;
    var userAnswer = 0;
    var rightAnswer = 0;
    var qList = cls.questionList[cls.structure.pages[cls.bookmark].testId].questions
        qUAns = cls.questionList[cls.structure.pages[cls.bookmark].testId].givenAnswer

    qUAns[cls.currentQuest] = { answers: [] };

    itemList.each(function (i,v) {
      qUAns[cls.currentQuest].answers[i] = {};

      // подсчёт ответов на которые нужно было ответить
      if ($(v).attr('right') === 'true') {
        rightAnswer++;
      }
      qUAns[cls.currentQuest].answers[i].label = $(v).text()
      qUAns[cls.currentQuest].answers[i].right = $(v).attr('right')
      
      if($(v).hasClass('selected')) {

        // был ли выбран пользователем НЕправильный ответ
        if ($(v).attr('right') !== 'true') {
          checker = false;
        } else {
          // подсчёт правильных ответов пользователя
          userAnswer++;
        }

        qUAns[cls.currentQuest].answers[i].selected = 1;
      } else {
        
        qUAns[cls.currentQuest].answers[i].selected = 0;
      }
    })

    if (checker && userAnswer == rightAnswer) {
      qList[cls.currentQuest].score = 100;
      cls.testScore += 100;
    } else {
      qList[cls.currentQuest].score = 0;
    }

    qList[cls.currentQuest].status = 'answered';
    // 
    $(task).find('.test_questions_panel_question').eq(cls.currentQuest).attr('class', 'test_questions_panel_question answered');

    var result = 0,
        testStatus = 0,
        testMsg = '';

    // проверить все ли отвечены
    var allAnswered = true;
    for (var i = 0; i < qList.length; i++) {
      if(qList[i].status != 'answered') {
        allAnswered = false;
        firstPassed = i;
        break;
      }
    }

    if (allAnswered) {

      if(cls.testScore > 0) {
        result = Math.floor(cls.testScore/qList.length);
      }  

      testMsg = '<p class="test_popup_text__result"><span>Ваш результат: '+result+'%</span></p>';
        
      /*testStatus = result >= cls.successScore ? 1 : -1;  

      if (testStatus < 0) {
        testMsg+= '<p>Вам не удалось ответить на вопросы итогового тестирования в достаточном объеме.</p>'+
                  '<p>'+result+'%  - это недостаточный результат.</p>'+
                  '<p>Может быть, вы были невнимательны или что-то отвлекло вас.</p>'+
                  '<p>Для возврата к разделам курса воспользуйтесь кнопкой «МЕНЮ», повторите материалы и попробуйте пройти тестирование еще раз.</p>'
      } else {
        testMsg+= '<p>Поздравляем!</p>'+
                  '<p>Вы успешно прошли итоговое тестирование учебного курса.</p>'
      }*/
      
      // установка статуса для глав
      chapters[ cls.structure.pages[ cls.bookmark ].chapterIndex ].score = result;
      if (result < 50) {
        chapters[ cls.structure.pages[ cls.bookmark ].chapterIndex ].status = 0;

        testMsg+= '<p class="test_popup_text__msg1">Вам не удалось ответить на вопросы тестирования в достаточном объеме.'+
                  ' Может быть, вы были невнимательны или что-то отвлекло вас.</p>'+
                  '<p>Вернитесь к материалам лекции для повторения и попробуйте пройти тестирование еще раз.</p>'
      } else if (result >= 50 && result < 80) {
        chapters[ cls.structure.pages[ cls.bookmark ].chapterIndex ].status = 1;

        testMsg+= '<p class="test_popup_text__msg1__red">Вам не удалось ответить на вопросы тестирования в достаточном объеме.'+
                  ' Может быть, вы были невнимательны или что-то отвлекло вас.</p>'+
                  '<p>Вернитесь к материалам лекции для повторения и попробуйте пройти тестирование еще раз.</p>'
      } else if (result >= 80) {
        chapters[ cls.structure.pages[ cls.bookmark ].chapterIndex ].status = 2;
        if (cls.bookmark == cls.structure.pages.length-1) {
          testMsg+= '<p>Поздравляем! Вы успешно ответили на вопросы итогового теста.</p>'
        } else {
          testMsg+= '<p>Поздравляем! Вы успешно ответили на вопросы тестирования по лекции.</p>'
        }
      }

      if (cls.bookmark == cls.structure.pages.length-1) {
        headComment = 'Результаты итогового тестирования';
      } else {
        headComment = 'Результаты тестирования по лекции';
      }

      $('.test_answBtn').addClass('disabled').attr('disabled', true);
      $('.test_passBtn').addClass('disabled').attr('disabled', true);

      cls.sendResult(testStatus, result, testMsg, 0, headComment);

      showGivenAnswers(cls.currentQuest)

    } else {
      // не все отвечены
      cls.currentQuest++;
      goToQuestion(task, -1);
    }

  };

  /**
  *   точно знаем, что есть неотвеченные вопросы, проверка в checkAnswer
  */
  function goToQuestion(task, quest) {

    var qList = cls.questionList[cls.structure.pages[cls.bookmark].testId].questions;

    // если был переход из панели вопросов
    if (quest > -1) {

      cls.currentQuest = quest;
      cls.makeTask(task, cls.currentQuest, false);
      return;
    }

    // если вопросы закончились
    if (cls.currentQuest >= qList.length) {

      // поиск первого неотвеченного
      for (var i = 0; i < qList.length; i++) {
        if(qList[i].status != 'answered') {
          cls.currentQuest = i;
          cls.makeTask(task, cls.currentQuest, false);
          return;
        }
      }

    } else {
      // пропускаем, если уже отвечен
      if (qList[cls.currentQuest].status == 'answered') {
        cls.currentQuest++;
        goToQuestion(task, -1);
      } else {
        cls.makeTask(task, cls.currentQuest, false);
      }
    }

  };

  /**
  *   показывает, где какие пользователь дал ответы
  */
  function showGivenAnswers(qNum) {
    // console.info('showGivenAnswers for quest', qNum)
    // console.info(cls.questionList[cls.structure.pages[cls.bookmark].testId].givenAnswer[qNum])
    // ...
    cls.makeTask(window.document, qNum, true);

    var qAnswers = $('.answer');
    var givenAnswer = cls.questionList[cls.structure.pages[cls.bookmark].testId].givenAnswer[qNum].answers;

    qAnswers.off();
    // показываем ответы пользователя
    for (var i = 0; i < givenAnswer.length; i++) {
      if (givenAnswer[i].selected) {
        qAnswers.eq(i).addClass('selected');
      }
      
    }

    // назначаем кнопкам панели вопросов функцию перехода к ответам с ответами пользователя
    $('.test_questions_panel_question').off().on('click', function() {
      var order = Number($(this).attr('order'));
      // console.log('go to test q #',order)

      showGivenAnswers(order)
    }).removeClass('answered')

  }

  /*cls.printCert = function(){
    var newWin = window.open('pages/cert/index.html', 'printPage', 'width=1024, height=768');
  }*/

  cls.makePDF = function() {
    var qrImg = document.querySelector('#qrHolder img').src;
    // console.log(qrImg)
    var now = new Date(),
        hours = String(now.getHours()),
        minutes = String(now.getMinutes()),
        seconds = String(now.getSeconds()),
        day = String(now.getDate()),
        month = String(now.getMonth()+1),
        year = now.getFullYear(),
        finalTestStatus = "ТЕСТ НЕ ПРОЙДЕН";


    if (hours.length < 2) { hours = '0'+hours }
    if (minutes.length < 2) { minutes = '0'+minutes }
    if (seconds.length < 2) { seconds = '0'+seconds }
    if (day.length < 2) { day = '0'+day }
    if (month.length < 2) { month = '0'+month }

    if (suspend.pages[cls.bookmark].score > 80) {
      finalTestStatus = "ТЕСТ ПРОЙДЕН";
    }

    var ndDocument = {
      content: [
        {
          text: 'Федеральная служба государственной статистики',
          fontSize: 10,
          margin: [0, 0, 0, 20],
          alignment: 'center'
        },
        {
          text:['Выборочное наблюдение доходов населения и участия в'],
          alignment: 'center'
        },
        {
            text: ['социальных программах в 2017 году'],
            alignment: 'center'
        },
        {
          text:[
            'ОТЧЁТ О РЕЗУЛЬТАТАХ ТЕСТИРОВАНИЯ'
          ],
          fontSize: 20,
          width: 400,
          margin: [0, 70],
          alignment: 'center'
        },
        {
            columns:[
                [
                    'Наименование субъекта', 
                    'Российской Федерации:',
                    {
                        text: cls.pdfvars.region,
                        margin: [0, 10]
                    },
                    'Дата прохождения теста:',
                    {
                        text: day+'.'+month+'.'+year,
                        margin: [0,0,0,30]
                    },
                    'Фамилия:',
                    {
                        text: cls.pdfvars.surname,
                        bold: 1,
                        margin: [0,0,0,5]
                    },
                    'Имя:',
                    {
                        text: cls.pdfvars.name,
                        bold: 1,
                        margin: [0,0,0,5]
                    },
                    'Отчество:',
                    {
                        text: cls.pdfvars.patronymiс,
                        bold: 1,
                        margin: [0,0,0,5]
                    },
                    'Возраст:',
                    {
                        text: cls.pdfvars.age,
                        bold: 1,
                        margin: [0,0,0,5]
                    }
                ],
                {
                    width:200,
                    image: qrImg
                }
            ]
            
        },
        {
            text:'Правильных ответов на вопросы итогового теста: '+suspend.pages[cls.bookmark].score+' из 100',
            margin: [0,20,0,30]
        },
        {
            text:'Результат:'
        },
        {
            text: finalTestStatus,
            alignment: 'center',
            fontSize: 20,
            bold: 1,
            margin: [0,20,0,0]
        },
        
    ],
    footer:
        {
            text:'Дата и время формирования отчёта: '+day+'.'+month+'.'+year+' '+hours+':'+minutes,
            fontSize: 8,
            alignment: 'center'
        }
    }
    pdfMake.createPdf(ndDocument).download('coursePDF.pdf');
  }
  cls.makeQR = function(QRdata) {
    var typeNumber = 4;
    var errorCorrectionLevel = 'L';

    QRdata = cls.pdfvars.region+'\n'+cls.pdfvars.surname+'\n'+cls.pdfvars.name+'\n'+cls.pdfvars.patronymiс+'\n'+'Балл за тест: '+suspend.pages[cls.bookmark].score;
    var qr = new QRCode(document.getElementById('qrHolder'), {
      text: String(QRdata),
      height: 300,
      width: 300,
      colordark: '#000000',
      colorLight: '#ffffff',
      correctLevel : QRCode.CorrectLevel.H
    })
  }

  cls.startCourse = function() {
    // document.getElementById('intro').style.display = 'none';
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
      document.getElementById('hello').innerHTML = '';//'No LMS detected.'
    }
    // сейчас грузит структуру независимо найдено апи или нет
    loadStructure();
  }

    // triggers
    var assetOpened = false,
        menuOpened = false,
        statsOpened = false,
        feedOpened = false,
        helpOpened = false,
        audioProgressChange = true; // без флажка прогресс звука отображается не корректно, если прошлая страница содержала звук, а текущая нет
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
        nextChapBtn = $('.nextChapBtn'),
        prevChapBtn = $('.prevChapBtn'),
        againBtn = $('.againBtn'),              // feedback
        continueBtn = $('.continueBtn'),        // feedback
        printCertBtn = $('.printCertBtn'),      // feedback
        pagePreloader = $('#page-preloader'),
        preloadWheel = $('.preload-wheel'),
        soundBtn = $('.audioCtrl_soundBtn'),
        soundBtn25 = $('.audioCtrl_soundBtn25'),
        soundBtn50 = $('.audioCtrl_soundBtn50'),
        soundBtn75 = $('.audioCtrl_soundBtn75'),
        soundBtn100 = $('.audioCtrl_soundBtn100'),
        soundBg = $('.audioCtrl_bg'),
        audioProgress = $('.audioCtrl_progress');
    // options
    var frameName = 'myframe',
        disabledBtnMsg = '';
        
    // 
    var testData,
        localStorage_data,
        suspend = '',
        suspend_main = '',
        suspend_intro = '',
        courseScore = 0,
        less_status = 'incomplete',
        preload,
        pagesCount = 0,
        chapters = [],
        chapters_intro = [],
        chapters_main = [],
        lastAudioLvl = 75,
        lastAudioAttr = 'vol_75';


    // start here
    if (window.addEventListener) {
        window.addEventListener('load', onLoadCourse, false);
      } else if (window.attachEvent) {
        window.attachEvent('onload', onLoadCourse);
      } else {
        window.onload = onLoadCourse;
      }
    function onLoadCourse() {
      document.getElementById('main-preloader').style.display = 'none';
      // document.getElementById('intro').style.display = 'block'; // флеш заставка содержит кнопку "начать курс"
      cls.startCourse();
    } 

    function loadStructure() {
      // предполагается использование курса без СДО, поэтому закоменчено
      /* console.log('loadStructure')
      $.getJSON('js/courseStructure.json', function(data) {
        // console.log(data)
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
      })*/

      cls.structure = courseStructure;
      // cls.structure_intro = courseStructure_intro;
      testData = testStructure;

      try {
        if (localStorage.rosstat_data != undefined) {
          localStorage_data = JSON.parse(localStorage.rosstat_data);
          console.info('load from local', localStorage_data)
        }
      } catch(e) {}
        

      init();
      init_intro();
      
    }

    function init() {
      
      // подсчёт страниц и глав в курсе
      var chapterIndex = 0;
      var counter = 0; // для подсчёта кол-ва страниц в главе

      disabledBtnMsg = cls.structure.disabledBtnMsg;

      cls.strongNavigation = cls.structure.strongNavigation;
      cls.successScore = cls.structure.successScore;
      cls.volume = cls.structure.volumeLvl;

      

      if (localStorage_data != undefined) {

        chapters_main = localStorage_data.suspend_main.chapters;
        suspend_main = localStorage_data.suspend_main;
        cls.bookmark_main = localStorage_data.suspend_main.bookmark;

        chapters_intro = localStorage_data.suspend_intro.chapters;
        suspend_intro = localStorage_data.suspend_intro;
        cls.bookmark_intro = localStorage_data.suspend_intro.bookmark;

        cls.learner = localStorage_data.suspend_main.learner;
        cls.age = localStorage_data.suspend_main.age;

      } else {

        suspend_intro = buildSuspend(courseStructure_intro.pages);
        suspend = suspend_main =  buildSuspend(cls.structure.pages);

        // формирование массива глав
        chapters_main.push(
          {
            title: cls.structure.chapters[0], 
            startPage: 0,
            status: -1,
            score: -1
          }
        );
        
        for (var i = 0; i < cls.structure.pages.length; i++) {

          if (cls.structure.pages[i].chapterIndex == chapterIndex) {
            counter++;
          }
          

          if (cls.structure.pages[i].chapterIndex > chapterIndex) {

            var obj = {
              title: cls.structure.chapters[cls.structure.pages[i].chapterIndex],
              startPage: i,   // индекс страницы с которой начинается глава
              status: -1,
              score: -1
            }

            chapters_main[chapterIndex].pagesTotal = counter;
            counter = 1;
            chapters_main.push(obj);

            chapterIndex++;
          }

          if (i == cls.structure.pages.length-1) {
            if (counter == 0) {counter++;}
            chapters_main[chapterIndex].pagesTotal = counter;
          }
          
          cls.structure.pages[i].orderInChapter = counter;
          suspend_main.pages[i].orderInChapter = counter;
        }
      }
 
      console.warn('chapters_main',chapters_main)
      pagesCount = cls.structure.pages.length;

      // полоса прогресса
      progressBar.slider({
        range: 'min',
        min: 0,
        max: pagesCount,
        animate: "slow"
      }).slider( "disable" );

      // конроль звука
      soundBtn.on('click', function() {
        if ($(this).hasClass('disabled')) { return; }

        if ($(this).hasClass('off')) {
          cls.coursePage.soundCtrl('volume', lastAudioLvl);
          soundBg.attr('vol', lastAudioAttr);
          $('.audioCtrl_soundBtn25, .audioCtrl_soundBtn50, .audioCtrl_soundBtn75, .audioCtrl_soundBtn100').removeClass('disabled')
          $(this).removeClass('off')
        } else {
          cls.coursePage.soundCtrl('volume', 0);
          soundBg.attr('vol', 'vol_0');

          $('.audioCtrl_soundBtn25, .audioCtrl_soundBtn50, .audioCtrl_soundBtn75, .audioCtrl_soundBtn100').addClass('disabled')
          $(this).addClass('off')
        }
        
      })

      soundBtn25.on('click', function() {
        if ($(this).hasClass('disabled')) {return;}
        cls.coursePage.soundCtrl('volume', 25);
        lastAudioLvl = 25;
        lastAudioAttr ='vol_25'

        soundBg.attr('vol', 'vol_25');
      })
      soundBtn50.on('click', function() {
        if ($(this).hasClass('disabled')) {return;}
        cls.coursePage.soundCtrl('volume', 50);
        lastAudioLvl = 50;
        lastAudioAttr ='vol_50'

        soundBg.attr('vol', 'vol_50');
      })
      soundBtn75.on('click', function() {
        if ($(this).hasClass('disabled')) {return;}
        cls.coursePage.soundCtrl('volume', 75);
        lastAudioLvl = 75;
        lastAudioAttr ='vol_75'

        soundBg.attr('vol', 'vol_75');
      })
      soundBtn100.on('click', function() {
        if ($(this).hasClass('disabled')) {return;}
        cls.coursePage.soundCtrl('volume', 100);
        lastAudioLvl = 100;
        lastAudioAttr ='vol_100'

        soundBg.attr('vol', 'vol_100');
      })

      $('.audioCtrl_play').on('click', function() {
        if ($(this).hasClass('pause')) {
          $(this).removeClass('pause');
          cls.coursePage.soundCtrl('play');
        } else {
          $(this).addClass('pause');
          cls.coursePage.soundCtrl('pause');
        }
        
      })

      audioProgress.slider({
        range: 'min',
        min: 0,
        max: 100,
        start: function( event, ui ) {
          cls.coursePage.soundCtrl('pause');
        },
        stop: function( event, ui ) {
          if (!$('.audioCtrl_play').hasClass('pause')) {
            cls.coursePage.soundCtrl('play');
          }
        },
        slide: function( event, ui ) {
          cls.coursePage.soundCtrl('seek', ui.value);
        },
        change: function(event, ui ) {
          // console.info('change au prog')
        }
      })//.slider( "disable" );

      dark.animate({opacity:0},0); // <= bug fix

      // tooltip
      $('#container').tooltip({
        items:'[jqtitle]',
        content: function() {
          return $(this).attr('jqtitle');
        }
      })

      // set main course name
      $('#course-title').find('p').text(cls.structure.courseTitle)


      // mainPage comp
      // 
      // set main screen btns
      // 

      var $mainPage_body_item = $('.mainPage_body_item');

      $mainPage_body_item.eq(0).on('click', function(){
        // Введение
        pagesCount = courseStructure_intro.pages.length;
        cls.bookmark = cls.bookmark_intro;
        suspend = suspend_intro;
        cls.structure = courseStructure_intro;
        chapters = chapters_intro;
        buildList(cls.structure.pages);

        $('#container').attr('data-style', 'intro');

        goToPage(cls.bookmark);
        $('.mainPage').css({'display':'none'});
      })

      $mainPage_body_item.eq(1).on('click', function(){
        // Курс
        pagesCount = courseStructure.pages.length;
        cls.bookmark = cls.bookmark_main;
        suspend = suspend_main;
        cls.structure = courseStructure;
        chapters = chapters_main;
        buildList(cls.structure.pages);

        $('#container').attr('data-style', 'course');

        goToPage(cls.bookmark);
        $('.mainPage').css({'display':'none'});
      })
      $mainPage_body_item.eq(2).on('click', function(){
        // видео
        $('#container').attr('data-style', 'video');

        initVideoPage();

        $('.mainPage').css({'display':'none'});
      })
      $mainPage_body_item.eq(3).on('click', function(){
        // примеры заполнения
        $('#container').attr('data-style', 'examples');

        initExamplePage();
        $('.mainPage').css({'display':'none'});
      })
      $mainPage_body_item.eq(4).on('click', function(){
        // практические упражнения
        $('#container').attr('data-style', 'exercises');

        goToPageByURL('page_exercises');
        $('.mainPage').css({'display':'none'});

      })
      $mainPage_body_item.eq(6).on('click', function(){
        // итоговый тест
        // goToPage(cls.bookmark);
        $('.mainPage').css({'display':'none'});
        pagePreloader.css({'display':'none'});

        pagesCount = courseStructure.pages.length;
        cls.bookmark = cls.bookmark_main;
        suspend = suspend_main;
        cls.structure = courseStructure;
        chapters = chapters_main;
        buildList(cls.structure.pages);

        $('#container').attr('data-style', 'final');

        goToPage(cls.structure.pages.length-1)
      })

      $mainPage_body_item.eq(5).on('click', function(){
        // тексты лекций
        $('#container').attr('data-style', 'lections');

        // initLectionsPage();
        initAddMaterials();
        $('.mainPage').css({'display':'none'});
      })
      /*$mainPage_body_item.eq(7).on('click', function(){
        // материалы для очного обучения
        $('#container').attr('data-style', 'materials');

        initMaterials();
        $('.mainPage').css({'display':'none'});     
      })
      $mainPage_body_item.eq(8).on('click', function(){
        // справочные материалы
        $('#container').attr('data-style', 'add-materials');

        initAddMaterials();
        $('.mainPage').css({'display':'none'});
      })*/


      //
      // set btns
      //

      nextBtn.on('click', function(){
        goToPage(cls.bookmark+1)
      })
      prevBtn.on('click', function(){
        goToPage(cls.bookmark-1)
      })

      nextChapBtn.on('click', function() {

        if (cls.structure.pages[cls.bookmark].chapterIndex == chapters.length-1) { return; }

        goToPage(chapters[cls.structure.pages[cls.bookmark].chapterIndex+1].startPage);
  
      })
      prevChapBtn.on('click', function() {

        if (cls.structure.pages[cls.bookmark].chapterIndex == 0) { return; }

        goToPage(chapters[cls.structure.pages[cls.bookmark].chapterIndex-1].startPage);
      })

      $('.menuBtn').on('click', function() {
        if (assetOpened) { return; }
        assetOpened = true;
        menuOpened = true;

        courseMenu.css('display', 'block');
        updateList('menu');

      })
      $('.statsBtn').on('click', function() {
        if (assetOpened) { return; }
        assetOpened = true;
        statsOpened = true;

        updateList('stats');

        courseStats.fadeToggle(400)
      })
      $('.helpBtn').on('click', function() {
        openHelp();
      })

      // homeBtn
      $('.homeBtn').on('click', function() {
        if (assetOpened) { closeAsset(); };

        var confirmQ = true;

        if ($('#container').attr('data-style') == 'exercises') {
          confirmQ = confirm('Вы действительно хотите закрыть упражнение?')
        }

        if (confirmQ) {
          if (ctrl.coursePage) { ctrl.coursePage.stop(); };

          $('#container').attr('data-style','home');
          $('.mainPage').css({'display':'block'});
          pageCont.innerHTML = '';
        }
        
      })

      $('.menuBtn, .statsBtn, .helpBtn').on('click', function() {

        dark.css('display', 'block')
          .animate({
            opacity: 0.9
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
      continueBtn.on('click', function() {
        goToPage(cls.bookmark+1);
      })
      printCertBtn.on('click', function() {
        cls.makeQR();
        setTimeout(cls.makePDF, 400);
      })
      $('.exitBtn').on('click', function() {

        var confirmQ = confirm('Завершить работу с курсом?')

        if (confirmQ) {
          sendData();
          $('#container').empty().append('<div id="end"></div>');
          setTimeout( function() { window.close() }, 2000)
        }
 
      })
      createInteractions(cls.structure.pages);

      // buildList(cls.structure.pages);
      // goToPage(cls.bookmark);
    }

    function init_intro() {
      if (localStorage_data == undefined) {
        // подсчёт страниц и глав в курсе
        var chapterIndex = 0;
        var counter = 0; // для подсчёта кол-ва страниц в главе

        // формирование массива глав
        chapters_intro.push(
          {
            title: courseStructure_intro.chapters[0], 
            startPage: 0,
            status: -1,
            score: -1
          }
        );
        
        for (var i = 0; i < courseStructure_intro.pages.length; i++) {

          if (courseStructure_intro.pages[i].chapterIndex == chapterIndex) {
            counter++;
          }
          

          if (courseStructure_intro.pages[i].chapterIndex > chapterIndex) {

            var obj = {
              title: courseStructure_intro.chapters_intro[courseStructure_intro.pages[i].chapterIndex],
              startPage: i,   // индекс страницы с которой начинается глава
              status: -1,
              score: -1
            }

            chapters_intro[chapterIndex].pagesTotal = counter;
            counter = 1;
            chapters_intro.push(obj);

            chapterIndex++;
          }

          if (i == courseStructure_intro.pages.length-1) {
            if (counter == 0) {counter++;}
            chapters_intro[chapterIndex].pagesTotal = counter;
          }

          courseStructure_intro.pages[i].orderInChapter = counter;
          suspend_intro.pages[i].orderInChapter = counter;

        }
      }
        console.warn('chapters_intro',chapters_intro)
        pagesCount = courseStructure_intro.pages.length;

      // buildSuspend(courseStructure_intro.pages);

      // createInteractions(courseStructure_intro.pages);

      // buildList(courseStructure_intro.pages);
      // goToPage(cls.bookmark);
    }

    /**
    * Ф-ия создаёт объект, который будет храниться в СДО как suspend_data
    */
    function buildSuspend(list) {
      // if (suspend || suspend.length > 0) { return; }
      var tmp_suspend = {};
      tmp_suspend.pages = [];
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
        tmp_suspend.pages.push(obj)
      }
      // console.log(suspend)
      return tmp_suspend;
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
      var tmpStrStats = '<ul id="stats-list">';
      var tmpStrMenu = '<ul class="menu-list">',
          chapterIndex = 0,
          tmpClass = '';

      // tmpStrMenu += '<li class="menu-list_section" order="0">'
      //                 +'<div class="menu-list_section_title">'
      //                   +'<div class="menu-list_section_plus">+</div>'
      //                   +Number(cls.structure.pages[0].chapterIndex+1)+'. '+chapters[0].title
      //                   +'<div class="menu-list_section_status"></div>'
      //                 +'</div><ul class="menu-list_pages">';

      for (var i = 0; i < suspend.pages.length; i++) {
        //todo:
        if (cls.structure.pages[i].chapterIndex == chapterIndex) {
          tmpClass = 'current';
        } else {
          tmpClass = '';
        }

        if (cls.structure.pages[i].chapterIndex > chapterIndex || i == 0) {

          if (i != 0) { 
            chapterIndex++;
            tmpStrMenu += '</ul>';
          }
      
          tmpStrMenu += '</li>'
                          +'<li class="menu-list_section '+tmpClass+'" order="'+chapterIndex+'">'
                            +'<div class="menu-list_section_title">'
                              +'<div class="menu-list_section_plus">+</div>'
                              // +Number(cls.structure.pages[i].chapterIndex+1)+'. '+chapters[chapterIndex].title
                              +chapters[chapterIndex].title
                              +'<div class="menu-list_section_status"></div>'
                          +'</div><ul class="menu-list_pages">';  
        }

        tmpStrMenu += '<li order="'+suspend.pages[i].order+'" type ="'+suspend.pages[i].type+'" class="';
        if (i == cls.bookmark) {
          tmpStrMenu += 'current '
        }

        tmpStrMenu += ' menu-list_page"><div class="menu-item-status"></div><div class="menu-item-num">'+suspend.pages[i].orderInChapter+'.</div><p>'+list[i].title+'</p></li>';
    
        if (suspend.pages[i].type == 'e') {
          tmpStrStats += '<li order="'+suspend.pages[i].order+'" type ="'+suspend.pages[i].type+'"><div class="stats-item-status"></div><p>'+list[i].title+'</p></li>';
        }
      }

      tmpStrMenu += '</ul></li></ul>';
      tmpStrStats += '</ul>';

      $('#menu-body').html('').append(tmpStrMenu);
      $('#stats-exs').html('').append(tmpStrStats);

      $('.menu-list_section').each(function(i,v) {
        if (!$(v).hasClass('current')) {
          $(v).find('.menu-list_pages').slideToggle(0);
        } else {
          $(v).find('.menu-list_section_plus').addClass('minus').html('—');
        }
      })
      // add listeners
      $('.menu-list_section').on('click', function() {

        var clicked = $(this);
        if (clicked.hasClass('current')) {
          return;
        }

        $('.menu-list_section').each(function(i,v) {
          
          if ($(v).hasClass('current')) {
            $(v).removeClass('current').find('.menu-list_pages').slideToggle(400, function() {
              clicked.addClass('current').find('.menu-list_pages').slideToggle(400);
              clicked.find('.menu-list_section_plus').addClass('minus').html('—');
            })

            $(v).find('.menu-list_section_plus').removeClass('minus').html('+');

            return false;
          }
        });

      })

      $('.menu-list_page, #stats-list li').on('click', function(e){
        goToPage($(this).attr('order'));
      })


      /*$('#stats-progress, #tests-progress').progressbar({
        max: 100
      })*/
    }

    /**
    *   Обновление статусов страниц списка меню и окна статы
    */
    function updateList(target) {

      switch(target) {
        case 'menu':
          var targetList = $('.menu-list_page');

          targetList.removeClass('current');
          var targetItemStatus = '.menu-item-status';

          // $('.menu-list_section').removeClass('current').eq(cls.structure.pages[cls.bookmark].chapterIndex).addClass('current');

          $('.menu-list_section').each(function(i,v) {
            
              $(v).removeClass('current').find('.menu-list_section_plus').removeClass('minus').html('+');

          })

          $('.menu-list_section')
            .eq(cls.structure.pages[cls.bookmark].chapterIndex)
            .addClass('current')
            .find('.menu-list_section_plus')
            .addClass('minus')
            .html('—');


          $('.menu-list_section_status').each(function(i,v) {

            $(v).removeClass('clean yellow green red');
            
            switch(chapters[i].status) {
              case -1: 
                  $(v).addClass('clean').attr('jqtitle', 'Тестирование не проходилось')
                break;
              case 0: 
                  $(v).addClass('red').attr('jqtitle', 'Тест не пройден')
                break;
              case 1: 
                  $(v).addClass('yellow').attr('jqtitle', 'Тест пройден')           // >= 50 < 80
                break;
              case 2: 
                  $(v).addClass('green').attr('jqtitle', 'Тест пройден отлично')    // >= 80
                break;
            }
          })

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

          testsProgress.progressbar('value', cProgress.tests.res);
          testsProgress.find('.progress-label')[0].innerHTML = Math.floor(cProgress.tests.res)+'%';
          break;
      }
      
      $('.menu-list_pages').css({'display':'none'});

      var tmpTarget;
      var tmpCurr;
      for (var i = 0; i < targetList.length; i++) {
        tmpTarget = $(targetList[i]);

        if (i == cls.bookmark) {
          tmpTarget.addClass('current').parent().css({'display':'block'});
          tmpCurr = tmpTarget;
        }

        if ((tmpTarget.attr('type') == 's' || tmpTarget.attr('type') == 'c') && suspend.pages[Number(tmpTarget.attr('order'))].status == 1) {
          tmpTarget.find(targetItemStatus).addClass('visited');
        }

        if (tmpTarget.attr('type') == 'e' || tmpTarget.attr('type') == 't') {
          if (suspend.pages[Number(tmpTarget.attr('order'))].status == 1) {
            tmpTarget.find(targetItemStatus).addClass('complited');
          } else if(suspend.pages[Number(tmpTarget.attr('order'))].status == -1) {
            tmpTarget.find(targetItemStatus).addClass('failed');
          }
        }

      }
      $('#menu-body').scrollTop($(tmpCurr).offset().top-150)
      
    }

    /**
    *   Считает % выполненых заданий и тестов,
    *   возвращает объект вида:
    *   {exs: { num: numExs,              всего заданий
    *           res: resExs,              результат в % за все задания
    *           done: complitedExs        всего выполнено
    *         }, 
    *   tests: {num: numTests,            всего тестов
    *           res: resTests,            средний результат в % за все тесты
    *           done: complitedTests,     всего выполнено
    *           finTestScore: finTestScore }}   баллы за финальный тест
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
          finTestScore = 0;

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

        // расчёт по всем тестам
        if (suspend.pages[i].type == 't') {
           if (suspend.pages[i].score > 0) {
            summTests += suspend.pages[i].score;
          }
          if (suspend.pages[i].status == 1 ) {
            complitedTests++;
          }
          // баллы за финальный тест
          if (suspend.pages[i].testId == cls.questionList.length-1) {
            finTestScore = suspend.pages[i].score;
          }
          
          numTests++;
        }

      }

      if (numExs > 0 ) {resExs = summExs/numExs;}
      
      if (numTests > 0 ){resTests = summTests/numTests;}

      return {exs: {
                num: numExs,
                res: resExs, 
                done: complitedExs
              }, 
              tests: {
                num: numTests, 
                res: resTests, 
                done: complitedTests, 
                finTestScore: finTestScore 
              }
            };

    }

    function closeMenu() {
      courseMenu.css('display', 'none');

      menuOpened = false;
    }

    function closeStats() {

      courseStats.fadeToggle(400);
      statsOpened = false;

    }

    function closeFeedBack() {

      $('.againBtn, .continueBtn, .printCertBtn').removeAttr('style');
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

    /**
    *  вывод сообщения (msg) пользователю
    *  
    */
    function openFeedBack(status,score,msg,lastTry,headComment) {
      if (assetOpened) { closeAsset(); }
      feedOpened = true;
      assetOpened = true;
      
      // againBtn.css('display','block');
      // continueBtn.css('display','block');
      // printCertBtn.css('display','none');

      /*if (status > 0) {
        againBtn.css('display','none');
        continueBtn.css('display','inline-block');
        // $('#feedback-head p').css({'color':'#2B7C00'})
      } else {
        againBtn.css('display','inline-block');
        continueBtn.css('display','none');
        // $('#feedback-head p').css({'color':'#7C002F'})
      }*/
      if (lastTry) {
        againBtn.css('display','none');
        continueBtn.css('display','none');
      }

      // если финальный тест
      if (cls.bookmark == cls.structure.pages.length-1) {
        printCertBtn.css('display','inline-block');
      }

      $('.feedback_headComment').text(headComment);

      courseFeed.stop().fadeToggle(400).find('#feedback-body').html(msg);

        dark.css('display', 'block')
          .animate({
            opacity: 0.9
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
            opacity: 0.9
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

    /**
    *  
    */
    function goToPage(page) {
      var page = Number(page);

      // проверка на страницу меньше первой и больше последней
      if (page < 0 || page > pagesCount-1) { return; }
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


      // состояние кнопок перехода по страницам
      if (page == chapters[cls.structure.pages[page].chapterIndex].startPage) { 
        // если страница первая в главе

        nextBtn.removeClass('disabled');
        prevBtn.addClass('disabled');
      } else if(cls.structure.pages[page].chapterIndex == chapters.length-1 && page == cls.structure.pages.length-1) {
        // если глава последняя и последняя страница

        nextBtn.addClass('disabled');
        prevBtn.removeClass('disabled');
      } else if(cls.structure.pages[page].chapterIndex != chapters.length-1) {
        // если глава не последняя
        
        nextBtn.removeClass('disabled');
        prevBtn.removeClass('disabled');
        if (cls.structure.pages[page].chapterIndex != cls.structure.pages[page+1].chapterIndex) {
          // если следующая страница находится в новой главе

          nextBtn.addClass('disabled');
          prevBtn.removeClass('disabled');
        }
      }
      if ( chapters[cls.structure.pages[page].chapterIndex].pagesTotal == 1 ) {
        // если глава состоит из 1 страницы
        nextBtn.addClass('disabled');
        prevBtn.addClass('disabled');
      }
      
      // состояние кнопок перехода по главам
      if (cls.structure.pages[page].chapterIndex == 0) {
        // если глава первая

        nextChapBtn.removeClass('disabled');
        prevChapBtn.addClass('disabled');
      } else if (cls.structure.pages[page].chapterIndex == chapters.length-1) {
        // если глава последняя

        nextChapBtn.addClass('disabled');
        prevChapBtn.removeClass('disabled');
      } else {
        nextChapBtn.removeClass('disabled');
        prevChapBtn.removeClass('disabled');
      }
      
      if (assetOpened) { closeAsset(); }

      // показ номера страницы из всех
      // paginator.text(String(page+1) +'/'+ String(cls.structure.pages.length));
      // показ номера страницы в главе
      paginator.text(String(suspend.pages[page].orderInChapter) +'/'+ String(chapters[cls.structure.pages[page].chapterIndex].pagesTotal));

      // стоп анимации на странице и удаление слушателей
      // подразумевается, что на странице санимацией есть метод, который экстренно её завершает
      if (ctrl.coursePage) { ctrl.coursePage.stop(); };

      // удаление прошлой страницы из DOM
      var delPage =  document.getElementById(frameName);
      if (delPage) {
        pageCont.removeChild(delPage);
      }
      pageCont.innerHTML = '';
      
      if ($('#container').attr('data-style') == 'intro') {
        cls.bookmark_intro = cls.bookmark = page;
      } else {
        cls.bookmark_main = cls.bookmark = page;
      }
      
      $(pageTitle).find('p').text(cls.structure.pages[page].title);

      // отключение звуковой кнопки, страница её сама включает
      soundBtn.addClass('disabled');
      $('.audioCtrl_soundBtn, .audioCtrl_soundBtn25, .audioCtrl_soundBtn50, .audioCtrl_soundBtn75, .audioCtrl_soundBtn100, .audioCtrl_play, .audioCtrl_bg').addClass('disabled');
      $('.audioCtrl_play').removeClass('pause');
      
      audioProgress.slider('value', 0)
      audioProgressChange = false;
      audioProgress.addClass( 'disabled' );

      // стоп анимации моргания nextBtn
      // nextBtn.removeClass('animating');

      updateProgressBar();

      // показываем загрузку
      pagePreloader.css('display','block');

      // добавляем страницу
      if (suspend.pages[page].type == 't') {
        initTestPage();
      } else {
        if (cls.structure.pages[page].video) {
          initVideoPage(cls.structure.pages[page].video_width, cls.structure.pages[page].video_height, cls.structure.pages[page].video, cls.structure.pages[page].video_poster);
        } else {
          initSimplePage();
        }
        
      }

      sendData();
      
    }

    //===--
    /**
    *   Переход к специальным страницам
    */
    function goToPageByURL(url) {
      // удаление прошлой страницы из DOM
      var delPage =  document.getElementById(frameName);
      if (delPage) {
        pageCont.removeChild(delPage);
      }
      pageCont.innerHTML = '';

      // отключение звуковой кнопки, страница её сама включает
      soundBtn.addClass('disabled');
      $('.audioCtrl_slider').slider('disable');

      // updateProgressBar();

      // показываем загрузку
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

      }
        
      iframe.src = 'pages/' + url + '/index.html';
      iframe.name = frameName;
      iframe.width = iframe.height = '100%';
      iframe.frameBorder = "0";
      pageCont.appendChild(iframe);
    }
    //===--

    function initTestPage() {
      pagePreloader.css('display','none');
      pageCont.innerHTML = ctrl.templates.test;
      ctrl.makeMeTestQuestionList();
      ctrl.makeTask(window.document, ctrl.currentQuest, false);

      $('.testTitle').html(cls.structure.pages[cls.bookmark].title);

      if (cls.bookmark == cls.structure.pages.length-1) {
        $('.prefinaltestpage').css('display','block')
        $('#task-container').css('display','none')
      } else {
        $('#task-container').css('display','block')
      }

      ctrl.coursePage = {
        stop: function(){
          // destroy();
          ctrl.coursePage = null;
        },
        restart: function(){
          ctrl.makeMeTestQuestionList();
          ctrl.makeTask(window.document, ctrl.currentQuest, false);
        }
      }
    }

    // 
    function initSimplePage() {
      var SPTimeout;
      pageCont.innerHTML = ctrl.templates.page;

      pageCont.querySelector('.container').innerHTML = '<img class="simplePage_img" src="pages/'+
                                                          ctrl.structure.pages[ctrl.bookmark].image+
                                                          '"><audio class="simplePage_audio" src="pages/'+
                                                          ctrl.structure.pages[ctrl.bookmark].sound+
                                                          '"></audio>';
    
      var audio = document.querySelector('.simplePage_audio');
      audioProgressChange = true;
      audioProgress.slider('value', 0)

      audio.addEventListener('ended', function() {
        // nextBtn.addClass('animating');
        goToPage(cls.bookmark+1);
      })
      audio.addEventListener('timeupdate', function() {
        // console.log(audio.currentTime/audio.duration*100)
        if (audioProgressChange) {
          audioProgress.slider( "value", audio.currentTime/audio.duration*100 );
        }
        audio.addEventListener('error', function() {
          alert('er!')
          alert(audio.error.code)
        })
        audio.addEventListener('stalled', function() {
          alert('stalled')
        })
        audio.addEventListener('waiting', function() {
          alert('waiting')
        })
        
      })

      function pagePlay() {
        $('.audioCtrl_slider').slider('value', ctrl.volume*100).slider('enable');
        $('.audioCtrl_soundBtn, .audioCtrl_soundBtn25, .audioCtrl_soundBtn50, .audioCtrl_soundBtn75, .audioCtrl_soundBtn100, .audioCtrl_play, .audioCtrl_bg').removeClass('disabled');
        audioProgress.removeClass('disabled');
        audio.volume = ctrl.volume;
        audio.load();

        SPTimeout = window.setTimeout(function(){
          audio.play(); 
        }, 1000);
        // audio.play();
      }

      pagePlay();

      ctrl.coursePage = {
        play: function() {
          pagePlay();
        },
        stop: function() {
          ctrl.coursePage = null;
          audio = null;
          window.clearTimeout();
        },
        restart: function(){
          // btnRestartHandler()
        },
        soundCtrl: function(command, val) {
          switch(command) {
            case 'play':
              audio.play();
              break;
            case 'pause':
              audio.pause();
              break;
            case 'volume':
            
              if (val == 0) {
                ctrl.volume = audio.volume = 0;
              } else {
                ctrl.volume = audio.volume = val/100;
              }
              
              break;
            case 'seek':
              audio.currentTime = audio.duration*val/100;
              break;
          }
        }
      }
    }

    function initVideoPage(width, height, url, posterURL) {

      if (!width || width == undefined || width == 'undefined') {
        width = '940';
      }
      if (!height || height == undefined || height == 'undefined') {
        height = '589';
      }
      if (!url || url == undefined || url == 'undefined') {
        url = 'video/video.mp4';
      }
      if (!posterURL || posterURL == undefined || posterURL == 'undefined') {
        posterURL = 'video/video.jpg';
      }
      
      pageCont.innerHTML = ctrl.templates.videoPage;

      // hack for IE (we create additional block to the page top and set {top: -40px} to video div)
      var topHackBlock = document.createElement('DIV');
      topHackBlock.setAttribute('class','hack-ie-video-block');
      pageCont.querySelector('.container').appendChild(topHackBlock);

      var courseVideo = document.createElement('VIDEO');
      courseVideo.setAttribute('id', 'example_video_1');
      courseVideo.setAttribute('class', 'video-js vjs-default-skin');
      courseVideo.setAttribute('preload', 'none');
      courseVideo.setAttribute('width', width);
      courseVideo.setAttribute('height', height);
      courseVideo.setAttribute('controls', true);
      courseVideo.setAttribute('poster', posterURL);
      courseVideo.setAttribute('data-setup', '{ "html5" : { "nativeTextTracks" : false } }');

      var courseVideoSource = document.createElement('SOURCE');
      courseVideoSource.setAttribute('src', url);


      pageCont.querySelector('.container').appendChild(courseVideo);
      courseVideo.appendChild(courseVideoSource);

      videojs("example_video_1", {}, function(){
        // ...
      });

      ctrl.coursePage = {
        stop: function() {
          // destroy();
          videojs("example_video_1").dispose();
          ctrl.coursePage = null;
        },
        restart: function() {
          // ...
        }
      }
    }

    function initExamplePage() {
      pageCont.innerHTML = ctrl.templates.examples;

      $('.animation-href').off('click').on('click', function() {
        var width = 940, 
          height = 589, 
          url = $(this).attr('data-href'), 
          posterURL = $(this).attr('data-poster');

          initVideoPage(width, height, url, posterURL);

          $('#container').attr('data-style', 'examples_in');
      })

      $('.exBack').off('click').on('click', function() {
        videojs("example_video_1").dispose();
        ctrl.coursePage = null;
        $('#container').attr('data-style', 'examples');
        initExamplePage();
      })

    }

    function initLectionsPage() {
      pageCont.innerHTML = ctrl.templates.lections;

      $('.lec-text-href').off('click').on('click', function() {

        $('#container').attr('data-style', 'lections_in');
        initObjOnPage($(this).attr('data-href'));
      })

      $('.exBack').off('click').on('click', function() {
        $('#container').attr('data-style', 'lections');
        initLectionsPage();
      })
    }

    function initAddMaterials() {
      pageCont.innerHTML = ctrl.templates.addMaterials;

      $('.add-materials-href').off('click').on('click', function() {

        $('#container').attr('data-style', 'add-materials_in');
        initObjOnPage($(this).attr('data-href'));
      })

      $('.exBack').off('click').on('click', function() {
        $('#container').attr('data-style', 'add-materials');
        initAddMaterials();
      })
    }

    function initMaterials() {
      pageCont.innerHTML = ctrl.templates.materials;

      $('.materials-href').off('click').on('click', function() {

        $('#container').attr('data-style', 'materials_in');
        initObjOnPage($(this).attr('data-href'));
      })

      $('.exBack').off('click').on('click', function() {
        $('#container').attr('data-style', 'materials');
        initMaterials();
      })
    }

    function initObjOnPage(url) {

      pageCont.innerHTML = ctrl.templates.objectPage;

      $('.object-page_text_link').attr('href', url);
    }

    function sendData () {
      // alert('send')
      suspend_main.bookmark = cls.bookmark_main;
      suspend_main.chapters = chapters_main;
      suspend_main.learner = cls.learner;
      suspend_main.age = cls.learner_age;

      suspend_intro.bookmark = cls.bookmark_intro;
      suspend_intro.chapters = chapters_intro;
      // console.info('sendData()', suspend_intro, suspend_main);

      course_data = {};
      course_data.suspend_main = suspend_main;
      course_data.suspend_intro = suspend_intro;

      // сохранение данных по курсу в локальное хринилище
      try {
        localStorage.setItem('rosstat_data', JSON.stringify(course_data));
      } catch(e) {}
      

      if (cls.success) {
        // set cls.bookmark
        pipwerks.SCORM.set('cmi.location', String(cls.bookmark));

        pipwerks.SCORM.set('cmi.suspend_data', JSON.stringify(suspend));

        // courseScore = calculateProgress().tests.res;
        // отправляются баллы только за итоговое тестирование
        courseScore = calculateProgress().tests.finTestScore;

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
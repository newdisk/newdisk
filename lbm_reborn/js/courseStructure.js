/**
*   пример упражнения singleChoice:
*    {
*      "id": 2,
*      "title": "Упражнение №1",
*      "location": "page02",
*      "hasSound": false,
*      "type": "exercise",
*      "data": {
*        "attempts": 3,  // кол-во попыток
*        "shuffle": true,  // мешать ответы?
*        "showAnswer": false, // показывать правильный ответ в конце
*        "taskText": "Упражнение на одиночный выбор, какой ответ верный?",
*        "questionList": [{
*          "label": "Правильный ответ",
*          "right": 1
*        },{
*          "label": "Неверный ответ",
*          "right": 0
*        },{
*          "label": "Неверный ответ",
*          "right": 0
*        },{
*          "label": "Неверный ответ",
*          "right": 0
*        },{
*          "label": "Неверный ответ",
*          "right": 0
*        }]
*      },
*      "messages": ["Правильный ответ!",
*                  "Ответ неверный!"]
*    }
*
*
*   звук страниц укладывать в папку audio страницы, файл звука длжен иметь название:
*   «page-папка главы-папка страницы.mp3» Пример: page-chapter04-page04.mp3
*/
const courseStructure = {
  "course": "Легко ли быть менеджером?",
  "description": "Модульный курс для дистанционного обучения",
  "chapters": [{
    "chapter_id": 1,
    "chapter_location": "chapter01",
    "title": "Введение",
    "description":"Введение",
    "pages": [{
      "page_id": 1,
      "title": "Введение, страница 1",
      "location": "page01",
      "hasSound": true,
      "type": "simple_page",
      "messages": [""]
    },{
      "page_id": 2,
      "title": "Введение, страница 2",
      "location": "page02",
      "hasSound": false,
      "type": "simple_page",
      "messages": [""]
    },{
      "page_id": 3,
      "title": "Введение, страница 3",
      "location": "page03",
      "hasSound": false,
      "type": "simple_page",
      "messages": [""]
    }] // end of pages array in chapter 1 (intro)
  } // end of chapter
  ,{
    "chapter_id": 2,
    "chapter_location": "chapter02",
    "title": "Глава 1",
    "description":"Основные различия между профессиональной и управленченской деятельностью",
    "pages": [{
      "page_id": 1,
      "title": "Глава 1, страница 1",
      "location": "page01",
      "hasSound": false,
      "type": "simple_page",
      "messages": [""]
    },{
      "page_id": 2,
      "title": "Глава 1, страница 2",
      "location": "page02",
      "hasSound": false,
      "type": "simple_page",
      "messages": [""]
    },{
      "page_id": 3,
      "title": "Page 3",
      "location": "page03",
      "hasSound": false,
      "type": "simple_page",
      "messages": [""]
    },{
      "page_id": 4,
      "title": "Page 4",
      "location": "page04",
      "hasSound": false,
      "type": "simple_page",
      "messages": [""]
    },{
      "page_id": 5,
      "title": "Page 5",
      "location": "page05",
      "hasSound": false,
      "type": "simple_page",
      "messages": [""]
    },{
      "page_id": 6,
      "title": "Задание 1",
      "location": "page06",
      "hasSound": false,
      "type": "exercise",
      "messages": [""]
    },{
      "page_id": 7,
      "title": "Вывод",
      "location": "page07",
      "hasSound": false,
      "type": "simple_page",
      "messages": [""]
    },{
      "page_id": 8,
      "title": "Вывод",
      "location": "page08",
      "hasSound": false,
      "type": "simple_page",
      "messages": [""]
    },{
      "page_id": 9,
      "title": "Вывод",
      "location": "page09",
      "hasSound": false,
      "type": "simple_page",
      "messages": [""]
    },{
      "page_id": 10,
      "title": "Вывод",
      "location": "page10",
      "hasSound": false,
      "type": "simple_page",
      "messages": [""]
    },{
      "page_id": 11,
      "title": "Задание 2",
      "location": "page11",
      "hasSound": false,
      "type": "exercise",
      "messages": [""]
    },{
      "page_id": 12,
      "title": "Вывод",
      "location": "page12",
      "hasSound": false,
      "type": "simple_page",
      "messages": [""]
    },{
      "page_id": 13,
      "title": "Задание 3",
      "location": "page13",
      "hasSound": false,
      "type": "exercise",
      "messages": [""]
    },{
      "page_id": 14,
      "title": "Задание 4",
      "location": "page14",
      "hasSound": false,
      "type": "exercise",
      "messages": [""]
    },{
      "page_id": 15,
      "title": "Вывод",
      "location": "page15",
      "hasSound": false,
      "type": "simple_page",
      "messages": [""]
    },{
      "page_id": 16,
      "title": "Вывод",
      "location": "page16",
      "hasSound": false,
      "type": "simple_page",
      "messages": [""]
    },{
      "page_id": 17,
      "title": "Вывод",
      "location": "page17",
      "hasSound": false,
      "type": "simple_page",
      "messages": [""]
    }] // end of pages array in chapter 2
  } // end of chapter
  ,{
    "chapter_id": 3,
    "chapter_location": "chapter03",
    "title": "Глава 2",
    "description":"Цикл управленченской деятельности",
    "pages": [{
      "page_id": 1,
      "title": "Page 1",
      "location": "page01",
      "hasSound": false,
      "type": "simple_page",
      "messages": [""]
    },{
      "page_id": 2,
      "title": "Page 2",
      "location": "page02",
      "hasSound": false,
      "type": "simple_page",
      "messages": [""]
    },{
      "page_id": 3,
      "title": "Page 3",
      "location": "page03",
      "hasSound": false,
      "type": "simple_page",
      "messages": [""]
    },{
      "page_id": 4,
      "title": "Задание 5",
      "location": "page04",
      "hasSound": false,
      "type": "exercise",
      "data": {
        "attempts": -1,  // кол-во попыток: -1 бесконечно
        "shuffle": true,  // мешать ответы?
        "showAnswer": false, // показывать правильный ответ в конце
        "useVideo": true, // для упражнения taskMarkerChoice: будет ли в блоке видео
        "videoPoster": "img/video-01.png",
        "videoUrl": "video/r1.mp4",
        "videoWidth": 640,
        "videoHeight": 480,
        "taskText": "Посмотрите киноэпизод. Прокомментируйте высказывания героя фильма. Раскрасте в зелёный цвет ты высказывания, с которыми согласны, а в красный те, с которыми не согласны.",
        "questionList": [{
          "label": "Мотивировать - это дело руководства: пусть зарплату повышают.",
          "right": 0
        },{
          "label": "МотивОрганизовывать... тоже никого не надо, все знают, что им делать.",
          "right": 1
        },{
          "label": "А вот контролировать - это нужно.",
          "right": 0
        },{
          "label": "Надо наказывать почаще, а то избаловались, всё на начальство сваливают.",
          "right": 1
        },{
          "label": "Правильный вариант для ассортимента.",
          "right": 1
        }]
      },
      "messages": ["Правильный ответ!",
                  "Ответ неверный!"]
    },{
      "page_id": 5,
      "title": "Page 4",
      "location": "page05",
      "hasSound": false,
      "type": "simple_page",
      "messages": [""]
    }] // end of pages array in chapter 3
  } // end of chapter
  ,{
    "chapter_id": 4,
    "chapter_location": "chapter04",
    "title": "Глава 3",
    "description":"Основные области деятельности руководителя",
    "pages": [{
      "page_id": 1,
      "title": "Page 1",
      "location": "page01",
      "hasSound": false,
      "type": "simple_page",
      "messages": [""]
    },{
      "page_id": 2,
      "title": "Page 2",
      "location": "page02",
      "hasSound": false,
      "type": "simple_page",
      "messages": [""]
    },{
      "page_id": 3,
      "title": "Page 3",
      "location": "page03",
      "hasSound": false,
      "type": "simple_page",
      "messages": [""]
    },{
      "page_id": 4,
      "title": "Задание 6",
      "location": "page04",
      "hasSound": false,
      "type": "exercise",
      "data": {
        "attempts": -1,  // кол-во попыток
        "shuffle": true,  // мешать ответы?
        "showAnswer": false, // показывать правильный ответ в конце
        "taskText": "Выберите правильные утверждения",
        "questionList": [{
          "label": "Повышение уровня продаж",
          "right": 0
        },{
          "label": "Поддержание ассортимента товара на складе",
          "right": 0
        },{
          "label": "Регулярный контроль выхода машин на линию",
          "right": 0
        },{
          "label": "Переписка с производством",
          "right": 0
        },{
          "label": "Набор и увольнение персонала",
          "right": 0
        },{
          "label": "Обеспечение финансовой стабильности предприятия",
          "right": 0
        },{
          "label": "Организация продаж",
          "right": 1
        },{
          "label": "Организация работы склада",
          "right": 1
        },{
          "label": "Контроль работы гаража",
          "right": 1
        },{
          "label": "Формирование заказов продукции",
          "right": 1
        },{
          "label": "Управление составом персонала",
          "right": 1
        },{
          "label": "Управление финансовыми потоками",
          "right": 1
        }]
      },
    "messages": ["Правильный ответ!",
                "Ответ неверный!"]
    },{
      "page_id": 5,
      "title": "Page 5",
      "location": "page05",
      "hasSound": false,
      "type": "simple_page",
      "messages": [""]
    },{
      "page_id": 6,
      "title": "Page 6",
      "location": "page06",
      "hasSound": false,
      "type": "simple_page",
      "messages": [""]
    }] // end of pages array in chapter 4
  } // end of chapter
  ,{
    "chapter_id": 5,
    "chapter_location": "chapter05",
    "title": "Глава 4",
    "description":"Функции управления и навыки менеджера",
    "pages": [{
      "page_id": 1,
      "title": "Page 1",
      "location": "page01",
      "hasSound": false,
      "type": "simple_page",
      "messages": [""]
    },{
      "page_id": 2,
      "title": "Page 2",
      "location": "page02",
      "hasSound": false,
      "type": "simple_page",
      "messages": [""]
    },{
      "page_id": 3,
      "title": "Page 3",
      "location": "page03",
      "hasSound": false,
      "type": "simple_page",
      "messages": [""]
    },{
      "page_id": 4,
      "title": "Page 4",
      "location": "page04",
      "hasSound": false,
      "type": "simple_page",
      "messages": [""]
    },{
      "page_id": 5,
      "title": "Page 5",
      "location": "page05",
      "hasSound": false,
      "type": "simple_page",
      "messages": [""]
    },{
      "page_id": 6,
      "title": "Задание 7",
      "location": "page06",
      "hasSound": false,
      "type": "exercise",
      "messages": [""]
    },{
      "page_id": 7,
      "title": "Задание 8",
      "location": "page07",
      "hasSound": false,
      "type": "exercise",
      "messages": [""]
    },{
      "page_id": 8,
      "title": "Задание 9",
      "location": "page08",
      "hasSound": false,
      "type": "exercise",
      "messages": [""]
    },{
      "page_id": 9,
      "title": "Page 9",
      "location": "page09",
      "hasSound": false,
      "type": "simple_page",
      "messages": [""]
    },{
      "page_id": 10,
      "title": "Page 10",
      "location": "page10",
      "hasSound": false,
      "type": "simple_page",
      "messages": [""]
    },{
      "page_id": 11,
      "title": "Page 11",
      "location": "page11",
      "hasSound": false,
      "type": "simple_page",
      "messages": [""]
    },{
      "page_id": 12,
      "title": "Задание 10",
      "location": "page12",
      "hasSound": false,
      "type": "exercise",
      "data": {
        "attempts": -1,  // кол-во попыток
        "shuffle": true,  // мешать ответы?
        "showAnswer": false, // показывать правильный ответ в конце
        "taskText": "Выберите правильные утверждения",
        "questionList": [{
          "label": "Распределение задач между ключевыми сотрудниками",
          "right": 0
        },{
          "label": "Совместная выработка целей руководителем и подчиненными",
          "right": 1
        },{
          "label": "Систематический контроль, измерение и оценка работы и результатов",
          "right": 0
        },{
          "label": "Разработка реалистичных планов достижения",
          "right": 1
        },{
          "label": "Корректирующие меры для достижения запланированных результатов",
          "right": 1
        }]
      },
    "messages": ["Правильный ответ!",
                "Ответ неверный!"]
    },{
      "page_id": 13,
      "title": "Page 13",
      "location": "page13",
      "hasSound": false,
      "type": "simple_page",
      "messages": [""]
    },{
      "page_id": 14,
      "title": "Page 14",
      "location": "page14",
      "hasSound": false,
      "type": "simple_page",
      "messages": [""]
    },{
      "page_id": 15,
      "title": "Page 15",
      "location": "page15",
      "hasSound": false,
      "type": "simple_page",
      "messages": [""]
    },{
      "page_id": 16,
      "title": "Page 16",
      "location": "page16",
      "hasSound": true,
      "type": "simple_page",
      "messages": [""]
    },{
      "page_id": 17,
      "title": "Page 17",
      "location": "page17",
      "hasSound": false,
      "type": "simple_page",
      "messages": [""]
    },{
      "page_id": 18,
      "title": "Page 18",
      "location": "page18",
      "hasSound": false,
      "type": "simple_page",
      "messages": [""]
    },{
      "page_id": 19,
      "title": "Page 19",
      "location": "page19",
      "hasSound": false,
      "type": "simple_page",
      "messages": [""]
    },{
      "page_id": 20,
      "title": "Page 20",
      "location": "page20",
      "hasSound": false,
      "type": "simple_page",
      "messages": [""]
    },{
      "page_id": 21,
      "title": "Page 21",
      "location": "page21",
      "hasSound": false,
      "type": "simple_page",
      "messages": [""]
    },{
      "page_id": 22,
      "title": "Page 22",
      "location": "page22",
      "hasSound": false,
      "type": "simple_page",
      "messages": [""]
    },{
      "page_id": 23,
      "title": "Page 23",
      "location": "page23",
      "hasSound": false,
      "type": "simple_page",
      "messages": [""]
    },{
      "page_id": 24,
      "title": "Page 24",
      "location": "page24",
      "hasSound": false,
      "type": "simple_page",
      "messages": [""]
    },{
      "page_id": 25,
      "title": "Page 25",
      "location": "page25",
      "hasSound": false,
      "type": "simple_page",
      "messages": [""]
    },{
      "page_id": 26,
      "title": "Page 26",
      "location": "page26",
      "hasSound": false,
      "type": "simple_page",
      "messages": [""]
    },{
      "page_id": 27,
      "title": "Page 27",
      "location": "page27",
      "hasSound": false,
      "type": "simple_page",
      "messages": [""]
    },{
      "page_id": 28,
      "title": "Page 28",
      "location": "page28",
      "hasSound": false,
      "type": "simple_page",
      "messages": [""]
    },{
      "page_id": 29,
      "title": "Page 29",
      "location": "page29",
      "hasSound": false,
      "type": "simple_page",
      "messages": [""]
    },{
      "page_id": 30,
      "title": "Page 30",
      "location": "page30",
      "hasSound": false,
      "type": "simple_page",
      "messages": [""]
    },{
      "page_id": 31,
      "title": "Page 31",
      "location": "page31",
      "hasSound": false,
      "type": "simple_page",
      "messages": [""]
    },{
      "page_id": 32,
      "title": "Page 32",
      "location": "page32",
      "hasSound": false,
      "type": "simple_page",
      "messages": [""]
    },{
      "page_id": 33,
      "title": "Page 33",
      "location": "page33",
      "hasSound": false,
      "type": "simple_page",
      "messages": [""]
    },{
      "page_id": 34,
      "title": "Page 34",
      "location": "page34",
      "hasSound": false,
      "type": "simple_page",
      "messages": [""]
    },{
      "page_id": 35,
      "title": "Page 35",
      "location": "page35",
      "hasSound": false,
      "type": "simple_page",
      "messages": [""]
    },{
      "page_id": 36,
      "title": "Page 36",
      "location": "page36",
      "hasSound": false,
      "type": "simple_page",
      "messages": [""]
    },{
      "page_id": 37,
      "title": "Page 37",
      "location": "page37",
      "hasSound": false,
      "type": "simple_page",
      "messages": [""]
    },{
      "page_id": 38,
      "title": "Page 38",
      "location": "page38",
      "hasSound": false,
      "type": "simple_page",
      "messages": [""]
    },{
      "page_id": 39,
      "title": "Page 39",
      "location": "page39",
      "hasSound": false,
      "type": "simple_page",
      "messages": [""]
    },{
      "page_id": 40,
      "title": "Page 40",
      "location": "page40",
      "hasSound": false,
      "type": "simple_page",
      "messages": [""]
    }] // end of pages array in chapter 5
  } // end of chapter
  ,{
    "chapter_id": 6,
    "chapter_location": "chapter06",
    "title": "Глава 5",
    "description":"Связующие процессы управленческого цикла",
    "pages": [{
      "page_id": 1,
      "title": "Page 1",
      "location": "page01",
      "hasSound": false,
      "type": "simple_page",
      "messages": [""]
    }] // end of pages array in chapter 6
  } // end of chapter
  ,{
    "chapter_id": 7,
    "chapter_location": "chapter07",
    "title": "Итоговое тестирование",
    "description": "Итоговое тестирование",
    "pages": [{
      "page_id": 1,
      "title": "Итоговое тестирование",
      "location": "page01",
      "hasSound": false,
      "type": "test",
      "messages": [""]
    }] // end of pages array in final chapter
  }] // end of chapters array
};
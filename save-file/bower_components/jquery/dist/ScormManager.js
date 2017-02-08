/**
 * Created by aklimenko on 09.12.15.
 * Сервис отвечает за поиск SCORM API,
 *  получение/передачу данных в формате SCORM,
 *  отправку данных в формате курса в курс.
 */

angular.module('coreApp')
  .factory('ScormManager', [
    'scormWrapper',
    'StructureManager',
    '$q',
    '$http',
    '$lmsConnected',
    '$structure',
    '$window',
    function (scormWrapper,
              StructureManager,
              $q,
              $http,
              $lmsConnected,
              $structure,
              $window) {
      var ScormManager = this;
      var _startDate;

      ScormManager.dataForCourse = {};
      ScormManager.dataForLMS = {};

      /**
       * Инициализация: поиск API, получение данных, установка их в статус
       */
      ScormManager.init = function (APIType) {
        var defered = $q.defer();
        console.log('$structure.config:',$structure.config);
        scormWrapper.setAPIVersion($structure.config.scorm_version);

        if (!$lmsConnected) {
          defered.reject('LMS connection failed');
          return defered.promise;
        } else {
          scormWrapper.doLMSInitialize();
          console.warn('LMS connection successed', scormWrapper.LMSIsInitialized());
        }

        var status = scormWrapper.doLMSGetValue("cmi.completion_status");

        console.warn('LMS version:', scormWrapper.getAPIVersion());

        _startDate = new Date().getTime();

        if (!status || status == "not attempted") {
          //если в cours_config параметр initializer не null,
          //то курс инициализируется где-то в другом месте, например во flash
          if ($structure.config.initializer) {
            defered.resolve('not attempted')
          } else {
            console.warn('Course status:', status, ' set initial state.')
            _initializeScorm().then(
              function () {
                _sendData();
                ScormManager.dataForCourse = _getDataForCourse();
                defered.resolve(ScormManager.dataForCourse);
              }
            );
          }
        } else {
          ScormManager.dataForCourse = _getDataForCourse();
          defered.resolve(ScormManager.dataForCourse);
        }

        return defered.promise;
      };

      function _getDataForCourse() {
        var suspend_data = _getSuspendData();
        var score_raw = scormWrapper.doLMSGetValue('cmi.score.raw');
        return {
          pages: _.map(
            suspend_data.pages,
            function (x) {
              return _.map(x, function (y) {
                return {id: y.id, info: y.i, passed: y.p}
              })
            }),
          exercises: _.map(
            suspend_data.exercises,
            function (x) {
              return {id: x.id, result: x.r}
            }),
          lesson_location: scormWrapper.doLMSGetValue('cmi.location'),
          lesson_status: scormWrapper.doLMSGetValue('cmi.completion_status'),
          score_raw: (score_raw > 0) ? score_raw : 0,
          time: scormWrapper.doLMSGetValue('cmi.total_time'),
          session_time: scormWrapper.doLMSGetValue('cmi.session_time')
        }
      }

      /**
       * Put json data from course to LMS
       * @param data
       */
      ScormManager.putParamJSON = (data) => {

        var $data = JSON.parse(data); // <= преобразование строки в JSON


        console.log('ScormManager.putParamJSON:', $data);

        ScormManager.dataForLMS = {
          lesson_location: $data.lesson_location,
          score_raw: $data.score,
          session_time: $data.time,
          lesson_status: ($data.score >= 100) ? 'completed' : 'incomplete',
          suspend_data: {
            exercises: _.map($data.exercises,
              exercise => ({
                id: exercise.id,
                r: exercise.result
              })
            ),
            pages: _.map($data.pages,
              chapter => _.map(chapter,
                page => ({
                  id: page.id,
                  p: 1 * !!page.passed,
                  i: (!page.info) ? -1 : page.info
                })
              )
            ),
            tests: _.map($data.tests,
              test => ({
                id: test.id,
                questions: test.questions
              })
            ),
            score: $data.score * 1,
            awards: $data.awards
          }
        };

        _sendData();
      };

      /**
       * Here we need to parse suspend_data to get valid json
       **/
      function _getSuspendData() {
        var val = scormWrapper.doLMSGetValue('cmi.suspend_data').replace(/\*/g, '"');
        console.log('getSuspendData:', val);

        if (!val) return {};

        return JSON.parse(val);
      }

      /**
       * initialize from not-attempted state
       */
      function _initializeScorm() {
        var defered = $q.defer();
        // the student is now attempting the lesson
        ScormManager.dataForLMS = {
          lesson_location: '',
          score_raw: 0,
          session_time: _computeTime(),
          lesson_status: "incomplete",
          suspend_data: {
            exercises: _.map(StructureManager.get.tasks, function (task) {
              return {
                id: task.id,
                r: task.result
              }
            }),
            pages: _.map(StructureManager.get.pages, function (page) {
              return {
                id: page.id,
                p: 1 * !!page.passed,
                i: (!page.info) ? -1 : page.info
              }
            }),
            tests: _.map(StructureManager.get.tests, function (test) {
              return {
                id: test.id,
                r: test.result
              }
            }),
            score: 0,
            awards: {}
          }
        };
        getAwards();

        function getAwards() {
          $http.get('./data/win-stats.json').then(
            function (response) {
              var data = response.data;
              for (var propName in data) {
                if (propName != 'messages') {
                  var hasEx = StructureManager.hasExType(propName);
                  ScormManager.dataForLMS.awards[propName] = (hasEx) ? 0 : -1
                }
              }
              defered.resolve();
            },
            function (error) {
              ScormManager.awards = {};
              defered.resolve();
            }
          )
        }

        return defered.promise;
      }

      /**
       * Sets Objectives and Interactions
       * according to ScormManager.data.pages ans ScormManager.data.tasks
       */
      function _setObjectivesAndInteractions() {
        var pages = ScormManager.dataForLMS.pages;
        var exercises = ScormManager.dataForLMS.exercises;

        //**********************
        //create Objectives
        _.forEach(pages, function (page) {
          var status_12 = 'not attempted'; //'passed'|'completed'|'failed'|'incomplete'|'browsed'|'not attempted'
          var success_status_2004 = 'unknown';    //'passed', 'failed', 'unknown'
          var completion_status_2004 = 'unknown'; //'completed', 'incomplete', 'not attempted', 'unknown'

          if (page.passed) {
            status_12 = 'passed';
            success_status_2004 = 'passed';
            completion_status_2004 = 'completed'
          }

          scormWrapper.doLMSSetValue('cmi.objectives.' + i + '.id', 'chapter_' + page.chapter + '_' + page.id);
          scormWrapper.doLMSSetValue('cmi.objectives.' + i + '.score.raw', page.result);
          scormWrapper.doLMSSetValue('cmi.objectives.' + i + '.status', status_12);

          //SCORM2004-------------------------------
          scormWrapper.doLMSSetValue('cmi.objectives.' + i + '.success_status', success_status_2004);
          scormWrapper.doLMSSetValue('cmi.objectives.' + i + '.completion_status', completion_status_2004);
          scormWrapper.doLMSSetValue('cmi.objectives.' + i + '.progress_measure', page.result);
          scormWrapper.doLMSSetValue('cmi.objectives.' + i + '.description', page.title);
        });

        //**********************
        //create Interactions
        _.forEach(exercises, function (exercise) {
          scormWrapper.doLMSSetValue('cmi.interactions.' + i + '.id', 'chapter_' + exercise.chapter + '_page_' + pages[tasks[i].page].id + '_task_' + i);
          scormWrapper.doLMSSetValue('cmi.interactions.' + i + '.type', 'numeric');
          scormWrapper.doLMSSetValue('cmi.interactions.' + i + '.result', exercise.data.result);
          scormWrapper.doLMSSetValue('cmi.interactions.' + i + '.weighting', '1');


          //TODO: неясно зачем назначать objectives для interaction
          //scormWrapper.doLMSSetValue('cmi.interactions.' + i + '.objectives.' + i + '.id', 'chapter_'+pages[tasks[i].chapter]+'_'+pages[tasks[i].page].id);

          //SCORM2004-------------------------------
          scormWrapper.doLMSSetValue('cmi.interactions.' + i + '.description', pages[exercise.page].title);

          //TODO: interaction types & learner_responses
          //scormWrapper.doLMSSetValue('cmi.interactions.' + i + '.type', pages[i].tasks[j].data.type);
          //scormWrapper.doLMSSetValue('cmi.interactions.' + i + '.learner_response', pages[i].tasks[j].data.learner_response);
        });
      }

      /**
       * Public update method - updates ScormManager.data
       * @param pages
       * @param tasks
       * @param currentPage
       */
      ScormManager.update = function (pages, tasks, currentPage) {
        if (!$lmsConnected) return;
        ScormManager.dataForLMS.suspend_data.pages = pages;
        ScormManager.dataForLMS.suspend_data.exercises = tasks;

        if (currentPage && currentPage.id) {
          ScormManager.dataForLMS.lesson_location = currentPage.id;
        } else {
          ScormManager.dataForLMS.lesson_location = ''
        }

        ScormManager.dataForLMS.score_raw = _computeScoreRaw(pages);
        ScormManager.dataForLMS.session_time = _computeTime();
        ScormManager.dataForLMS.lesson_status = _computeLessonStatus();

        console.log('update', ScormManager.data);
      };

      /**
       * Public send method - builds scorm_data according to ScormManager.data
       * and sends it to LMS
       */
      function _sendData() {
        console.log('sendData -> lmsConnected:', $lmsConnected)
        if (!$lmsConnected) return;

        console.log('data to LMS:1');

        scormWrapper.doLMSSetValue("cmi.score.raw", ScormManager.dataForLMS.score_raw);

        console.log('data to LMS:2');
        scormWrapper.doLMSSetValue("cmi.location", ScormManager.dataForLMS.lesson_location);

        console.log('data to LMS:3');
        scormWrapper.doLMSSetValue("cmi.session_time",_computeTime());

        console.log('data to LMS:4');
        scormWrapper.doLMSSetValue("cmi.completion_status", ScormManager.dataForLMS.lesson_status);

        console.log('data to LMS:5');
        //_setObjectivesAndInteractions();


        var str = ScormManager.dataForLMS.suspend_data;

        if(typeof str != "string") str = JSON.stringify(str);

        scormWrapper.doLMSSetValue("cmi.suspend_data", str.replace(/\"/g, '*'));

        console.log('after doLMSSetValue, suspend_data: ', ScormManager.dataForLMS.suspend_data);

        console.log('LMS commit:',scormWrapper.doLMSCommit(""));
        return scormWrapper.doLMSCommit();
      };


      //Utility functions======================================
      /**
       * Calculates main score
       * @param pages
       * @returns {number}
       */
      function _computeScoreRaw(pages) {
        var pages_with_tasks = _.filter(pages, function (page) {
          return (page.tasks && page.tasks.length);
        });

        if (!pages_with_tasks.length) {
          console.log('There are no exercises, you earn 100 points!');
          return 100;
        }

        var summ = _.reduce(pages_with_tasks, function (summ, page) {
          return summ + page.result;
        }, 0);

        return Math.round(summ / pages_with_tasks.length);
      }

      /**
       * Calculates main course status
       *
       * @returns {String}
       */
      function _computeLessonStatus() {
        var status = 'incomplete';
        var pages = ScormManager.dataForLMS.pages;
        var exercises = ScormManager.dataForLMS.exercises;

        var isPassed = !_.some(pages, function (page) {
          return !page.passed
        });

        var isComplete = !_.some(exercises, function (exercise) {
          return exercise.result * 1 != 100
        });

        if (isPassed && isComplete) status = 'completed';
        else if (isPassed) status = 'incomplete';//Change to 'passed' if needed

        //console.log('isPassed:', isPassed, 'isComplete:', isComplete);
        //console.log('lesson_status:', status);

        return status;
      }

      /*******************************************************************************
       ** Public method to finish course
       *******************************************************************************/
      ScormManager.unloadPage = function () {
        console.log('ScormManager.unloadPage $lmsConnected:', $lmsConnected);

        scormWrapper.doLMSSetValue("cmi.session_time", _computeTime());

        // NOTE: LMSFinish will unload the current SCO.  All processing
        //       relative to the current page must be performed prior
        //		 to calling LMSFinish.
        console.log('ScormManager unloadPage');
        scormWrapper.doLMSFinish();

        // NOTE:  don't return anything that resembles a javascript
        //		  string from this function or IE will take the
        //		  liberty of displaying a confirm message box.

        $window.close();
        console.log('page unloaded!')
      };


      function _computeTime() {
        if (_startDate != 0) {
          var currentDate = new Date().getTime();
          var elapsedSeconds = ( (currentDate - _startDate) / 1000 );
          var formattedTime = _convertTotalSeconds(elapsedSeconds);
        }
        else {
          formattedTime = "00:00:00.0";
        }

        return formattedTime;

        /*******************************************************************************
         ** this function will convert seconds into hours, minutes, and seconds in
         ** CMITimespan type format - HHHH:MM:SS.SS (Hours has a max of 4 digits &
         ** Min of 2 digits
         *******************************************************************************/
        function _convertTotalSeconds(ts) {
          var sec = (ts % 60);

          ts -= sec;
          var tmp = (ts % 3600);  //# of seconds in the total # of minutes
          ts -= tmp;              //# of seconds in the total # of hours

          // convert seconds to conform to CMITimespan type (e.g. SS.00)
          sec = Math.round(sec * 100) / 100;

          var strSec = new String(sec);
          var strWholeSec = strSec;
          var strFractionSec = "";

          if (strSec.indexOf(".") != -1) {
            strWholeSec = strSec.substring(0, strSec.indexOf("."));
            strFractionSec = strSec.substring(strSec.indexOf(".") + 1, strSec.length);
          }

          if (strWholeSec.length < 2) {
            strWholeSec = "0" + strWholeSec;
          }
          strSec = strWholeSec;

          if (strFractionSec.length) {
            strSec = strSec + "." + strFractionSec;
          }


          if ((ts % 3600) != 0)
            var hour = 0;
          else var hour = (ts / 3600);
          if ((tmp % 60) != 0)
            var min = 0;
          else var min = (tmp / 60);

          if ((new String(hour)).length < 2)
            hour = "0" + hour;
          if ((new String(min)).length < 2)
            min = "0" + min;

          var rtnVal = hour + ":" + min + ":" + strSec;

          return rtnVal;
        }
      }

      return ScormManager;
    }]);

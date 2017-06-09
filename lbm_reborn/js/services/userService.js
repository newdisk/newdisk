;(function() {
'use strict';

  angular
    .module('courseApp')
    .service('userService', userService);

    
    function userService(courseDataObj, testDataObj, $document, scormWrapper, courseInfo) {

      let userDataObj = courseDataObj.chapters.map(function(elem) {
        return {
          id: elem.id,
          visited: 1,
          completed: false,
          pages: elem.pages.map(function(item, index) {
            return {
              id: item.id,
              type: item.type,
              title: item.title,
              visited: index === 0 ? true : false,
              completed: ''
            }
          })
        }
      });

      this.exs=[];
      courseDataObj.chapters.forEach((elem,indx,arr)=>{
        elem.pages.map((elem, i) => {
          if (elem.type == 'exercise') {
            this.exs.push({
              id: elem.page_id,
              chapter_id: indx,
              page_id: i,
              score: 0,
              status: -1,
              title: elem.title
            }) 
          }
        })
      })


      console.warn('userService:: setUp exs Arr', JSON.stringify(this.exs)) 

      // this.testData = _.shuffle(JSON.parse(JSON.stringify(testDataObj.tests[0].groups[0].questions)));

      this.loadExs = (data)=> {
        alert('load exs!')
        this.exs = data;
      }

      this.currentTestQuestion = null;
      this.setCurrentTestQuestion = (question)=> {
        this.currentTestQuestion = question;
      }
        
      // console.log('userService:: exs',this.exs)
      this.getExs = () => {
        // console.log('userService:: getExs, exs', this.exs)
        return this.exs;
      }

      this.getPageVisit = () => {
        //
      }
      this.setPageVisit = (module, page) => {
        // 
      }
      this.setUserProgress = (score, status, chapter, page) => {
        // console.log('userService:: setUserProgress this.exs', this.exs)
        this.exs.forEach((item) => {
          console.log('=>',item, chapter, page)
          if (item.chapterId == chapter && item.pageId == page) {
            item.score = score;
            item.status = status;
          }
        })
        console.log('userService:: setUserProgress > this.exs',this.exs)

        courseInfo.exercises = JSON.parse(JSON.stringify(this.exs));
        // courseInfo.excercises = this.exs;

        this.sendToLMS();
      }
      this.sendToLMS = ()=> {
        // alert('sendToLMS: ' + JSON.stringify(courseInfo))
        console.warn('userService:: sendToLMS: ' + angular.toJson(courseInfo))
        scormWrapper.doLMSSetValue('cmi.suspend_data', angular.toJson(courseInfo))
        scormWrapper.doLMSSetValue('cmi.core.score.raw', courseInfo.testScore)

        if ( courseInfo.testScore >= 60 ) {
          scormWrapper.doLMSSetValue('cmi.core.lesson_status', 'completed')
        } else {
          scormWrapper.doLMSSetValue('cmi.core.lesson_status', 'incomplete')
        }

        scormWrapper.doLMSCommit();
      }

      this.closeCourse = ()=> {
        this.sendToLMS();

        document.getElementsByClassName('course-wrapper')[0].innerHTML = '<p class="close-msg">Работа с модулем курса завершена.</p>'
      }
    }
})();
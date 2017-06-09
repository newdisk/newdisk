;(function() {
  'use strict';

  angular
    .module('courseApp')
    .service('staticService', staticService)

    /* @ngInject */
    function staticService(courseDataObj, courseInfo) {

      let modals = [{
        type: 'menu',
        state: false
      },{
        type: 'stats',
        state: false
      },{
        type: 'about',
        state: false
      },{
        type: 'help',
        state: false
      },{
        type: 'exercise',
        state: false
      },{
        type: 'video',
        state: false
      },{
        type: 'cloak',
        state: false
      }]

      //
      this.getModalState = index => {
        // console.log('staticService:: getModalState: index', index)
        return modals[index].state;
      }


      this.showModal = (index, headText, bodyText) => {
        // console.log('staticService:: showModal: state', modals[index].state)
        if (modals[index].state) {
          modals[index].state = false;
        } else {
          this.closeModals();

          if ( modals[index].type == 'exercise' ) {
            document.getElementsByClassName('modal_head')[0].innerHTML = headText;
            document.getElementsByClassName('modal_body')[0].innerHTML = bodyText;
          }
          modals[index].state = true;
          modals[modals.length-1].state = true;
        }
      }

      this.closeModals = (index) => {
        modals.forEach((elem) => {
          elem.state = false;
        })
      }

      // 
      this.getCourseName = () => ({
        course: courseDataObj.course,
        description: courseDataObj.description
      });

      // call getChapterObj() from 'HeaderCtrl' controller
      this.getChapterObj = index => 
          courseDataObj.chapters[index];
      
      this.getChaptersTotal = () =>
          courseDataObj.chapters;

      this.getPageTotal = () => {
        let totalPages = 0;
        for (let i = 0; i < courseDataObj.chapters.length; i++) {
          totalPages += courseDataObj.chapters[i].pages.length;
        }
        return totalPages;
      }
      this.getBookmark = () => 
          courseInfo.bookmark;

      this.setBookmark = (chapterPage, chapter) => {
        console.warn('staticService:: try to setBookmark:', chapterPage, chapter)
        courseInfo.bookmark.chapterPage = chapterPage;
        courseInfo.bookmark.chapter = chapter;

        
        if (chapter == 1) {
          courseInfo.bookmark.page = chapterPage;
        } else {
          let tmpPages = 0;
          for (let i = 0; i < chapter-1; i++) {
            tmpPages += courseDataObj.chapters[i].pages.length;
          }
          courseInfo.bookmark.page = tmpPages + chapterPage;
        }
        console.log('staticService:: setBookmark ChP: %d, Ch: %d, Page: %d', chapterPage, chapter, courseInfo.bookmark.page)
      }

      // get exercise data array
      this.getData = ($stateParams, prop) => 
          courseDataObj.chapters[$stateParams.chapter - 1].pages[$stateParams.page - 1].data[prop];

      // get message array
      this.getMessage = ($stateParams, num) => 
          courseDataObj.chapters[$stateParams.chapter - 1].pages[$stateParams.page - 1].messages[num];

      /**
      *  audio section
      */
      let audioTime = 0,
          stopAudio = false;

      this.setAudioTime = (time) => {
        audioTime = time;
      }

      this.getAudioTime = () => {
        return audioTime;
      }

      this.stopAudio = (bool) => {
        stopAudio = bool;
      }

      this.getStopAudio = () => {
        return stopAudio;
      }

      let waitAudio = false;
      this.startAudio = (toggler) => {
        if (arguments.length === 0) { return waitAudio; };
        waitAudio = toggler;
      }
    }
})();
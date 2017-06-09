;(function() {
  'use strict';

  angular
    .module('courseApp')
    .controller('HeaderCtrl', HeaderCtrl);

    /* @ngInject */
    function HeaderCtrl($state, $stateParams, staticService, userService) {

      this.chapters = staticService.getChaptersTotal();
      
      this.exercises = userService.exs;

      this.getExs = () => userService.getExs();
      
      this.countExs = () => userService.getExs().length;
      
      this.countDoneExs = () => {
        let exs = userService.getExs(),
            counter = 0;
        exs.forEach((item, i, arr) => {
          if(item.status == 1) {
            counter++;
          }
        })
        return counter;
      }
      this.title = {
        course: staticService.getCourseName().course,
        chapter: staticService.getChapterObj(Number($stateParams.chapter) -1 ).title,
        exercise: this.chapters[Number($stateParams.chapter) - 1].pages[Number($stateParams.page) - 1].title
      }

      this.getModalState = (index) => 
          staticService.getModalState(index);
      

      this.menuPagesCounter = 1;
      this.countPages = () => this.menuPagesCounter++;

      this.coursePage = document.querySelector('.page-wrapper');

      this.goFromMenu = (page, chapter) => {
        console.log('HeaderCtrl:: goFromMenu, page: %d, chapter: %d, SP: %s, SC: %s', page.page_id, chapter.chapter_id, $stateParams.page, $stateParams.chapter)
  
        if (chapter.chapter_id > Number($stateParams.chapter)) {
          this.coursePage.classList.remove('backward');
        } else if (chapter.chapter_id == Number($stateParams.chapter)) {
          if (page.page_id > Number($stateParams.page)) {
            this.coursePage.classList.remove('backward');
          } else {
            this.coursePage.classList.add('backward');
          }
        } else {
          this.coursePage.classList.add('backward');
        }

        $state.go('page', {chapter: chapter.chapter_id, page: page.page_id});

        staticService.closeModals();
      }
      this.getCurrent = () => {
        return staticService.getBookmark().page;
      }
      this.toggleMenu = () => {
        staticService.showModal(0);
        scrollMenu();
      }

      const scrollMenu = () => {
        let currentItem = document.querySelector('.menu_list__page-item.current'),
            menu = document.querySelector('.modal_nav-menu')

        // console.warn('curr offsetTop',currentItem.offsetTop)
        setTimeout(function() {
          menu.scrollTop = currentItem.offsetTop;
        }, 30)
        
      }

      this.toggleStat = () => {
        // this.exercises = userService.exs;
        staticService.showModal(1);
      }
      this.toggleAbout = () => {
        staticService.showModal(2);
      }
      this.closeModals = ()=> {
        staticService.closeModals();
      }

      this.closeCourse = ()=> {
        userService.closeCourse();
      }
      

      this.toggleVideo = ()=> {
        console.log('HeaderCtrl:: toggleVideo:')
        staticService.showModal(5);
      }
    }
})();
;(function() {
  'use strict';

  angular
    .module('courseApp')
    .controller('FooterCtrl', FooterCtrl);

    /* @ngInject */
    function FooterCtrl($state, $stateParams, staticService, userService, courseInfo, courseDataObj) {

      if ( window.bookmark && !window.bookmark.loaded ) {
        window.bookmark.loaded = true;
        document.getElementsByClassName('paginator')[0].innerHTML = window.bookmark.page+' / '+staticService.getPageTotal();
        staticService.setBookmark(window.bookmark.chapterPage, window.bookmark.chapter)
      } else {
        document.getElementsByClassName('paginator')[0].innerHTML = courseInfo.bookmark.page+' / '+staticService.getPageTotal();
      }
      
      this.bookmark = staticService.getBookmark();
      console.log('FooterCtrl::', this.bookmark)

      // alert(JSON.stringify(courseInfo))

      this.coursePage = document.querySelector('.page-wrapper');

      this.curChapterNum = Number($stateParams.chapter);
      // страница в главе
      this.curPageNum = Number($stateParams.page);
      // всего страниц в курсе
      this.pageAmountTotal = '' + staticService.getPageTotal();
      // всего страниц в главе
      this.pageAmountChapter = staticService.getChapterObj(this.curChapterNum - 1).pages.length;

      let currChapterObj = courseDataObj.chapters[this.curChapterNum-1];
      this.chapterLocation = currChapterObj.chapter_location;
      this.pageLocation = currChapterObj.pages[this.curPageNum-1].location;
      this.pageHasSound = currChapterObj.pages[this.curPageNum-1].hasSound;
      console.warn('FooterCtrl:: locs: %s, %s, sound: %s', this.chapterLocation, this.pageLocation, this.pageHasSound)

      this.toBack = () => {
        if (this.curChapterNum == 1 && this.curPageNum == 1) { return; }

        if (this.curPageNum == 1) {
          this.curPageNum = staticService.getChapterObj(this.curChapterNum - 2).pages.length;
          this.curChapterNum--;
        } else {
          this.curPageNum--;
        }
        
        staticService.setBookmark(this.curPageNum, this.curChapterNum);
        this.coursePage.classList.add('backward');
        // console.warn('FooterCtrl:: локейшены', courseDataObj.chapters[this.curChapterNum-1].chapter_location, courseDataObj.chapters[this.curChapterNum-1].pages[this.curPageNum-1].location)
        
        $state.go('page', {chapter: this.curChapterNum, page: this.curPageNum});
      }

      this.toForward = () => {
        
          if(this.curChapterNum == staticService.getChaptersTotal().length && this.curPageNum == this.pageAmountChapter) { return; }

          if (this.curPageNum == this.pageAmountChapter) {
            this.curChapterNum++;
            this.curPageNum = 1;
          } else {
            this.curPageNum++;
          }

          staticService.setBookmark(this.curPageNum, this.curChapterNum);
          userService.setPageVisit(this.curChapterNum - 1, this.curPageNum);
          this.coursePage.classList.remove('backward');
          $state.go('page', {chapter: this.curChapterNum, page: this.curPageNum});
      }

      this.toggleAbout = () => {
        //
      }
      this.toggleHelp = () => {
        //
      }

    }

})();

// ;(function($, ctrl){
//   'use strict';

  var pageDocument = $(parent.frames['myframe'].document);
  //var commentMessage = ctrl.structure.pages[ctrl.bookmark].messages;
  var m_answe = $(parent.frames['myframe'].document).find( "#accordion" ).accordion({
    heightStyle: "content",
    icons: false
  });

  var elements = pageDocument.find('h3');

  $(elements[0]).addClass('viewed');

  var elementsLength = elements.length;


  m_answe.on('click',clickAcc);

  function clickAcc(e) {
     $(e.target).closest('.page__header').addClass('viewed');
    var counter=0;
    elements.each(function(i,v){
      if($(v).hasClass('viewed')) {
        counter++;
      }
    })
    if(counter ==elementsLength){
      parent.ctrl.sendResult(1,100,"Все посмотренно");
    }

  }

//   ctrl.coursePage = {
//     play: function() {
//       //
//     },
//     stop: function(){
//      // $('#myBtn').off('click')
//       m_answe.off('click');
//       ctrl.coursePage = null;

//     },
//     restart: function(){
//       //restartBtnClicker();
//     }
//   }
// })(parent.jQuery, parent.ctrl);
// parent.ctrl.coursePage.play();
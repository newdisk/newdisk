'use strict';

function initCarousels(){
  var carousel_btns = document.getElementsByClassName('carousel-intro');

  for(var i=0; i< carousel_btns.length; i++){
    carousel_btns[i].onclick = function(evt){
      $(evt.currentTarget).fadeOut();
      var carousel_id = $(evt.currentTarget).data('target');
      $(carousel_id).fadeIn();
      $(carousel_id).removeClass('hidden');
    }
  }
}

window.templateLoader.addLoadHandler(initCarousels)
window.templateLoader.addLoadHandler(initModel3d)

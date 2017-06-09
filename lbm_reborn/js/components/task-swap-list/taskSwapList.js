;(function() {
  'use strict';

  angular
    .module('courseApp')
    .component('taskSwapList', {
      templateUrl: 'js/components/task-swap-list/taskSwapListTmpl.html',
      controller: 'SwapListCtrl',
      controllerAs: '$ctrl'
    })
    .controller('SwapListCtrl', SwapListCtrl);

    /* @ngInject */
    function SwapListCtrl() {
      // TODO:

      angular.element(document).ready(()=> {
        $(function() {
          $(".task-swap-list_item")
          .draggable({ 
            zIndex: 2,
            start:function(e, ui) {},
            stop: function(e, ui) {
              console.log(ui)
              ui.helper[0].style.top = '0px'
              ui.helper[0].style.left = '0px'
            }
          })
          .droppable({
              drop:function(event,ui){
                console.log('куда =>',$(this).get(0))
                console.log('что =>',$(ui.draggable).get(0))
                  swapNodes($(this).get(0),$(ui.draggable).get(0));
              }});
        });


        function swapNodes(a, b) {
          if(a.classList.contains('task-swap-list_item__fixed')) {
            console.warn('drop on fixed')
            return;
          }
            var aparent= a.parentNode;
            var asibling= a.nextSibling===b? a : a.nextSibling;
            b.parentNode.insertBefore(a, b);
            aparent.insertBefore(b, asibling);
            
            b.style.left = '0px';
            b.style.top = '0px';
        }
      })
    }
})();
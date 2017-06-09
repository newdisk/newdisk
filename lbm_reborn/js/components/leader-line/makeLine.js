;(function() {
 'use strict';

 angular
  .module('courseApp')
  .component('makeLine', {
    bindigs: {
      lineTo: '@'
    },
    controller: 'LeaderLineCtrl'
  })
  .controller('LeaderLineCtrl', LeaderLineCtrl)

  /* @ngInject */
  function LeaderLineCtrl($element, $attrs, userService) {
    
    /*angular.element(document).ready(()=> {
      this.elementsFrom = JSON.parse($attrs.linefrom);
      this.elementsTo = JSON.parse($attrs.lineto);
      // console.log(this.elementsFrom, this.elementsTo)
      
      for (var i = 0; i < this.elementsFrom.length; i++) {
        console.log('draw line')
        let start = document.getElementById(this.elementsFrom[i]),
            end = document.getElementById(this.elementsTo[i]),
            params = JSON.parse(start.getAttribute('data'));
            // console.log(params)
        new LeaderLine(
            start,
            end,
            params
          )
      }
    })*/

    //TODO: 
    // var e = document.getElementsByClassName('leader-line')
    // e[0].remove()
    // 
  }

})();
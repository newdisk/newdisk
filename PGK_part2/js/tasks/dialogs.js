!function(e,t){"use strict";function a(t){e(m).hasClass("active")?(e(parent.frames.myframe.document).find(".slide-block").slideDown(),e(m).removeClass("active"),e(l).removeClass("activated"),e(parent.frames.myframe.document).find(".dialog__wrapper").attr("style","display: none")):(e(parent.frames.myframe.document).find(".slide-block").slideUp(),e(m).addClass("active"),e(l).addClass("activated"),e(parent.frames.myframe.document).find(".dialog__wrapper").removeAttr("style")),0===o&&r(),o++}function r(){var t=e(parent.frames.myframe.document).find(".animate");if(0!==t.length)for(var a=0;a<t.length;a++)e(t[a]).animate({opacity:0},0).delay(2e3*(a+1)).animate({opacity:1},500)}function n(a,r){u=r.draggable,p=e(u[0]).clone().addClass("clone").appendTo(e(parent.frames.myframe.document).find(".dialog__wrapper")),u.addClass("unvisible");var n=e(f[0]).find(".dialog__item"),s=e(p[0]).find(".dialog__item");s.context.style.position="absolute",s.context.style.top=n.offset().top+"px",s.context.style.left=n.offset().left+"px",c.draggable({disabled:!0});for(var o=0;o<d.length;o++)if(e(u).attr("id")==d[o])return t.sendResult(1,100,'<p class="feedback__text">'+i[parseFloat(e(u).attr("id"))-1]+"</p>");return t.sendResult(-1,0,'<p class="feedback__text">'+i[parseFloat(e(u).attr("id"))-1]+"</p>")}function s(){e(p).remove(),e(u).removeClass("unvisible"),c=e(parent.frames.myframe.document).find(".item");for(var t=0;t<c.length;t++)if(Math.random()<.5&&0!==t){var a=e(c[t]).attr("src"),r=e(c[t]).attr("id");e(c[t]).attr("src",e.trim(e(c[t-1]).attr("src"))).attr("id",e.trim(e(c[t-1]).attr("id"))),e(c[t-1]).attr("src",e.trim(a)).attr("id",e.trim(r))}else if(t!==c.length-1){var a=e(c[t]).attr("src"),r=e(c[t]).attr("id");e(c[t]).attr("src",e.trim(e(c[t+1]).attr("src"))).attr("id",e.trim(e(c[t+1]).attr("id"))),e(c[t+1]).attr("src",e.trim(a)).attr("id",e.trim(r))}c.draggable({disabled:!1}),c.load()}var i=t.structure.pages[t.bookmark].messages,d=t.structure.pages[t.bookmark].answers.split(","),o=0,m=e(parent.frames.myframe.document).find(".slide-block__arrow");m.on("click",a);var l=e(parent.frames.myframe.document).find(".slide-block__toggle"),c=e(parent.frames.myframe.document).find(".item");c.draggable({zIndex:2,containment:"document",revert:!0});var f=e(parent.frames.myframe.document).find(".basket");f.droppable({drop:n});var p,u,g=e(parent.frames.myframe.document).find(".btn--restart");g.on("click",s),t.coursePage={play:function(){s()},stop:function(){e(m).off("click"),g.off("click"),c.draggable("destroy"),f.droppable("destroy"),t.coursePage=null},restart:function(){s()}}}(parent.jQuery,parent.ctrl),parent.ctrl.coursePage.play();
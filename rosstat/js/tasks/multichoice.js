!function(e,a,s){"use strict";function t(){p.on("click",l).addClass("disabled").attr("disabled",!0),h.on("click",d);var e="";u=s.shuffle(u);for(var a=0;a<u.length;a++)e+='<div class="page__item-wrapper1"><div class="page__item-wrapper2"><div class="page__item" right="'+u[a].right+'"><div class="page__item-before"></div><p>'+u[a].label+"</p>",e+=u[a].image.length>0?'<img src="'+u[a].image+'" class="page__item-wrapper--image"></div></div></div>':"</div></div></div>";f.empty().append(e),n=o.find(".page__item"),n.on("click",i)}function i(a){if(!w){p.attr("disabled",!1).removeClass("disabled"),"singlechoice"==m?(n.removeClass("selected"),e(this).addClass("selected")):e(this).hasClass("selected")?e(this).removeClass("selected"):e(this).addClass("selected");var s=!1;n.each(function(a,t){e(t).hasClass("selected")&&(s=!0)}),s?p.attr("disabled",!1).removeClass("disabled"):p.attr("disabled",!0).addClass("disabled")}}function r(){p.off("click"),h.off("click"),n.off("click")}function d(){w=!1,r(),t()}function l(){w=!0,n.addClass("disabled"),p.attr("disabled",!0).addClass("disabled");var s=!0,t=0,i=0;n.each(function(a,r){"true"===e(r).attr("right")&&i++,e(r).hasClass("selected")&&"true"!==e(r).attr("right")&&(s=!1),e(r).hasClass("selected")&&"true"===e(r).attr("right")&&t++}),s&&t==i?(C=1,b=100,_=g[0],c()):(C=-1,b=0,_=g[v],v++,v==g.length&&(b=2,v=1,k=!0,c())),a.sendResult(C,b,_,k)}function c(){n.each(function(a,s){e(s).removeClass("selected"),"true"==e(s).attr("right")&&e(s).addClass("show-right")})}var n,o=e(parent.frames.myframe.document),f=o.find("#task-body"),u=a.structure.pages[a.bookmark].answers,g=a.structure.pages[a.bookmark].messages,p=o.find("#btn--answer"),h=o.find("#btn--restart"),m=o.find("#task-container").attr("class"),v=1,b=0,C=-1,_="",k=!1,w=!1;a.coursePage={play:function(){t()},stop:function(){r(),a.coursePage=null},restart:function(){d()}}}(parent.jQuery,parent.ctrl,parent._),parent.ctrl.coursePage.play();
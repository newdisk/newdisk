!function(e,t){"use strict";function a(t){m.prop("disabled")===!0&&m.attr("disabled",!1).removeClass("btn--disabled"),void 0!==f&&f.innerText!==t.target.innerText&&(e(f).find(".single-choice__radio").removeClass("selected").attr("style",""),e(f).find(".single-choice__text").attr("style","")),f=t.target.parentNode,e(f).find(".single-choice__radio").addClass("selected")}function r(){m.attr("disabled",!0).addClass("btn--disabled");var a=e(f).prop("id");return a==s?(e(f).find(".single-choice__radio").attr("style","background-position: 0 -72px"),e(f).find(".single-choice__text").attr("style","color: #4B9968;"),t.sendResult(1,100,'<p class="feedback__text">'+i[a-1]+"</p>")):t.sendResult(-1,0,'<p class="feedback__text">'+i[a-1]+"</p>")}function n(){m.attr("disabled",!0).addClass("btn--disabled"),e(f).find(".single-choice__radio").removeClass("selected").attr("style",""),e(f).find(".single-choice__text").attr("style",""),f="";for(var t=o.length-1;t>0;t--){var a=Math.floor(Math.random()*(t+1)),r=o[a].text;o[a].text=o[t].text,o[t].text=r;var n=o[a].id;o[a].id=o[t].id,o[t].id=n}for(var t=0;t<d.length;t++)e(d[t]).attr("id",o[t].id),c[t].innerHTML=o[t].text}for(var i=t.structure.pages[t.bookmark].messages,s=t.structure.pages[t.bookmark].answers,d=e(parent.frames.myframe.document).find(".single-choice__wrapper"),c=e(parent.frames.myframe.document).find(".single-choice__text"),o=[],l=0;l<c.length;l++)o[l]={},o[l].text=c[l].innerText,o[l].id=e(d[l]).prop("id");var f,m=e(parent.frames.myframe.document).find(".btn--answer"),p=e(parent.frames.myframe.document).find(".btn--restart");m.attr("disabled",!0).addClass("btn--disabled");var u=e(parent.frames.myframe.document).find(".single-choice__text");u.on("click",a);var _=e(parent.frames.myframe.document).find(".single-choice__radio");_.on("click",a),m.on("click",r),p.on("click",n),t.coursePage={play:function(){n()},stop:function(){u.off("click"),_.off("click"),m.off("click"),p.off("click"),t.coursePage=null},restart:function(){n()}}}(parent.jQuery,parent.ctrl),parent.ctrl.coursePage.play();
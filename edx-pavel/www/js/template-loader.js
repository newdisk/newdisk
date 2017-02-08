;(function(){
  "use strict";

  function TemplateLoader(){
    var callbacks = []
    this.addLoadHandler = function(callback){
      callbacks.push(callback)
    }
    this.trigger = function(){
      callbacks.forEach(function(callback){
        callback()
      })
      callbacks=[]
    }
  }

  window.templateLoader = new TemplateLoader()

  document.addEventListener('DOMContentLoaded', function(){
    var param = window.location.search.slice(1).split('&')[0].split('=')[1];
    //console.log('win loc:',location)
    var reqManifest = new XMLHttpRequest();
    reqManifest.open('GET','./manifest.json', true);
    reqManifest.onload = function(){
      if(reqManifest.status >= 200 && reqManifest.status < 400){
        var manifest= JSON.parse(reqManifest.responseText);
        renderTemplate(manifest[param]);
      }else{
        console.error('Manifest not found!')
      }
    };
    reqManifest.onerror = connectionError;
    reqManifest.send();

    function connectionError(){
      console.error('Connection failed!')
    }

    function renderTemplate(param){
      var reqTemplate = new XMLHttpRequest();
      reqTemplate.open('GET','./templates/'+param.template+'.hbs', true);
      reqTemplate.onload = function(){
        if (reqTemplate.status >= 200 && reqTemplate.status < 400){
          var template = Handlebars.compile(reqTemplate.responseText);
          var elem = document.createElement('div');
          elem.innerHTML = template(param.context);
          document.body.appendChild(elem);
          window.templateLoader.trigger();
        }else{
          console.error('Template not found!')
        }
      };
      reqTemplate.onerror = connectionError;
      reqTemplate.send();
    }
  })
})()

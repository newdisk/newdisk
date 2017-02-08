'use strict';

Handlebars.registerHelper('times', function(n, block) {
  var accum = '';
  for(var i = 0; i < n; ++i)
      accum += block.fn(i);
  return accum;
});

Handlebars.registerHelper('for', function(from, to, incr, block) {
    var accum = '';
    for(var i = from; i < to; i += incr)
        accum += block.fn(i);
    return accum;
});

Handlebars.registerHelper('ifCond', function(v1, v2, options) {
  if(v1 === v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});

Handlebars.registerHelper('list', function(items, options) {
  var out = "<ul class='tree-list'>";
  //var title = options.fn(items[0]);
  //var content = options.fn(items[1]);
  console.log('items:', items)

  read(items);

  function read(val){

    for(var i=0, l=val.length; i<l; i++) {
      if (typeof(val[i].content)=='string'){
        out = out + "<li class='tree-branch'><h4 class='tree-title'>" + val[i].title + "</h4><h4>"+val[i].content+"</h4></li>";
      }else{
        out = out + "<li class='tree-branch'><h4 class='tree-title'>"+val[i].title+"</h4><ul class='tree-list'>";
        read(val[i].content);
        out +="</ul></li>"
      }
    }
  }

  return out + "</ul>";
});
// var fs = require('fs');
// var Docxtemplater = require('docxtemplater');

//Load the docx file as a binary
// var content = fs
// .readFileSync(__dirname + "/input.docx", "binary");
requirejs.config({
  baseUrl: 'bower_components/',
  paths: { // path to your app
    jquery: 'jquery/dist/jquery.min',
    docxtemplater: 'docxtemplater/build/docxtemplater-latest.min',
    jszip: 'jszip-utils/dist/jszip-utils.min',
    filesaver: 'file-saver/FileSaver.min'
  }
});

require(["jquery", "docxtemplater", "jszip", "filesaver"], function($, Docxtemplater, jszip, filesaver) {


  // fs.writeFileSync(__dirname + "/output.docx", buf);
  function _onGetFile(err, content) {
    if(err) {
      throw e
    };

    console.log('content:', content)

    doc = new Docxtemplater(content);
    doc.setData({
        "first_name": "Hipp",
        "last_name": "Edgar",
        "phone": "0652455478",
        "description": "New Website"
      }) //set the templateVariables
    doc.render() //apply them (replace all occurences of {first_name} by Hipp, ...)
    out = doc.getZip()
      .generate({
        type: "blob"
      }) //Output the document using Data-URI
    var sv = prompt('Сохранить как', 'output.docx')
    if(sv) saveAs(out, sv)
  }

  var _loadFile = function(url, callback) {
    jszip.getBinaryContent(url, callback);
  }

  $('#btn')
    .click(function() {
      _loadFile('./input.docx', _onGetFile)
    });
})



//editor.gotoLine(editor.session.getLength()+1);    test
//editor.insert("\nHello World!");
var fileName = 0;

function setLanguage(){
	var lan = document.getElementById("InputLanguage").value;
	editor.getSession().setMode("ace/mode/"+lan);
	console.log("Language changed into "+lan+".");
}

function showPosition(){
  var cursor = editor.selection.getCursor();
  alert(cursor.row+","+cursor.column);
}

function setPosition(a,b){
  editor.selection.moveTo(a,b);
}

function findWordNext(){
  var w1 = document.getElementById("Word_1").value;
  var r1 = document.getElementById("Range_1").value;
  var r2 = document.getElementById("Range_2").value;

  if(r1=="" || !r1){               //if r1 is empty,r1 = start
    r1 = 1;
  }
  if(r2=="" || !r2){               //if r2 is empty,r2 = end
    r2 = editor.session.getLength();
  }
  var rowRange = new Range(Number(r1)-1,0,Number(r2)-1,editor.selection.getLineRange(Number(r2)-1).end);
  editor.find(w1,{backwards:false,range:rowRange});
}

function findWordLast(){
  var w1 = document.getElementById("Word_1").value;
  var r1 = document.getElementById("Range_1").value;
  var r2 = document.getElementById("Range_2").value;

  if(r1=="" || !r1){
    r1 = 1;
  }
  if(r2=="" || !r2){
    r2 = editor.session.getLength();
  }
  var rowRange = new Range(Number(r1)-1,0,Number(r2)-1,editor.selection.getLineRange(Number(r2)-1).end);
  editor.find(w1,{backwards:true,range:rowRange});
}

function changeWord(){
/*    var w1 = document.getElementById("Word_1").value;
  var w2 = document.getElementById("Word_2").value;
  editor.find(w1);
  editor.replace(w2);   */
  var w2 = document.getElementById("Word_2").value;
  editor.session.replace(editor.selection.getRange(),w2);
}

function findAllWords(){
  var w1 = document.getElementById("Word_1").value;
  var r1 = document.getElementById("Range_1").value;
  var r2 = document.getElementById("Range_2").value;

  if(r1=="" || !r1){
    r1 = 1;
  }
  if(r2=="" || !r2){
    r2 = editor.session.getLength();
  }
  //console.log(r1+","+r2);
  var rowRange = new Range(Number(r1)-1,0,Number(r2)-1,editor.selection.getLineRange(Number(r2)-1).end);           /*startRow,starrColumn,endRow,endColumn*/
  editor.findAll(w1,{range:rowRange});
}

function changeAll(){
  var w1 = document.getElementById("Word_1").value;
  var w2 = document.getElementById("Word_2").value;
  var r1 = document.getElementById("Range_1").value;
  var r2 = document.getElementById("Range_2").value;

  if(r1=="" || !r1){
    r1 = 1;
  }
  if(r2=="" || !r2){
    r2 = editor.session.getLength();
  }
  var rowRange = new Range(Number(r1)-1,0,Number(r2)-1,editor.selection.getLineRange(Number(r2)-1).end);
  editor.findAll(w1,{range:rowRange});
  //editor.find(w1);
  editor.replaceAll(w2);
}

function toLine(value){
  //var line = document.getElementById("ToLine").value;
  var line = value;
  if(isNaN(line)){
    console.log('It\'s not a number!');
    return false;
  }
  else{
    var lineNum = Number(line);
    if(lineNum<0){
      console.log('It\'s smaller than zero!')
      return false;
    }
    else if(lineNum>editor.session.getLength()){
      console.log('It\'s too big!');
      return false;
    }
    else{
      editor.gotoLine(lineNum);
    }
  }
}

function autoLine(){
  if(event.keyCode == 13){                           //press enter then go to line
    var button = document.getElementById("toLine");
    button.click();
  }
}

function clearText(){
  editor.setValue("");
}

function save(){
  var content = editor.getValue();
  var blob = new Blob([content], {type: "text/plain;charset=utf-8"});
  if(fileName.length > 1 && fileName ) {
  //var lindex = fileName.lastIndexOf("fakepath\\");
  var name = fileName.substring(12);
  }
  else{
    var name = "a.txt";
  }
  console.log("Saving ");
  console.log("Saving "+ name?name:"a.txt");
  saveAs(blob, name);//saveAs(blob,filename)
  console.log("Successed");
};
//*http://jsbin.com/koxuhuduro/edit?html,js,console,output******************/


function getType(e){
  fileName = e.target.value;
  if(fileName.length > 1 && fileName ) {
  var ldot = fileName.lastIndexOf(".");
  var type = fileName.substring(ldot + 1);
  //console.log(fileName+" "+type);
  switch (type) {
    default:language = "javascript";
  }
  console.log(language);
  }
  handFile(e.target.files[0]);
}

function handFile(file){
  console.log('hand');
  var reader = new FileReader();
  reader.onload = function(e){
    editor.setValue(this.result);
  };
  reader.readAsText(file);
  editor.selection.moveTo(0,0);
}

/**************/

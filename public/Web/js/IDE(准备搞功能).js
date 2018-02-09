    function KeepShape(){
        document.getElementById("IDE").style.height= ""+document.documentElement.clientHeight-1+"px";
        document.getElementById("ProManager").style.height= ""+document.documentElement.clientHeight-52-document.getElementById("OutputArea").offsetHeight+"px";
        document.getElementById("PMrContainer").style.height= ""+document.documentElement.clientHeight-104-document.getElementById("OutputArea").offsetHeight+"px";
        document.getElementById("PMrContainer").style.width= ""+document.getElementById("ProManager").style.width+"px";
        document.getElementById("EditorCon").style.left=""+document.getElementById("ProManager").offsetWidth-1+"px";
        document.getElementById("EditorCon").style.bottom=""+document.getElementById("OutputArea").offsetHeight-1+"px";
    };
    function PMrControling(whichBox){
        switch(whichBox){
            case 1:{
                document.getElementById("PMrfileTreeLb").style.color="rgb(211,41,104)";
                document.getElementById("PMrESLb").style.color="rgb(160,210,46)";
                document.getElementById("PMrgdbSELb").style.color="rgb(160,210,46)";
                document.getElementsByClassName("PMrfileTree")[0].style.display="block";
                document.getElementsByClassName("PMrES")[0].style.display="none";
                document.getElementsByClassName("PMrgdbSE")[0].style.display="none";
                }break;
            case 2:{
                document.getElementById("PMrESLb").style.color="rgb(211,41,104)";
                document.getElementById("PMrfileTreeLb").style.color="rgb(160,210,46)";
                document.getElementById("PMrgdbSELb").style.color="rgb(160,210,46)";
                document.getElementsByClassName("PMrES")[0].style.display="block";
                document.getElementsByClassName("PMrfileTree")[0].style.display="none";
                document.getElementsByClassName("PMrgdbSE")[0].style.display="none";
                }break;
            case 3:{
                document.getElementById("PMrgdbSELb").style.color="rgb(211,41,104)";
                document.getElementById("PMrESLb").style.color="rgb(160,210,46)";
                document.getElementById("PMrfileTreeLb").style.color="rgb(160,210,46)";
                document.getElementsByClassName("PMrgdbSE")[0].style.display="block";
                document.getElementsByClassName("PMrES")[0].style.display="none";
                document.getElementsByClassName("PMrfileTree")[0].style.display="none";
                }
        }
    };
    window.onload = function(){KeepShape();PMrControling(1);};
    window.onresize = function(){KeepShape();};

/*
 treeMenu - jQuery plugin
 version: 0.4

 Copyright 2014 Stepan Krapivin

*/

(function($){
    $.fn.openActive = function(activeSel) {
        activeSel = activeSel || ".active";

        var c = this.attr("class");

        this.find(activeSel).each(function(){
            var el = $(this).parent();
            while (el.attr("class") !== c) {
                if(el.prop("tagName") === 'UL') {
                    el.show();
                } else if (el.prop("tagName") === 'LI') {
                    el.removeClass('tree-closed');
                    el.addClass("tree-opened");
                }

                el = el.parent();
            }
        });

        return this;
    }

    $.fn.treemenu = function(options) {
        options = options || {};
        options.delay = options.delay || 0;
        options.openActive = options.openActive || false;
        options.activeSelector = options.activeSelector || "";

        this.addClass("treemenu");
        this.find("> li").each(function() {
            e = $(this);
            var subtree = e.find('> ul');
            var button = e.find('span').eq(0).addClass('toggler');

            if( button.length == 0) {
                var button = $('<span>');
                button.addClass('toggler');
                e.prepend(button);
            } else {
                button.addClass('toggler');
            }

            if(subtree.length > 0) {
                subtree.hide();

                e.addClass('tree-closed');

                e.find(button).click(function() {
                    var li = $(this).parent('li');
                    li.find('> ul').slideToggle(options.delay);
                    li.toggleClass('tree-opened');
                    li.toggleClass('tree-closed');
                    li.toggleClass(options.activeSelector);
                });

                $(this).find('> ul').treemenu(options);
            } else {
                $(this).addClass('tree-empty');
            }
        });

        if (options.openActive) {
            this.openActive(options.activeSelector);
        }

        return this;
    }
})(jQuery);
$(function(){
        $(".tree").treemenu({delay:300}).openActive();
    });


/*
/////////////////////////////////////////////////////////////////////////
// Generic Resize by Erik Arvidsson                                    //
//                                                                     //
// You may use this script as long as this disclaimer is remained.     //
// See www.dtek.chalmers.se/~d96erik/dhtml/ for mor info               //
//                                                                     //
// How to use this script!                                             //
// Link the script in the HEAD and create a container (DIV, preferable //
// absolute positioned) and add the class="resizeMe" to it.            //
/////////////////////////////////////////////////////////////////////////

var theobject = null; //This gets a value as soon as a resize start

function resizeObject() {
 this.el        = null; //pointer to the object
 this.dir    = "";      //type of current resize (n, s, e, w, ne, nw, se, sw)
 this.grabx = null;     //Some useful values
 this.graby = null;
 this.width = null;
 this.height = null;
 this.left = null;
 this.top = null;
}


//Find out what kind of resize! Return a string inlcluding the directions
function getDirection(el) {
 var xPos, yPos, offset, dir;
 dir = "";

 xPos = window.event.offsetX;
 yPos = window.event.offsetY;

 offset = 8; //The distance from the edge in pixels

 if (yPos<offset) dir += "n";
 else if (yPos > el.offsetHeight-offset) dir += "s";
 if (xPos<offset) dir += "w";
 else if (xPos > el.offsetWidth-offset) dir += "e";

 return dir;
}

function doDown() {
 var el = getReal(event.srcElement, "className", "resizeMe");

 if (el == null) {
  theobject = null;
  return;
 }

 dir = getDirection(el);
 if (dir == "") return;

 theobject = new resizeObject();

 theobject.el = el;
 theobject.dir = dir;

 theobject.grabx = window.event.clientX;
 theobject.graby = window.event.clientY;
 theobject.width = el.offsetWidth;
 theobject.height = el.offsetHeight;
 theobject.left = el.offsetLeft;
 theobject.top = el.offsetTop;

 window.event.returnValue = false;
 window.event.cancelBubble = true;
}

function doUp() {
 if (theobject != null) {
  theobject = null;
 }
}

function doMove() {
 var el, xPos, yPos, str, xMin, yMin;
 xMin = 0; //The smallest width possible
 yMin = 0; //             height

 el = getReal(event.srcElement, "className", "resizeMe");

 if (el.className == "resizeMe") {
  str = getDirection(el);
 //Fix the cursor
  if (str == "") str = "default";
  else str += "-resize";
  el.style.cursor = str;
 }

//Dragging starts here
 if(theobject != null) {
  if (dir.indexOf("e") != -1)
   theobject.el.style.width = Math.max(xMin, theobject.width + window.event.clientX - theobject.grabx) + "px";

  if (dir.indexOf("s") != -1)
   theobject.el.style.height = Math.max(yMin, theobject.height + window.event.clientY - theobject.graby) + "px";

  if (dir.indexOf("w") != -1) {
   theobject.el.style.left = Math.min(theobject.left + window.event.clientX - theobject.grabx, theobject.left + theobject.width - xMin) + "px";
   theobject.el.style.width = Math.max(xMin, theobject.width - window.event.clientX + theobject.grabx) + "px";
  }
  if (dir.indexOf("n") != -1) {
   theobject.el.style.top = Math.min(theobject.top + window.event.clientY - theobject.graby, theobject.top + theobject.height - yMin) + "px";
   theobject.el.style.height = Math.max(yMin, theobject.height - window.event.clientY + theobject.graby) + "px";
  }

  window.event.returnValue = false;
  window.event.cancelBubble = true;
 }
}


function getReal(el, type, value) {
 temp = el;
 while ((temp != null) && (temp.tagName != "body")) {
  if (eval("temp." + type) == value) {
   el = temp;
   return el;
  }
  temp = temp.parentElement;
 }
 return el;
}

document.onmousedown = doDown;
document.onmouseup   = doUp;
document.onmousemove = doMove;

*/

//Add from main.js:


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

function toLine(){
  var line = document.getElementById("ToLine").value;
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

//add new:

    function KeepShape(){
        document.getElementById("IDE").style.height= ""+document.documentElement.clientHeight-1+"px";
//状态栏
        $("#PMrContainer").css("width",$("#ProManager").css("width"));

        document.getElementById("ProManager").style.height= ""+document.documentElement.clientHeight-52/*-document.getElementById("OutputArea").offsetHeight+"px"*/;
        //document.getElementById("PMrContainer").style.height= ""+document.documentElement.clientHeight-104/*-document.getElementById("OutputArea").offsetHeight+"px"*/;
        document.getElementById("PMrContainer").style.height= "100%";
        document.getElementById("PMrContainer").style.width= ""+document.getElementById("ProManager").style.width+"px";
    //代码框区域
        document.getElementById("EditorCon").style.left=""+document.getElementById("ProManager").offsetWidth-1+"px";
        document.getElementById("EditorCon").style.bottom=""+document.getElementById("toolBox").offsetHeight-1+"px";
//工具栏
	//$("#toolBox").children("div").css("width",$("#EditorCon").css("width"));
        if($("#ProManager").css("display") == "none"){
            $("#toolBox").css("left",''+2+'px');
        }else{
            $("#toolBox").css("left",parseInt($("#ProManager").css("width"))+1+'px');
        }


    };
    function PMrControling(whichBox){
        switch(whichBox){
            case 0:{
              document.getElementById("PMrfileTreeLb").style.color="rgb(211,41,104)";
              document.getElementById("PMrESLb").style.color="rgb(160,210,46)";
              document.getElementById("PMrgdbSELb").style.color="rgb(160,210,46)";
              document.getElementsByClassName("PMrfileTree")[0].style.display="none";
              document.getElementsByClassName("PMrES")[0].style.display="none";
              document.getElementsByClassName("PMrgdbSE")[0].style.display="none";
                }break;
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


/*** 以下是编辑器功能相关内容 ***/

//editor.gotoLine(editor.session.getLength()+1);    test
//editor.insert("\nHello World!");

//语言
function setLanguage(value){
  console.log("Changed language to " + value);
  if(value == "c"){value = "c_cpp"} //因为没c，所以用cpp
  editorLanguage = value;
  editor.getSession().setMode("ace/mode/"+editorLanguage);
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
    console.log('请输入数字!');
    return false;
  }
  else{
    var lineNum = Number(line);
    if(lineNum<0){
      console.log('没有小于0的行啦!')
      return false;
    }
    else if(lineNum>editor.session.getLength()){
      console.log('行数太大，没有这行！');
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

function save(f_name,f_type,f_content){
  var content = f_content;
  var blob = new Blob([content], {type: "text/plain;charset=utf-8"});

  //var name = f_type ? f_name+'.'+f_type : f_name || 'a.txt';
  var name = f_name || 'a.txt';

  console.log("Saving "+ name );
  saveAs(blob, name);//saveAs(blob,filename)
  console.log("End saving");
}
//*http://jsbin.com/koxuhuduro/edit?html,js,console,output******************/


function getType(e){
  var fileName = e.target.value;
  if(fileName.length > 1 && fileName ) {
  var ldot = fileName.lastIndexOf(".");
  var type = fileName.substring(ldot + 1);
  var lslash = fileName.lastIndexOf("\\");
  var fileName = fileName.substring(lslash + 1);

  //console.log(fileName+" "+type);
  switch (type) {
    case 'sh': editorLanguage = "sh";
      break;
    case 'c': editorLanguage = 'c';
      break;
    case 'cpp': editorLanguage = 'c_cpp';
    default:editorLanguage = "javascript";
  }
  //console.log(editorLanguage);
  }
  handFile(e.target.files[0],fileName);
  console.log('handed '+fileName);
  return fileName;
}

function handFile(file,filename){
  //tree是目录树的名字,root是根的名字
  var newNode;
  if(tree.selectedNode && tree.selectedNode.type == 'fold'){
    for(var i=0;i<tree.selectedNode.childNodes.length;i++){
      if(filename == tree.selectedNode.childNodes[i].text){
        console.log("ERROR: File has the same name existed!");
        return;
      }
    }
    newNode = tree.selectedNode.createChildNode(filename,true,'images/file.png',null,'context1','file');
  }
  else{
    for(var i=0;i<root.childNodes.length;i++){
      if(filename == root.childNodes[i].text){
        console.log("ERROR: File has the same name existed!");
        return;
      }
    }
    newNode = root.createChildNode(filename,true,'images/file.png',null,'context1','file');
  }
//单窗口遗留物
/*
  var reader = new FileReader();
  reader.onload = function(e){
    editor.setValue(this.result);
  };
  reader.readAsText(file);
  editor.selection.moveTo(0,0);

  tree.selectNode(newNode);
*/
}

function file_import(){
  var input = document.getElementById('fileInput');
  document.getElementById('fileInputTrigger').addEventListener('click',function(){input.click();});
  if(input)
  input.addEventListener('change', function(e){htmlDB.addfile("/",e);getType(e);});

}
/*** 以上是编辑器功能相关内容 ***/

//add new:
/*** jquery模块 ***/

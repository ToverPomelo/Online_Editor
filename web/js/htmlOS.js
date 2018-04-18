var getVersion=function(){
return 1;
}
var htmlDB = Object.create(null);
const htmlOS = Object.create(null);

htmlDB.init = function(){
  var request=window.indexedDB.open("htmlDB",getVersion());
  request.onsuccess=function(e){htmlDB.db=e.target.result;};
  var fileReader = new FileReader();
  request.onupgradeneeded=function(e){
    htmlDB.db=e.target.result;
    if(!htmlDB.db.objectStoreNames.contains("file")){
      var store=htmlDB.db.createObjectStore("file",{keyPath: "fileName",content:"content",info:"info"});
      store.createIndex("typeIndex","type",{unique:false});
      store.createIndex("pathIndex","path",{unique:false});
    }
    console.log("htmlDB version changed to "+getVersion());
  };

  htmlDB.findfileBYfileName = function(fileName){
    var transaction = htmlDB.db.transaction("file","readwrite");

var store = transaction.objectStore("file");

  var request = store.get(fileName);

request.onsuccess = function(){
      htmlDB.findfileBYfileName.result = request.result;
    }
  }
  htmlDB.getAllfile = function(){
    var transaction = htmlDB.db.transaction("file","readwrite");

var store = transaction.objectStore("file");

  var request = store.getAll();

request.onsuccess = function(){
      htmlDB.getAllfile.result = request.result;
    }
  }

  htmlDB.deletefileBYfileName = function(fileName){
    var transaction=htmlDB.db.transaction("file","readwrite");
    var store=transaction.objectStore("file");
    store.delete(fileName);
  }

  htmlDB.addfile = function(path,fileName){
    var file = undefined;
    if(typeof(fileName) == "object"){
      var file = fileName.target.files[0];
      fileName = file.name;
      if(fileName == undefined) fileName = "undefined";
      fileName = fileName.substring(fileName.lastIndexOf("\\")+1);
      htmlDB.findfileBYfileName(fileName);
      if(htmlDB.findfileBYfileName.result != undefined){
        var info = tipsTemplate;
        info.title = "警告";
        info.content = "<div id=\"tipsBox\" style=\"position: relative; top: 35%; left:20%; transform: translateY(-50%);\">文件已存在,确定覆盖吗</div><style>.tipsButton{float: right; margin-top: 120px; margin-right: 14px; cursor: pointer; border-radius: 6px; box-shadow: 1px 1px 5px rgba(100, 100, 100, 1); color: #FFF; } </style> <div class=\"tipsButton\"onclick=\"object=document.getElementById('tipsBox').parentNode;object.remove();htmlOS.message('triggerControlButton',object,'close');\">取消</div> <div class=\"tipsButton\" onclick=\"object=document.getElementById('tipsBox').parentNode;object.remove();htmlOS.message('triggerControlButton',object,'close');htmlDB.deletefileBYfileName('"+fileName+"');htmlDB.addfile('"+path+"','"+fileName+"');\">确定</div></htmlwindow>";
        htmlOS.start("window",info);
        return;
      }
      fileReader.readAsText(file);
      fileReader.onload = function(e){
        var filePointer = fileName.lastIndexOf(".")+1;
        var type = filePointer?fileName.substring(filePointer):undefined;
        var transaction=htmlDB.db.transaction("file","readwrite");
        var store=transaction.objectStore("file");
        var newfile={fileName:fileName,content:this.result,info:file,type:type,path:path};
        store.add(newfile);
        htmlDB.addfile.value = this.result;
        /*(function(id){
            var info=editorsTemplate;
            info.setId(id);
            htmlOS.start("window",info).set("movable");
            setEditor(id);
            editorList[id].setValue(htmlDB.addfile.value);
            editorList[id].selection.moveTo(0,0);
         })(fileName);*/
      };
    }else{
      var namePointer = fileName.lastIndexOf(".")+1;
      var type = namePointer?fileName.substring(namePointer):undefined;
      var transaction=htmlDB.db.transaction("file","readwrite");
      var store=transaction.objectStore("file");
      var newfile={fileName:fileName,content:"",info:"newfile",type:type,path:path};
      store.add(newfile);
    }
  }

  htmlDB.changefile = function(fileName){
    var transaction=htmlDB.db.transaction("file","readwrite");
    var store=transaction.objectStore("file");
    var request=store.get(fileName);
    request.onsuccess=function(e){
      var file=e.target.result;
      file.content=editorList[file.fileName].getValue();
      store.put(file);
    };
  }

  htmlDB.changefileName = function(fileName,newfileName){
    	var transaction = htmlDB.db.transaction("file","readwrite");
	var store = transaction.objectStore("file");
	var request = store.get(fileName);
	request.onsuccess = function(){
    		var transaction=htmlDB.db.transaction("file","readwrite");
    		var store=transaction.objectStore("file");
    		var newfile={fileName:newfileName,content:request.result.content,info:request.result.info,type:request.result.type,path:request.result.path};
   		store.add(newfile);
    		htmlDB.deletefileBYfileName(fileName);
  	  }
  }

  htmlDB.clean = function(){
    htmlDB.db.close();
    indexedDB.deleteDatabase("htmlDB");
  }

  htmlDB.save = function(fileName){
    var content = htmlDB.findfileBYfileName(fileName).content;
    var blob = new Blob([content], {type: "text/plain;charset=utf-8"});
    if(fileName.length > 1 && fileName ){
      saveAs(blob, name);
    }
  }
}();

htmlOS.init = function(display){
  htmlOS.process     = [];
  htmlOS.topProgram  = null;
  htmlOS.addProcess = function(htmlOSprogramInfo,programInstance){
    var controler = htmlOS.process;
    var newHandle = controler.length;
    controler.push({
      handle:newHandle,
      info:htmlOSprogramInfo,
      instance:programInstance
    });
    return newHandle;
  }
  htmlOS.message = function(type,object,detail){
         switch(type){
           case "createWindow":{
             var newProcessId       = htmlOS.addProcess(detail,object);
             object.id              = newProcessId;
           }
           case "clickWindow":{
             htmlOS.topWindow = htmlOS.display.getElementsByClassName("topHTMLwindow")[0]||htmlOS.topWindow;
             var topWindow = htmlOS.topWindow;
             if(topWindow==object) return;
             var topProgramDeep     = (topWindow)?(topWindow.style.zIndex):0;
             object.style.zIndex = (parseInt(topProgramDeep)+1);
             object.className="topHTMLwindow";
             if(topWindow) topWindow.classList.remove("topHTMLwindow");
           }break;
           case "triggerControlButton":{
             switch(detail){
               case "close":{
                 delete htmlOS.process[object.id];
               }
             }
           }break;
         }
       };

  htmlOS.display = Object.create(null);
  if(typeof(display)==="string"){
    htmlOS.display = document.getElementById(display);
    htmlOS.display.name = display;
  }
  if(typeof(display)==="object"){
    htmlOS.display = display;
    name = display.id||"display";
  }
  htmlOS.display.on       = function(){htmlOS.display.style.visibility="visible"};
  htmlOS.display.off      = function(){htmlOS.display.style.visibility="hidden"};
  htmlOS.display.style.overflow="hidden";
  htmlOS.topProgram=Object.create(null);
  htmlOS.topProgram.instance=htmlOS.display;

  htmlOS.start = function(htmlOSprogramType,htmlOSprogramInfo){
    if(typeof(htmlOSprogramType)!=="string"){
      console.log("Error: The first argument(should be typeName of htmlOSprogram) using in function \"htmlOS.start\" is not a string");
      return;
    }
    if(typeof(htmlOSprogramInfo)!=="object"){
      console.log("Error: The second argument(should be infomation of htmlOSprogram) using in function \"htmlOS.start\" is not a object");
      return;
    }
    switch(htmlOSprogramType){
      case "window":{
        var newWindow=createHTMLwindow(htmlOSprogramInfo);
        htmlOS.display.appendChild(newWindow);
        return newWindow;
      }break;

      default:{
        console.log("Error: NO this htmlOSprogramType(\""+htmlOSprogramType+"\"),but you can try to use newProgramType() to create it");
      }break;
    }
  }
}


function controlButton(object,close,maximize,minimize){
  if(typeof(object)!=="object") return;
  if(typeof(close)!=="boolean") close=true;
  if(typeof(maximize)!=="boolean") maximize=true;
  if(typeof(minimize)!=="boolean") minimize=true;
  if((close===false)&&(maximize===false)&&(minimize===false)){
    if(typeof(object.getElementsByTagName("ControlButton")[0])=="node")object.removeChild(object.getElementsByTagName("ControlButton")[0]);
    return;
  }else{
    if(!object.getElementsByTagName("controlButton")[0]){
      var control = document.createElement("ControlButton");
      var type=['close','maximize','restore','minimize'];
      var typeIcon=['×','□','❐','-']
      for(var i in type){
        control[type[i]]=document.createElement(type[i]);
        control[type[i]].className="ControlButton";
        control[type[i]].innerHTML=typeIcon[i];
        control.appendChild(control[type[i]]);
        control[type[i]].onclick = function(){htmlOS.message("triggerControlButton",object,type[i])};
      }
      control.objectRecord = Object.create(null);
      object.close=function(){
        object.remove();
        htmlOS.message("triggerControlButton",object,"close");
      };
      control['close'].addEventListener("click",object.close);
      object.maximize=function(){
        if(control.objectRecord.now==="min"){
          control['restore'].click();
        }
        control.objectRecord.left = object.style.left;
        control.objectRecord.top = object.style.top;
        control.objectRecord.width = object.style.width;
        control.objectRecord.height = object.style.height;
        control.objectRecord.move = object.move;
        control.objectRecord.now = "max";
        object.move=null;
        control.parentNode.style.width="calc(100% + 2px)";
        control.parentNode.style.height="calc(100% + 2px)";
        control.parentNode.getElementsByTagName("div")[0].style.height="calc(100% - 22px)";
        control.parentNode.style.left="-1px";
        control.parentNode.style.top="-1px";
        if(control.info.maximize)control["maximize"].style.display="none";
        if(control.info.minimize)control["minimize"].style.display="inline-block";
        control["restore"].style.display="inline-block";
        htmlOS.message("triggerControlButton",object,"maximize");
      };
      control['maximize'].addEventListener("click",object.maximize);
      object.minimize=function(){
        if(control.objectRecord.now==="max"){
          control['restore'].click();
        }
        control.objectRecord.left = object.style.left;
        control.objectRecord.top = object.style.top;
        control.objectRecord.width = object.style.width;
        control.objectRecord.height = object.style.height;
        control.objectRecord.now = "min";
        control.parentNode.style.zIndex+=100000;
        control.parentNode.style.width="150px";
        control.parentNode.style.height="17px";
        if(control.info.maximize)control["maximize"].style.display="inline-block";
        if(control.info.minimize)control["minimize"].style.display="none";
        control["restore"].style.display="inline-block";
        if(control.objectRecord.mleft){
          control.parentNode.style.left=control.objectRecord.mleft;
          control.parentNode.style.top=control.objectRecord.mtop;
        }
        htmlOS.message("triggerControlButton",object,"minimize");
      };
      control['minimize'].addEventListener("click",object.minimize);
      object.restore=function(){
        if(control.objectRecord.now==="min"){
          control.objectRecord.mleft=control.parentNode.style.left;
          control.objectRecord.mtop=control.parentNode.style.top;
          control.objectRecord.now="normal";
          control.parentNode.style.zIndex-=100000;
        }else{
          object.move=control.objectRecord.move;
          control.objectRecord.now="normal";
        };
        if(control.info.maximize)control["maximize"].style.display="inline-block";
        if(control.info.minimize)control["minimize"].style.display="inline-block";
        control["restore"].style.display="none";
        control.parentNode.style.width=control.objectRecord.width;
        control.parentNode.style.height=control.objectRecord.height;
        control.parentNode.style.left=control.objectRecord.left;
        control.parentNode.style.top=control.objectRecord.top;
        htmlOS.message("triggerControlButton",object,"restore");
      };
      control['restore'].addEventListener("click",object.restore);
      object.getElementsByTagName("titleBar")[0].addEventListener("dblclick",function(){
              if(control.objectRecord.now==="normal") control['maximize'].click();
              else control['restore'].click();
            });
      object.appendChild(control);
      control.info=Object.create(null);
    }
  }
  var control=object.getElementsByTagName("ControlButton")[0];
  control.info.close    = close;
  control.info.maximize = maximize;
  control.info.restore  = false;
  control.info.minimize = minimize;
  control.getElementsByTagName("restore")[0].style.display="none";
  control["close"].style.display=(close)?("inline-block"):("none");
  control["maximize"].style.display=(maximize)?("inline-block"):("none");
  control["minimize"].style.display=(minimize)?("inline-block"):("none");
}



function movable(object,trigger,bool){
  if(typeof(object)!=="object") return;
  if(typeof(object.style)!=="object") return;
  if(typeof(trigger)!=="object") return;
  if(typeof(bool)!=="boolean") bool=true;
  if(bool){
    if(!object.moveTrigger)object.moveTriggers=[];
    object.moveTriggers.push(trigger);
    if(trigger.mousedown) return;
    object.move=function(x,y){
           if(((typeof(x)!=="string")&&(typeof(x)!=="number"))||
              ((typeof(y)!=="string")&&(typeof(y)!=="number"))){
             if((typeof(x)!=="object")||x.button!==0) return;
             var event = x;
             var cursorRecord = Object.create(null);
             cursorRecord.X = event.clientX;
             cursorRecord.Y = event.clientY;
             var objectRecord = Object.create(null);
             objectRecord.X = parseInt(object.style.left);
             objectRecord.Y = parseInt(object.style.top);
             var move=function(e){
               if(x.button!==0)return;
               object.style.left = (objectRecord.X-cursorRecord.X+e.clientX)+"px";
               object.style.top  = (objectRecord.Y-cursorRecord.Y+e.clientY)+"px";
               htmlOS.message("move",object);};
             htmlOS.display.addEventListener("mousemove",move);
             htmlOS.display.addEventListener("mouseup",function moveup(){
               htmlOS.display.removeEventListener("mousemove",move);
               htmlOS.display.removeEventListener("mouseup",moveup);
             });
           }else{
             object.style.left = parseInt(x)+"px";
             object.style.top  = parseInt(y)+"px";
             htmlOS.message("move",object);
           }
         };
    trigger.style.cursor="move";
    trigger.mousedown=function(e){object.move(e)}
    trigger.addEventListener("mousedown",trigger.mousedown);
  }else{
    trigger.removeEventListener("mousedown",trigger.mousedown);
    trigger.mousedown=null;
    var size=object.moveTriggers.length;
    for (var i=0;i<size;i++){
      if(object.moveTriggers[i]===trigger){
        object.moveTriggers[i]=object.moveTriggers[0];
        trigger.style.cursor="default";
        object.moveTriggers.shift();
        break;
      }
    }
    if(!object.moveTriggers.length){
      delete object.move;
      delete object.moveTriggers;
    }
  }
}


function resizable(object,bool){
  if(typeof(object)!=="object") return;
  if(typeof(object.style)!=="object") return;
  if(typeof(bool)!=="boolean") bool=true;
  var type=['w','n','e','s','nw','ne','se','sw'];
  if(bool){
    if(object.resize) return;
    object.resize=function(width,height){
          if(((typeof(width)!=="string")&&(typeof(width)!=="number"))||
             ((typeof(height)!=="string")&&(typeof(height)!=="number"))){
          if((typeof(width)!=="string")||(typeof(height)!=="object")||height.button!==0) return;
          var event = height;
          event.preventDefault();
          var cursorRecord = Object.create(null);
          cursorRecord.X = event.clientX;
          cursorRecord.Y = event.clientY;
          var objectRecord = Object.create(null);
          objectRecord.left = parseInt(object.style.left);
          objectRecord.top = parseInt(object.style.top);
          objectRecord.width = parseInt(object.style.width);
          objectRecord.height = parseInt(object.style.height);
          var resizeType=width;
          var div=object.childNodes[1];
          var move=function(e){
              switch (resizeType) {
                case "w_resize":{
                  var deltaX = e.clientX - cursorRecord.X;
                  var newLeft = objectRecord.left + deltaX;
                  var newWidth = objectRecord.width - deltaX;
                    object.style.left = "" + newLeft + "px";
                    object.style.width = "" + newWidth + "px"
                  }break;
                case "n_resize":{
                    var deltaY = e.clientY - cursorRecord.Y;
                    var newTop = objectRecord.top + deltaY;
                    var newHeight = objectRecord.height - deltaY;
                    object.style.top = "" + newTop + "px";
                    object.style.height = "" + newHeight + "px";
                    div.style.height= "" + (newHeight-22) + "px";
                  }break;
                case "e_resize":{
                    var deltaX = e.clientX - cursorRecord.X;
                    var newWidth = objectRecord.width + deltaX;
                    object.style.width = "" + newWidth + "px";
                  }break;
                case "s_resize":{
                    var deltaY = e.clientY - cursorRecord.Y;
                    var newHeight = objectRecord.height + deltaY;
                    object.style.height = "" + newHeight + "px";
                    div.style.height= "" + (newHeight-22) + "px";
                  }break;
                case "nw_resize":{
                    var deltaX = e.clientX - cursorRecord.X;
                    var deltaY = e.clientY - cursorRecord.Y;
                    var newLeft = objectRecord.left + deltaX;
                    var newTop = objectRecord.top + deltaY;
                    var newWidth = objectRecord.width - deltaX;
                    var newHeight = objectRecord.height - deltaY;
                    object.style.left = "" + newLeft + "px";
                    object.style.top = "" + newTop + "px";
                    object.style.width = "" + newWidth + "px";
                    object.style.height = "" + newHeight + "px";
                    div.style.height= "" + (newHeight-22) + "px";
                  }break;
                case "ne_resize":{
                    var deltaX = e.clientX - cursorRecord.X;
                    var deltaY = e.clientY - cursorRecord.Y;
                    var newTop = objectRecord.top + deltaY;
                    var newWidth = objectRecord.width + deltaX;
                    var newHeight = objectRecord.height - deltaY;
                    object.style.top = "" + newTop + "px";
                    object.style.width = "" + newWidth + "px";
                    object.style.height = "" + newHeight + "px";
                    div.style.height= "" + (newHeight-22) + "px";
                  }break;
                case "se_resize":{
                    var deltaX = e.clientX - cursorRecord.X;
                    var deltaY = e.clientY - cursorRecord.Y;
                    var newWidth = objectRecord.width + deltaX;
                    var newHeight = objectRecord.height + deltaY;
                    object.style.width = "" + newWidth + "px";
                    object.style.height = "" + newHeight + "px";
                    div.style.height= "" + (newHeight-22) + "px";
                  }break;
                case "sw_resize":{
                    var deltaX = e.clientX - cursorRecord.X;
                    var deltaY = e.clientY - cursorRecord.Y;
                    var newLeft = objectRecord.left + deltaX;
                    var newWidth = objectRecord.width - deltaX;
                    var newHeight = objectRecord.height + deltaY;
                    object.style.left = "" + newLeft + "px";
                    object.style.width = "" + newWidth + "px";
                    object.style.height = "" + newHeight + "px";
                    div.style.height= "" + (newHeight-22) + "px";
                  }break;
                }
                htmlOS.message("resize", object);
              };
          htmlOS.display.addEventListener("mousemove",move);
          htmlOS.display.addEventListener("mouseup",function resizeup(e){
            htmlOS.display.removeEventListener("mousemove",move);
            htmlOS.display.removeEventListener("mouseup",resizeup);
          });
        }else{
          object.style.width  = parseInt(width)+"px";
          object.style.height = parseInt(height)+"px";
          htmlOS.message("resize", object);
        }
      };
    var resizeTrigger=[];
    for (var i in type){
      resizeTrigger[type[i]]=document.createElement(type[i]+"_resizeTrigger");
      object.appendChild(resizeTrigger[type[i]]);
      resizeTrigger[type[i]].onmousedown=function(type){
                                                  return function(e){
                            object.resize(type+"_resize",e)};
                                                }(type[i]);
    };
  }else{
    for (var i in type){

    }
    delete object.resize;
  }
}

function createHTMLwindow(htmlOSprogramInfo){
  var info=htmlOSprogramInfo;
  var display=htmlOS.display;
  var newWindow=document.createElement("HTMLwindow");
  newWindow.style.height=(parseInt(info.height)||(display.offsetHeight * 0.7))+"px";
  newWindow.style.width=(parseInt(info.width)||(display.offsetWidth * 0.54))+"px";
  newWindow.style.left=(parseInt(info.left)||(display.offsetWidth * 0.12))+"px";
  newWindow.style.top=(parseInt(info.top)||(display.offsetHeight * 0.13))+"px";
  newWindow.innerHTML="<titlebar>"+(info.title||"")+"</titlebar>";
  var div=document.createElement("div");
  div.style.height=((parseInt(info.height)-22)||((display.offsetHeight * 0.7)-22))+"px";
  newWindow.appendChild(div);
  if(typeof(info.content)==="object"){div.appendChild(info.content);
  }else div.innerHTML+=info.content;
  controlButton(newWindow,info.closable,info.maximizable,info.minimizable);
  resizable(newWindow,info.resizable);
  newWindow.info=info;
  newWindow.set= function(attribute,value){
            switch(attribute){
              case "movable":{
                movable(this,(arguments[1]||this.getElementsByTagName("titleBar")[0]||this),arguments[2]);
                newWindow.info.resizable=(arguments[2]==false)?false:true;
              }break;
              case "resizable":{
                newWindow.info.resizable=(value==false)?false:true;
                resizable(this,value);
              }break;
              case "title":{
                newWindow.getElementsByTagName("titleBar")[0].innerHTML=value;
              }break;
            }
          }
  newWindow.addEventListener("mousedown",function(){htmlOS.message("clickWindow",newWindow,null)});
  htmlOS.message("createWindow",newWindow,info);
  return newWindow;
}

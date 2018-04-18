const htmlDB = Object.create(null);
const htmlOS = Object.create(null);

htmlOS.init = function(display){
  htmlOS.process     = [];
  htmlOS.topProgram  = null;
  htmlOS.addProcess =function(htmlOSprogramInfo,programInstance){
    var controler = htmlOS.process;
    var newHandle     = controler.length;
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
    object.removeChild(object.getElementsByTagName("ControlButton")[0]);
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
window.alert(object.move);
window.alert(control.objectRecord.move);
        control.objectRecord.now = "max";
        object.move=null;
        control.parentNode.style.width="calc(100% + 2px)";
        control.parentNode.style.height="calc(100% + 2px)";
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
                    object.style.height = "" + newHeight + "px"
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
                    object.style.height = "" + newHeight + "px"
                  }break;
                case "ne_resize":{
                    var deltaX = e.clientX - cursorRecord.X;
                    var deltaY = e.clientY - cursorRecord.Y;
                    var newTop = objectRecord.top + deltaY;
                    var newWidth = objectRecord.width + deltaX;
                    var newHeight = objectRecord.height - deltaY;
                    object.style.top = "" + newTop + "px";
                    object.style.width = "" + newWidth + "px";
                    object.style.height = "" + newHeight + "px"
                  }break;
                case "se_resize":{
                    var deltaX = e.clientX - cursorRecord.X;
                    var deltaY = e.clientY - cursorRecord.Y;
                    var newWidth = objectRecord.width + deltaX;
                    var newHeight = objectRecord.height + deltaY;
                    object.style.width = "" + newWidth + "px";
                    object.style.height = "" + newHeight + "px"
                  }break;
                case "sw_resize":{
                    var deltaX = e.clientX - cursorRecord.X;
                    var deltaY = e.clientY - cursorRecord.Y;
                    var newLeft = objectRecord.left + deltaX;
                    var newWidth = objectRecord.width - deltaX;
                    var newHeight = objectRecord.height + deltaY;
                    object.style.left = "" + newLeft + "px";
                    object.style.width = "" + newWidth + "px";
                    object.style.height = "" + newHeight + "px"
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
  newWindow.innerHTML="<titlebar>"+(info.title||"")+"</titlebar>";
  if(typeof(info.content)==="object"){newWindow.appendChild(info.content);
  }else newWindow.innerHTML+=info.content;
  newWindow.style.height=(parseInt(info.height)||(display.offsetHeight * 0.7))+"px";
  newWindow.style.width=(parseInt(info.width)||(display.offsetWidth * 0.54))+"px";
  newWindow.style.left=(parseInt(info.left)||(display.offsetWidth * 0.12))+"px";
  newWindow.style.top=(parseInt(info.top)||(display.offsetHeight * 0.13))+"px";
  controlButton(newWindow,info.close,info.maximizable,info.minimizable);
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
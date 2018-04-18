editorsTemplate=Object.create(null);
editorsTemplate.id="main.cpp";
editorsTemplate.setId=function(id){
  editorsTemplate.id=id;
  editorsTemplate.title=editorsTemplate.id+" - Editor";

  editorsTemplate.content="<pre id=\""+editorsTemplate.id+"\" class=\"editor\">\n<textarea class=\"ace_text-input\">\n#include <iostream>\nint main(){\n    \n    \n    return 0;\n}\n</textarea>\n</pre>\n";
}
editorsTemplate.setId(editorsTemplate.id);
editorsTemplate.height="488.6px";
editorsTemplate.width=692.28;
editorsTemplate.left=153.84;
editorsTemplate.top=90.74;
editorsTemplate.minimizable=true;
editorsTemplate.maximizable=true;
editorsTemplate.closable=true;
editorsTemplate.resizable=true;

tipsTemplate=Object.create(null);

tipsTemplate.title="提示";

tipsTemplate.content="<style>tipsButton{float:right; margin-right: 14px; margin-top: 125px; padding: 2px 5px;box-shadow: 1px 1px 5px rgba(100, 100, 100, 1);border-radius: 6px;cursor: pointer;}</style><tipsButton onclick=\"tipsCancle()\">取消</tipsButton><tipsButton onclick=\"tipsConfirm()\">确定</tipsButton>";
tipsTemplate.height=200;
tipsTemplate.width=400;
tipsTemplate.left=document.getElementById("IDE").offsetWidth*0.2;
tipsTemplate.top=200;
tipsTemplate.minimizable=false;
tipsTemplate.maximizable=false;
tipsTemplate.closable=false;
tipsTemplate.resizable=false;
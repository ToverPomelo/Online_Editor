(function(){
/*document.getElementById("IDE").innerHTML+="<input type=\"file\" id=\"fileInput\" style=\"display:none\">"*/
document.getElementById("fileInputTrigger").addEventListener("click",function(){document.getElementById('fileInput').click();});
document.getElementById("fileInput").addEventListener('change', function(e){htmlDB.addfile("/",e)});
})();

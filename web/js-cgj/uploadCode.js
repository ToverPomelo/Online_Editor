/**
 * Created by chenguojin on 2018/3/14.
 */

function upload() {
    alert('teset3');
    alert(editor.getValue());
    loadXMLDoc();
    alert('teset1');
}

function loadXMLDoc()
{
    var xmlhttp;
    if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp=new XMLHttpRequest();
    }
    else
    {// code for IE6, IE5
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange=function()
    {
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
        {
            alert('xml-http请求失败-0101');
        }
    }


    //xmlhttp.open("POST","http://localhost:8080/SCNU/uploadCode",true);
    xmlhttp.open("POST","uploadCode",true);
    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xmlhttp.send("file="+editor.getValue());

    //获取上传代码后的返回值
    // var b = xmlhttp.responseText;
    // console.log(b+"____");
    // console.log(xmlhttp.responseText);
    // if(b == "done"){
    //     alert("done！");
    // }else{
    //     alert("false！");
    // }

    xmlhttp.onreadystatechange = function(){
        if(xmlhttp.readyState == 4){
            if(xmlhttp.status == 200){
                console.log(xmlhttp.responseText);
                document.getElementById("help").innerHTML=xmlhttp.responseText;
                alert(xmlhttp.responseText);
            } else {
                console.log(xmlhttp.status);
            }
        }
    }
}


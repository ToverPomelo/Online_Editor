
//Tree Context Menu Structure
var contex_menu = {
	'context1' : {
		elements : [
			{
				text : '打开文件',
				icon: 'images/leaf.png',
				action : function(node) {
					(function(id){
						if(typeof( editorList[id]) == "object" ) return;
						var transaction = htmlDB.db.transaction("file","readwrite");
						var store = transaction.objectStore("file");
						var request = store.get(id);
						request.onsuccess = function(){
							var info=editorsTemplate;
							info.setId(id);
							htmlOS.start("window",info).set("movable");
							setEditor(id);
							editorList[id].setValue(request.result.content);
							editorList[id].selection.moveTo(0,0);

							editor = editorList[id];
						}
						//if(node.content!=null) editorList[id].setValue(node.content);
					})(node.text);
				},
				type: 'file'
			},
			{
				text : '导出文件',
				icon: 'images/redo.png',
				action : function(node) {
					var transaction = htmlDB.db.transaction("file","readwrite");
					var store = transaction.objectStore("file");
					var request = store.get(node.text);
					request.onsuccess = function(){
						console.log(request.result.content);
						save(node.text,node.fileType,request.result.content);
					}
				},
				type: 'file'
			},
			{
				text : '新建文件夹',
				icon: 'images/add1.png',
				action : function(node) {
					var name = prompt("请输入文件名","New fold");
					if(!name || name=="") name = "New fold";
					var no_name = 0;
					var index = Number(0);
					var filename = name;
					while(no_name == 0)
					{
						if(index!=0)
						filename = name+"("+index+")";
						no_name = 1;
						for(var i=0;i<node.childNodes.length;i++){
							if(filename == node.childNodes[i].text){
								no_name = 0;
							}
						}
						index++;
					}
					console.log("new fold: "+filename);
					var newnode = node.createChildNode('Created',true,'images/folder.png',null,'context1','fold');
					newnode.setText(filename);
				},
				type: 'fold'
			},
			{
				text : '新建文件',
				icon: 'images/add1.png',
				action : function(node) {
					var name = prompt("请输入文件名","New file");
					if(!name || name=="") name = "New file";
					var no_name = 0;
					var index = Number(0);
					var filename = name;
					while(no_name == 0)
					{
						if(index!=0)
						filename = name+"("+index+")";
						no_name = 1;
						for(var i=0;i<node.childNodes.length;i++){
							if(filename == node.childNodes[i].text){
								no_name = 0;
							}
						}
						index++;
					}
					var newnode = node.createChildNode('Created',true,'images/file.png',null,'context1','file');
					newnode.setText(filename);
					console.log("new file: "+newnode.getPath());
					htmlDB.addfile(newnode.getPath(),filename);
					newnode.content = "";
				},
				type: 'fold'
			},
			{
				text : '删除文件夹',
				icon: 'images/delete.png',
				action : function(node) {
					var DB_remove_fold = function(n){
						if(n.id=="root" && n.type=="fold") return;
						for(var i=0;i<n.childNodes.length;i++){
							if(n.childNodes[i].type == "file"){
								htmlDB.deletefileBYfileName(n.childNodes[i]);
							}
							else if(n.childNodes[i].type == "fold"){
								//递归
								DB_remove_fold(n.childNodes[i])
							}
						}
						htmlDB.deletefileBYfileName(n);
					}
					DB_remove_fold(node);
					console.log(node.childNodes);
					node.removeNode();
				},
				type: 'fold'
			},
			{
				text : '清空文件夹',
				icon: 'images/clear.png',
				action : function(node) {
					node.removeChildNodes();
				},
				type: 'fold'
			},
			{
				text : '删除文件',
				icon: 'images/delete.png',
				action : function(node) {
					(function(fileName){
						var transaction=htmlDB.db.transaction("file","readwrite");
						var store=transaction.objectStore("file");
						store.delete(fileName);
					})(node.text);
					node.removeNode();

					htmlDB.deletefileBYfileName(node.text);
				},
				type: 'file'
			},
			{
				text : '展开',
				icon: 'images/leaf.png',
				action : function(node) {
					node.expandNode();
				},
				topLine: true,
				type: 'fold'
			},
			{
				text : '展开所有',
				icon: 'images/tree.png',
				action : function(node) {
					node.expandSubtree();
				},
				type: 'fold'
			},
			{
				text : '折叠',
				icon: 'images/leaf.png',
				action : function(node) {
					node.collapseNode();
				},
				type: 'fold'
			},
			{
				text : '折叠所有',
				icon: 'images/tree.png',
				action : function(node) {
					node.collapseSubtree();
				},
				type: 'fold'
			},
			{
				text : '重命名',
				icon: 'images/pencil.png',
				action : function(node) {
					var name = node.text;
					var filename = prompt("请输入文件名",node.text);
					if(filename && filename!="")
					{
						node.setText(filename);
						htmlDB.changefileName(name,filename);
					}
				},
				type: 'file'
			},
			{
				text : '重命名',
				icon: 'images/pencil.png',
				action : function(node) {
					var name = node.text;
					var filename = prompt("请输入文件名",node.text);
					if(filename && filename!="")
					{
						node.setText(filename);
						//标记一下：改文件时应该递归更改子文件路径
						//htmlDB.changefileName(name,filename);
					}
				},
				type: 'fold'
			}
		]
	}
};
//以上都是重定义右键

//Setting custom events
/*tree.nodeBeforeOpenEvent = function(node) {
console.log(": Before expand event");
}

tree.nodeAfterOpenEvent = function(node) {
console.log(": After expand event");
}

tree.nodeBeforeCloseEvent = function(node) {
console.log(": Before collapse event");
}*?


/*************************** 下面是正文 ******************************/

///// Creating the tree component
// p_div: ID of the div where the tree will be rendered;
// p_backColor: Background color of the region where the tree is being rendered;
// p_contextMenu: Object containing all the context menus. Set null for no context menu;
function createTree(p_div,p_backColor,p_contextMenu) {
	var tree = {
		name: 'tree',
		div: p_div,
		ulElement: null,
		childNodes: [],
		backcolor: p_backColor,
		contextMenu: p_contextMenu,
		selectedNode: null,
		selectedFold: null,
		nodeCounter: 0,
		contextMenuDiv: null,
		rendered: false,
		///// Creating a new node
		// p_text: Text displayed on the node;
		// p_expanded: True or false, indicating wether the node starts expanded or not;
		// p_icon: Relative path to the icon displayed with the node. Set null if the node has no icon;
		// p_parentNode: Reference to the parent node. Set null to create the node on the root;
		// p_tag: Tag is used to store additional information on the node. All node attributes are visible when programming events and context menu actions;
		// p_contextmenu: Name of the context menu, which is one of the attributes of the p_contextMenu object created with the tree;
		createNode: function(p_text,p_expanded, p_icon, p_parentNode,p_tag,p_contextmenu,p_type,p_id) {
			v_tree = this;
			node = {
				id: p_id || 'node_' + this.nodeCounter,
				text: p_text,
				icon: p_icon,
				parent: p_parentNode,
				expanded : p_expanded,
				childNodes : [],
				tag : p_tag,
				contextMenu: p_contextmenu,
				elementLi: null,
				type: p_type || 'file',    //file or fold
				fileType: null,
				content: null,
				///// Removing the node and all its children
				removeNode: function() { v_tree.removeNode(this); },
				///// Expanding or collapsing the node, depending on the expanded value
				toggleNode: function(p_event) { v_tree.toggleNode(this); },
				///// Expanding the node
				expandNode: function(p_event) { v_tree.expandNode(this); },
				///// Expanding the node and its children recursively
				expandSubtree: function() { v_tree.expandSubtree(this); },
				///// Changing the node text
				// p_text: New text;
				setText: function(p_text) {
					var filename = p_text;
					if(this.id == 'root'){
						console.log("Can't rename root!");
						return;
					}
					for(var i=0;i<this.parent.childNodes.length;i++){
						if(filename == this.parent.childNodes[i].text){
							alert("同名文件已存在！");
							console.log("File has the same name existed!");
							return;
						}
					}
					v_tree.setText(this,filename); },
					//得到路径
					getPath: function()
					{
						if(this.id == "root")
						return "";
						var path = this.parent.getPath()+ "/" + this.text;
						return path;
					},
					///// Collapsing the node
					collapseNode: function() { v_tree.collapseNode(this); },
					///// Collapsing the node and its children recursively
					collapseSubtree: function() { v_tree.collapseSubtree(this); },
					///// Deleting all child nodes
					removeChildNodes: function() { v_tree.removeChildNodes(this); },
					///// Creating a new child node;
					// p_text: Text displayed;
					// p_expanded: True or false, indicating wether the node starts expanded or not;
					// p_icon: Icon;
					// p_tag: Tag;
					// p_contextmenu: Context Menu;

					//add:copy
					copyChildNode: function(c_node){
						var new_node = this.createChildNode(c_node.text,c_node.expanded,c_node.icon,c_node.tag,c_node.contextmenu,c_node.type);
						for(var i=0;i<c_node.childNodes.length;i++)
						{
							new_node.copyChildNode(c_node.childNodes[i]);
						}
					} ,

					//I have changed this! :
					createChildNode: function(p_text,p_expanded,p_icon,p_tag,p_contextmenu,p_type) {
						type = p_type || 'fold';
						if(this.type == 'fold'){
							return v_tree.createNode(p_text,p_expanded,p_icon,this,p_tag,p_contextmenu,type);
						}
					}
				}

				//file type:
				var ldot = node.text.lastIndexOf(".");
				node.fileType = ldot>0 ? node.text.substring(ldot + 1) : null;
				//console.log(node.fileType);

				this.nodeCounter++;

				if (this.rendered) {
					if (p_parentNode==undefined) {
						this.drawNode(this.ulElement,node);
						this.adjustLines(this.ulElement,false);
					}
					else {
						var v_ul = p_parentNode.elementLi.getElementsByTagName("ul")[0];
						if (p_parentNode.childNodes.length==0) {
							if (p_parentNode.expanded) {
								p_parentNode.elementLi.getElementsByTagName("ul")[0].style.display = 'block';
								v_img = p_parentNode.elementLi.getElementsByTagName("img")[0];
								v_img.style.visibility = "visible";
								v_img.src = 'images/collapse.png';
								v_img.id = 'toggle_off';
							}
							else {
								p_parentNode.elementLi.getElementsByTagName("ul")[0].style.display = 'none';
								v_img = p_parentNode.elementLi.getElementsByTagName("img")[0];
								v_img.style.visibility = "visible";
								v_img.src = 'images/expand.png';
								v_img.id = 'toggle_on';
							}
						}
						this.drawNode(v_ul,node);
						this.adjustLines(v_ul,false);
					}
				}

				if (p_parentNode==undefined) {
					this.childNodes.push(node);
					node.parent=this;
				}
				else
				p_parentNode.childNodes.push(node);

				tree.InitHerf();

				return node;
			},
			///// Render the tree;
			drawTree: function() {

				this.rendered = true;

				var div_tree = document.getElementById(this.div);
				div_tree.innerHTML = '';

				ulElement = createSimpleElement('ul',this.name,'tree');
				this.ulElement = ulElement;

				for (var i=0; i<this.childNodes.length; i++) {
					this.drawNode(ulElement,this.childNodes[i]);
				}

				div_tree.appendChild(ulElement);

				this.adjustLines(document.getElementById(this.name),true);

			},
			///// Drawing the node. This function is used when drawing the Tree and should not be called directly;
			// p_ulElement: Reference to the UL tag element where the node should be created;
			// p_node: Reference to the node object;
			drawNode: function(p_ulElement,p_node) {

				v_tree = this;

				var v_icon = null;

				if (p_node.icon!=null)
				v_icon = createImgElement(null,'icon_tree',p_node.icon);

				var v_li = document.createElement('li');
				p_node.elementLi = v_li;

				var v_span = createSimpleElement('span',null,'node');

				var v_exp_col = null;

				if (p_node.childNodes.length == 0) {
					v_exp_col = createImgElement('toggle_off','exp_col','images/collapse.png');
					v_exp_col.style.visibility = "hidden";
				}
				else {
					if (p_node.expanded) {
						v_exp_col = createImgElement('toggle_off','exp_col','images/collapse.png');
					}
					else {
						v_exp_col = createImgElement('toggle_on','exp_col','images/expand.png');
					}
				}

				v_span.ondblclick = function() {
					v_tree.doubleClickNode(p_node);
				};

				//add for drag
				v_span.addEventListener("mouseenter",function() {
					tree.TargetDOM&&v_tree.selectFold(p_node);
				});

				v_span.addEventListener("mousedown",function() {
					v_tree.selectNode(p_node);
				});
				//end add

				v_exp_col.onclick = function() {
					v_tree.toggleNode(p_node);
				};

				v_span.onclick = function() {
					v_tree.selectNode(p_node);
				};

				v_span.oncontextmenu = function(e) {
					v_tree.selectNode(p_node);
					v_tree.nodeContextMenu(e,p_node);
				};

				if (v_icon!=undefined)
				v_span.appendChild(v_icon);

				v_a = createSimpleElement('a',null,null);
				v_a.innerHTML=p_node.text;
				v_span.appendChild(v_a);
				v_li.appendChild(v_exp_col);
				v_li.appendChild(v_span);

				p_ulElement.appendChild(v_li);

				var v_ul = createSimpleElement('ul','ul_' + p_node.id,null);
				v_li.appendChild(v_ul);

				if (p_node.childNodes.length > 0) {

					if (!p_node.expanded)
					v_ul.style.display = 'none';

					for (var i=0; i<p_node.childNodes.length; i++) {
						this.drawNode(v_ul,p_node.childNodes[i]);
					}
				}
			},
			///// Changing node text
			// p_node: Reference to the node that will have its text updated;
			// p_text: New text;
			setText: function(p_node,p_text) {
				p_node.elementLi.getElementsByTagName('span')[0].lastChild.innerHTML = p_text;
				p_node.text = p_text;
			},
			///// Expanding all tree nodes
			expandTree: function() {
				for (var i=0; i<this.childNodes.length; i++) {
					if (this.childNodes[i].childNodes.length>0) {
						this.expandSubtree(this.childNodes[i]);
					}
				}
			},
			///// Expanding all nodes inside the subtree that have parameter 'p_node' as root
			// p_node: Subtree root;
			expandSubtree: function(p_node) {
				this.expandNode(p_node);
				for (var i=0; i<p_node.childNodes.length; i++) {
					if (p_node.childNodes[i].childNodes.length>0) {
						this.expandSubtree(p_node.childNodes[i]);
					}
				}
			},
			///// Collapsing all tree nodes
			collapseTree: function() {
				for (var i=0; i<this.childNodes.length; i++) {
					if (this.childNodes[i].childNodes.length>0) {
						this.collapseSubtree(this.childNodes[i]);
					}
				}
			},
			///// Collapsing all nodes inside the subtree that have parameter 'p_node' as root
			// p_node: Subtree root;
			collapseSubtree: function(p_node) {
				this.collapseNode(p_node);
				for (var i=0; i<p_node.childNodes.length; i++) {
					if (p_node.childNodes[i].childNodes.length>0) {
						this.collapseSubtree(p_node.childNodes[i]);
					}
				}
			},
			///// Expanding node
			// p_node: Reference to the node;
			expandNode: function(p_node) {
				if (p_node.childNodes.length>0 && p_node.expanded==false) {
					if (this.nodeBeforeOpenEvent!=undefined)
					this.nodeBeforeOpenEvent(p_node);

					var img=p_node.elementLi.getElementsByTagName("img")[0];

					p_node.expanded = true;

					img.id="toggle_off";
					img.src = 'images/collapse.png';
					elem_ul = img.parentElement.getElementsByTagName("ul")[0];
					elem_ul.style.display = 'block';

					if (this.nodeAfterOpenEvent!=undefined)
					this.nodeAfterOpenEvent(p_node);
				}
			},
			///// Collapsing node
			// p_node: Reference to the node;
			collapseNode: function(p_node) {
				if (p_node.childNodes.length>0 && p_node.expanded==true) {
					var img=p_node.elementLi.getElementsByTagName("img")[0];

					p_node.expanded = false;
					if (this.nodeBeforeCloseEvent!=undefined)
					this.nodeBeforeCloseEvent(p_node);

					img.id="toggle_on";
					img.src = 'images/expand.png';
					elem_ul = img.parentElement.getElementsByTagName("ul")[0];
					elem_ul.style.display = 'none';

				}
			},
			///// Toggling node
			// p_node: Reference to the node;
			toggleNode: function(p_node) {
				if (p_node.childNodes.length>0) {
					if (p_node.expanded)
					p_node.collapseNode();
					else
					p_node.expandNode();
				}
			},
			///// Double clicking node
			// p_node: Reference to the node;
			doubleClickNode: function(p_node) {
				if(p_node.type == "fold")
				this.toggleNode(p_node);
				else if(p_node.type == "file")
				{
					//打开文件
					(function(id){
						if(typeof( editorList[id]) == "object" ) return;
						var transaction = htmlDB.db.transaction("file","readwrite");
						var store = transaction.objectStore("file");
						var request = store.get(id);
						request.onsuccess = function(){
							var info=editorsTemplate;
							info.setId(id);
							htmlOS.start("window",info).set("movable");
							setEditor(id);
							editorList[id].setValue(request.result.content);
							editorList[id].selection.moveTo(0,0);

							editor = editorList[id];
						}
						//if(node.content!=null) editorList[id].setValue(node.content);
					})(node.text);
				}
			},
			///// Selecting node
			// p_node: Reference to the node;
			selectNode: function(p_node) {
				var span = p_node.elementLi.getElementsByTagName("span")[0];
				span.className = 'node_selected';
				if (this.selectedNode!=null && this.selectedNode!=p_node)
				this.selectedNode.elementLi.getElementsByTagName("span")[0].className = 'node';
				this.selectedNode = p_node;
			},
			///// Selecting fold
			// p_node: Reference to the node;
			selectFold: function(p_node) {
				var span = p_node.elementLi.getElementsByTagName("span")[0];
				span.className = 'node_selected';
				if (this.selectedFold!=null && this.selectedFold!=p_node)
				this.selectedFold.elementLi.getElementsByTagName("span")[0].className = 'node';
				this.selectedFold = p_node;
			},
			///// Deleting node
			// p_node: Reference to the node;
			removeNode: function(p_node) {

				if(p_node.id == 'root'){
					console.log("Can't remove root!");
					return;
				}

				var index = p_node.parent.childNodes.indexOf(p_node);

				if (p_node.elementLi.className=="last" && index!=0) {
					p_node.parent.childNodes[index-1].elementLi.className += "last";
					p_node.parent.childNodes[index-1].elementLi.style.backgroundColor = this.backcolor;
				}

				p_node.elementLi.parentNode.removeChild(p_node.elementLi);
				p_node.parent.childNodes.splice(index, 1);

				if (p_node.parent.childNodes.length==0) {
					var v_img = p_node.parent.elementLi.getElementsByTagName("img")[0];
					v_img.style.visibility = "hidden";
				}

			},
			///// Deleting all node children
			// p_node: Reference to the node;
			removeChildNodes: function(p_node) {

				if (p_node.childNodes.length>0) {
					var v_ul = p_node.elementLi.getElementsByTagName("ul")[0];

					var v_img = p_node.elementLi.getElementsByTagName("img")[0];
					v_img.style.visibility = "hidden";

					p_node.childNodes = [];
					v_ul.innerHTML = "";
				}
			},
			///// Rendering context menu when mouse right button is pressed over a node. This function should no be called directly
			// p_event: Event triggered when right clicking;
			// p_node: Reference to the node;
			nodeContextMenu: function(p_event,p_node) {
				if (p_event.button==2) {
					p_event.preventDefault();
					p_event.stopPropagation();
					if (p_node.contextMenu!=undefined) {

						v_tree = this;

						var v_menu = this.contextMenu[p_node.contextMenu];

						var v_div;
						if (this.contextMenuDiv==null) {
							v_div = createSimpleElement('ul','ul_cm','file-tree-menu');
							//set the menu to the top
							v_div.style.zIndex = '1000';
							//set background color
							v_div.style.background = '#383838';
							//set cloor
							v_div.style.color = 'white';

							document.body.appendChild(v_div);
						}
						else
						v_div = this.contextMenuDiv;

						v_div.innerHTML = '';

						var v_left = p_event.pageX-5;
						var v_right = p_event.pageY-5;

						v_div.style.display = 'block';
						v_div.style.position = 'absolute';
						v_div.style.left = v_left + 'px';
						v_div.style.top = v_right + 'px';

						for (var i=0; i<v_menu.elements.length; i++) (function(i){

							var v_li = createSimpleElement('li',null,null);
							//I add:
							if(v_menu.elements[i].type != undefined && v_menu.elements[i].type==p_node.type){
								v_li.style.display = 'list-item';
							}
							else if(v_menu.elements[i].type != undefined){
								v_li.style.display = 'none';
							}

							if(v_menu.elements[i].topLine == true)
							{
								v_li.style.borderTop = '1px solid #aaa';
							}
							if(v_menu.elements[i].bottomLine == true)
							{
								v_li.style.borderBottom = '1px solid #aaa';
							}
							//end add!

							var v_span = createSimpleElement('span',null,null);
							v_span.onclick = function () {  v_menu.elements[i].action(p_node) };

							var v_a = createSimpleElement('a',null,null);
							var v_ul = createSimpleElement('ul',null,'file-tree-submenu');

							v_a.appendChild(document.createTextNode(v_menu.elements[i].text));

							v_li.appendChild(v_span);

							if (v_menu.elements[i].icon!=undefined) {
								var v_img = createImgElement('null','null',v_menu.elements[i].icon);
								v_li.appendChild(v_img);
							}

							v_li.appendChild(v_a);
							v_li.appendChild(v_ul);
							v_div.appendChild(v_li);

							if (v_menu.elements[i].submenu!=undefined) {
								var v_span_more = createSimpleElement('div',null,null);
								v_span_more.appendChild(createImgElement(null,'file-tree-menu_img','images/right.png'));
								v_li.appendChild(v_span_more);
								v_tree.contextMenuLi(v_menu.elements[i].submenu,v_ul,p_node);
							}

						})(i);

						this.contextMenuDiv = v_div;

					}
				}
			},
			///// Recursive function called when rendering context menu submenus. This function should no be called directly
			// p_submenu: Reference to the submenu object;
			// p_ul: Reference to the UL tag;
			// p_node: Reference to the node;
			contextMenuLi : function(p_submenu,p_ul,p_node) {
				v_tree = this;

				for (var i=0; i<p_submenu.elements.length; i++) (function(i){

					var v_li = createSimpleElement('li',null,null);
					//I add:
					if(p_submenu.elements[i].type != undefined && p_submenu.elements[i].type==p_node.type){
						v_li.style.display = 'list-item';
					}
					else if(p_submenu.elements[i].type != undefined){
						v_li.style.display = 'none';
					}

					if(p_submenu.elements[i].topLine == true)
					{
						v_li.style.borderTop = '1px solid #aaa';
					}
					if(p_submenu.elements[i].bottomLine == true)
					{
						v_li.style.borderBottom = '1px solid #aaa';
					}
					//end add!

					var v_span = createSimpleElement('span',null,null);
					v_span.onclick = function () {  p_submenu.elements[i].action(p_node) };

					var v_a = createSimpleElement('a',null,null);
					var v_ul = createSimpleElement('ul',null,'file-tree-submenu');

					v_a.appendChild(document.createTextNode(p_submenu.elements[i].text));

					v_li.appendChild(v_span);

					if (p_submenu.elements[i].icon!=undefined) {
						var v_img = createImgElement('null','null',p_submenu.elements[i].icon);
						v_li.appendChild(v_img);
					}

					v_li.appendChild(v_a);
					v_li.appendChild(v_ul);
					p_ul.appendChild(v_li);

					if (p_submenu.elements[i].p_submenu!=undefined) {
						var v_span_more = createSimpleElement('div',null,null);
						v_span_more.appendChild(createImgElement(null,'file-tree-menu_img','images/right.png'));
						v_li.appendChild(v_span_more);
						v_tree.contextMenuLi(p_submenu.elements[i].p_submenu,v_ul,p_node);
					}

				})(i);
			},
			///// Adjusting tree dotted lines. This function should not be called directly
			// p_node: Reference to the node;
			adjustLines: function(p_ul,p_recursive) {
				var tree = p_ul;

				var lists = [];

				if (tree.childNodes.length>0) {
					lists = [ tree ];

					if (p_recursive) {
						for (var i = 0; i < tree.getElementsByTagName("ul").length; i++) {
							var check_ul = tree.getElementsByTagName("ul")[i];
							if (check_ul.childNodes.length!=0)
							lists[lists.length] = check_ul;
						}
					}

				}

				for (var i = 0; i < lists.length; i++) {
					var item = lists[i].lastChild;

					while (!item.tagName || item.tagName.toLowerCase() != "li") {
						item = item.previousSibling;
					}

					item.className += "last";
					item.style.backgroundColor = this.backcolor;

					item = item.previousSibling;

					if (item!=null)
					if (item.tagName.toLowerCase() == "li") {
						item.className = "";
						item.style.backgroundColor = 'transparent';
					}
				}
			},

			//Add dragging
			TargetDOM:null, //储存当前拖拽的DOM对象引用
			t_flag: 1, //记录鼠标放上去是否足够一秒
			InitHerf: function(){ //传递一个DOM对象，给其中的a添加mouseover和mouseout事件
				var o = document.getElementById(p_div);
				var v=o.getElementsByTagName('span'),L=v.length,E;
				while(L--){
					(E=v[L]).onmousedown=function(){tree.DragBegin(this)};
					E.onmouseenter=function(){tree.t_flag=0;tree.TargetDOM&&setTimeout("tree.t_flag=1;tree.expandNode(tree.selectedFold);",1000);};
					E.onmouseover=function(){tree.TargetDOM&&tree.DragOver(this);};
					E.onmouseout=function(){tree.TargetDOM&&tree.DragOut(this)};
					E.onmouseup=function(){tree.DragOut(this);tree.DragEnd(this);};
				}
			},
			DragOver:function(o){
				o.style.backgroundColor='#888';
				o.style.color='#FFF';
			},
			DragOut:function(o){
				o.style.backgroundColor='';
				o.style.color='';
			},
			DragBegin:function(o){
				tree.TargetDOM=o;
			},
			DragEnd:function(o){
				var TargetDOM=tree.TargetDOM,pTNode=TargetDOM.parentNode,
				pNode=o.parentNode,v=pTNode.getElementsByTagName('span'),L=v.length;
				switch(true){
					case TargetDOM==o:
					//这里写点击链接后发生的事件
					break;
					case pNode==pTNode.parentNode.parentNode:
					console.log('无法移动，目标文件夹与源文件夹相同!');
					break;
					default:
					while(L--){
						if(v[L]==o){
							console.log('不能移动到子目录下!');
							o.style.backgroundColor='';
							o.style.color='';
							tree.TargetDOM=null;
							return;
						}
					}
					switch(tree.t_flag){
						case 1:if(tree.selectedFold.type == 'fold'){
							tree.expandNode(tree.selectedFold);
							//(v=pNode.getElementsByTagName('ul')).length? //目标文件夹下有ul,添加自己到ul里最后
							//v[0].appendChild(pTNode):(pNode.appendChild(document.createElement('ul'))).appendChild(pTNode);
							tree.selectedFold.copyChildNode(tree.selectedNode);
							tree.selectedNode.removeNode();

							break;
						}

						default:	if(pTNode == pTNode.parentNode.lastChild && pTNode.previousSibling){
							pTNode.previousSibling.style.backgroundColor = '#1b1f1e';
							pTNode.previousSibling.setAttribute("class", "last");
						}
						insertAfter(pTNode,pNode);
						//Matain
						if(pTNode == pTNode.parentNode.lastChild){
							pTNode.style.backgroundColor = '#1b1f1e';
							pTNode.setAttribute("class", "last");
						}
						else{
							pTNode.style.backgroundColor = 'transparent';
							pTNode.setAttribute("class", "");
						}

						if(pTNode.nextSibling){
							if(pTNode.nextSibling == pTNode.nextSibling.parentNode.lastChild){
								pTNode.nextSibling.style.backgroundColor = '#1b1f1e';
								pTNode.nextSibling.setAttribute("class", "last");
							}
							else{
								pTNode.nextSibling.style.backgroundColor = 'transparent';
								pTNode.nextSibling.setAttribute("class", "");
							}
						}

						if(pNode == pNode.parentNode.lastChild){
							pNode.style.backgroundColor = '#1b1f1e';
							pNode.setAttribute("class", "last");
						}
						else{
							pNode.style.backgroundColor = 'transparent';
							pNode.setAttribute("class", "");
						}

						break;
					}

				}
				tree.TargetDOM=null;
			}
			//End adding dragging

		}

		window.onclick = function(o) {
			if (tree.contextMenuDiv!=null)
			tree.contextMenuDiv.style.display = 'none';
		}

		return tree;
	}

	// Helper Functions

	//Create a HTML element specified by parameter 'p_type'
	function createSimpleElement(p_type,p_id,p_class) {
		element = document.createElement(p_type);
		if (p_id!=undefined)
		element.id = p_id;
		if (p_class!=undefined)
		element.className = p_class;
		return element;
	}

	//Create img element
	function createImgElement(p_id,p_class,p_src) {
		element = document.createElement('img');
		if (p_id!=undefined)
		element.id = p_id;
		if (p_class!=undefined)
		element.className = p_class;
		if (p_src!=undefined)
		element.src = p_src;
		return element;
	}

	//http://www.jb51.net/article/28533.htm
	function insertAfter(newElement, targetElement){
		var parent = targetElement.parentNode;
		if (parent.lastChild == targetElement) {
			// 如果最后的节点是目标元素，则直接添加。因为默认是最后
			parent.appendChild(newElement);
		}
		else {
			parent.insertBefore(newElement, targetElement.nextSibling);
			//如果不是，则插入在目标元素的下一个兄弟节点 的前面。也就是目标元素的后面
		}
	}

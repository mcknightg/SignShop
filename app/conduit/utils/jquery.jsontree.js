jQuery.widget("aka.jsontree",{
    options:{root:'json', data:{},displayValue:false,displayKeys:[]},
    selectedNode:null,
    _create: function() {
        var self = this;
        this.element.html(this._parseNode(this.options.root,this.options.data));
        this._initBindings();
     //   this._closeAll();
        this._selectNode( this.element.children('ol.je-node:first').children('.je-key:first').children('.je-key-input:first'));
    },
    _setOption: function( key, value ) {
        this.options[ key ] = value;
        this._update();
    },
    _update: function() {
        this.element.html(this._parseNode(this.options.root,this.options.data));
    },
    _initBindings:function(){
        var self = this;
        var elmid = this.element.attr('id');
        if(elmid){elmid = '#'+ elmid + ' '; }else{elmid ='';}
        jQuery(elmid + '.je-tree-toggle').unbind('click').bind('click', function () {
            self.toggleNode(this);
        });
       jQuery(elmid + '.je-key-input').unbind('click').bind('click', function () {
            self._selectNode(this);
        });
        jQuery(elmid + '.je-key-input').unbind('dblclick').bind('dblclick', function () {
                   self._dblClickNode(this);
        });
        jQuery(elmid + '.je-tree-node-icon').unbind('click').bind('click', function () {
            self._selectNode(jQuery(this).nextAll('.je-key:first').children('.je-key-input:first'));
        });
    },

    _parseNode:function(key, node) {
        var children=[];
        var count= 0;
        for (var i in node) {

                var el=node[i];
                console.log("Type == " + typeof(el));
                if (typeof(el)==='function'){}
                else if (typeof(el)==='object'){} //children.push(this._parseNode(i, el));
                //else if (typeof(el)==='string' || typeof(el)==='number') {children.push(this._parseLeaf(i, el));}
                else {children.push(this._parseLeaf(i, el));}
                count++;

        }
        var html = '';

            html += '<ol class="je-node" path="' + key + '">';
            html += '<span class="fa fa-plus-square-o je-tree-toggle"></span>';
            html += '<span class="je-tree-node-closed-icon je-tree-node-icon"></span>';

            html += '<span class="je-key"><span class="je-key-input" >' + this.getDisplayKey(key) + '</span></span>';
            html += '<span class="je-tree-badge">' + count + '</span>';

            //html+='<ol class="je-children">'+children.join('')+'</ol>';
            html += '<ol class="je-children"></ol>';
            html += '</ol>';

        return html;
    },
    getDisplayKey:function(key){
        if(this.options.displayKeys){
            var displayKey = this.options.displayKeys[key];
            if(displayKey){
                return  displayKey;
            }
        }

       return key;
    },
    _isHTML:function (str) {
        var a = document.createElement('div');
        a.innerHTML = str;
        for (var c = a.childNodes, i = c.length; i--; ) {
            if (c[i].nodeType == 1) return true;
        }
        return false;
    },
    _parseLeaf:function(key, val) {

        var html = '';

            html +='<li class="je-leaf" path="' + key + '">';
            html+='<span class="je-tree-leaf-node-icon"></span>';
            html+='<span class="fa fa-leaf je-tree-leaf-icon je-tree-node-icon"></span>';
            html+='<span class="je-key"><span class="je-key-input" >'+this.getDisplayKey(key)+'</span></span>';
            if(this.options.displayValue){
                if(this._isHTML(val)){
                     val = "HTML";
                }
                html+='<span class="je-connector">:</span>';
                html+='<span class="je-val"><span class="je-val-input">'+val+'</span></span>';
            }
            html+='</li>';


        return html;
    },
    _selectNode:function(node) {

        if(this.selectedNode){
            jQuery(this.selectedNode).css('background-color', 'transparent');
            jQuery(this.selectedNode).css('color', 'white');
            jQuery(this.selectedNode).removeClass('selectedTreeNode');
        }
        this.selectedNode = node;
     //   jQuery(this.selectedNode).css('background-color', '#234599');
        jQuery(this.selectedNode).css('color', 'orange');
        jQuery(this.selectedNode).addClass('selectedTreeNode');
        var path = this.getPath(jQuery(this.selectedNode));
        var json = this.getValue(path);

        this._trigger("onSelectNode",path,{path:path,json:json});
    },
    _dblClickNode:function(node) {
            if(this.selectedNode){
                jQuery(this.selectedNode).css('background-color', 'white');
                jQuery(this.selectedNode).css('color', 'black');
            }
            this.selectedNode = node;
            jQuery(this.selectedNode).css('background-color', '#234599');
            jQuery(this.selectedNode).css('color', 'white');
            var path = this.getPath(jQuery(this.selectedNode));
            var json = this.getValue(path);
            var nodename = jQuery(this.selectedNode).html();
            this._trigger("onDoubleClickNode",null,{path:path,json:json,nodename:nodename});
        },
    _closeAll:function(node){
        var nodes = null;
        if(!node){nodes =jQuery('span.je-tree-minus-icon');}
        else{nodes = jQuery(node).nextAll('span.je-tree-minus-icon')}
        jQuery.each(nodes,function(i,selectnode){
            jQuery(selectnode).removeClass('fa fa-minus-square-o').addClass('fa fa-plus-square-o').nextAll('ol.je-children:first').hide();
        });
    },
    destroy:function(){
        if(this.selectedNode){this.selectedNode=null;}
        if(this.options.data){this.options.data=null;}
        this.element.html("");
        jQuery.Widget.prototype.destroy.call( this );
    },
    setValue :function(path,value){
        try {
            if(value instanceof Object){eval("this.options.data" + path + " = " + value );}
            else{eval("this.options.data" + path + " = '" + value + "'");}
        }catch(e){
            alert("Unable to set Tree value at this.options.data" + path + " To " + JSON.stringify(value) + e);
        }
    },
    getValue : function(path){
        if(!path || path === ''){return this.options.data;}
        else{ return eval("this.options.data" + path);}
    },
    getPath:function(node){
        var path = new Array();
        while(node){
            var key = node.attr('path');
            node = node.parent();
            if(typeof key !== 'undefined' && key !== false){
                if(key !== this.options.root){path.push('[\'' + key + '\']');}
                else{node = null;}
            }
        }
        return path.reverse().join('');
    },

    treeNodeForPath:function(path){
         var self = this;
     
        var selector  = null;
        jQuery.each(path.split(']['),function(){
            var node = self.nodeForPath(path);
            if(!selector && node.is(":visible")){
                selector = node;
            }else{
                path = path.substring(0, path.lastIndexOf('['));
            }
        });
         if(!selector){
             selector = self.nodeForPath('[Source]');
         }
        return selector;

    },
    nodeForPath:function(path){
        var selector = path.replace(/\[/g,'[path=');
        selector = selector.replace(/\]\[/g,']>*>[');

        return jQuery(this.element).find(selector).children(".je-key:first");
        //return jQuery(selector).children(".je-key:first");
    },
    toggleNode:function(node) {

        if (jQuery(node).hasClass('fa fa-plus-square-o')) {

            var children=[];
            var nodepath = this.getPath(jQuery(node));
            var val =this.getValue(nodepath);
            for (var i in val) {
                var el=val[i];
                if (typeof(el)==='function'){}
                else if (typeof(el)==='object'){children.push(this._parseNode(i, el));}
                else  {children.push(this._parseLeaf(i, el));}  //if (typeof(el)==='string' || typeof(el)==='number')
            }
            jQuery(node).nextAll('.je-children:first').html(children.join(''));

            this._initBindings();
            jQuery(node).toggleClass('fa fa-plus-square-o').toggleClass('fa fa-minus-square-o').nextAll('ol.je-children:first').show();
        } else {
            jQuery(node).toggleClass('fa fa-minus-square-o').toggleClass('fa fa-plus-square-o').nextAll('ol.je-children:first').hide();

        }
        this._trigger("onToggleNode",'toggle',{});
    }
})(jQuery);
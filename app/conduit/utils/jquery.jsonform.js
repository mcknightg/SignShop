$.widget("aka.jsonform",{
    options:{root:'json', data:{},displayValue:true,displayKeys:[],search:'',node_search:''},
    _create: function() {
        this.element.html(this._parseNode(this.options.root,this.options.data));
    },
    _setOption: function( key, value ) {
        this.options[ key ] = value;
        this._update();
    },
    _update: function() {
        this.element.html(this._parseNode(this.options.root,this.options.data));
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
    destroy:function(){
        if(this.options.data){this.options.data=null;}
        this.element.html("");
        $.Widget.prototype.destroy.call( this );
    },
    setValue :function(path,value){
        try {
            if(value instanceof Object){eval("this.options.data" + path + " = " + value );}
            else{eval("this.options.data" + path + " = '" + value + "'");}
        }catch(e){
            alert("Unable to set Form value at this.options.data" + path + " To " + JSON.stringify(value) + e);
        }

    },
    getValue : function(path){
        if(!path || path === ''){return this.options.data;}
        else {return eval("this.options.data" + path);}
    },
    isValidLeaf:function(leaf){
        return leaf && leaf.text() !== '';
    },
    getPath:function(node){
        //if(this.isValidLeaf(node)){
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
        //}
        //return '';
    },

    nodeForPath:function(path){
        var selector =  path.replace(/\[/g,'[path=').replace(/\]\[/g,']>*>[');
        return $(this.element).find(selector).children(".key:first");
    },
    _isHTML:function (str) {
        var a = document.createElement('div');
        a.innerHTML = str;
        for (var c = a.childNodes, i = c.length; i--; ) {
            if (c[i].nodeType == 1) return true;
        }
        return false;
    },
    _parseNode:function(key, node,node_label) {
        var html = '';
        var type = typeof(node);

        var label = key; //key.substring(key.lastIndexOf('.')+1, key.length);
        label = label.substring(key.lastIndexOf(':')+1, key.length);

        switch (type) {
            case  'function':
                break;
            case 'object':
                var children = new Array();
                    html +='<ol path="' + key + '"class="node">';
                    html +='<span  class="key node_key">' + this.getDisplayKey(label)  + '</span>';
                    for (var i in node) { children.push(this._parseNode(i, node[i],label));}
                    html+='<ol class="children">'+children.join('')+'</ol>';
                    html+='</ol>';
                break;

            default:
                if(this.options.search == '' ||   label.indexOf(this.options.search) > -1 ){
                    if(this.options.node_search == '' || (node_label && node_label.indexOf(this.options.node_search) > -1) ){
                        html +='<li class="leaf fa fa-leaf" path="' + key + '">';
                        html += '<span class="key">' + this.getDisplayKey(label)  + '</span>';
                        if( this.options.displayValue){
                            if(this._isHTML(node)){
                                node = "HTML";
                            }
                            html +=':<span class="' + type + ' edit">' + node + '</span>';
                        }
                        html +='</li>';
                    }
                }
                break;
        }
        return html;
    }
})(jQuery);

var SnippetContainer = Snippet.extend({
    init:function(name,kind){
        this._super( name,kind);
        this.klass="SnippetContainer";
        this.height = 100;
        this.snippets = [];
        this._id = null;
        this.private.sessionvars = {
            id:null,
            name:null
        }
    },
    addSessionVars:function($scope) {
        this.private.sessionvars = jQuery.extend(this.private.sessionvars,$scope);
    },
    isComponentContainer:function(){return true;},
    move:function(old_index, new_index){
        this.snippets.move(old_index,new_index);
    },
    snippetIndex:function(id){
        for (var i = 0; i < this.snippets.length; i++) {
            var snippet = this.snippets[i];
            if (snippet.snip_id === id) {return i;}
        }
        return null;
    },
    listByKlass:function(klass,array){
        if(!array){
            array = [];
        }
        for (var i = 0; i < this.snippets.length; i++) {
            var snippet = this.snippets[i];
            if (snippet.klass === klass) {
                array.push(snippet);
            }
            if (snippet.isContainer()) {
                snippet.listByKlass(klass, array);
            }
        }
        return array;
    },
    listForms:function(){
        return this.listByKlass('SnippetForm');
    },
    findFieldsByEndpoint:function(endpoint,array){
        for (var i = 0; i < this.snippets.length; i++) {
            var snippet = this.snippets[i];
            if (snippet.isContainer()) {
                snippet.findFieldsByEndpoint(endpoint, array);
            }else{
                if (snippet.findEndPoint() === endpoint) {
                    array.push(snippet);
                }
            }
        }
    },
    renderContainer:function(){
        var that = this;
        var container = jQuery('<div></div>');

        if(this.edit_mode){
            container.addClass('container-padding');
            container.css('min-height',this.height).css('height',"100%").attr('id',this.snip_id).addClass('selectable').addClass('sortable');//.css('border','1px solid gray');
            if(that.snippets.length <1){
                if(!that.parent){
                    container.html(jQuery('<h2>Drag and Drop Or Double Click a Snippet</h2>').css('color','lightgray').css('text-align','center'));
                } else{
                    container.html(jQuery('<h4>Empty</h4>').css('color','lightgray').css('text-align','center'));
                }
            }
        }
        if(!this.edit_mode){
            container.find(":hasClassStartingWith('editable-')").alterClass('editable-*');
        }
        return container;
    },
    afterRender:function(){
        jQuery.each(this.snippets,function(index,snippet){
            try{
                snippet.afterRender();
            }catch(e){
              alert(e);
            }

        });
        this._super();
    },
    render:function(elm){
        var that = this;
        var container = this.renderContainer();

        jQuery.each(this.snippets,function(index,snippet){
            if(!snippet){
                that.snippets.splice(index, 1);
            }else{
                container.append(snippet.render());
            }
        });
        
        if(elm){
            elm = jQuery(elm).html(container);
            this.afterRender();
            return elm;
        }
        return container;
    },
    compileCSS:function(){
        var that = this;
        var styles  = {};
        jQuery.each(this.snippets,function(index,snippet){
            if(!snippet){
                that.snippets.splice(index, 1);
            }else{
                styles = $.extend(styles,snippet.compileCSS());
            }
        });
        return styles;
    },
    add : function(snippet,above) {
        try {
            if(snippet.snip_id){
                snippet.setParent(this);
                this.snippets.push(snippet);
                if(above){
                    this.snippets.move(this.snippets.length-1,0);
                }
                return this;
            }
        }catch(e){
            console.log(e);
            console.log(snippet);
        }
    },
    setEditMode:function(edit_mode){
        this.edit_mode = edit_mode;
        jQuery.each(this.snippets,function(index,snippet){
            snippet.setEditMode(edit_mode);
        });
    },
    remove:function(snippet2remove){
        if(snippet2remove.klass === 'SnippetCol' && snippet2remove.parent){
             this.remove({klass:'SnippetRow',snip_id:snippet2remove.parent});
        } else{
            for (var i = 0; i < this.snippets.length; i++) {
                var snippet = this.snippets[i];

                if (snippet2remove.snip_id ===  snippet.snip_id) {this.snippets.splice(i, 1);}
                else if (snippet.isContainer()) {
                    snippet.remove(snippet2remove);
                }
            }
        }

    },
    
    getByName:function (name) {
        var ret = null;
        if (name === this.name) { return this;}
        else {
            for (var i = 0; i < this.snippets.length; i++) {
                var snippet = this.snippets[i];
                if (snippet.name === name) {return snippet;}
                if (snippet.isContainer()) {
                    //console.log(snippet);
                    ret = snippet.getByName(name);
                    if (ret !== null) {return ret;}
                }
            }
        }
        return ret;
    },
    getById:function (id) {
        var ret = null;
        if (id === this.snip_id) { return this;}
        else {
            for (var i = 0; i < this.snippets.length; i++) {
                var snippet = this.snippets[i];
                if (snippet.snip_id === id) {return snippet;}
                if (snippet.isContainer()) {
                    ret = snippet.getById(id);
                    if (ret !== null) {return ret;}
                }
            }
        }
        return ret;
    },
    clone:function(){
        return this.loadObject(this);
    },
    save:function(){
        return JSON.stringify(this,this.privateVariables);
    },
    saveObject:function(){
        return JSON.parse(this.save());
    },
    load:function(json) {
        var obj = JSON.parse(json);
        return this.loadObject(obj);
    },
    loadObject:function(obj){
        var newObj = eval("new " + obj.klass + "()");
        var item = jQuery.extend(newObj,obj);
        if(obj['_id']){
            item._id = obj['_id'];
        }
        if(item.isContainer()){
            item.snippets = [];
            item.loadChildren(obj);
        }
       
        return item;
    },
    loadChildren:function(container){
        var that = this;
        jQuery.each(container.snippets,function(index,snippet){
            if(snippet && snippet.klass){
                var item = eval("new " + snippet.klass + "()");
                jQuery.extend(true,item,snippet);
                if(item.isContainer()){
                    item.snippets = [];
                    item.loadChildren(snippet);
                }
                that.add(item);
            }
        });
    }
});


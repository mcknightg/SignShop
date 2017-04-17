var counter = 0;
var snippetTypes = new SnippetTypes();
var Snippet =  Class.extend({
    init:function(name,kind){
        this.name = name;
        this.kind = kind;
        this.klass="Snippet";
        this.category = "misc";
        this.icon = "fa fa-edit";
        //for rendering
        this.css = null;
        this.template = "<div></div>";
        this.properties = this.getPropertyDefaults();
        // will not be included in serialization
        this.snip_id =  'snippet_' + counter++;
        this.edit_mode = true;
        this.parent = null;
        this.private = {
            parent:undefined
        };

    },
    //used by json.stringify() to omit certain properties based on conditions
    privateVariables:function (key, value) {
        if(key=='snip_id' || key=='edit_mode' || key=='parent' || key=='private' || key=='service') {
            return undefined;
        }
        if(key=='_id' || key=='css'){
             if(!value){
                 return undefined;
             }
        }
        return value;
    },
    afterRender:function(){
        var self = this;
        self.resize();
        jQuery(window).on('load resize', function(){
            self.resize();
        });
        //this.execute();

    },
    findForm:function(){
        var parent = this.private.parent;
        while(parent){
            if(parent && parent.klass === 'SnippetForm' && parent.properties && parent.properties.endpoint){
                return parent;
            }else{
                parent = parent.private.parent;
            }
        }
        return null;
    },
    findEndPoint:function(){
        var parent = this.private.parent;
        while(parent){
            if(parent && parent.properties && parent.properties.endpoint){
                return parent.properties.endpoint;
            }else{
                parent = parent.private.parent;
            }
        }
    },
    resize:function(){
        if(this.properties.marginleft){
            var form = jQuery('#' + this.snip_id);
            var width = $(window).width(), height = $(window).height();
            if(width > 768){
                form.css('margin-left',this.properties.marginleft);
            }else{
                form.css('margin-left','0px');
            }
        }
    },
    isEditMode:function(){
        
    },
    getProperties:function(){
         return this.properties;
    },
    getPropertyDefaults:function(){
        var ret = {};
        if(document.getElementById("temp") instanceof Element){
            var schema = this.schema();
            if(schema){
                try{
                    var editor = new JSONEditor(document.getElementById("temp"),{'schema':schema});
                    ret= editor.getValue();
                    if(!ret){
                        ret = {};
                    }
                    editor.destroy();
                }catch(e){
                    console.log(e);
                }
            }
        }else{
            //console.log("HTML Must Contain a temp element for editing");
        }
        return ret;
    },
    schema:function(){
        return snippetTypes.getSchema(this.kind);
    },
    render:function(){
        var snippet =  jQuery(this.processTemplate());
        if(this.edit_mode){
            return jQuery('<div></div>').attr('id',this.snip_id).addClass('selectable').addClass('moveable').append(snippet);
        }
        return snippet;
    },
    processTemplate:function(){
        try{
            var data = $.extend({edit_mode:this.edit_mode,snip_id:this.snip_id},this.properties);
            return Handlebars.compile(this.template)(data) ;
        }catch(e){
            alert(e);
        }
    },
    isComponentContainer:function(){return false;},
    setCss:function(css){
        if(css){
            this.css = css;
        }
    },
    setKlass:function(klass){
       this.klass = klass;
    },
    compileCSS:function(){
        var styles = {};
      if(this.css && this.css !== ''){
          styles[this.kind] = this.css;
      }
        return styles;
    },
    toCSS:function() {
        var css = "";
        var styles = this.compileCSS();
        $.each(styles, function (index,style) {
            css += style;
        });
        return css;
    },
    propertiesChanged:function(){

    },
    getSessionVars:function(){
        var root = this.getRoot();
        return root.private.sessionvars;
    },
    getRoot:function(){
        var parent = this,root = this;
        while(parent){
            parent = parent.private.parent;
            if(parent){
                root = parent;
            }
        }
        return root;
    },
    execute:function(data){
        this.javascript =
            'function sayHello(){ ' +
                'console.log(data);' +
            '};'+
            'sayHello();';
        var data = {cool:'fred'};

        if(this.javascript){
            var result = eval(this.javascript);
        }
    },
    isContainer:function(){
        return this.snippets;
    },
    setParent:function(parent){
        this.parent = parent.snip_id;
        if(!this.private){
            this.private = {};
        }
        this.private['parent'] = parent;
        return this;
    },
    showBorders:function(){
        jQuery('.border_control').addClass('border_position')
    },
    hideBorders:function(){
        jQuery('.border_control').removeClass('border_position')
    },
    setTemplate:function(template){
        this.template = template;
    },
    setCategory:function(category){
        this.category = category;
    },
    getCategory:function(){return this.category;},
    setIcon:function(icon){
        this.icon = icon;
    },
    flatten :function (obj) {
        var ret ={};
        for(var key in obj) {
            if(obj.hasOwnProperty(key) && typeof  obj[key] !== 'function'){
                ret[key] = obj[key];
            }
        }
        return ret;
    },
    setVal:function(name,value,index){
       if(!name){ alert("Name Value Pair only");}
        else{
           if(index && index !== 'undefined'){
             console.log('Setting old text for '   + name +  'from ' + this.properties['list'][index][name] + ' to ' + value + ' for ' + this.snip_id + ' index ' + index);
               this.properties['list'][index][name] = value;
           }else{
             console.log('Setting old text for '   + name +  'from ' + this.properties[name] + ' to ' + value + ' for ' + this.snip_id);
               this.properties[name] = value;
           }
       }
    },
    save:function(){JSON.stringify(this);},
    clone:function(){
        var newObj = eval("new " + this.klass + "()");
        newObj = jQuery.extend(true,newObj,this);
        return newObj;
    },
    setEditMode:function(edit_mode){this.edit_mode = edit_mode;return this;}
});

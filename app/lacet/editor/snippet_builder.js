(function () {
    function SnippetBuilder() {
        this.editor = null;
    }
    SnippetBuilder.prototype.showSnippetBuilder = function (id) {
        
        var deferred = $.Deferred();
        
        var self = this;
        var editor = $('<div></div>');
        editor.load("lacet/editor/snippet_builder.html", function() {
            bootbox.dialog({
                title: "Snippet Builder",
                message: editor,
                size: 'large',
                className: 'SnippetEditor',
                buttons: {
                    success: {
                        label: "Save",
                        className: "btn-success",
                        callback: function () {
                            self.saveCustomSnippet();
                            deferred.resolve();
                        }
                    }
                }
            });
            self.initEditors(id);

        });
        return deferred.promise();
    };
    SnippetBuilder.prototype.newCustomSnippet = function () {
        return this.showSnippetBuilder();
    };
    SnippetBuilder.prototype.removeCustomSnippet = function (id) {
        var that = this;
        window.custom_snippets.remove(id, function () {
            that.refresh();
        });
    };
    SnippetBuilder.prototype.refresh = function(cb){
        window.lacetEastPanel.loadCustomSnippets(function(){
            window.lacetEastPanel.initSnippetEvents();
            if(cb){cb();}
        });
    };
    SnippetBuilder.prototype.editCustomSnippet = function (id) {
        return this.showSnippetBuilder(id);
    };
    SnippetBuilder.prototype.loadCustomSnippets = function(cb){
        var snippets = {};
        window.custom_snippets.qry().find(function(data){
            console.log(data);
            $.each(data.rows,function(idx,snippet){
                var category = snippet.category; 
                if(category){
                    var snippetArray = snippets[category];
                    if(!snippetArray){
                        snippets[category] = [];
                    }
                    snippetArray.push(snippet); 
                }
            });
            if(cb){
               cb(snippets); 
            }
        });
    };
    SnippetBuilder.prototype.serializeSnippet = function( ){
        var self = this;
        //noinspection JSUnresolvedFunction
        var data = $('#snippetForm').serializeObject();
        var id = data['_id'];
        if(id){
            data['_id'] = data['_id'];
        }
        data['schema'] = self.schemaEditor.getValue();
        data['template'] = self.htmlEditor.getValue();
        if(self.cssEditor.getValue()){
            data['css'] = self.cssEditor.getValue();
        }

        return data;

    };
    SnippetBuilder.prototype.loadCustomSnippets = function(cb) {
        var self = this;
        window.custom_snippets.qry().find(function(data){
            var collection = new SnippetContainer('SnippetList');
            $.each(data.rows,function(idx,snippetJson){
                var snippet = self.loadSnippetJson(snippetJson);
                if(snippet){
                    collection.add(snippet);
                }
            });
            if(cb){
                cb(collection);
            }
        });
    };
    SnippetBuilder.prototype.loadSnippetJson = function(snippetJson){
        try{

            var schema =  snippetTypes.createValidSchema(snippetJson);
            snippetTypes.add(schema);

            var kind = snippetJson.kind;
            var name = snippetJson.name;

            var snippet = new Snippet(name,kind);

            if(snippet){
                snippet.setKlass('Snippet');
                snippet.setCategory(snippetJson.category);
                snippet.setIcon('fa ' + snippetJson.icon);
                snippet.setTemplate(snippetJson.template);
                snippet.setCss(snippetJson.css);
                snippet['_id'] = snippetJson._id;
                console.log(snippet);
                return snippet;
            }
        }catch(e){
            console.log('Snippet Issue error is ->' + e);
        }
        return null;
    };
    SnippetBuilder.prototype.saveCustomSnippet = function () {
        var that = this;
        var snippet = that.serializeSnippet();
        window.custom_snippets.save(snippet,function(data){
             console.log(data);
        });
    };
    SnippetBuilder.prototype.initEditors = function(id){
        var self = this;
        $('[role="iconpicker"]').iconpicker({placement:'left',icon: $('[name="icon"]').val()}).on('change', function(e) {
            $('[name="icon"]').val(e.icon) ;
        });

        var schema = "{}";
        var template = "<div></div>";
        var css = '@charset "UTF-8"';

        if(id){
            window.custom_snippets.getById(id,function(data){
                $('[name="_id"]').val(data._id);
                $('[name="kind"]').val(data.kind);
                $('[name="name"]').val(data.name);
                $('[name="icon"]').val(data.icon);
                $('[name="category"]').val(data.category);
                $('[name="tags"]').val(data.tags);
                if(data.schema){schema =data.schema;}
                if(data.template){template =data.template;}
                if(data.css){css =data.css;}
                self.schemaEditor = self.configureEditor("schema",schema,'json');
                self.htmlEditor = self.configureEditor("template",template,"html");
                self.cssEditor = self.configureEditor("css",css,'css');
            });
        }else{
            self.schemaEditor = self.configureEditor("schema",schema,'json');
            self.htmlEditor = self.configureEditor("template",template,"html");
            self.cssEditor = self.configureEditor("css",css,'css');
        }

    };
    SnippetBuilder.prototype.getPrettyData = function(data,mode){
        var options   = {
            source: data,
            mode : "beautify",
            lang  : mode,
            wrap : 150,
            inchar : "\t",
            insize : 1
        };
        return  prettydiff(options);
    };
    SnippetBuilder.prototype.configureEditor = function(selectorId,data,mode){
        var editor = ace.edit(selectorId);
        editor.setTheme("ace/theme/idle_fingers");
        editor.setOptions({
            maxLines: Infinity
        });
        var pd = this.getPrettyData(data,mode);
        editor.setValue(pd[0], -1);
        editor.getSession().setMode("ace/mode/" + mode);
        return editor;
    };
   
    window.snippetBuilder = new SnippetBuilder();
    // When the DOM is ready, run the application.
    jQuery(function () {

    });
    // Return a new application instance.
    return( window.snippetBuilder );
})(jQuery);
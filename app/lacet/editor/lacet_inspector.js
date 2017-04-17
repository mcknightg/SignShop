(function () {
    function LacetInspector() {
        this.editor = null;
    }
    LacetInspector.prototype.getPage = function(){
        return window.lacetEditor.page;
    };
    LacetInspector.prototype.buildFormDropList = function(){
        var forms =   this.getPage().listForms();
        var formItems = [];
        $.each(forms,function(idx,form){
            console.log(form);
            try{
                formItems.push('<li><a>' + form.properties.endpoint + '</a></li>');
            }catch(e){
                console.log(e);
            }
            formItems.sort();
        });
        return  formItems;
    }; 
 
    //Show the snippet property Editor
    LacetInspector.prototype.showInspector = function () {
        var that = this;
        var lacetEditor = window.lacetEditor;
        if(!this.editing){
            if (lacetEditor.selectedcontrol) {
                lacetEditor.disableShortCuts();
                var editor = $('<div></div>');
                editor.load("lacet/editor/lacet_inspector.html", function(responseTxt, statusTxt, xhr){
                    bootbox.dialog({
                            title: "Edit Snippet Parameters",
                            message:editor,
                            size:'large',
                            className:'InspectorDialog',
                            onEscape:function(result){
                                lacetEditor.enableShortCuts();
                            },
                            buttons: {
                                success: {
                                    label: "Save",
                                    className: "btn-success",
                                    callback: function () {
                                        that.saveEditors();
                                        lacetEditor.saveLocal();
                                        lacetEditor.render();
                                    }
                                }
                            }
                        }
                    );
                    that.renderInspector().done(function(data){
                        if(data && lacetEditor.selectedcontrol.value){
                            if(that.prev){
                                if( JSON.stringify(lacetEditor.selectedcontrol.value) !== JSON.stringify(that.prev)){

                                }
                            }
                            that.prev = data;
                        }
                    });
                    that.renderEditors();
                });
            }else{
                jQuery('#inspectorPalette').html("Nothing Selected");
            }
        }
    };
    LacetInspector.prototype.getPrettyData = function(data,mode){
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
    LacetInspector.prototype.renderInspector = function(){
        var self = this;
        var deferred = $.Deferred();
        var snippet = window.lacetEditor.selectedcontrol;
        //This is for Forms
        if(snippet.properties.field_endpoint ){
            var endpoint = snippet.findEndPoint();
            console.log(endpoint);
            if(endpoint){
                snippet.properties.field_endpoint = endpoint;
            }
        }
        if (self.editor) {
            self.editor.destroy();
            self.editor = null;
        }
        var schema = snippet.schema();
        if (schema) {
            self.editor = new JSONEditor(document.getElementById("inspectorPalette"),
            {
                iconlib: "fontawesome4",
                'schema': schema,
                show_errors: 'always',
                expand_height:false,
                // input_width:'100px',
                disable_collapse:true,
                disable_edit_json: true,
                disable_properties: false,
                disable_array_delete: false,
                disable_array_delete_all_rows:true,
                disable_array_delete_last_row:true
            });
            self.editor.setValue(snippet.properties);
            self.editor.on("change", function () {
                if (snippet.properties !== self.editor.getValue()) {
                    snippet.properties = self.editor.getValue();
                    snippet.propertiesChanged();
                }
                deferred.resolve(snippet.properties);
            });
        }
        return deferred.promise();
    };
    LacetInspector.prototype.saveEditors = function () {
        var editor = window.lacetEditor;
        window.lacetEditor.selectedcontrol.setTemplate( window.htmlEditor.getValue());
        window.lacetEditor.selectedcontrol.setCss( window.cssEditor.getValue());
        editor.renderSelected();
        editor.saveLocal();
        editor.renderCSS();
    };
    LacetInspector.prototype.renderEditors = function () {
        var editor = window.lacetEditor;

        //if(window.lacetEditor.selectedcontrol.klass && window.lacetEditor.selectedcontrol.klass === "Snippet"){
       // console.log(window.lacetEditor.selectedcontrol.template);

        //HTML
        window.htmlEditor  = this.configureEditor("htmlEditor", window.lacetEditor.selectedcontrol.template,"html");
        //CSS
        var css = window.lacetEditor.selectedcontrol.css;
        if(!css){
            css ="/*-- CSS For " + window.lacetEditor.selectedcontrol.name + "---*/";
        }
        window.cssEditor = this.configureEditor("cssEditor", css,"css");

        $('#saveHTMLTemplate').unbind('click').bind('click', function (e) {
            window.lacetEditor.selectedcontrol.setTemplate( window.htmlEditor.getValue());
            editor.saveLocal();
            editor.renderSelected();
        });
        $('#saveCSS').unbind('click').bind('click', function (e) {
            window.lacetEditor.selectedcontrol.setCss( window.cssEditor.getValue());
            editor.saveLocal();
            editor.renderCSS();
        });

        $('[data-toggle="tab"]').unbind('click').bind('click', function (e) {
            htmlEditor.renderer.updateFull();
            cssEditor.renderer.updateFull();
        });
        // }
        

    };
    LacetInspector.prototype.configureEditor = function(selectorId,data,mode){

        var editor = ace.edit(selectorId);
        editor.setTheme("ace/theme/idle_fingers");
        editor.setOptions({

        });

        var pd = this.getPrettyData(data,mode);
        editor.setValue(pd[0], -1);
        editor.getSession().setMode("ace/mode/" + mode);

        return editor;
    };
    window.lacetInspector = new LacetInspector();
    // When the DOM is ready, run the application.
    jQuery(function () {

    });
    // Return a new application instance.
    return( window.lacetInspector );
})(jQuery);
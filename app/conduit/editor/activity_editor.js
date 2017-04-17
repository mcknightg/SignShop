(function () {
    function ActivityEditor() {
        this.editor = null;
    }
    ActivityEditor.prototype.showConfig = function(){
        $('#showInput').removeClass("active");
        $('#showOutput').removeClass("active");
        $('#showConfig').addClass("active");

        $('#inspectorPalette').show();
        $('#activity_input').hide();
        $('#activity_out_panel').hide();
    };
    ActivityEditor.prototype.showOutput = function(){
        $('#showInput').removeClass("active");
        $('#showOutput').addClass("active");
        $('#showConfig').removeClass("active");

        $('#inspectorPalette').hide();
        $('#activity_input').hide();
        $('#activity_out_panel').show();
    };
    ActivityEditor.prototype.showInput = function(){
        $('#showInput').addClass("active");
        $('#showOutput').removeClass("active");
        $('#showConfig').removeClass("active");

        $('#inspectorPalette').hide();
        $('#activity_input').show();
        $('#activity_out_panel').hide();
    };


    ActivityEditor.prototype.showEditor = function () {
        var that = this;
        var conduitEditor = window.conduitEditor;
        if(!this.editing){
            var flowActivity = conduitEditor.selectedcontrol;
            if (flowActivity) {
                //conduitEditor.disableShortCuts();
                var editor = $('<div></div>');
                editor.load("conduit/editor/activity_editor.html", function(responseTxt, statusTxt, xhr){
                    bootbox.dialog({
                            title: "",
                            message:editor,
                            size:'medium',
                            className:'InspectorDialog',
                            onEscape:function(result){
                                
                            },
                            buttons: {
                                success: {
                                    label: "Save",
                                    className: "btn-success",
                                    callback: function () {
                                        flowActivity.description = $('#activity_description').val();
                                        flowActivity.name = $('#activity_name').val();
                                    }
                                }
                            }
                        }
                    );

                    that.render().done(function(data){
                        var activity_elm = jQuery('#activity_input');
                        activity_elm.css('position','absolute')
                            .css('left',20)
                            .css('top',60).jsontree({root:'Schema',data:flowActivity,displayValue:true,'onToggleNode':function() {

                            }
                        });
                        var sourceNode = activity_elm.find('.fa-plus-square-o');
                        activity_elm.jsontree('toggleNode',sourceNode);
                        
                        $('#activity_name').val(flowActivity.name);
                        $('#activity_description').val(flowActivity.description);
                        if(data && flowActivity.value){
                            if(that.prev){
                                if( JSON.stringify(flowActivity.value) !== JSON.stringify(that.prev)){

                                }
                            }
                            that.prev = data;
                        }
                        that.showConfig();
                        $('#showConfig').unbind('click').bind('click',function(){
                            that.showConfig();
                        });
                        $('#showInput').unbind('click').bind('click',function(){
                            that.showInput();
                        });
                        $('#showOutput').unbind('click').bind('click',function(){
                            that.showOutput();

                        });
                        $('#runActivity').unbind('click').bind('click',function(){
                            var input = JSON.stringify(flowActivity.input);
                            window.activities.runActivity(flowActivity.activityClass,input,function(output){
                                var activity_output_elm = jQuery('#activity_output');
                                activity_output_elm.css('position','absolute')
                                    .css('left',20)
                                    .css('top',80).jsontree({root:'Output',data:output,displayValue:true,'onToggleNode':function() {
                                }
                                });
                                var sourceNode = activity_output_elm.find('.fa-plus-square-o');
                                activity_output_elm.jsontree('toggleNode',sourceNode);

                                $('#set_out_schema').unbind('click').bind('click',function(){
                                    flowActivity.output = output;
                                    that.showInput();
                                });

                                that.showOutput();
                            });
                        });
                        $('#activity_settings').slimscroll({
                            height:'400px'
                        })
                    });
                    
                });
            }else{
                jQuery('#inspectorPalette').html("Nothing Selected");
            }
        }
    };
    ActivityEditor.prototype.render = function(){
        var self = this;
        var deferred = $.Deferred();
     
        var flowActivity = window.conduitEditor.selectedcontrol;
         
        if (self.editor) {
            self.editor.destroy();
            self.editor = null;
        }
        var schema = window.conduitWestPanel.getActivityByFlowActivity(flowActivity).schema;
        if (schema) {
            self.editor = new JSONEditor(document.getElementById("inspectorPalette"),
                {
                    iconlib: "fontawesome4",
                    'theme':'bootstrap3Custom',
                    'schema': schema,
                    show_errors: 'always',
                    no_additional_properties:true,
                    expand_height:true,
                    disable_collapse:true,
                    disable_edit_json: true,
                    disable_properties: true,
                    disable_array_delete: false,
                    disable_array_delete_all_rows:true,
                    disable_array_delete_last_row:true

                });
            self.editor.setValue(flowActivity.input);
            self.editor.on("change", function () {
                if (flowActivity.input !== self.editor.getValue()) {
                    flowActivity.input = $.extend(flowActivity.input,self.editor.getValue());
                }
                deferred.resolve(flowActivity.input);
            });
        }
        return deferred.promise();
    };
    window.activityEditor = new ActivityEditor();
    // When the DOM is ready, run the application.
    jQuery(function () {

    });
    // Return a new application instance.
    return( window.activityEditor );
})(jQuery);
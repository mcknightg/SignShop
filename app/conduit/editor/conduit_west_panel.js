(function () {
    function ConduitWestPanel() {
        this.activities = {};
        this.categories = {
            'Input':{icon:'fa fa-lg fa-hand-o-right',name:'Input Events'},
            'files':{icon:'fa fa-lg fa-file',name:'Files & Folders'}
        }
    }
    /*
     Initialize East Panel
     */
    ConduitWestPanel.prototype.init = function () {
        var self = this;
        var deferred = $.Deferred();
        $('#east-panel').load("conduit/editor/conduit_west_panel.html", function(responseTxt, statusTxt, xhr){
            self.loadActivities().done(function(activities){
                self.activities = activities;
                self.buildActivityMenu();
                self.initActivityEvents();
                deferred.resolve();
                self.loadFlows();
                self.initFlowEvents();
            });
            $('#lacet').unbind().bind('click',function(){
                window.location = '#/laceteditor';
            })
        });
        return deferred.promise();
    };

    ConduitWestPanel.prototype.loadActivities = function() {
        var deferred = $.Deferred();
        var activities = {};
        window.activities.qry().find(function(data){
            jQuery.each(data,function(index,activity){
                var id =  activity.activityClass.replace(/\./g,'-');
                activities[id] = activity;
            });
            deferred.resolve(activities);
        });
        return deferred.promise();
    };
    ConduitWestPanel.prototype.buildActivityMenu = function() {
        jQuery('#side-menu').empty();
        var categories =  this.getCategoryHtml(this.activities);
        jQuery.each(categories,function(index){
            jQuery('#side-menu').append(categories[index]);
        });
    };
    ConduitWestPanel.prototype.initActivityEvents = function(){
        this.initDoubleClickActivity();
        this.initDragActivity();
    };
    ConduitWestPanel.prototype.initDoubleClickActivity = function(){
        var that = this;
        jQuery('.dropactivity').unbind('dblclick.workit').bind('dblclick.workit',function(){
            var activity = that.getActivityById(jQuery(this).attr('klass'));
            window.conduitEditor.addActivity(activity);
        }).unbind('click').bind('click',function(eventObject){
            eventObject.preventDefault();
            eventObject.stopPropagation();
        });
    };
    ConduitWestPanel.prototype.initDragActivity = function() {
        var that = this;
        //noinspection JSUnresolvedFunction
        jQuery(".dropactivity").draggable({
            opacity: 0.50,
            tolerance: 'pointer',
            connectToSortable: ".sortable",
            cancel: '.editctrl,.controls, table, td, th, tr,.locked',
            helper: function (ev) {
                ev.stopPropagation();
                var activity = that.getActivityById(jQuery(this).attr('klass'));
                return activity.render().appendTo('Body').css('zIndex',500);
            },
            stop: function (event, ui) {
                ui.helper.fadeOut();
                return true;
            }
        });
    };
    ConduitWestPanel.prototype.getActivityById= function(id){
        var activity =  this.activities[id];
        return new FlowActivity(activity);
    };
    ConduitWestPanel.prototype.getActivityByFlowActivity = function(flowActivity){
        var id =  flowActivity.activityClass.replace(/\./g,'-');
        return this.activities[id];
    };
    ConduitWestPanel.prototype.getMenuItem = function(activity){
        var name = activity.name;
        var icon = 'fa fa-lg ' +activity.icon;
        var id =  activity.activityClass.replace(/\./g,'-');
        var listItem = jQuery('<li class="dropactivity"></li>').attr('klass',id);
        var item = jQuery('<a type="button" class="tool"></a>').attr('klass',id).attr('title',name);
        item.append(jQuery('<i></i>').addClass(icon));
        item.append(jQuery('<span></span>').addClass('nav-label').html(name));

        listItem.append(item);
        return listItem;
    };
    /*
     Common Snippet Code
     */
    ConduitWestPanel.prototype.getCategoryHtml = function(activityList) {
        var that = this;
        var categories = {};
        var searchString = $('#snippetSearch').val();
        jQuery.each(activityList,function(index,activity){
            var add = false;
            var name = activity.name;
            if(!searchString || searchString == ""){
                add = true;
            }
            if(!add && searchString && name.toLowerCase().indexOf(searchString.toLowerCase()) != -1 ){
                add = true;
            }
            if(add){
                var category = activity.category;
                if(category){
                    var categoryItem = categories[activity.category];
                    if(!categoryItem){
                        categoryItem = that.getCategory(activity);
                        categories[activity.category] = categoryItem;
                    }
                    categoryItem.find('ul').append(that.getMenuItem(activity));
                }
            }
        });
        return categories;
    };
    ConduitWestPanel.prototype.getCategoryByName = function(name){
        var category = this.categories[name];
        if(!category){
            category = {name:name,icon:'fa fa-lg fa-gear'}
        }
        return category;
    };
    ConduitWestPanel.prototype.getCategory = function(activity){
        var category = this.getCategoryByName(activity.category);
        var id = "menu_" + activity.name;
        var listItem = jQuery('<li data-toggle="collapse" data-target="#' + id+ '" class="collapsed"></li>');
        var item = jQuery('<a></a>');
        item.append(jQuery('<i></i>').addClass(category.icon));
        item.append(jQuery('<span></span>').addClass('nav-label').html(category.name));
        item.append(jQuery('<span></span>').addClass('fa arrow').addClass('pull-right'));
        listItem.append(item);
        listItem.append(jQuery('<ul class="sub-menu collapse" id="'+ id + '"></ul>'));
        return listItem;
    };

    /*
     Load Flows
     */
    ConduitWestPanel.prototype.loadFlows = function(){
        var that = this;
        window.flows.qry().find(function(data){
            console.log(data);
            jQuery('#pages').empty();
            jQuery.each(data.rows,function(index,item){
                jQuery('#pages').append(that.getFlowMenuItem(item._id,item.name,'fa fa-random fa-lg'));
            });

            jQuery('.removeFlow').unbind('click').bind('click',function(ev){
                ev.stopPropagation();
                var id = $(this).parent().parent().attr('flowid');
                // alert('Are You Sure');
                that.removeFlow(id);
            });

            jQuery('.showFlow').unbind('click').bind('click',function(ev){
                ev.stopPropagation();
                var id = $(this).attr('flowid');
                that.showFlow(id);
            });

            jQuery('.viewFlow').unbind('click').bind('click',function(ev){
                ev.stopPropagation();
                var name = $(this).parent().find('.nav-label').html();
                window.location = './#/conduit/' + name ;
            });
        });
    };

    ConduitWestPanel.prototype.readJsonFiles = function(){
        var deferred = $.Deferred();
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            var fileList = jQuery('<input type="file" id="files" name="files[]" multiple />').appendTo("body");
            fileList.click(function() {
                $(this).change(function(evt){
                    var files = evt.target.files;
                    var jsonFiles = [];
                    for (var i = 0, f; f = files[i]; i++) {
                        var reader = new FileReader();
                        reader.onload = (function(theFile) {
                            return function(e) {
                                try{
                                    jsonFiles.push(JSON.parse(e.target.result));
                                    if(i === files.length){
                                        deferred.resolve(jsonFiles);
                                    }
                                }catch(e){
                                    console.log(e);
                                }
                            };
                        })(f);
                        reader.readAsText(f);
                    }
                    $(this).remove();
                });
            })[0].click();
        } else {
            alert('The File APIs are not fully supported in this browser.');
        }
        return deferred.promise();
    };

    ConduitWestPanel.prototype.initFlowEvents = function(){
        var self = this;
        $('#newFlow').unbind('click').bind('click',function(ev){
            window.conduitEditor.newFlow();
            self.updateFlowName();
        });

        $('#importFlow').unbind('click').bind('click',function(ev){
            self.readJsonFiles().done(function(flows){
                console.log("Importing Flow");
                console.log(flows);
                jQuery.each(flows,function(idx,flow){
                    window.flows.save(flow,function(data){
                        self.loadFlows();
                    });
                });
            });
        });
        $('#exportFlow').unbind('click').bind('click',function(ev){
            var flow =  window.conduitEditor.flow;
            if(flow){
                var data = "data:application/json," + encodeURIComponent(flow.save());
                jQuery("<a />", {"download": flow.name +  ".json","href" : data})
                    .appendTo("body").click(function() {
                    $(this).remove()
                })[0].click();
            }
        });

        $('#viewCachedFlow').unbind('click').bind('click',function(ev){
            ev.stopPropagation();
            window.location = "#/conduitviewer";
        });

        $('#saveFlow').unbind('click').bind('click',function(ev){
            ev.stopPropagation();
            self.saveFlow();
        });

        $('#flowName').unbind('click').bind('click',function(ev){
            ev.stopPropagation();
            self.editFlowName();
        });
    };
    ConduitWestPanel.prototype.removeFlow = function(flowId) {
        var that = this;
        window.flows.remove(flowId, function () {
            that.loadFlows();
        });
    };
    ConduitWestPanel.prototype.showFlow = function(flowId){
        var that = this;
        window.flows.getById(flowId,function(data){
            console.log("Get By ID");
            console.log(data);
            window.conduitEditor.showFlow(data);
            that.updateFlowName();
        });
    };
    ConduitWestPanel.prototype.updateFlowName = function(){
        if(window.conduitEditor.flow){
            var flowName = window.conduitEditor.flow.name;
            if(!flowName){
                flowName = "Untitled";
            }
            $('#flowName').html(flowName);
        }
    };
    ConduitWestPanel.prototype.saveFlow = function(){
        var that = this;
        var flow = window.conduitEditor.flow.saveObject();
       
        window.flows.save(flow,function(data){
            window.conduitEditor.showFlow(data);
            that.updateFlowName();
            that.loadFlows();
        });
    };
    ConduitWestPanel.prototype.editFlowName = function () {
        var that = this;
        bootbox.dialog({
                title: "Edit Flow Name",
                message:
                '<div class="row">  ' +
                '<div class="col-md-12"> ' +
                '<form class="form-horizontal"> ' +
                '<div class="form-group"> ' +
                '<label class="col-md-2 control-label" for="propFlowName">Name</label> ' +
                '<div class="col-md-8"> ' +
                '<input id="propFlowName" name="propFlowName" type="text" placeholder="Flow Name" class="form-control input-md"> ' +
                '</div>' +
                /*'<span class="input-group-btn"> ' +
                 '<button class="btn btn-success btn-sm" data-iconset="fontawesome" role="propiconpicker"></button>'+
                 '</span>' +*/
                '</div>' +
                '</form> </div>  </div>',
                buttons: {
                    success: {
                        label: "Save",
                        className: "btn-default",
                        callback: function () {
                            window.conduitEditor.flow.name = $('#propFlowName').val();
                            $('#flowName').html(window.conduitEditor.flow.name);
                            that.saveFlow();
                        }
                    }
                }
            }
        );
        $('#propFlowName').val($('#flowName').html());
    };
    ConduitWestPanel.prototype.getFlowMenuItem = function(id,name,icon){

        var listItem = jQuery('<li class="showFlow"></li>').attr('flowid',id);
        var item = jQuery('<a></a>');
        item.append(jQuery('<i></i>').addClass(icon));
        item.append(jQuery('<span></span>').addClass('nav-label').html(name));
        item.append(jQuery('<i class="menuIcon removeFlow" ></i>').addClass('fa fa-remove fa-lg pull-right'));
        item.append(jQuery('<i class="menuIcon lockFlow" ></i>').addClass('fa fa-unlock fa-lg pull-right'));
        listItem.append(item);
        return listItem;
    };

    window.conduitWestPanel = new ConduitWestPanel();
    // When the DOM is ready, run the application.
    jQuery(function () {

    });
    // Return a new application instance.
    return( window.conduitWestPanel );
})(jQuery);
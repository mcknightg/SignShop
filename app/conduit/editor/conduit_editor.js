(function () {
    function ConduitEditor() {
        this.shortCuts = true;
    }
    ConduitEditor.prototype.enableShortCuts = function(){
        this.shortCuts = true;
    };
    ConduitEditor.prototype.disableShortCuts = function(){
        this.shortCuts = false;
    };

    ConduitEditor.prototype.init = function (element) {
        var that = this;
        $(element).load("conduit/editor/conduit_editor.html", function(responseTxt, statusTxt, xhr){
            if(statusTxt == "success"){
                window.conduitWestPanel.init().done(function(){
                    that.run();
                });
            }else if(statusTxt == "error"){
                console.log("Error: " + xhr.status + ": " + xhr.statusText);
            }
        });
        window.conduitSocket.connect();

        jQuery(window).resize(function() {
            that.resize();
        });

    };
    ConduitEditor.prototype.resize = function(){
        var newWidth =  jQuery(window).width() - 280;
        var newHeight =  jQuery(window).height() - 20;
        jQuery('#main-content')
            .css('width', newWidth)
            .css('height', newHeight)
            .css('margin-top','0px')
            .addClass('droppable');
            //.css('background-size','25px 25px')
            //.css('background-image','linear-gradient(to right, #ededed 1px, transparent 1px), linear-gradient(to bottom, #ededed 1px, transparent 1px)');

    };

    ConduitEditor.prototype.newFlow = function(){
        this.newView();
        this.render();
    };
    ConduitEditor.prototype.showFlow = function (data) {
        if(!this.flow){
            this.newView();
        }
        this.flow = this.flow.loadObject(data);
        this.render();
    };
    //A New Empty Flow
    ConduitEditor.prototype.newView = function () {
        this.flow = new Flow("Untitled");

    };
    ConduitEditor.prototype.addActivity = function (activity) {
        if(this.flow){
            this.flow.addActivity(activity);
            this.render();
        }else{
            alert("Select or create a flow to add an activity");
        }

    };

    ConduitEditor.prototype.run = function () {
        window.conduitEditor.selectedcontrol = null;
        window.conduitEditor.maincontent = jQuery('#main-content');
        this.resize();
        this.render();
    };
    //Render the page and initialize the event handlers
    ConduitEditor.prototype.render = function(){
        var controls = jQuery('.selected_control');
       if(this.flow){
           window.conduitEditor.maincontent.html('');
           var html  = this.flow.render(window.conduitEditor.maincontent);
           this.resize();
          // this.saveLocal();
           this.initSelectable();
           this.init_mapper_endpoints();
           this.renderConnections();
           this.initDragAndDrop();
           this.enableShortCuts();
           this.initKeyHandlers();
       }

    };

    //Save the current page to cache
    ConduitEditor.prototype.saveLocal = function(){
        localStorage["flowData"] =  this.flow.save();
    };
    //Load that last cached page
    ConduitEditor.prototype.loadLocal = function(){
        this.newView();
        var flowData = localStorage["flowData"];
        if(flowData && flowData != null && flowData !== 'undefined'){
            this.flow = this.flow.load(flowData);
            if(window.conduitWestPanel){
                window.conduitWestPanel.updateFlowName();
            }
        }
    };

    ConduitEditor.prototype.cut = function(){
        var self = this;
        this.copy();
        $.each(self.listSelectedActivities(),function(idx,activity){
            self.flow.removeActivity(activity.id);
        });
        this.render();
    };
    ConduitEditor.prototype.copy = function(){
        localStorage["activity_clipboard"] = JSON.stringify({'activities':this.listSelectedActivities()});
    };
    ConduitEditor.prototype.paste = function(){
        var self = this;
        if(this.flow){
            var clipboard = JSON.parse(localStorage["activity_clipboard"]);
            if(clipboard && clipboard.activities){
                $.each(clipboard.activities,function(idx,activity){
                    activity.id = null;
                    activity.y  = activity.y + 52;
                    self.flow.addActivity(new FlowActivity(activity));
                });
            }
            this.render();
        }
    };

    //Initialize Selectable
    ConduitEditor.prototype.initSelectable = function(){
        var that = this;
         var tooltipTimeout;
        jQuery('.selectable').unbind('click').bind('click', function (event) {
                event.stopPropagation();
                if (!event.ctrlKey) {
                    that.clearSelection();
                }
                jQuery(this).toggleClass('selected_control');
                var id = jQuery(this).attr('id');
                that.selectedcontrol = that.getById(id);
        }).unbind('dblclick').bind('dblclick', function (event) {
                event.stopPropagation();
                window.activityEditor.showEditor();
                jQuery(".theme-config-box").addClass("show");
        }).hover(function(){
            var id = jQuery(this).attr('id');
            var description = that.getById(id).description;
            if(description){
                var name = jQuery("<p id='tooltip'></p>")
                    .css('position','absolute')
                    .css('left',25)
                    .css('display','block')
                    .css('background-color','#F0FFFB')
                    .css('padding','5px')
                    .css('text-align','center')
                    .css('width', '250px')
                    .css('height', '54px')
                    .css('top',-60)
                    .css('color','black')
                    .css('border-radius','10px')
                    .css('border', '2px solid #8F8F8F')
                    .css('font-size','50%').html(description);
                $(this).append(name);
            }

        },function(){
            $("#tooltip").fadeOut().remove();
        });

    };
    //Render the selected snippet
    ConduitEditor.prototype.renderSelected = function(){
        if (window.conduitEditor.selectedcontrol) {
            var html =  window.conduitEditor.selectedcontrol.render();
            jQuery('#' + window.conduitEditor.selectedcontrol.snip_id).html(html.html());
            this.initSelectable();
        }
    };

    //Given any element find the snippet
    ConduitEditor.prototype.findSnippet = function(elm){
        if(elm && elm.attr('id') && elm.attr('id').indexOf("snippet_") === 0){
            return this.getById(elm.attr('id'));
        }else if(elm.parent()){
            return this.findSnippet(elm.parent());
        }
        return null;
    };
    ConduitEditor.prototype.disableSorting = function(){
        jQuery('.sortable').sortable('disable')
            .disableSelection('disabled')
            .unbind('click')
            .unbind('mousedown')
            .unbind('mouseup')
            .unbind('selectstart')
            .unbind('dblclick');
    };


    ConduitEditor.prototype.clearSelection = function () {
        var that = this;
        jQuery.each(jQuery('.selected_control'), function () {
            jQuery(this).removeClass('selected_control');
            that.selectedcontrol = null;
        });
    };
    ConduitEditor.prototype.listSelectedActivities = function () {
        var that = this;
        var activity_list = [];
        jQuery('.selected_control').each(function () {
            var control = that.getById(jQuery(this).attr('id'));
            activity_list.push(control);
        });
        return  activity_list;
    };
    ConduitEditor.prototype.deleteSelected = function(){
        jQuery.each(this.listSelectedActivities(),function(index, activity){
            window.conduitEditor.flow.removeActivity(activity.id);
        });
        this.render();
    };
    ConduitEditor.prototype.reSelectControls = function(controls){
        jQuery.each(controls,function(index,control){
            jQuery('#' + control.snip_id).addClass('selected_control');
        });
    };
    ConduitEditor.prototype.getById = function(id){
        return window.conduitEditor.flow.getActivityById(id);
    };

    //Initialize KeyHandlers
    ConduitEditor.prototype.initKeyHandlers = function(){
        var self = this;
        jQuery(document).unbind('keydown');
        jQuery(document).unbind('keyup');
        jQuery(document).bind('keydown',function(event){

            if(self.shortCuts) {
                switch (event.which) {
                    case 46://DELETE
                        console.log("DELETE KEY");
                        event.preventDefault();
                        self.deleteSelected();
                        return true;
                        break;
                    case 88:  //X
                        if (event.ctrlKey) {
                            console.log("CUT KEY");
                            self.cut();
                        }
                        return true;
                        break;
                    case 67:  //C
                        if (event.ctrlKey) {
                            console.log("COPY KEY");
                            self.copy();
                        }
                        return true;
                        break;
                    case 86:  //V
                        if (event.ctrlKey) {
                            console.log("PASTE KEY");
                            self.paste();
                        }
                        return true;
                        break;
                }
            }
        });

    };
     

     //Drag and Drop Flow Activities
    ConduitEditor.prototype.initDragAndDrop = function(){
        var self = this;
       jQuery( ".droppable" ).droppable({
            drop: function( event, ui ) {
                if(ui.draggable.hasClass('dropactivity')){
                  var flowActivity = window.conduitWestPanel.getActivityById(ui.draggable.attr('klass'));
                    var offset = jQuery(this).position();
                    flowActivity.x = ui.offset.left - 270;
                    flowActivity.y = ui.offset.top;
                  var connection = self.maincontent.mapper("findConnection",ui.offset.left,ui.offset.top,50,50);
                  self.flow.addActivity(flowActivity,connection);
                  self.render();
              }
            }
        });

        jQuery(".draggable").draggable({
            opacity:0.50,
            cancel:'',
            helper:function (ev, ui) {return jQuery(this);},
            stop:function (event, ui) {
                var offset = jQuery(this).position();
                var activity =  self.flow.getActivityById(event.target.id);
                var x =  (offset.left -270) - activity.x;
                var y =  offset.top - activity.y;

                $.each(self.listSelectedActivities(),function(idx,activity){
                    activity.x = activity.x + x;
                    activity.y = activity.y + y;
                });

                activity.x = offset.left -270;
                activity.y = offset.top;
                self.render();
                return true;
            }
        });
    };
    //Flow Activity Connections
    ConduitEditor.prototype.addConnection = function(connection){
        var src_activity = this.getById(connection.src.parent().attr('id'));
        var tgt_activity = this.getById(connection.tgt.parent().attr('id'));
        this.flow.addConnection(src_activity,tgt_activity);
        this.renderConnections();
    };
    ConduitEditor.prototype.removeConnection = function(connection){
        var src_activity = this.getById(connection.src.parent().attr('id'));
        var tgt_activity = this.getById(connection.tgt.parent().attr('id'));
        this.flow.removeConnectionById(src_activity,tgt_activity);
        this.render();
    };
    ConduitEditor.prototype.renderConnections = function() {
        var self = this;
        jQuery.each(this.flow.connections,function(i,connection){
            var src_selector = jQuery('#' + connection.src + ' .fa-chevron-circle-right');
            var dst_selector = jQuery('#' + connection.tgt + ' .fa-chevron-circle-left');
            self.maincontent.mapper("connect",src_selector,dst_selector,connection);
        });
    };
    ConduitEditor.prototype.init_mapper_endpoints = function(){
        var self = this;
        this.maincontent.mapper({
            onDrop:function(event,connection){
                console.log(connection);
                self.addConnection(connection);
            },
            onMouseDown:function(event,connection){
                var src_activity = self.getById(connection.src.parent().attr('id'));
                var tgt_activity = self.getById(connection.tgt.parent().attr('id'));
                window.activityMapper.showMapper({flow:self.flow,src:src_activity,tgt:tgt_activity});
            }
        });
        this.maincontent.mapper("createEndPoints", '.fa-chevron-circle-right', '.fa-chevron-circle-left');
    };
    window.conduitEditor = new ConduitEditor();
    // When the DOM is ready, run the application.
    jQuery(function () {

    });
    // Return a new application instance.
    return( window.conduitEditor );
})(jQuery);
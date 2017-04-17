(function () {
    function ActivityMapper() {
        this.mapper = null;
    }
    //Render Source and Target JSON
    ActivityMapper.prototype.render = function(connection){
        var jsonSrcElm = jQuery('#jsonSrc');
        var jsonTgtElm = jQuery('#jsonTgt');
        var self = this;
        var tgtName = connection.tgt.name;

        var tgt = {};
        var src = connection.flow.getSourceActivities(connection.tgt);
        var displayKeys = src.displayKeys;
        var srcActivities = src.activities;

        var tgtDisplayKeys = [];
        tgtDisplayKeys[connection.tgt.id] =  tgtName;
        tgt[connection.tgt.id] = {input:connection.tgt.input};
        //Left Tree
        jsonSrcElm
            .css('position','absolute')
            .css('left',20)
            .css('top',40 ).jsontree({root:'Source',data:srcActivities,displayValue:false,displayKeys:displayKeys,'onToggleNode':function() {
                self.renderConnectionMaps(connection.flow);
            }
        });
        //Right Form
        jsonTgtElm.css('position','absolute')
            .css('left',300)
            .css('top',40 ).jsonform({root:'Target',data:tgt,displayValue:true,displayKeys:tgtDisplayKeys});

        self.init_mapper_endpoints(connection);
        var sourceNode = jsonSrcElm.find('.fa-plus-square-o');
        jsonSrcElm.jsontree('toggleNode',sourceNode);
    };
    //render connection maps
    ActivityMapper.prototype.renderConnectionMaps = function(flow) {
        var activityMapper = jQuery('#jsonMapper');
        activityMapper.mapper("removeAllConnections");
        activityMapper.mapper('createEndPoints', "#jsonSrc .je-key-input", "#jsonTgt .key");
        jQuery.each(flow.connectionMaps,function(i,connectionMap){
             var src_selector = jQuery('#jsonSrc').jsontree('treeNodeForPath',connectionMap.src);
             var dst_selector = jQuery('#jsonTgt').jsonform('nodeForPath',connectionMap.tgt);
             activityMapper.mapper("connect",src_selector,dst_selector,connectionMap);
        });
        activityMapper.mapper('update');
    };
    //Initialize listeners for src and tgt json endpoints
    ActivityMapper.prototype.init_mapper_endpoints = function(connection){
        var self = this;
        jQuery('#jsonMapper').mapper({id:'mapperID',
            onDrop:function(event,connectionMap){
                self.addConnectionMap(connection,connectionMap);
            },
            onMouseDown:function(event,connectionMap){
                 self.removeConnectionMap(connection.flow,connectionMap);
            }
        });
    };
    ActivityMapper.prototype.removeConnectionMap = function(flow,connectionMap){
        var removedMap = flow.removeConnectionMap(connectionMap);
        console.log("Removed ");
        console.log(removedMap);
        this.renderConnectionMaps(flow);
    };
    //Add a connection Map to the flow
    ActivityMapper.prototype.addConnectionMap = function(connection,connectionMap){
        var jsonSrcElm = jQuery('#jsonSrc');
        var jsonTgtElm = jQuery('#jsonTgt');

        var srcPath =  jsonSrcElm.jsontree('getPath',connectionMap.src);
        /*var path = srcPath.split('\'][\'');
        var srcActivityId = path[0].replace('[\'','').replace('\']','');
        var srcType = path[1].replace('[\'','').replace('\']',''); */
 
        var tgtPath =  jsonTgtElm.jsonform('getPath',connectionMap.tgt);
        /*var tgtActivityId = connection.tgt.id;
        var tgtType = "input";    */

        connection.flow.addConnectionMap(srcPath,tgtPath);


    };

    //Show the mapper Dialog
    ActivityMapper.prototype.showMapper = function (connection) {
        var self = this;
        var mapper = $('<div></div>');
        mapper.load("conduit/editor/activity_mapper.html", function(responseTxt, statusTxt, xhr) {
            var d = bootbox.dialog({
                    title: "",
                    message: mapper,
                    size: 'large',
                    show: false,
                    className: 'InspectorDialog',
                    onEscape: function (result) {

                    },
                    buttons: {
                        success: {
                            label: "Save",
                            className: "btn-success",
                            callback: function () {

                            }
                        }
                    }
                }
            );
            d.on("shown.bs.modal", function() {
                self.render(connection);
            });
            d.modal('show');

        });
    };
    window.activityMapper = new ActivityMapper();
    // When the DOM is ready, run the application.
    jQuery(function () {

    });
    // Return a new application instance.
    return( window.activityMapper );
})(jQuery);
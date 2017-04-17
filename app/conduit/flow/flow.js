var Flow =  Class.extend({

    init:function(name){
        this.name = name;
        this.activities = [];
        this.connections = [];
        this.connectionMaps = [];
        this['@class'] = 'com.bluntsoftware.lib.conduit.construct.flow.Flow';
    },
    addConnectionMap:function(src,tgt){
        this.connectionMaps.push({
            'src':src,
            'tgt':tgt,
            '@class':'com.bluntsoftware.lib.conduit.construct.flow.ConnectionMap'
        });
    },
    removeConnectionMap:function(connectionMap){
        var self = this;
        $.each(self.connectionMaps,function(index,connection){
            if(connection && connection.src && connection.tgt){

                if(connectionMap.data.src === connection.src && connectionMap.data.tgt === connection.tgt){
                    self.connectionMaps.splice(index,1);
                    return connection;
                }
            }
        });
    },
    addConnection:function(src,tgt){
        this.addConnectionIDs(src.id,tgt.id);
    },
    addConnectionIDs:function(srcId,tgtId){
        this.connections.push({
            'src':srcId,
            'tgt':tgtId,
            '@class':'com.bluntsoftware.lib.conduit.construct.flow.Connection'});
    },
    getSourceActivities:function(tgtActivity,srcActivities,displayKeys){
        var self = this;
        if(!displayKeys){
            displayKeys  = [];
        }
        if(!srcActivities){
            srcActivities = [];
        }
        $.each(this.connections,function(idx,connection){
            if(connection.tgt === tgtActivity.id){
                var srcActivity = self.getActivityById(connection.src);
                if(srcActivity && srcActivity.id){
                    srcActivities[srcActivity.id] = {input:srcActivity.input,output:srcActivity.output};
                    displayKeys[srcActivity.id] = srcActivity.name;
                    self.getSourceActivities(srcActivity,srcActivities,displayKeys);
                }
            }
        });
        return {'activities':srcActivities,'displayKeys':displayKeys};
    },
    removeConnection:function(connection){
        return this.removeConnectionById(connection.src,connection.tgt);
    },
    removeConnectionById:function(srcId,tgtId){
        var self = this;
        $.each(self.connections,function(index,connection){
            if(connection && connection.src && connection.tgt){
                if(srcId === connection.src && tgtId === connection.tgt){
                    self.connections.splice(index,1);
                    return connection;
                }
            }
        });
    },
    removeConnectionOrphans:function(){
        var self = this;
        var connections_copy = self.connections.slice();
        $.each(connections_copy,function(index,connection){
            if(connection && connection.src && connection.tgt){
                var activitySrc = self.getActivityById(connection.src);
                var activityTgt = self.getActivityById(connection.tgt);
                if(!activitySrc || !activityTgt){
                    console.log("Removing Orphan");
                    self.removeConnection(connection);
                }
            }
        });
    },
    removeActivityConnections:function(id){
        var self = this;
        var connections_copy = self.connections.slice();
        $.each(connections_copy,function(index,connection){
            if(connection && connection.src && connection.tgt){
                if(id === connection.src || id === connection.tgt){
                    self.removeConnection(connection);
                }
            }
        });
    },
    removeActivity:function(id){
        
        var self = this;
        this.removeActivityConnections(id);

        jQuery.each(this.activities,function(index,activity){
            if(activity && activity.id === id){
                self.activities.splice(index,1);
            }
        });

    },
    render:function(elm){
        var flow = jQuery('<div></div>');
        jQuery.each(this.activities,function(index,activity){
            flow.append( activity.render());
        });
        if(elm){
            return jQuery(elm).html(flow);
        }
        return flow;
    },
    getActivityById:function(id){
        var ret = null;
        jQuery.each(this.activities,function(index,activity){
            if(activity.id === id){
                ret = activity;
            }
        });
        return ret;
    },
    addActivity : function(activity,connection) {
        try {
            var flowActivity = new FlowActivity(activity);
            this.activities.push(flowActivity);

            //Connect It
            if(connection && connection.data){
                this.addConnectionIDs(connection.data.src,flowActivity.id);
                this.addConnectionIDs(flowActivity.id,connection.data.tgt);
                this.removeConnection(connection.data);
            }

            return this;
        }catch(e){
            console.log(e);
            console.log(activity);
        }
    },
    save:function(){
        this.removeConnectionOrphans();
        return JSON.stringify(this);
    },
    saveObject:function(){
        return JSON.parse(this.save());
    },
    load:function(json) {
        var obj = JSON.parse(json);
        return this.loadObject(obj);
    },
    loadObject:function(obj){
        console.log(obj);
        var self = this;
        jQuery.extend(this,obj);
        this.activities = [];
        if(obj.activities){
            jQuery.each(obj.activities,function(index,activity){
                self.activities.push(new FlowActivity(activity));
            });
        }
        return this;
    }
});
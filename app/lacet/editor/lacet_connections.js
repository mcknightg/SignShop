(function () {
    function ServerConfig() {
        this.editor = null;
    }
    ServerConfig.prototype.init = function(){
        var self = this;
        var deferred = $.Deferred();
        this.loadConnections().done(function(data){
            self.connections = data.connections;
        }).complete(function(){
            if(!self.connections){
                if(!base_url){base_url = '../';}
                self.connections = {
                    'model':{url:base_url + "tune_manager"},
                    'users':{url:base_url + "user_manager"},
                    'conduit':{url:base_url + "conduit/rest"},
                    'mongo':{url:base_url + "mongo"}
                };
            }
            deferred.resolve();
        });
        return deferred.promise();
    };
    
    ServerConfig.prototype.menu = function(list,path){
        var menu =  jQuery('<ul class="dropdown-menu scrollable-menu"></ul>');
        $.each(list,function(name) {
            var id = path + '/' + name;
            menu.append( jQuery('<li class="endpoint-menu-item" id="'+ id + '"><a href="#">' + name + '</a></li>'));
        });
        return menu;
    };

    ServerConfig.prototype.subMenu = function(){
        return jQuery('<ul role="menu" class="dropdown-menu multi-level"></ul>');
    };

    ServerConfig.prototype.subMenuLineItem = function(name){
        return jQuery('<li class="dropdown-submenu"></li>').append('<a tabindex="-1" href="#">'+ name + '</a>');
    };
    
    ServerConfig.prototype.buildDropList = function(){
        var self = this;
        var connections = self.subMenu();
        var deferred = $.Deferred();
        this.connectionList().done(function(connectionList){
            console.log(connectionList);
            if(connectionList){
                    $.each(connectionList,function(connectionName,connection){
                        if(connection instanceof Object){
                            var connectionLi = self.subMenuLineItem(connectionName);
                            var mods =  self.subMenu();
                            $.each(connection,function(modName,mod) {
                                if(mod['name']){
                                    mods.append(jQuery('<li class="endpoint-menu-item" id="'+ connectionName + '/' + mod['name'] + '/"><a href="#">' + mod['name'] + '</a></li>'));
                                }else{
                                    var modLi = self.subMenuLineItem(modName).append(self.menu(mod,connectionName + '/' + modName));
                                    mods.append(modLi);
                                }
                            });
                            connectionLi.append(mods);
                            connections.append(connectionLi);
                        }else{
                            connections.append(jQuery('<li class="endpoint-menu-item" id="'+ connectionName + '/"><a href="#">' + connectionName + '</a></li>'));
                        }
                    });
            }
            deferred.resolve(connections);
         });
        return deferred.promise();
    };

    ServerConfig.prototype.connectionList = function(){
        var self = this;
        var deferred = $.Deferred();
        var connectionList = {};
        $.each(this.connections,function(idx,connection){
            self.entities(idx).done(function(data){
                var mods = data['mods'];
                if(!mods){
                    mods = data;
                }
                connectionList[idx] = mods;
            }).error(function(){
                connectionList[idx] = idx;
            }).complete(function(){
                if(Object.keys(connectionList).length  ===  Object.keys(self.connections).length){
                    deferred.resolve(connectionList);
                }
            });
        });
        return deferred.promise();
    };
    
    ServerConfig.prototype.entities = function(connectionName){
        return new RestCollection(this.connections[connectionName]['url'] + "/api").find();
    };
    
    ServerConfig.prototype.getEndpoint = function(name) {
        if(name.startsWith("http") ||  name.startsWith("../")){
            return name;
        }
        var path = name.split('/');
        if(path.length > 1){
            if(this.connections[path[0]]){
                var ret = this.connections[path[0]]['url'];
                for(var i= 1;i<path.length;i++){
                    ret += '/' + path[i];
                }
                return  ret;
            }
        }
        return name;
    };

    ServerConfig.prototype.showServerConfig = function () {
        var self = this;
        var editor = $('<div></div>');
        editor.load("lacet/editor/lacet_connections.html", function() {
            bootbox.dialog({
                title: "Server Config",
                message: editor,
                size: 'large',
                className: 'ServerConfig',
                buttons: {
                    success: {
                        label: "Save",
                        className: "btn-success",
                        callback: function () {
                            self.saveServerConfig();
                        }
                    }
                }
            });
            
            $('.addConnection').unbind('click').bind('click',function(){
                var name = $('[name="name"]').val();
                var url = $('[name="url"]').val();
                self.connections[name] = {url:url};
                self.renderConnectionList();
            });
            self.renderConnectionList();
        });
    };

    ServerConfig.prototype.renderConnectionList = function(){
        var self = this;
        var body = jQuery('#connection_list');
        body.empty();
        $.each(this.connections,function(idx,data){
            var tr = jQuery('<tr class="connection_row"></tr>');
            tr.append('<td>' + idx + '</td>');
            tr.append('<td>' + data.url + '</td>');
            if(idx != 'self'){
                tr.append('<td><i id="'+ idx + '" class="remove_connection fa fa-remove"></i></td>');
            }
            body.append(tr);
        });

        $('.connection_row').unbind('click').bind('click',function(){
            $('[name="name"]').val($($(this).find('td').get(0)).html());
            $('[name="url"]').val($($(this).find('td').get(1)).html());
        });
        $('.remove_connection').unbind('click').bind('click',function(){
            var idx = $(this).attr('id');
            delete self.connections[idx];
            self.renderConnectionList();
        });

    };
    ServerConfig.prototype.loadConnections = function(){
        return window.connections.qry().getById('server_config');
    };
    ServerConfig.prototype.saveServerConfig = function(){
        var serverConfig = {_id:'server_config',connections:this.connections};
        window.connections.save(serverConfig);
    };
    
    window.serverConfig = new ServerConfig();
    // When the DOM is ready, run the application.
    jQuery(function () {
        window.serverConfig.init();
    });
    // Return a new application instance.
    return( window.serverConfig );
})(jQuery);
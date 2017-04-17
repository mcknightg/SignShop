jQuery.widget("aka.mapper", {
    options:{id:'html5CanvasId'},
    connection_array:null,
    html5Canvas:null,
    _create:function () {
        var self = this;
        this.connection_array = [];
        this.html5Canvas = document.createElement("canvas");

        jQuery(this.html5Canvas).attr('id', self.options.id);

        this._initMouseDown();
        this._initMouseMove();
        this._initMouseUp();

        this.element.scroll(function () {
            self._update();
        });
        this._update();
    },

    _setOption:function (key, value) {
        this.options[ key ] = value;
        this._update();
    },

    _update:function () {
        console.log('update');
        var self = this;
        this._resizeCanvas();
        jQuery.each(this.connection_array, function (index, connection) {
            self._drawLineBetweenElements(connection.src, connection.tgt);
        });
        this.element.prepend(this.html5Canvas);

    },
    _resizeCanvas:function () {
        var canvasDiv = jQuery(this.element);
        if (jQuery(this.html5Canvas).length > 0) {
            jQuery(this.html5Canvas)[0].width =  canvasDiv.width() + canvasDiv.scrollLeft();
            jQuery(this.html5Canvas)[0].height =  canvasDiv.height() + canvasDiv.scrollTop();
        }
    },
    removeConnection:function (connection) {

        var self = this;
        var conns = this.connection_array;
        for (var i = 0; i < conns.length; i++) {
            if (conns[i].tgt.get(0) === connection.tgt.get(0) && conns[i].src.get(0) === connection.src.get(0)) {
                conns.splice(i, 1);
                self._trigger("onRemoveConnection",'removeConnection',connection);
                jQuery(connection.src).removeClass("connection-node").removeClass('selectedNode');
                jQuery(connection.tgt).removeClass("connection-node").removeClass('selectedNode');

            }

        }
        self.update();
    },
    removeAllConnections:function(){
        this.connection_array = [];
        this.update();
    },
    destroy:function () {
        if (this.connection_array) {
            this.connection_array = null;
        }
        if (this.html5Canvas) {
            this.html5Canvas = null;
        }
        this.element.html("");
        jQuery.Widget.prototype.destroy.call(this);
    },
    update:function () {
        this._update();
    },
    resize:function () {
        this._resizeCanvas();
    },
    _bind_draggable_event:function(drag_element){
        var self = this;
        var  drag_selector = jQuery(drag_element);

        var parents =  drag_selector.parents();
        if(parents){
            jQuery.each(parents,function(i,parent){
                parent = jQuery(parent);
                if(parent.hasClass('draggable')){
                    drag_selector = parent;
                }
            });
        }

        if(drag_selector && drag_selector.hasClass('draggable')){
            drag_selector.unbind('drag').bind('drag',function(){
                self.update();
            });
        }
    },

    connect:function (source_element, target_element,data) {
        if(source_element && target_element){

            if(!data){
                data = {};
            }
            var connection =  {src:source_element, tgt:target_element,data:data};

            jQuery(source_element).addClass("connection-node");
            jQuery(target_element).addClass("connection-node");

            this._bind_draggable_event( source_element);
            this._bind_draggable_event( target_element);

            this.connection_array.push(connection);
            this._drawLineBetweenElements(source_element, target_element);
            console.log('Connection Made');
        }

    },
    getConnections:function () {
        return this.connection_array;
    },
    removeSelectedConnection:function () {
        var self = this;
        jQuery.each(this.connection_array, function (c, conn) {
            if (conn.src.hasClass('selectedNode') && conn.tgt.hasClass('selectedNode')) {
                self.removeConnection(self.connection_array[c]);
            }
        });
        self._update();

    },
    getTargetNode:function (sourceNode) {
        var self = this;
        jQuery.each(this.connection_array, function (index, connection) {
            if (jQuery(connection.src).get(0) === jQuery(sourceNode).get(0)) {
                return self.connection_array[index];
            }
        });
        return null;
    },
    getSourceNodes:function (targetNode) {
        var self = this;
        var connections = [];
        jQuery.each(this.connection_array, function (index, connection) {
            if (jQuery(connection.tgt).get(0) === jQuery(targetNode).get(0)) {
                connections.push(self.connection_array[index]);
            }
        });
        return connections;
    },

    createEndPoints:function (source_selector, target_selector) {
        var self = this;
        try {
            var startElement = null;
            jQuery(target_selector).each(function (index, jsontgtid) {
                var target_node = this;
                jQuery(target_node).droppable({
                    greedy:true,
                    drop:function (event, ui) {
                        self.connect(startElement, jQuery(this));
                        self._trigger("onDrop",'drop',{src:startElement,tgt:jQuery(this)});
                    }
                });

                jQuery(target_node).unbind('click').bind('click', function () {
                    jQuery('.connection-node').removeClass('selected_connection');
                    jQuery(this).addClass('selected_connection');
                });

                jQuery(target_node).unbind('dblclick').bind('dblclick', function () {
                    alert("Target Double Clicked");
                });

                jQuery(target_node).hover(
                    function () {
                        jQuery(target_node).addClass("hover-node");
                    },
                    function () {
                        jQuery(target_node).removeClass("hover-node");
                    }
                );
            });

            jQuery(source_selector).each(function (index, jsonsrcid) {
                var src_node = this;
                jQuery(src_node).unbind('click').bind('click', function () {
                    alert("Source Clicked");
                });
                jQuery(src_node).unbind('dblclick').bind('dblclick', function () {
                    alert("Source Double Clicked");

                });

                jQuery(src_node).hover(function () {
                    jQuery(src_node).addClass("hover-node");
                }, function () {
                    jQuery(src_node).removeClass("hover-node");
                });

                jQuery(src_node).draggable({
                    cursor:'hand',
                    zIndex:12000,
                    create:function (event, ui) {

                    },
                    start:function (event, ui) {
                        startElement = jQuery(this);
                    },
                    drag:function (event, ui) {
                        self._update();
                        self._drawLineBetweenElements(jQuery(this), jQuery("#" + self.id + 'helper'));
                    },
                    stop:function (event, ui) {
                        self._update();
                    },
                    helper:function (event) {
                        self._update();
                        return jQuery(src_node).clone(false, true).appendTo('body').attr('id', self.id + 'helper').css('zIndex', 5);
                    }
                });

            });
        }
        catch (e) {
            alert(e);
        }
        console.log('Mapper Endpoints Created');
    },
    findConnection:function(x,y,height,width){
        return this._findConnection(x,y,height,width);
    },
    _findConnection:function(x,y,height,width){

        if(!height){height = 1;}
        if(!width){width = 1;}
        var self = this;
        var canvas = document.getElementById(self.options.id);// e.target;
        var context = canvas.getContext('2d');
        var canvasOffsetX = jQuery(self.html5Canvas).offset().left;
        var canvasOffsetY = jQuery(self.html5Canvas).offset().top;
 
        var ret = null;
        jQuery.each(self.connection_array, function (index, connection) {
            if(connection && connection.src && connection.tgt && connection.src.offset() &&  connection.tgt.offset()){
                var sourceX = connection.src.offset().left + connection.src.width();// / 2;
                var sourceY = connection.src.offset().top + connection.src.height() / 2;

                var targetX = connection.tgt.offset().left;// + targetElement.width() ;// / 2;
                var targetY = connection.tgt.offset().top + connection.tgt.height() / 2;

                var objX =  sourceX  - ((sourceX - targetX)/2);
                var objY =  sourceY  - ((sourceY - targetY)/2);

                context.beginPath();
                context.arc( objX- canvasOffsetX, objY - canvasOffsetY,7, 0, 2 * Math.PI, false);
                for(var i = 0;i<height;i++){
                    for(var t=0;t<width;t++){
                        if (context.isPointInPath(i + x-canvasOffsetX,t+y-canvasOffsetY)) {
                            ret = connection;
                        }
                    }
                }
            }
        });
        return ret;
    },
    _initMouseUp:function(){
        var self = this;
        this.html5Canvas.onmouseup  = function (e) {
            var connection = self._findConnection(e.pageX,e.pageY);
            if(connection){
                self._trigger("onDrop",'drop',connection);

            }
        }
    },
    _initMouseMove:function(){
        /*
        var self = this;
        this.html5Canvas.onmousemove  = function (e) {
            var connection = self._findConnection(e);
            if(connection){
                self._trigger("onHover",'hover',connection);
            }
        }*/
    },
    _initMouseDown:function(){
        var self = this;
        this.html5Canvas.onmousedown  = function (e) {
            var connection = self._findConnection(e.pageX,e.pageY);
            if(connection){
                self._trigger("onMouseDown",'mouseDown',connection);
            }
        }
    },
     

    _drawLineBetweenElements:function (sourceElement, targetElement) {
        var color = 'gray';
        var lineWidth = 2;

        if(sourceElement.parent().parent().hasClass('selected_control') || targetElement.parent().parent().hasClass('selected_control')){
            color ='orange';
            lineWidth = 2;
        }

        if (sourceElement.offset() !== null && targetElement.offset() != null) {
            try{
                var sourceX = sourceElement.offset().left + sourceElement.width() ;// / 2;
                var sourceY = sourceElement.offset().top + sourceElement.height() / 2;

                var targetX = targetElement.offset().left;// + targetElement.width() ;// / 2;
                var targetY = targetElement.offset().top + targetElement.height() / 2;

                //you need to draw relative to the canvas not the page
                var canvasOffsetX = jQuery(this.html5Canvas).offset().left;
                var canvasOffsetY = jQuery(this.html5Canvas).offset().top;
                var context = jQuery(this.html5Canvas)[0].getContext('2d');
                //draw line
                context.lineWidth = lineWidth;
                context.strokeStyle = color; //black
                context.beginPath();
                context.moveTo(sourceX - canvasOffsetX, sourceY - canvasOffsetY);
                context.closePath();
                context.bezierCurveTo(sourceX - canvasOffsetX + 150, sourceY - canvasOffsetY + 10, targetX - canvasOffsetX - 150, targetY - canvasOffsetY - 10, targetX - canvasOffsetX, targetY - canvasOffsetY);
                context.stroke();
                context.moveTo((screen.width / 2) - canvasOffsetX + 150, targetY - canvasOffsetY);
                context.lineTo((screen.width / 2) - canvasOffsetX, targetY - canvasOffsetY);
                //Add Object on Center Line
                context.beginPath();
                var objX =  sourceX  - ((sourceX - targetX)/2);
                var objY =  sourceY  - ((sourceY - targetY)/2);
                // context.rect( objX- canvasOffsetX, objY - canvasOffsetY, 10, 10);
                context.arc( objX- canvasOffsetX, objY - canvasOffsetY,6, 0, 2 * Math.PI, false);
                context.fillStyle = "teal";
                context.fill();
                context.lineWidth = 1;
                context.strokeStyle = 'black';
                context.stroke();
                context.closePath();
            }catch(e){
                
            }


        }
    }
})(jQuery);
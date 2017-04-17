var FlowActivity =  Class.extend({

    init:function(activity){
        this.x = 20;
        this.y = 20;
        jQuery.extend(this,activity);
        if(!this.id){
            this.id = this.generateUUID();
        }
        this['@class'] = 'com.bluntsoftware.lib.conduit.construct.flow.FlowActivity';
        delete this.schema;
    },
    render:function(){
        var div =  jQuery('<div></div>')
            .css('position','absolute')
            .css('left',this.x + 270)
            .css('top',this.y )
            .css('height','50px')
            .css('width','50px')
            //.css('background-color','white')
            .css('border-radius','10px')
            .css('border', '2px solid #73AD21')
            .css('padding', '10px')
            .addClass('draggable')
            .addClass('selectable')
            .addClass('fa fa-2x ' + this.icon)
            .attr('kind',this.className)
            .attr('id',this.id);

        var leftConnection = jQuery('<i class="field-connect fa icon-resize-small fa-chevron-circle-left">')
            .css('position','absolute')
            .css('left',-13)
            .css('top',15)
            .css('color','gray')
            .css('font-size','60%');

        var rightConnection = jQuery('<i class="field-connect fa icon-resize-small fa-chevron-circle-right">')
            .css('position','absolute')
            .css('left',+42)
            .css('top',15)
            .css('color','gray')
            .css('font-size','60%');


        var name = jQuery('<p></p>')
            .css('position','absolute')
            .css('left',0)
            .css('text-align','center')
            .css('width', '100%')
            .css('top',55)
            .css('color','black')
            .css('font-size','50%').html(this.name);


        if(this.category !== "Input"){
            div.append(leftConnection);
        }

        div.append(rightConnection);
        div.append(name);

        return div;

    },
    generateUUID:function (){
        var d = new Date().getTime();
        if(window.performance && typeof window.performance.now === "function"){
            d += performance.now(); //use high-precision timer if available
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random()*16)%16 | 0;
            d = Math.floor(d/16);
            return (c=='x' ? r : (r&0x3|0x8)).toString(16);
        });
    }
});
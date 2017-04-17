var SnippetPanel = SnippetContainer.extend( {
    init: function ( name,kind) {
        this._super( name,kind);
        this.klass = "SnippetPanel";
        this.height = 100;
        this.type = 'SnippetPanel';
        this.content = null;
    },
    render:function(){

        var panel = jQuery('<div></div>').addClass('panel').addClass('{{panelColor}}').addClass('selectable');
        panel.addClass('container-padding');
        if(this.edit_mode){
            panel.attr('id',this.snip_id).addClass('moveable');
        }
        var header = jQuery('<div></div>').addClass('panel-heading editable-header');
        header.append("{{{header}}}");
        panel.append(header);

        var body = this._super();
        body.addClass('panel-body');
        panel.append(body);

        var footer = jQuery('<div></div>').addClass('panel-footer editable-footer');
        footer.append('{{{footer}}}');
        panel.append(footer);

        var func = Handlebars.compile(jQuery('<div></div>').append(panel).html());
        return jQuery(func(this.properties));
    }
});

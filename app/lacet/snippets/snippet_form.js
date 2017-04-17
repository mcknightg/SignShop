var SnippetForm =   SnippetContainer.extend( {
    init: function ( name,kind) {
        this._super(name,kind );
        this.klass = "SnippetForm";
        this.type = 'SnippetForm';
    },
    schema:function(){
        return {
            'id': 'bootstrap.form',
            'type': "object",
            'title': 'Panel',
            extends: [BootstrapHeader, BootstrapFooter],
            'properties': {
                endpoint: {title: 'Rest URL', 'type': 'string', default: './restapi',format:'endpointChooser'},
                'header': {'type': 'string', 'default': 'Form Header'},
                'footer': {'type': 'string', 'default': 'Form Footer'},
                'marginleft': {'type': 'string', 'default': '0px'},
                'panelColor': {
                    'type': 'string',
                    enum: ['panel-default', 'panel-warning', 'panel-success', 'panel-primary', 'panel-info', 'panel-danger'],
                    options: {enum_titles: ["Default", "Warning", "Success", "Primary", "Info", "Danger"]},
                    'default': 'panel-default'
                }
            }
        }
    },
    afterRender:function(){
        this._super();
        this.refreshData();
    },
    refreshData:function(){
        var self = this;
        var id = this.getSessionVars().id;
        var form = jQuery('#' + this.snip_id);
        if(id && id !== ''){
            form.attr('data-id',id);
            var service = new RestCollection(window.serverConfig.getEndpoint(this.properties.endpoint));
            service.getById(id,function(data){
                self.fillForm(data);
            });
        } 
    },
    fillForm:function(data){
        var self = this;
        var form = jQuery('#' + this.snip_id);
        //Magic
        jQuery.expr[':'].parents = function(a,i,m){
            return jQuery(a).parents(m[3]).length < 1;
        };
        //Exclude fields in a form list
        form.find('[name]').filter(':parents(.form-list)').each(function(){
            try{
                var val = eval('data.'+ jQuery(this).attr('name'));
                if(val){
                    jQuery(this).val(val).change();
                } 
            }catch(e){
                console.log('SnippetForm:fillForm -> ' + e);
            }
        });
    },

    getFields:function(){
        var fields = [];
        this.findFieldsByEndpoint(this.properties.endpoint,fields);
        console.log(fields);
        return fields;
    },
 
    submitForm:function(){
        var deferred = $.Deferred();
        var self = this;
        var form = jQuery('#' + this.snip_id);
        var id = form.attr('data-id');
        var fields = this.getFields();
        var data = {};
        var submit = true;
        $.each(fields,function(idx,snippet){
            var fieldName = snippet.properties.name;
            if(fieldName){
                var val  = form.find('[name="'+ fieldName + '"]').val();
                if(snippet.properties.required && !val){
                    form.find('[name="'+ fieldName + '"]')
                        .css('border-color','red')
                        .css('border-width','1px')
                        .css('border-style','solid');
                    submit= false;
                }else{
                    form.find('[name="'+ fieldName + '"]').css('border-color','black');
                }

                //Lets do some validation
                // if(snippet.properties.submit){
                data[fieldName] = val;
                // }
            }
        });
        console.log('Validation Complete');
        if(submit){
            console.log(this.properties.endpoint);
             var service = new RestCollection(window.serverConfig.getEndpoint(this.properties.endpoint));
             service.save(data).done(function(data){
                 self.fillForm(data);
                 deferred.resolve(data);
             }).error(function(message){
                 console.log(message);
             });
        }
        return deferred.promise();
    },
    render:function(){
        var panel = jQuery('<div></div>').addClass('panel').addClass('{{panelColor}}');

        panel.attr('id',this.snip_id);
        if(this.edit_mode){
            panel.addClass('selectable');
            panel.addClass('container-padding');
            panel.addClass('moveable');
        }
        var header = jQuery('<div></div>').addClass('panel-heading');
        var text = jQuery('<p></p>').addClass('editable-header');
        text.append("{{{header}}}");
        header.append(text);
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

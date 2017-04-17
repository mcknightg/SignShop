var SnippetFormList =   SnippetContainer.extend({
    init: function ( name,kind) {
        this._super(name,kind );
        this.klass = "SnippetFormList";
        this.type = 'SnippetFormList';

    },
    schema:function(){
        return {
            id: 'bootstrap.form',
            type: "object",
            title: 'Form List',
            properties: {
                endpoint: {title: 'Rest URL', type: 'string', default: './restapi',format:'endpointChooser'},
                label: {type: 'string', default: 'Label'},
                readonly:{'type': 'boolean',enum: [false,true], options: { enum_titles: ["No","Yes"]},'default':false},
                marginleft: {type: 'string', default: '0px'},
                criteria:{ title: "Criteria",type: "array",  format:'table',uniqueItems: true,
                    disable_collapse:false,
                    items: {
                        type: "object",
                        title: "Option",
                        headerTemplate: "{{ i1 }}",
                        properties:{
                            field:{'type':'string',format:'columns', default: 'id', "watch": {"endpoint": "endpoint"}},
                            operator:{'type': 'string',enum:["eq","icn","be","ew","gt","lt"] ,
                                options: { enum_titles: ['Equals','Contains','Begins With','Ends With','Greater Then','Less Then']},'default':'eq'},
                            value: {'type': 'string',format:'fieldChooser',default: 'id'}
                        }
                    },default:[

                    ]
                }
            }
        }
    },
    getFieldValue:function(fieldname){
        var self = this;
        var ret = undefined;
        jQuery('#view-content').find("[name='" + fieldname + "']").each(function(){
            var val =  jQuery(this).val();
            if(val){
                ret = val;
            }
        }).change(function () {
            self.refreshFormList();
        });
        return ret;
    },
    getQuery:function(){
        var self = this;
        var url = window.serverConfig.getEndpoint(this.properties.endpoint);
        this.service = new PagedCollection(url);
        var query = this.service.qry();

        if(this.properties.criteria){
            $.each(this.properties.criteria,function(idx,criteria){
                var val = self.getFieldValue(criteria.value);
                query.add(criteria.field,criteria.operator,val);
            });
        }
        return query;
    },
    submitFormList:function(){

        var promises = [];
        if(!this.properties.readonly){
            var self = this;
            var panelRow = jQuery('#list' + this.snip_id).find('.form-row');
            var service = new RestCollection(window.serverConfig.getEndpoint(self.properties.endpoint));
            panelRow.each(function(){
                var deferred = $.Deferred();
                var data = {'id':$(this).attr('data-id')};
                $(this).find('[name]').each(function(){
                    var fieldName = $(this).attr('name');
                    data[fieldName] = $(this).val();
                });
                //Now the criteria fields
                if(self.properties.criteria){
                    $.each(self.properties.criteria,function(idx,criteria){
                        var val = self.getFieldValue(criteria.value);
                        data[criteria.field] = val;
                    });
                }
                service.save(data).done(function(data){
                    promises.push(deferred);
                }).error(function(message){
                    console.log(message);
                });
            });
        }
        return $.when.apply($, promises).promise();
    },
    refreshFormList:function(){
        if(!this.edit_mode){
            var self = this;
            var formTemplate =  this.private['form_template'];
            var snippet = jQuery('#list' + self.snip_id);
            var panelBody = snippet.find('.form-list');

            this.getQuery().find().done(function (json) {

                panelBody.empty();
                $.each(json.rows,function(idx,data){
                    var formRow = jQuery('<div data-id="'+ data.id + '"></div>').addClass('form-row');
                    var form = jQuery(formTemplate).clone();
                    form.find('[name]').each(function(){
                        try{
                            var jPath = 'data.'+ jQuery(this).attr('name');
                            var val = eval(jPath);
                            jQuery(this).val(val).change();
                        }catch(e){
                              console.log(e);
                        }
                    });
                    formRow.append(form);
                    panelBody.append(formRow);
                });

            }).complete(function(){

            });
        }  
    },
    addEmptyRow:function(){
        var self = this;
        var snippet = jQuery('#list' + self.snip_id);
        var panelBody = snippet.find('.form-list');
        var formRow = jQuery('<div></div>').addClass('form-row');
        formRow.append(this.private['form_template']);
        panelBody.append(formRow);
    },
    afterRender:function(){
        console.log('afterRender');
        var self = this;
        //self.addEmptyRow();
        jQuery('#list' + self.snip_id).find('.add-empty-row').unbind('click').bind('click',function(){
           console.log('Click add Empty Row');
            self.addEmptyRow();
        });
        if(this.properties.criteria && this.properties.criteria.length > 0){
            console.log(this.properties.criteria);
            $.each(this.properties.criteria,function(idx,criteria){
                $('[name="' + criteria.value + '"]').unbind('change.' + self.snip_id).bind('change.' + self.snip_id,function(){
                     self.refreshFormList();
                });
            });
        }else{
            self.refreshFormList();
        }

    },
    render:function(){
        var panel = jQuery('<div></div>');//.addClass('panel')
        panel.attr('id','list' + this.snip_id);
        if(this.edit_mode){
            panel.addClass('selectable');
            panel.addClass('container-padding');
            panel.addClass('moveable');
        }
        if(!this.properties.readonly) {
            panel.append('<i class="add-empty-row fa fa-plus-square-o pull-right"></i>');
        }
        if(this.properties.label){
            var header = jQuery('<label></label>').addClass('editable-label');
            header.append(this.properties.label);
            panel.append(header);
        }
        var body = jQuery('<div></div>').addClass('form-list');
        this.private['form_template'] = this._super();
        var formRow = jQuery('<div></div>').addClass('form-row');
        formRow.append(this.private['form_template']);
        body.append(formRow);
        panel.append(body);
        return jQuery('<div></div>').append(panel);
    }
});
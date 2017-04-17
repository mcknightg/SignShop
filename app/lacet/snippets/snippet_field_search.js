var SnippetSearchField = Snippet.extend( {
    init: function ( name,kind) {
        this._super(name,kind );
        this.klass = "SnippetSearchField";
        this.type = 'SnippetSearchField';
    },
    schema:function(){
        return {
            'title':'Search Field',
            'id':'bootstrap.search.field',
            'type': "object",
            'extends':BootstrapField,
            'properties': {
                endpoint: {title: 'Rest URL', 'type': 'string', default: './restapi',format:'endpointChooser'},
                'multiple':{'type': 'string',enum: ['', 'multiple'],options: { enum_titles: ["No","Yes"]},'default':''},
                field_value:{'type':'string',format:'columns', default: 'id', "watch": {"endpoint": "endpoint"}},
                display_value:{ title: "display_value",type: "array",  format:'table',uniqueItems: true,
                    disable_collapse:false,
                    items: {
                        type: "object",
                        title: "Add To Display Value",
                        headerTemplate: "{{ i1 }}",
                        properties:{
                            display_field:{'type':'string',format:'columns', default: 'id', "watch": {"endpoint": "endpoint"}}
                        }
                    },default:[

                    ]
                },
                criteria:{ title: "Criteria",type: "array",  format:'table',uniqueItems: true,
                    disable_collapse:false,
                    items: {
                        type: "object",
                        title: "Add Criteria",
                        headerTemplate: "{{ i1 }}",
                        properties:{
                            field:{'type':'string',format:'columns', default: 'id', "watch": {"endpoint": "endpoint"}},
                            operator:{'type': 'string',enum:["eq","icn","be","ew","gt","lt"] ,
                                options: { enum_titles: ['Equals','Contains','Begins With','Ends With','Greater Then','Less Then']},'default':'eq'},
                            value: {'type': 'string',format:'fieldChooser',default: 'id'}
                        }
                    },default:[

                    ]
                },
                field_map:{ title: "Field Map",type: "array",  format:'table',uniqueItems: true,
                    disable_collapse:false,
                    items: {
                        type: "object",
                        title: "Add Field Map",
                        headerTemplate: "{{ i1 }}",
                        properties:{
                            source:{'type':'string',format:'columns', default: 'id', "watch": {"endpoint": "endpoint"}},
                            target:{'type':'string',format:'fieldChooser',default: 'id'}
                        }
                    },default:[

                    ]
                }
            }
        }
    },
    render:function(){
        var snippet =  jQuery('<div></div>').attr('id',this.snip_id);
        if(this.edit_mode) {
            snippet.addClass('selectable').addClass('moveable');

        }
        var div = jQuery('<div></div>').addClass('control-group');
        var label = jQuery('<label></label>').addClass('control-label editable-label').html(this.properties.label);
        var controls = jQuery('<div class="controls"></div>');
        //{{>multiple}}
        var select = jQuery('<select></select>')
            .attr('id',this.properties.id)
            .attr('name',this.properties.name)
            .addClass('form-control')
            .addClass(this.properties.classes)
            .addClass(this.properties.inputsize);

        select.append('<option value="">New</option>');

        controls.append(select);
        div.append(label);
        div.append(controls);
        snippet.append(div);
        return snippet;
    },
    afterRender:function(){

        var self = this;
        var url = window.serverConfig.getEndpoint(this.properties.endpoint);
        var collection = new PagedCollection(url);
        var select = $('#' + this.snip_id).find('select');

        collection.find().done(function(data_list){

            $.each(data_list.rows,function(idx,row){

                var display_value = "";
                $.each(self.properties.display_value,function(idx,data){
                    display_value += row[data['display_field']];
                });

                select.append('<option value="'+ row[self.properties.field_value] + '">' + display_value + '</option>');
            });
            var form = self.findForm();
            if(form){// && form.klass === 'SnippetForm'
                console.log(form);
                form.refreshData();
            }
            select.unbind('change').bind('change',function(){
               collection.qry().eq('id',$(this).val()).find().done(function(item){
                   $.each(self.properties.field_map,function(idx,data){
                       try{
                           var found = eval('item.rows[0].'+ data['source']);
                           $('[name="'+ data['target'] + '"').val(found);
                       }catch(e){
                         console.log(e);
                       }
                   });
               });
            });
        });


    }
});
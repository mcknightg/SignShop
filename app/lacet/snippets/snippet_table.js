var SnippetTable = Snippet.extend({
    init: function (name,kind) {
        this._super(name,kind);
        this.klass = "SnippetTable";
        this.type = 'SnippetTable';
    },
    schema:function(){
        return {
            title:'Table Properties',
            id:'bootstrap.table',
            properties: {
                endpoint: {title:'Rest URL','type':'string',default: '',format:'endpointChooser'},
                rows: {title:'Max Rows','type':'number', default: 20},
                hover:{title:'Hover','type':'boolean',default:'true'},
                striped:{title:'Stripe Rows','type':'boolean',default:'true'},
                bordered:{title:'Border','type':'boolean',default:'true'},
                marginleft: {'type': 'string', 'default': '0px'},
                label: {title:'Label','type':'string', default: ''},
                condensed:{title:'Condense Rows','type':'boolean',default:true},
                responsive:{title:'Scroll Columns','type':'boolean',default:false},
                add_form:{title:'Add Form','type': 'string',format:'link',default:''},
                edit_form:{title:'Edit Form','type': 'string',format:'link',default:''},
                sidx: {title:'Sort Index','type':'string',format:'columns', default: 'id',
                    "watch": {"endpoint": "endpoint"}},

                sord:{title:'Sort Order','type': 'string',enum: ['ASC', 'DESC'],
                    options: { enum_titles: ["Ascending","Descending"]},'default':'ASC'},
                columns:{ title: "Columns",type: "array",  format:'table',uniqueItems: true,
                    disable_collapse:false,
                    items: {
                        type: "object",
                        title: "Option",
                        headerTemplate: "{{ i1 }}",
                        properties:{
                            label: {'type': 'string', default: 'Id'},
                            name: {'type':'string',format:'columns', default: 'id',
                                "watch": {"endpoint": "endpoint"}},
                            format:{title:'Format','type': 'string',enum: ['text','image', 'icon'],
                                options: { enum_titles: ['Text',"Image","Icon"]},'default':'text'}
                        }
                    },default:[
                        {name:'id',label:'Id'}
                    ]
                },
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
    propertiesChanged:function(){
        this.service = null;
    },
    getColumns:function(cb){
         cb(this.properties.columns);
    },

    afterRender:function(){
        this._super();
        var self = this;
        if(this.properties.criteria){
            $.each(this.properties.criteria,function(idx,criteria){
                self.watchValueField(criteria.value);
            });
        }
        self.refresh();
    },
    watchValueField:function(fieldname){
        var self = this;
        jQuery('#view-content').find("[name='" + fieldname + "']").unbind('change.valuefield').bind('change.valuefield',function(){
            self.refresh();
        });
    },
    getFieldValue:function(fieldname){
        var ret = undefined;
        jQuery('#view-content').find("[name='" + fieldname + "']").each(function(){
            var val =  jQuery(this).val();
            if(val){
                ret = val;
            }
        });
        return ret;
    },
    getRows:function(cb){
        var self = this;
        var url = window.serverConfig.getEndpoint(this.properties.endpoint);
        if(!this.service ||  !$.isFunction(this.service.qry)  || url !== this.service.url ){
            this.service = new PagedCollection(url);
            this.service.sord = self.properties.sord;
            this.service.sidx = self.properties.sidx;
            this.service.rows = self.properties.rows;
        }
        var query = this.service.qry();
        var panel = $('#' + this.snip_id);

        panel.find('.filters').find('input').each(function(){
            var inputContent = $(this).val().toLowerCase();
            var column = panel.find('.filters th').index($(this).parents('th'));
             if(self.properties.columns[column]){
                 var colName = self.properties.columns[column]['name'];
                 if(inputContent){
                     query.icn(colName,inputContent);
                 }
             }
        });
         if(this.properties.criteria){
             $.each(this.properties.criteria,function(idx,criteria){
                 var val = self.getFieldValue(criteria.value);
                  console.log("find where " + criteria.field + " " + criteria.operator + " " + val );
                  query.add(criteria.field,criteria.operator,val);
             });
         }

        panel.find('.search').find('input').each(function(){
            var srchterm = $(this).val().toLowerCase();
            if(srchterm){
                jQuery.each(self.properties.columns,function(idx,column){
                    query.orMode().icn(column['name'],srchterm);
                });
            }
        });
        query.find(function (data) {
            if(cb){cb(data);}
        });
    },
    filterFields:function(){
        var self = this;
        var panel = $('#' + this.snip_id);

        panel.find('.btn-filter').unbind('click').bind('click',function(){
            var $panel = $(this).parents('.filterable'),
                $filters = $panel.find('.filters input'),
                $tbody = $panel.find('.table tbody');
            if ($filters.prop('disabled') == true) {
                $filters.prop('disabled', false);
                $filters.first().focus();
            } else {
                $filters.val('').prop('disabled', true);
                $tbody.find('.no-result').remove();
                $tbody.find('tr').show();
            }
        });

        panel.find('.filters').find('input').keyup(function(e){
            /* Ignore tab key */
            var code = e.keyCode || e.which;
            if (code == '9') return;
            self.service.setPage(1);
            self.getRows(function(data){
                self.drawTable(data);
            });
        });
        panel.find('.search').find('input').keyup(function(e){
            var code = e.keyCode || e.which;
            if (code == '9') return;
            self.service.setPage(1);
            self.getRows(function(data){
                self.drawTable(data);
            });
        });
    },
    refresh:function(cb){
        var self = this;
        self.getRows(function(data){
            self.drawTable(data);
            self.filterFields();
            if(cb){cb(data);}
        });
    },
    drawTable:function(data){
         var self = this;
         var columns = self.properties.columns;
         var rows = data.rows;
         var  body = jQuery('<tbody></tbody>');
         jQuery.each(rows,function(index,row){
             var id =  row['id'];
             if(!id){
                 id = row['_id'];
             }
             var tr = jQuery('<tr  id="' + id + '"></tr>');
             jQuery.each(columns,function(idx,column){
                 var val = eval('row.'+ column['name']);
                 if(!val){val = "";}
                 var format = column['format'];
                 if(format){
                      switch(format){
                          case 'text':
                              tr.append('<td>'+ val + '</td>');
                              break;
                          case 'image':
                              tr.append('<td><img style="max-height:65px" src="' + val+ '"/></td>');
                              break;
                      }
                 } else{
                     tr.append('<td>'+ val + '</td>');
                 }


             });
             body.append(tr);
         });
         var panel = $('#' + self.snip_id);

         panel.find('.page_number').html(data.currpage + " of " + data.totalpages);
             //data.currpage + ' of ' + data.totalpages + ' pages ' +
         var info = jQuery('<span></span>').addClass('pull-right').html('found ' + data.totalrecords + ' records');
         panel.find('.record_count').html(info);
         panel.find('.pager_next').unbind('click').bind('click',function(){

             self.service.nextPage();
             self.refresh();
         });
         panel.find('.pager_prev').unbind('click').bind('click',function(){
             self.service.previousPage();
             self.refresh();
         });
         panel.find('.column_sort').unbind('click').bind('click',function(){
            self.service.toggleSort();
            self.service.sidx = $(this).attr('data-sort');
            self.refresh();
         });
         panel.find('table').on('dblclick', 'tbody >tr', function () {
             var id = $(this).attr('id');

             if(self.properties.edit_form){
                  window.location =  self.properties.edit_form + '/' + id;
             }
        });

         var table = panel.find('table');
         table.find('tbody').html('');
         table.append(body);
     },

    render:function(){
        var self = this;
        var panel = jQuery('<div class="panel panel-default filterable"></div>');
        panel.attr('id',this.snip_id);

        if(this.edit_mode){
            panel.css('min-width','75px');
            panel.addClass('selectable');
        }

        var search = jQuery(
        '<div class="input-group search">'+
            '<input class="form-control input-sm" placeholder="Search for" >'+
            '<span class="input-group-btn">'+
                '<button type="submit" class="btn btn-round btn-sm btn-default"><i class="fa fa-search"></i></button>'+
                '<button class="btn btn-round btn-sm btn-default btn-filter"><i class="fa fa-filter"></i></button>'+
            '</span>'+
        '</div>');

        if(this.properties.label){
            var panel_header = jQuery('<div class="panel-heading"></div>');
            panel_header.append('<h3 class="panel-title">' + this.properties.label + '</h3>');
            panel_header.append(search);
            panel.append(panel_header);
        }

        var table = jQuery('<table class="table"></table>');
        if(this.properties.striped){
            table.addClass('table-striped');
        }
        if(this.properties.bordered){
            table.addClass('table-bordered');
        }
        if(this.properties.hover){
            table.addClass('table-hover');
        }
        if(this.properties.condensed){
            table.addClass('table-condensed');
        }

        var header = jQuery('<thead></thead>');
        var trow = jQuery('<tr class="filters"></tr>');
        jQuery.each(this.properties.columns,function(index,column){
            trow.append(
                '<th><div class="input-group input-group-unstyled">' +
                '<input type="text" class="form-control input-sm" placeholder="'+ column['label'] + '" disabled>  ' +
                '<span class="input-group-addon">' +
                '<i data-sort="' +column['name'] + '" class="text-muted column_sort fa fa-sort"></i>' +
                '</span>' +
                '</div></th>');
        });
        header.append(trow);
        table.append(header);
        table.append('<tbody></tbody>').append('<tr><td>No Data Found</td></tr>');

        var panel_body = jQuery('<div class="panel-body no-more-tables" ></div>');
        if(this.properties.responsive){
            panel_body.addClass('table-responsive');
        }
        panel_body.append(table);
        panel.append(panel_body);

        var panel_footer = jQuery('<div class="panel-footer"></div>');
        var requestedRows = jQuery('<div></div>').addClass('col-sm-4');
        if(!this.properties.label) {
         //   requestedRows.append(filter);
        }

        var pager = jQuery('<div></div>').addClass('col-sm-4').addClass('text-center');
        pager.append(jQuery('<div class="btn-group">' +
            '<a type="button" class="btn btn-xs btn-round btn-default pager_prev">Prev</a>' +
            '<a type="button" class="btn btn-xs btn-default page_number">1</a>' +
            '<a type="button" class="btn btn-xs btn-round btn-default pager_next">Next</a>' +
        '</div>'));

        var recordCount = jQuery('<div class="record_count"></div>').addClass('col-sm-4');
        var row = jQuery('<div></div>').addClass('row').addClass('container-padding');

        row.append(requestedRows);
        row.append(pager);
        row.append(recordCount);

        panel_footer.append(row);
        panel.append(panel_footer);
        self.template = panel.html();
       
        return panel;
    }
});
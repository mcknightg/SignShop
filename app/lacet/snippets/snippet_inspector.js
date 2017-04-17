var SnippetInspector =  Class.extend({
    init:function() {
        JSONEditor.defaults.options.theme = 'bootstrap3Custom';
        JSONEditor.defaults.theme = 'bootstrap3Custom';
        JSONEditor.defaults.iconlib = 'fontawesome4';
        JSONEditor.defaults.resolvers.unshift(function (schema) {
            if (schema.type === "string" && schema.format === "icon") {
                return "iconChooser";
            }else if( schema.format === "hidden"){
                return "hidden";
            }else if(schema.type === "string" && schema.format === "link"){
                return "linkChooser";
            }else if(schema.type === "string" && schema.format === "columns"){
                return "columnChooser";
            }else if(schema.type === "string" && schema.format === "fieldChooser"){
                return "fieldChooser";
            }else if(schema.type === "string" && schema.format === "endpointChooser"){
                return "endpointChooser";
            }else if(schema.type === "string" && schema.format === "formChooser"){
                return "formChooser";
            }
        });
    }
});

JSONEditor.defaults.editors.iconChooser = JSONEditor.defaults.editors.string.extend({
    afterInputReady: function() {
        this._super();
        var self = this;
        var span =  jQuery('<span class="input-group-btn"></span>');
        var button = jQuery('<button class="btn btn-default btn-sm" data-iconset="fontawesome" role="iconpicker"></button>');//.css('margin-top','25px');
        span.append(button);
        jQuery(this.input).parent().css('padding-left','15px').css('padding-right','15px').addClass("input-group").prepend(span);
        jQuery(button).iconpicker({placement:'top',icon: self.input.value}).on('change', function(e) {
            self.input.value = e.icon;
            self.value = self.input.value;
            self.is_dirty = true;
            self.onChange(true);
        });
    }
});

JSONEditor.defaults.editors.formChooser = JSONEditor.defaults.editors.string.extend({
    buildList:function(dropDown){
        var self = this;
        jQuery.each(window.lacetInspector.buildFormDropList(),function(index,column){
            var item = jQuery( column);
            item.unbind('click').bind('click', function(e) {
                e.preventDefault();

                self.input.value = $(this).find('a').html();
                self.value = self.input.value;
                self.is_dirty = true;
                self.onChange(true);
            });
            dropDown.append(item);
        });
    },
    afterInputReady: function() {
        this._super();
        var self = this;
        var span =  jQuery('<div class="input-group-btn"></div>');
        var button = jQuery('<button class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown"></button>');
        button.append('<span class="caret"></span>');
        var dropDown =  jQuery('<ul class="dropdown-menu scrollable-menu"></ul>');
        self.buildList(dropDown);
        span.append(button);
        span.append(dropDown);
        jQuery(this.input).css('min-width','175px').parent().css('padding-left','15px').css('padding-right','15px').addClass("input-group").prepend(span);
    }
});


JSONEditor.defaults.editors.endpointChooser = JSONEditor.defaults.editors.string.extend({
    buildList:function(dropDown){
        var self = this;
        dropDown.find('.endpoint-menu-item').unbind('click').bind('click', function(e) {
            e.preventDefault();
            self.input.value = $(this).attr('id');
            self.value = self.input.value;
            self.is_dirty = true;
            self.onChange(true);
        });
    },
    afterInputReady: function() {
        this._super();
        var self = this;

        var span =  jQuery('<div class="input-group-btn"></div>');
        var button = jQuery('<button class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown"></button>');
        button.append('<span class="caret"></span>');
        span.append(button);
        console.log("Create Endpoint Drop List");
        window.serverConfig.buildDropList().done(function(dropDown){
            self.buildList(dropDown);
            span.append(dropDown);
        });
        jQuery(this.input).css('min-width','175px').parent().css('padding-left','15px').css('padding-right','15px').addClass("input-group").prepend(span);
    }
});
JSONEditor.defaults.editors.fieldChooser = JSONEditor.defaults.editors.string.extend({
    buildList:function(dropDown){
        var self = this;
        var fields = [];
        jQuery('#main-content').find('[name]').each(function(){
            try{
                fields.push('<li><a>' + jQuery(this).attr('name') + '</a></li>');
            }catch(e){
                console.log(e);
            }
        });
        fields.sort();
        jQuery.each(fields,function(index,column){
            var item = jQuery( column);
            item.unbind('click').bind('click', function(e) {
                e.preventDefault();
                self.input.value = $(this).find('a').html();
                self.value = self.input.value;
                self.is_dirty = true;
                self.onChange(true);
            });
            dropDown.append(item);
        });
    },
    afterInputReady: function() {
        this._super();
        var self = this;

        var span =  jQuery('<div class="input-group-btn"></div>');
        var button = jQuery('<button class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown"></button>');
        button.append('<span class="caret"></span>');
        var dropDown =  jQuery('<ul class="dropdown-menu scrollable-menu"></ul>');
        self.buildList(dropDown);

        span.append(button);
        span.append(dropDown);
        jQuery(this.input).css('min-width','220px').parent().css('padding-left','15px').css('padding-right','15px').addClass("input-group").prepend(span);
    }
});
JSONEditor.defaults.editors.columnChooser = JSONEditor.defaults.editors.string.extend({
    buildList:function(endpoint,dropDown){
        var self = this;
        if(endpoint && endpoint !== 'none'){
            console.log("Found Endpoint " + endpoint);
            var service = new RestCollection(window.serverConfig.getEndpoint(endpoint));
            service.call('columns','','get',function(data){
                var local = [];
                var relation = [];

                jQuery.each(data.columns,function(index,column) {
                    if (column.includes(".")) {
                        relation.push('<li><a>' + column + '</a></li>');
                    } else {
                        local.push('<li><a>' + column + '</a></li>');
                    }
                });
                local.sort();
                local.push('<li class="divider"></li>');
                relation.sort();
                local = local.concat(relation);

                jQuery.each(local,function(index,column){
                    var item = jQuery( column);
                    item.unbind('click').bind('click', function(e) {
                        e.preventDefault();
                        self.input.value = $(this).find('a').html();
                        self.value = self.input.value;
                        self.is_dirty = true;
                        self.onChange(true);
                    });
                    dropDown.append(item);
                });
            });
        }
    },
    afterInputReady: function() {
        this._super();
        var self = this;
        var endpoint = self.watched_values.endpoint;
        var span =  jQuery('<div class="input-group-btn"></div>');
        var button = jQuery('<button class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown"></button>');
        button.append('<span class="caret"></span>');
        var dropDown =  jQuery('<ul class="dropdown-menu scrollable-menu"></ul>');
        self.buildList(endpoint,dropDown);

        self.link_watchers.push(function(vars) {
            dropDown.html('');
            self.buildList(vars.endpoint,dropDown);
        });

        span.append(button);
        span.append(dropDown);
        jQuery(this.input).css('min-width','220px').parent().css('padding-left','15px').css('padding-right','15px').addClass("input-group").prepend(span);
    }
});
JSONEditor.defaults.editors.linkChooser = JSONEditor.defaults.editors.string.extend({
    buildList:function(dropDown){
        var self = this;
        window.pages.qry().find(function(data){
             var items = [];
            jQuery.each(data.rows,function(index,item) {
                items.push('<li><a href="#" id="'+ '#/lacet/' + item.name + '"> ' + item.name + '</a></li>');
            });
            items.sort();

            jQuery.each(items,function(index,jitem){
                var item = jQuery( jitem);
                item.unbind('click').bind('click', function(e) {
                    e.preventDefault();
                    self.input.value = $(this).find('a').attr('id');
                    self.value = self.input.value;
                    self.is_dirty = true;
                    self.onChange(true);
                });
                dropDown.append(item);
            });

        });
    },
    afterInputReady: function() {
        this._super();
        var span =  jQuery('<div class="input-group-btn"></div>');
        var button = jQuery('<button class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown"></button>');
        button.append('<span class="caret"></span>');
        var dropDown =  jQuery('<ul class="dropdown-menu"></ul>');
        this.buildList(dropDown);
        span.append(button);
        span.append(dropDown);
        jQuery(this.input).parent().css('padding-left','15px').css('padding-right','15px').addClass("input-group").prepend(span);
    }
});
JSONEditor.defaults.editors.hidden = JSONEditor.defaults.editors.string.extend({
    afterInputReady: function() {
        this._super();
        jQuery(this.label).parent().removeClass('form-group');
        jQuery(this.label).html('');
        jQuery(this.input).attr('type','hidden');
    }
});
JSONEditor.defaults.themes.bootstrap3Custom = JSONEditor.AbstractTheme.extend({
    getSelectInput: function(options) {
        var el = this._super(options);
        el.className += 'form-control';
        //el.style.width = 'auto';
        return el;
    },
    setGridColumnSize: function(el,size) {
        el.className = 'col-md-'+size;
    },
    afterInputReady: function(input) {
        if(input.controlgroup) return;
        input.controlgroup = this.closest(input,'.form-group');
        if(this.closest(input,'.compact')) {
            if(input.controlgroup){
                input.controlgroup.style.marginBottom = 20;
            }
        }

        // TODO: use bootstrap slider
    },
    getTextareaInput: function() {
        var el = document.createElement('textarea');
        el.className = 'form-control';
        return el;
    },
    getRangeInput: function(min, max, step) {
        // TODO: use better slider
        return this._super(min, max, step);
    },
    getFormInputField: function(type) {
        var el = this._super(type);
        if(type !== 'checkbox') {
            el.className += 'form-control';
        }
        return el;
    },
    getFormControl: function(label, input, description) {
        var group = document.createElement('div');

        if(label && input.type === 'checkbox') {
            group.className += ' checkbox';
            label.appendChild(input);
            label.style.fontSize = '14px';
            group.style.marginTop = '0';
            group.appendChild(label);
            input.style.position = 'relative';
            input.style.cssFloat = 'left';
        }
        else {
            group.className += ' form-group-sm ';
            if(label) {
                label.className += ' control-label';
                label.className += ' col-sm-3';

                group.appendChild(label);
            }

            var inputCol10 = document.createElement('div');
            inputCol10.className += ' col-sm-9';
            inputCol10.appendChild(input);
            group.appendChild(inputCol10);
        }

        if(description) group.appendChild(description);

        return group;
    },
    getIndentedPanel: function() {
        var el = document.createElement('form');
        el.className = 'form-horizontal';
        el.style.paddingBottom = 0;
       // var tabList = jQuery('<ul></ul>').addClass('nav').addClass('nav-tabs').attr('role','tablist');
      //  jQuery(el).append(tabList);
        return el;
    },
    getFormInputDescription: function(text) {
        var el = document.createElement('p');
        el.className = 'help-block';
        el.innerHTML = text;
        return el;
    },
    getHeaderButtonHolder: function() {
        var el = this.getButtonHolder();
        el.style.marginLeft = '10px';
        return el;
    },
    getButtonHolder: function() {
        var el = document.createElement('div');
        el.className = 'btn-group';
        return el;
    },
    getButton: function(text, icon, title) {
        var el = this._super(text, icon, title);
        el.className += 'btn btn-default btn-sm';
        return el;
    },
    getTable: function() {
        var el = document.createElement('table');
        el.className = 'table table-bordered';
        el.style.width = 'auto';
        el.style.maxWidth = 'none';
        return el;
    },

    addInputError: function(input,text) {
        if(!input.controlgroup) return;
        input.controlgroup.className += ' has-error';
        if(!input.errmsg) {
            input.errmsg = document.createElement('p');
            input.errmsg.className = 'help-block errormsg';
            input.controlgroup.appendChild(input.errmsg);
        }
        else {
            input.errmsg.style.display = '';
        }

        input.errmsg.textContent = text;
    },
    removeInputError: function(input) {
        if(!input.errmsg) return;
        input.errmsg.style.display = 'none';
        input.controlgroup.className = input.controlgroup.className.replace(/\s?has-error/g,'');
    },
    getTabHolder: function() {
        var el = document.createElement('div');
        el.innerHTML = "<div class='tabs list-group col-md-2'></div><div class='col-md-10'></div>";
        el.className = 'rows';
        return el;
    },
    getTab: function(text) {
        var el = document.createElement('a');
        el.className = 'list-group-item';
        el.setAttribute('href','#');
        el.appendChild(text);
        return el;
    },
    markTabActive: function(tab) {
        tab.className += ' active';
    },
    markTabInactive: function(tab) {
        tab.className = tab.className.replace(/\s?active/g,'');
    },
    getProgressBar: function() {
        var min = 0, max = 100, start = 0;

        var container = document.createElement('div');
        container.className = 'progress';

        var bar = document.createElement('div');
        bar.className = 'progress-bar';
        bar.setAttribute('role', 'progressbar');
        bar.setAttribute('aria-valuenow', start);
        bar.setAttribute('aria-valuemin', min);
        bar.setAttribute('aria-valuenax', max);
        bar.innerHTML = start + "%";
        container.appendChild(bar);

        return container;
    },
    updateProgressBar: function(progressBar, progress) {
        if (!progressBar) return;

        var bar = progressBar.firstChild;
        var percentage = progress + "%";
        bar.setAttribute('aria-valuenow', progress);
        bar.style.width = percentage;
        bar.innerHTML = percentage;
    },
    updateProgressBarUnknown: function(progressBar) {
        if (!progressBar) return;

        var bar = progressBar.firstChild;
        progressBar.className = 'progress progress-striped active';
        bar.removeAttribute('aria-valuenow');
        bar.style.width = '100%';
        bar.innerHTML = '';
    }
});


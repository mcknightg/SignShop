(function () {
    function LacetEditor() {
        this.shortCuts = true;
    }
    LacetEditor.prototype.enableShortCuts = function(){
        this.shortCuts = true;
    };
    LacetEditor.prototype.disableShortCuts = function(){
        this.shortCuts = false;
    };
    
    LacetEditor.prototype.init = function (element) {
        var that = this;
        $(element).load("lacet/editor/lacet_editor.html", function(responseTxt, statusTxt, xhr){
            if(statusTxt == "success"){
                window.lacetEastPanel.init().done(function(){
                    that.run();
                });
            }else if(statusTxt == "error"){
                console.log("Error: " + xhr.status + ": " + xhr.statusText);
            }
        });
    };
    LacetEditor.prototype.newPage = function(){
        this.newView();
        this.render();
    };
    LacetEditor.prototype.showPage = function (data) {
        this.page = this.page.loadObject(data);
        this.render();
    };
    LacetEditor.prototype.addSnippet = function (snippet,insertAbove) {
         
        if(this.selectedcontrol && this.selectedcontrol && this.selectedcontrol.isContainer()){
            this.selectedcontrol.add(snippet,insertAbove);
        }else{
            this.page.add(snippet,insertAbove);
        }
        this.render();
    };
    LacetEditor.prototype.run = function () {
        window.lacetEditor.selectedcontrol = null;
        window.lacetEditor.maincontent = jQuery('#main-content')
            .css('padding', '10px')
            .css('outline', '1px solid lightgray')
            .css('margin-bottom','10px');
        this.loadLocal();
        this.render();
    };
    //Render the page and initialize the event handlers
    LacetEditor.prototype.render = function(){
        var controls = jQuery('.selected_control');
        this.renderCSS();
        var html  = this.page.render(window.lacetEditor.maincontent);
       // html.find( "nav").removeClass("navbar-fixed-top");


        this.saveLocal();
        this.initResizeable();
        this.initSelectable();
        this.initDragAndDrop();
        this.initEditable();
        this.initTabs();
        this.reSelectControls(controls);
        this.enableShortCuts();
    };
    LacetEditor.prototype.renderCSS = function(){
        var styles =  this.page.compileCSS();
        var snippetStyles = jQuery('#snippetStyles');
        if(snippetStyles.length == 0){
            $("head").append(jQuery('<style id="snippetStyles"></style>'));
            snippetStyles = jQuery('#snippetStyles');
        }
        snippetStyles.html('');
        $.each(styles,function(index,style){
            try{
                snippetStyles.append(style);
            }catch(e){

            }
        });
    };
    //Initialize Resizeable
    LacetEditor.prototype.initResizeable = function(){
        var that = this;
        jQuery(".resizeable").resizable({
            aspectRatio:false,
            handles:'e',
            minWidth:20,
            helper: "ui-resizable-helper",
            minHeight:20,
            ghost:true,
            autoHide:true,
            stop:function (event, ui) {

                event.stopImmediatePropagation();
                var control = that.getById(event.target.id);
                var parent = control.private.parent;//that.getById(control.parent);
                //For Resizing Column in a SnippetRow
                if(parent && parent.type === 'SnippetRow'){

                    console.log('resizable event fired on ' + event.target.id + "Parent = " + parent.snip_id);

                    var tileWidth = jQuery('#' + parent.snip_id).width()/12;
                    var direction = Math.round((ui.size.width -ui.originalSize.width)/tileWidth);
                    
                     parent.adjustColumns(control.snip_id,direction);
                }
                that.render();
                return true;
            }
        });
    };
    //Save the current page to cache
    LacetEditor.prototype.saveLocal = function(){
      
        
        localStorage["snippetData"] =  this.page.save();
    };
    //Load that last cached page
    LacetEditor.prototype.loadLocal = function(){
        this.newView();
        var snippetData = localStorage["snippetData"];
        //console.log(snippetData);
        if(snippetData && snippetData != null && snippetData !== 'undefined'){
            this.page = this.page.load(snippetData);
            if(window.lacetEastPanel){
                window.lacetEastPanel.updatePageName();
            }
        }
    };
    //A New Empty View
    LacetEditor.prototype.newView = function () {
        var that = this;
        this.page = new SnippetContainer("Untitled");

        jQuery(window.lacetEditor.maincontent).mouseover(function () {
            that.page.showBorders();
        });
        jQuery(window.lacetEditor.maincontent).mouseout(function () {
            that.page.hideBorders();
        });
        this.initKeyHandlers();
    };
    LacetEditor.prototype.cut = function(){
        var selected = this.selectedcontrol;
        if(selected){
            localStorage["clipboard"] = JSON.stringify(selected,selected.privateVariables);
            window.lacetEditor.page.remove(selected);
            this.render();
        }
    };
    LacetEditor.prototype.copy = function(){
        var selected = this.selectedcontrol;
        if(selected){
            localStorage["clipboard"] = JSON.stringify(selected,selected.privateVariables);
        }
    };
    LacetEditor.prototype.paste = function(){
        if(this.selectedcontrol && this.selectedcontrol.isContainer()){
            var snippet = this.selectedcontrol.loadObject(JSON.parse(localStorage["clipboard"]));
            this.selectedcontrol.add(snippet);
            this.render();
        }
    };
    //Initialize Editable
    LacetEditor.prototype.initEditable = function(){
        var that = this;
        //jQuery(".editable-label,.editable-header,.editable-text,.editable-linkText").unbind('dblclick').bind('dblclick',function(){
        //jQuery(snippet).find(':hasClassStartingWith("editable-")').removeClass (function (index, css) {
        // return (css.match (/\editable-\S+/g) || []).join(' ');
        //});
        //noinspection CssInvalidPseudoSelector
        jQuery(":hasClassStartingWith('editable-')").unbind('dblclick').bind('dblclick',function(event){
            event.stopPropagation();
            event.preventDefault();
            that.disableSorting();
             that.disableShortCuts();
            that.editing = true;
            jQuery('.editable-text-check').each(function(){
                jQuery(this).click();
            });
            var selectedSnippet = that.findSnippet(jQuery(this));
            if(!selectedSnippet){
                selectedSnippet = that.getById(that.selectedcontrol.snip_id);
            }

            var clone = jQuery(this).clone();
            var textInfo = that.getTextInfo(jQuery(this));

            var editableText =  jQuery("<div></div>").attr('id','editor');

            //For editing labels
            if(clone.hasClass('editable-label')){
                editableText = jQuery("<input />").keyup(function(e){
                    if(e.keyCode == 13)  {
                        jQuery(this).trigger("enterKey");
                    }
                }).val(clone.html()).unbind("enterKey").bind("enterKey",function(){
                    jQuery(this).blur();
                }).blur(function(){
                    var index = clone.attr('index');

                    if(clone.hasClass('buttonlabel')){
                        selectedSnippet.setVal(['buttonlabel'], jQuery(this).val(),index);
                    }else{
                        selectedSnippet.setVal(['label'], jQuery(this).val(),index);

                    }
                    that.editing = false;
                    that.render();
                });
                jQuery(this).replaceWith(editableText);
                editableText.css('width', textInfo.width + 50).css('height',textInfo.height + 20);
            }else{ //Editing Rich Text HTML
                jQuery(".rich-te-config-box").addClass("show");
                var textBox = jQuery('<div></div>');
                textBox.append(editableText.html(textInfo.html).css('height',textInfo.height +30).css('width', textInfo.width ));
                textBox.append(jQuery('<a></a>').addClass('btn btn-primary').attr('title','save').append(jQuery('<i></i>').addClass('fa fa-check editable-text-check')));

                jQuery(this).replaceWith(textBox);
                jQuery('#main-content').mousedown(function(evt){
                    if(evt.target.id && evt.target.id === 'editor' || jQuery(evt.target).parents('#editor').length){
                        return;
                    }
                    jQuery('.editable-text-check').click();
                });
                jQuery('.editable-text-check').unbind('click').bind('click',function(){

                    var cleanHTML = jQuery('#editor').cleanHtml();

                    if(clone.hasClass('editable-header')){
                        selectedSnippet.setVal(['header'],cleanHTML);
                    }else if(clone.hasClass('editable-text')){
                        selectedSnippet.setVal(['text'],cleanHTML);
                    } else if(clone.hasClass('editable-linkText')){
                        selectedSnippet.setVal(['linkText'], cleanHTML);
                    } else if(clone.hasClass('editable-footer')){
                        selectedSnippet.setVal(['footer'], cleanHTML);
                    } else{
                        alert('Cannot Find Editable Class');
                    }

                    jQuery(".rich-te-config-box").removeClass("show");
                    that.editing = false;
                    that.render();

                });
                var editor =jQuery('#editor');

                var fonts = ['Serif', 'Sans', 'Arial', 'Arial Black', 'Courier',
                        'Courier New', 'Comic Sans MS', 'Helvetica', 'Impact', 'Lucida Grande', 'Lucida Sans', 'Tahoma', 'Times',
                        'Times New Roman', 'Verdana'],

                    fontTarget = $('[title=Font]').siblings('.dropdown-menu');
                fontTarget.html('');
                $.each(fonts, function (idx, fontName) {
                    fontTarget.append($('<li><a data-edit="fontName ' + fontName +'" style="font-family:\''+ fontName +'\'">'+fontName + '</a></li>'));
                });
                editor.wysiwyg();


                var editorOffset = editor.offset();
                //jQuery('#voiceBtn').css('position','absolute').offset({top: editorOffset.top, left: editorOffset.left+editor.innerWidth()-35});

            }

            editableText
                .css('background-color','transparent')
                .css('fontSize',textInfo.font_size).css('padding','5px')
                .css('cursor','text')
                .css('border','1px dashed lightgray')
                .css('outline','none') ;
            // .css('z-index','4000');
            jQuery(".theme-config-box").removeClass("show");
        });
    };
    //Initialize Selectable
    LacetEditor.prototype.initSelectable = function(){
        var that = this;

        jQuery('.selectable').unbind('click').bind('click', function (event) {
            if (!that.editing) {
                event.stopPropagation();
                if (!event.shiftKey) {
                    that.clearSelection();
                }
                jQuery(this).toggleClass('selected_control');

                var id = jQuery(this).attr('id');
                 console.log(id);
                that.selectedcontrol = that.getById(id);
                if (that.selectedcontrol.klass == 'SnippetTabRow') {
                    jQuery(event.target).tab('show');
                    if (that.selectedcontrol.activeTab != jQuery(event.target).parent().index()) {
                        that.selectedcontrol.activeTab = jQuery(event.target).parent().index();
                        that.render();
                    }
                }
            }
        }).not(":hasClassStartingWith('editable-')").unbind('dblclick').bind('dblclick', function (event) {
            if(!that.editing){
                event.stopPropagation();
                window.lacetInspector.showInspector();
                jQuery(".theme-config-box").addClass("show");
            }

        });
    };
    //Render the selected snippet
    LacetEditor.prototype.renderSelected = function(){
        if (window.lacetEditor.selectedcontrol) {
            //var snippet = this.getById(window.lacetEditor.selectedcontrol.id);
            //console.log(snippet.render());
            var html =  window.lacetEditor.selectedcontrol.render();
            jQuery('#' + window.lacetEditor.selectedcontrol.snip_id).html(html.html());
            this.initEditable();
            this.initSelectable();
        }
    };
    //Utility Function
    LacetEditor.prototype.getTextInfo = function(element){
        var html = element.html();
        var height = element.height();
        var line_height = parseFloat(element.css('line-height'));
        var rows =  Math.round(height / line_height);
        return {'html':html,'height':height,'line_height':line_height,'rows':rows,'font_size':element.css('fontSize'),
            'width':Number(element.width())
        };
    };
    //Given any element find the snippet
    LacetEditor.prototype.findSnippet = function(elm){
        if(elm && elm.attr('id') && elm.attr('id').indexOf("snippet_") === 0){
            return this.getById(elm.attr('id'));
        }else if(elm.parent()){
            return this.findSnippet(elm.parent());
        }
        return null;
    };
    LacetEditor.prototype.disableSorting = function(){
        jQuery('.sortable').sortable('disable')
            .disableSelection('disabled')
            .unbind('click')
            .unbind('mousedown')
            .unbind('mouseup')
            .unbind('selectstart')
            .unbind('dblclick');
    };
    
    
    LacetEditor.prototype.clearSelection = function () {
        var that = this;
        jQuery.each(jQuery('.selected_control'), function () {
            jQuery(this).removeClass('selected_control');
            that.selectedcontrol = null;
           // that.showInspector();
        });
    };
    LacetEditor.prototype.listSelectedControls = function () {
        var that = this;
        var control_list = [];
        jQuery('.selected_control').each(function () {
            var control = that.getById(jQuery(this).attr('id'));
            control_list.push(control);
        });
        return  control_list;
    };
    LacetEditor.prototype.deleteSelected = function(){
        jQuery.each(this.listSelectedControls(),function(index,snippet){
            window.lacetEditor.page.remove(snippet);
        });
        this.render();
    };
    LacetEditor.prototype.reSelectControls = function(controls){
        jQuery.each(controls,function(index,control){
            jQuery('#' + control.snip_id).addClass('selected_control');
        });
    };
    LacetEditor.prototype.getById = function(id){
        return window.lacetEditor.page.getById(id);
    };
    //Initialize Tabs
    LacetEditor.prototype.initTabs = function(){
        jQuery('.nav-tabs .active').tab('show');
        jQuery('[role="iconpicker"]').iconpicker();
    };
    //Initialize KeyHandlers
    LacetEditor.prototype.initKeyHandlers = function(){
        var self = this;
        jQuery(document).unbind('keydown');
        jQuery(document).unbind('keyup');
        jQuery(document).bind('keydown',function(event){
           if(self.shortCuts) {
               switch (event.which) {
                   case 46://DELETE
                       event.preventDefault();
                       self.deleteSelected();
                       return true;
                       break;
                   case 88:  //X
                       if (event.ctrlKey) {
                           self.cut();
                       }
                       return true;
                       break;
                   case 67:  //C
                       if (event.ctrlKey) {
                           self.copy();
                       }
                       return true;
                       break;
                   case 86:  //V
                       if (event.ctrlKey) {
                           self.paste();
                       }
                       return true;
                       break;
               }
           }
        });

    };
    //Initialize  DragAndDrop and Sortable
    LacetEditor.prototype.initDragAndDrop = function(){
        var newId = null;
        var that = this;

        jQuery('.sortable').sortable({
            opacity:0.50,
            connectWith:".sortable",
            forcePlaceholderSize: true,
            forceHelperSize: true,
            tolerance:'pointer',
            receive:function(ev,ui){

                //jQuery('.container-padding').css('padding','25px');
                ev.stopImmediatePropagation();
                var container = that.getById(ev.target.id);
                if(!container || !container.isContainer()){
                    container = that.getById( container.parent);
                }

                if(container  && container.isContainer() && ui.item.hasClass('dropbang')){
                    var snippet = window.lacetEastPanel.getSnippetByName(ui.item.attr('klass'));
                    var clonedItem = snippet.clone();
                    newId= clonedItem.snip_id;
                    container.add(clonedItem);
                }else{
                    var sortableSnippet = that.getById(ui.item.attr('id'));
                    if(sortableSnippet){
                        if(!container || !container.isContainer()){
                            container = that.getById( sortableSnippet.parent);
                        }
                        if(container && container.isContainer()){
                            var sourceContainer =  that.getById( sortableSnippet.parent);
                            if(sourceContainer){
                                sourceContainer.remove(sortableSnippet);
                                container.add(sortableSnippet);
                            }
                        }
                    }
                }
            },

            update:function (event, ui) {
                console.log('update receive event fired for ' + event.target.id);
                var container = that.getById(event.target.id);
                if(!container || !container.isContainer()){
                    var sortableSnippet = that.getById(ui.item.attr('id'));
                    if(sortableSnippet){
                        container = that.getById( sortableSnippet.parent);
                    }
                }
                if(container && container.isContainer()){
                    var itemId =  ui.item.attr('id');
                    var oldIndex = container.snippetIndex(itemId);
                    if(!oldIndex && newId){
                        oldIndex =container.snippetIndex(newId);
                    }
                    if(oldIndex != null){
                        var newIndex = ui.item.index();
                        if(newIndex < container.snippets.length){
                            container.move(oldIndex,newIndex);
                        }
                    }
                }
                that.render();
                return true;
            }
        });
    };
    window.lacetEditor = new LacetEditor();
    // When the DOM is ready, run the application.
    jQuery(function () {
         
    });
    // Return a new application instance.
    return( window.lacetEditor );
})(jQuery);
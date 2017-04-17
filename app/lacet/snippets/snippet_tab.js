var SnippetTabContainer =   SnippetContainer.extend( {
    init: function (  name) {
        this._super( name );
        this.klass = "SnippetTabContainer";
        this.type = 'SnippetTabContainer';
    }   ,
    isComponentContainer:function(){return false;}
});

var SnippetTabRow =   SnippetContainer.extend( {
    init: function ( name) {
        this._super( name );
        this.klass = "SnippetTabRow";
        this.height = 100;
     //   this.backgroundColor = "#ffffff";
        this.type = 'SnippetTabRow';
        this.activeTab = 0;
    },
    add : function(snippet,above,tabcontent) {
        try {
           // alert(snippet.klass + " - " + this.klass + " active tab is " + this.activeTab);
            if(snippet.klass === this.klass){
                this._super(new SnippetTabContainer('Tab ' + (this.snippets.length+1)));
                return this;
            }else if( snippet.klass === 'SnippetTabContainer' ){
                this._super(snippet,above);
            }else{
                var container = this.snippets[this.activeTab];
                if(container && container.isContainer()){
                    container.add(snippet,above);
                }
            }

        }catch(e){
            console.log(e);
            console.log(snippet);
        }
    },
    setVal:function(name,value,index){

        this.snippets[this.activeTab].setVal(name,value,index);
    },
    render:function(){
        var that = this;
        var row = jQuery('<div></div>').addClass('tabbable').addClass('selectable');//.addClass('sortable');
        row.addClass('container-padding');
        if(this.edit_mode){
            row.attr('id',this.snip_id).addClass('moveable');//.css('background-color',this.backgroundColor);//).addClass('sortable')
        }

        if(this.snippets.length <1){
            var container = new SnippetTabContainer('Tab 1');
            //container.backgroundColor ='#555555';
            that.add(container,false,true);
        }

        var tabList = jQuery('<ul></ul>').addClass('nav').addClass('nav-tabs').attr('role','tablist');

        var contentList = jQuery('<div></div>').addClass('tab-content');
        jQuery.each(this.snippets,function(index,snippet){
            var label = null;
            if(snippet.properties){
                label = snippet.properties.label;
             }

            if(!label || label === '' ){
                label = 'Tab ' +index;
            }
            var tab = jQuery('<a></a>')
             .addClass('editable-label')
                 .attr('data-target','#'+snippet.snip_id)
                //.attr('href','#'+snippet.id)
                .attr('data-toggle','tab').html(label);
           if(index == that.activeTab){
                tab.addClass('active');
           }

            tabList.append(jQuery('<li></li>').append(tab));
            var content = snippet.render();

            content.addClass('tab-pane').attr('role','tabpanel').removeClass('sortable').attr('id',snippet.snip_id);
            content.find('.resizeable').removeClass('resizeable').addClass('hiddentab');
             if(index == that.activeTab){
               content.addClass('active').addClass('sortable');
                 content.find('.hiddentab').addClass('resizeable').removeClass('hiddentab');
            }
            contentList.append(content);
        });
        row.append(tabList);

        row.append(contentList);

        return row;
    }
});

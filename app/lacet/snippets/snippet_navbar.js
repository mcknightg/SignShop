var SnippetNavBarItem =   Snippet.extend({
    init:function(name,kind){
        this._super( name,kind);
        this.klass="SnippetNavBarItem";
    },
    schema:function(){
        return {
            'title':'Navigation Bar Item',
            'id':'bootstrap.navItem',
            'extends':this._super(),
            'properties': {
                'label': {'type': 'string', default: 'Link'},
                'link':{'type': 'string',format:'link',default:'http://bluntsoftware.com'},
                'type': {'type': 'string',enum: ['link','dropdown','button','search'], options: { enum_titles: ["link","dropdown","button","search"]},'default':'link'},
                'icon':{ 'type': 'string','format':'icon','default':''},
                'location': {'type': 'string',enum: ['navbar-left','', 'navbar-right'], options: { enum_titles: ["Left","Center","Right"]},'default':''}
            }
        }
    },
    render:function(){
        var lineItem = jQuery('<li></li>');
        var component = jQuery('<a></a>');
         if(this.properties.icon){
             component.append('<span class="fa '+this.properties.icon + '"></span>')
         }
        component.append('&nbsp;' +this.properties.label);
        lineItem.append(component);
        if(this.edit_mode){
            lineItem.addClass('sortable');
            component.attr('id',this.snip_id).addClass('selectable');
        }else{
            component.attr('href',this.properties.link);
        }

        return  lineItem;
    }
});

var SnippetNavBar =   SnippetContainer.extend({
    init: function (name,kind) {
        this._super(name,kind);
        this.klass = "SnippetNavBar";
        this.type = 'SnippetNavBar';
    },
    schema:function(){
        return {
            'title':'Navigation Bar',
            'id':'bootstrap.nav',
            'extends':this._super(),
            'properties': {
                'Brand': {'type': 'string', default: 'Brand'},
                'Image': {'type': 'string', default: null},
                'image_class':{'type':'string',default: null},
                'img_height': {'type': 'number', default: 30},
                'img_width': {'type': 'number', default: 30},
                'link':{'type': 'string',format:'link','default':'http://bluntsoftware.com'},
                'Inverse':{'type': 'boolean', default: false},
                'location': {'type': 'string',enum: ['navbar-fixed-top','navbar-fixed-bottom', 'navbar-static-top','navbar-static'], options: { enum_titles: ["Fixed Top","Fixed Bottom","Static Top","Static"]},'default':'navbar-fixed-top'}
            }
        }
    },
    add : function(snippet,above) {
        try {
            if( snippet.klass === 'SnippetNavBarItem' ){
                this._super(snippet,above);
            }
        }catch(e){
            console.log(e);
            console.log(snippet);
        }
    },
    render:function(){
        var that = this;
        var div = jQuery('<div></div>');

        var navBar = jQuery('<nav role="navigation"></nav>');
       // navBar.addClass('container-padding');
        div.attr('id',this.snip_id);
        navBar.addClass('navbar navbar-default');
        navBar.css('padding-right','25px');
        if(this.properties.Inverse === true){
            navBar.addClass('navbar-inverse');
        }
        var body = $('body');
        body.css('padding-top','0px');
        body.css('padding-bottom','0px');
        if(this.edit_mode){
            div.addClass('container-padding');
            div.addClass('selectable');
            navBar.addClass('sortable');
        }else{
            if(this.properties.location === 'navbar-fixed-top'){
                body.css('padding-top','50px');
            }
            if(this.properties.location === 'navbar-fixed-bottom'){
               body.css('padding-bottom','50px');
            }
            //if(this.properties.location === 'navbar-static'){

            //}
            navBar.addClass(this.properties.location);
        }
        var header = jQuery(
             '<div class="navbar-header">' +
                 '<button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#top_navbar">' +
                    '<span class="sr-only">Toggle navigation</span>' +
                    '<span class="icon-bar"></span>' +
                    '<span class="icon-bar"></span>' +
                    '<span class="icon-bar"></span>' +
                 '</button>' +
             '</div>');

        
             var brand = jQuery('<a class="navbar-brand"></a>');
             if(this.properties.link && !this.edit_mode){
                   brand.attr('href',this.properties.link);
             }
             if(this.properties.Image){
                 var image = jQuery('<img alt="Brand">');
                 image.addClass(this.properties.image_class);
                 image.attr('src',this.properties.Image).attr('height',this.properties.img_height).attr('width',this.properties.img_width);
                 brand.append(image);
             } else if(this.properties.Brand){
                 brand.append(this.properties.Brand);
             }
        header.append(brand);
         var content = jQuery('<div class="collapse navbar-collapse" id="top_navbar"></div>');
            var navLeft = jQuery('<ul class="nav navbar-nav navbar-left"></ul>');
            var navCenter = jQuery('<ul class="nav navbar-nav"></ul>');
            var navRight = jQuery('<ul class="nav navbar-nav navbar-right"></ul>');
            jQuery.each(this.snippets,function(index,snippet){

                if(snippet.properties.location == 'navbar-left'){
                    navLeft.append(snippet.render());
                } else if(snippet.properties.location == 'navbar-right'){
                    navRight.append(snippet.render());
                } else{
                    navCenter.append(snippet.render());
                }
            });
        content.append(navLeft);
        content.append(navCenter);
        content.append(navRight);
        navBar.append(header);
        navBar.append(content);
        div.append(navBar);
        return div;
    }
});
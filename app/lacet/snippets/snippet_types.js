var SnippetTypes =  Class.extend({
    snippet_templates:{},
    schemas:{},
    init:function(){
        this.snippetInspector =  new SnippetInspector();
        this.add(BootstrapSnippet).add(BootstrapField)
            .add(BootstrapText).add(BootstrapHeader)
            .add(BootstrapIcon).add(BootstrapLink)
            .add(BootstrapButton).add(BootstrapDoubleButton)
            .add(BootstrapSelect).add(BootstrapCarousel)
            .add(BootstrapLabelValue).add(BootstrapRadio)
            .add(BootstrapForm).add(BootstrapImage)
            .add(BootstrapJumbotron).add(BootstrapCheckbox)
            .add(BootstrapButtonGroup).add(BootstrapMovie)
            .add(BootstrapFooter).add(BootstrapPanel)
            .add(BootstrapNavLink).add(BootstrapSideBar)
            .add({
                id:'blunt.address',
                type:'object',
                title:'Address',
                properties:{
                    'text':{type:'string',format:'textarea','default':'<strong>Apple</strong><br/>1 Infinite Loop<br/>Cupertino, CA 95014<br/> <abbr title="Phone">P:</abbr> (408) 996-1010'}
                }
            }).add({
                id:'blunt.headertext',
                type:'object',
                title:'Header Text',
                extends:[BootstrapHeader,BootstrapText,BootstrapLink,BootstrapIcon]
            }).add({
                id:'blunt.media',
                type:'object',
                title:'Media',
                extends:[BootstrapHeader,BootstrapText,BootstrapImage],
                properties:{
                    'image':{'type': 'string','default':'img/no_pic.jpg'},
                    'responsive':{'type': 'string','default':''}
                }
            });


    },
    createValidSchema:function(snippet){
        var schema = {};
        schema['id'] = snippet.kind;
        schema['type'] = 'object';
        schema['title'] = snippet.name;
        try{
            schema['properties'] = JSON.parse(snippet.schema);
        }catch(e){
            schema['properties'] = {};
            console.log(e);
        }
        return schema;
    },
    registerSnippet:function(snippet){
         this.add(snippet.schema());
    },
    add:function(snippet){
        if(!snippet.id){
            alert('snippet must have a parameter named kind i.e {kind:"yourcompany.button"}');
        }
        if(this.schemas[snippet.id]){
            console.log('Snippet Type ' + snippet.id + ' already exists and will not be added');
        }else{
            this.schemas[snippet.id] = snippet;
        }
        return this;
    },
    getSchema:function(schema_type){
        if(this.schemas[schema_type]){
            return this.schemas[schema_type];
        }
        return {};
    },
    getDefaults:function(schema_type){
        var ret = {};
        var schema = this.getSchema(schema_type);
        if(schema){
            var editor = new JSONEditor(document.getElementById("temp"),{'schema':schema});
            ret= editor.getValue();
            editor.destroy();
        }
        return ret;
    }
});
Handlebars.registerPartial('id','{{#if id}} id="{{ id }}" {{/if}}');
Handlebars.registerPartial('classes','{{#if classes}} {{classes}} {{/if}}');
Handlebars.registerPartial('name','{{#if name}} name="{{ name }}" {{/if}}');
Handlebars.registerPartial('idNameField','{{>id}} {{>name}}');
Handlebars.registerPartial('readonly','{{#if readonly}}  readonly="readonly"  {{/if}}');
Handlebars.registerPartial('required','{{#if required}}  required="required"  {{/if}}');
Handlebars.registerPartial('checked','{{#if checked}}  checked="checked"  {{/if}}');
Handlebars.registerPartial('placeholder','{{#if placeholder}} placeholder="{{ placeholder }}"  {{/if}}');
Handlebars.registerPartial('multiple','{{#if multiple}} multiple="multiple"  {{/if}}');
Handlebars.registerPartial('selected','{{#if selected}} selected="selected"  {{/if}}');
Handlebars.registerPartial('inputsize','{{#if inputsize}} {{inputsize}}  {{/if}}');
Handlebars.registerPartial('helptext','{{#if helptext}} <p class="help-block">{{ helptext }}</p>  {{/if}}');
Handlebars.registerPartial('textfield','<input class="form-control {{classes}} {{ inputsize }}"  type="text" {{>idNameField}} {{>placeholder}} {{>required}} {{>readonly}}/>');
Handlebars.registerPartial('legend','{{#if legend}} <legend>{{ legend }}</legend> {{/if}}');
Handlebars.registerPartial('linkText','{{#if linkText}} <div><a class="btn editable-linkText" href="#">{{{linkText}}}</a></div>{{/if}}');
Handlebars.registerHelper('times', function(n, block) {
    var accum = '';
    for(var i = 1; i < n; ++i)
        accum += block.fn(i);
    return accum;
});
var handleBarsTemplate = {};
var BootstrapSnippet = {
    'id':'bootstrap.snippet',
    'type': "object",
    'properties':{
        id: {'type':'string',default: null},
        edit_mode: {'type':'boolean',format:'hidden',default: false},
        classes:{'type':'string',default: null}
    }
};
/*      .add(BootstrapNavBar)
var BootstrapNavBar = {
    'title':'Field',
    'id':'bootstrap.nav',
    'extends':BootstrapSnippet
};  */
var BootstrapField =  {
    'title':'Field',
    'id':'bootstrap.field',
    'type': "object",
    'extends':BootstrapSnippet,
    'properties': {
        'field_endpoint': {'title':'Rest URL','type':'string',format:'hidden',default: 'none'},
        'label':        {'type': 'string', default: 'Field',"watch": {"name": "name"}},
        'name':         {'type': 'string', format:'columns', default: 'id', "watch": {"endpoint": "field_endpoint"}},
        'submit':       {'title':'submit','type': 'boolean',enum: [false, true],options: { enum_titles: ["No","Yes"]},'default':true},
        'required':     {'type': 'string',enum: ['', 'required'],options: { enum_titles: ["No","Yes"]},'default':''},
        'readonly':     {'type': 'string',enum: ['', 'readonly'], options: { enum_titles: ["No","Yes"]},'default':''},
        'inputsize':    {'type': 'string',enum: ['input-sm','', 'input-lg'], options: { enum_titles: ["Small","Medium","Large"]},'default':''},
        'placeholder':  {'type': 'string','default': null},
        'helptext':     {'type': 'string','default': null}
    }
};
var BootstrapLabelValue= {
    'id':'bootstrap.labelValue',
    'type': "object",
    'properties': {
        'label': {'type': 'string','default': 'Label'},
        'value': {'type': 'string','default': 'Value'}
    }
};
var BootstrapForm= {
    'id':'bootstrap.form',
    'type': "object",
    'title':'Form',
    'properties': {
        'legend': {'type': 'string','default': 'My Awesome Form'},
        'type': {'type': 'string',enum: ['', 'form-inline','form-horizontal'],options: { enum_titles: ["None","Inline","Horizontal"]},'default':''}
    }
};
var BootstrapCheckbox = {
    'id':'bootstrap.checkbox',
    'type': "object",
    'title':"Checkbox",
    'extends': BootstrapField,
    'properties':{
        'inline':{'type': 'string',enum: ['checkbox', 'checkbox-inline'],options: { enum_titles: ["No","Yes"]},'default':'checkbox'},
        'checkboxes':{ type: "array",  format:'table',title: " ",uniqueItems: false,
            disable_collapse:false,
            items: {
                type: "object",
                title: "Option",
                "headerTemplate": "{{ i1 }}",
                'properties':{
                    'checked':{'type': 'string',enum: ['', 'checked'], options: { enum_titles: ["No","Yes"]},'default': ''}
                },
                "extends":BootstrapLabelValue
            },default:[
                {"label":"Checkbox 1","value":"1"},
                {"label":"Checkbox 2","value":"2"}
            ]
        }
    }
};
var BootstrapRadio = {
    'id':'bootstrap.radio',
    'type': "object",
    'title':"Radio",
    'extends': BootstrapField,
    'properties':{
        'inline':{'type': 'string',enum: ['radio', 'radio-inline'],options: { enum_titles: ["No","Yes"]},'default':'radio'},
        'name':{'type': 'string' ,'default':'choice'},
        'radios':{ type: "array",  format:'table',title: " ",uniqueItems: false,
            disable_collapse:false,
            items: {
                type: "object",
                title: "Option",
                "headerTemplate": "{{ i1 }}",
                'properties':{

                },
                "extends":BootstrapLabelValue
            },default:[
                {"label":"Radio 1","value":"1"},
                {"label":"Radio 2","value":"2"}
            ]
        }
    }
};
  //options   multiple
var BootstrapSelect = {
    'id':'bootstrap.select',
    'type': "object",
    'title':"Select",
    'extends': BootstrapField,
    'properties':{
        'multiple':{'type': 'string',enum: ['', 'multiple'],options: { enum_titles: ["No","Yes"]},'default':''},
        'options':{ type: "array",  format:'table',title: " ",uniqueItems: false,
            disable_collapse:false,
            items: {
                type: "object",
                title: "Option",
                "headerTemplate": "{{ i1 }}",
                'properties':{
                    'selected':{'type': 'string',enum: ['', 'selected'],options: { enum_titles: ["No","Yes"]},'default':''}
                },
                "extends":BootstrapLabelValue
            },default:[
                {"label":"Option 1","value":"1"},
                {"label":"Option 2","value":"2"}
            ]
        }
    }
};
var BootstrapText={
    'id':'bootstrap.text',
    'type': "object",
    'properties': {
        'text': {
            format:'textarea',
            'type': 'string',
            'default': 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
        }
    }
};
var BootstrapFooter={
    'id':'bootstrap.footer',
    'type': "object",
    'properties':{
        'footer':{ 'type': 'string','default':'What is Lorem Ipsum?'}
    }
};
var BootstrapHeader={
    'id':'bootstrap.header',
    'type': "object",
    'properties':{
        'header':{ 'type': 'string','default':'<h2>What is Lorem Ipsum?</h2>'}
    }
};
var BootstrapPanel={
    'id':'bootstrap.panel',
    'type': "object",
    'title':'Panel',
     extends:[BootstrapHeader,BootstrapText,BootstrapFooter],
    'properties':{
        'header':{ 'type': 'string','default':'Panel Header'},
        'text':{ 'type': 'string','default':'Panel Text'},
        'footer':{ 'type': 'string','default':'Panel Footer'},
        'panelColor':{'type': 'string',enum: ['panel-default', 'panel-warning', 'panel-success','panel-primary', 'panel-info', 'panel-danger'],
            options: { enum_titles: ["Default","Warning","Success","Primary","Info","Danger"]},'default':'panel-warning'}
    }
};
var BootstrapIcon={
    'id':'bootstrap.icon',
    'type': "object",
    'properties':{
        'icon':{ 'type': 'string','format':'icon','default':'fa-edit'}
    }
};
var BootstrapLink={
    'id':'bootstrap.link',
    'type': "object",
    'properties':{
        'link':{'type': 'string','format':'link','default':'http://bluntsoftware.com'}
    }
};
var BootstrapImage={
    'id':'bootstrap.image',
    'type': "object",
    'properties':{
        'image':{'type': 'string','default':'img/no_pic.jpg'},
        'responsive':{'type': 'string',enum: ['', 'img-responsive'],options: { enum_titles: ["No","Yes"]},'default':'img-responsive'},
        'imgtype':{'type': 'string',enum: ['','img-rounded','img-circle', 'img-thumbnail'], options: { enum_titles: ["Normal","Rounded","Circle","Thumbnail"]},'default':''}
    }
};
var BootstrapMovie={
    'id':'bootstrap.movie',
    'type': "object",
    'properties':{
        'movie':{'type': 'string','default':'http://www.youtube.com/embed/f8jX9wTG7go'}
    }
};
var BootstrapCarousel={
    'id':'bootstrap.carousel',
    'type': "object",
    'title':'Carousel',
    'extends':BootstrapSnippet,
    'properties':{
        'id':{default:'carousel_inSlider'},
        'scale':{'type': 'boolean','default':true},
        'carouselList':{ type: "array", title: " ",format:'tabs', uniqueItems: false,
            disable_collapse:false,
            items: {
                type: "object",
                title: "Panel",
                "headerTemplate": "{{ i1 }}",
                "extends": [BootstrapImage,BootstrapHeader,BootstrapText,BootstrapIcon]
            },
            default:[
                {"image":"img/header_one.png","icon":"fa-edit","header":"<h2>Carousel Panel 1</h2>","text":"Carousel text for Panel 1. Double click to edit"},
                {"image":"img/header_two.png","icon":"fa-edit","header":"<h2>Carousel Panel 2</h2>","text":"Carousel text for Panel 2. Double click to edit"}
            ]
        }
    }
};
var BootstrapNavLink={
    'id':'bootstrap.navlink',
    'title':'NavLink',
    'extends':[BootstrapSnippet,BootstrapIcon,BootstrapLink],
    'properties':{
        'label':{'type': 'string','default':'Link'}
    }
};
var BootstrapSideBar={
    'id':'bootstrap.sidebar',
    'title':'Sidebar',
    'extends':[BootstrapSnippet],
    'properties': {
        'brand': {'type': 'string', 'default': 'Side Nav'},
        'navList': {
            type: "array", title: " ", format: 'tabs', uniqueItems: false,
            disable_collapse: false,
            items: {
                type: "object",
                title: "Link",
                "headerTemplate": "{{ i1 }}",
                "extends": [BootstrapNavLink]
            }, default: [
                {"label": "Home", "id": "","icon": "fa-dashboard", "link": "#Home"},
                {"label": "About", "id": "", "icon": "fa-dashboard", "link": "#About"},
                {"label": "Contact", "id": "","icon": "fa-dashboard", "link": "#Contact"},
                {"label": "Photos", "id": "", "icon": "fa-dashboard", "link": "#Photos"},
                {"label": "Videos", "id": "", "icon": "fa-dashboard", "link": "#Videos"}
            ]
        }
    }
};
var BootstrapButton={
    'id':'bootstrap.button',
    'title':'Button',
    'extends':[BootstrapSnippet,BootstrapIcon,BootstrapLink],
    'properties':{
        'submit':{'type': 'string',format:'formChooser','default':''},
        'label':{'type': 'string','default':'Single Button'},
        'buttontype':{'type': 'string',enum: ['btn-default', 'btn-warning', 'btn-success','btn-primary', 'btn-info', 'btn-danger'],
            options: { enum_titles: ["Default","Warning","Success","Primary","Info","Danger"]},'default':'btn-warning'},
        'buttonsize':{'type': 'string',enum: ['btn-xs', 'btn-sm','btn-md', 'btn-lg'],
            options: { enum_titles: ["Extra Small","Small","Medium","Large"]},'default':'btn-md'},
        'buttonlabel':{'type': 'string','default':'Button Label'},
        'fullwidth':{'type': 'string',enum: ['', 'btn-block'],options: { enum_titles: ["Label Width","Column Width"]},'default':''}
    }
};



var BootstrapDoubleButton={
    'title':'Multiple Buttons',
    'id':'bootstrap.doubleButton',
    'properties':{
        'edit_mode': {'type':'boolean',format:'hidden',default: false},
        'buttonsize':{'type': 'string',enum: ['btn-xs', 'btn-sm','btn-md', 'btn-lg'],
            options: { enum_titles: ["Extra Small","Small","Medium","Large"]},'default':'btn-md'},
        'buttonList':{ type: "array",  title: " ", format:'tabs',uniqueItems: false,
            disable_collapse:false,
            items: {
                type: "object",
                title: "Button",
                "headerTemplate": "{{ i1 }}",
                'extends':[BootstrapButton]
            },default:[
                {"buttontype":"btn-primary", "buttonlabel":"Button One","id":"","icon":"fa-dashboard","link":"http://bluntsoftware.com"},
                {"buttontype":"btn-success", "buttonlabel":"Button Two","id":"","icon":"fa-cube","link":"http://bluntsoftware.com"}
            ]
        }
    }
};
var BootstrapButtonGroup={
    'title':'Button Group',
    'id':'bootstrap.buttonGroup',
    'extends':BootstrapDoubleButton,
    'properties':{
        direction:{'type': 'string',enum: ['btn-group', 'btn-group-vertical'],options: { enum_titles: ["Horizontal","Vertical"]},'default':''},
        justify:{'type': 'string',enum: ['', 'btn-group-justified'],options: { enum_titles: ["No","Yes"]},'default':''}
    }
};
var BootstrapJumbotron = {
    'id':'bootstrap.jumbotron',
    type:'object',
    title:'Jumbotron',
    extends:[BootstrapHeader,BootstrapText,BootstrapButton],
    'properties':{
        'header':{ 'type': 'string','default':'Hello, world!'},
        'text':{ 'type': 'string','default':'This is a simple hero unit, a simple jumbotron-style component for calling extra attention to featured content or information.'},
        'buttonlabel':{'type': 'string','default':'Learn more'}
    }
};

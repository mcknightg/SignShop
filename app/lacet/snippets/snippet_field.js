var SnippetField = Snippet.extend( {
    init: function ( name,kind) {
        this._super(name,kind );
        this.klass = "SnippetField";
        this.type = 'SnippetField';
    },
    afterRender:function(){
        //console.log("Just Rendered " + this.name + "-" + this.kind + " with id " + this.snip_id);

    }
});
 
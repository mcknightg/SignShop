var SnippetButton = Snippet.extend( {
    init: function ( name,kind) {
        this._super(name,kind );
        this.klass = "SnippetButton";
        this.type = 'SnippetButton';
    },
    afterRender:function(){
        var self = this;
        console.log("Button After Render");
        jQuery('[data-id="' + this.snip_id + '"]').find('[role="button"]').unbind('click').bind('click',function(evt){
            evt.preventDefault();
            var href = $(this).attr('href');
            var properties = self.properties;
            if(properties.buttonList){
                var idx = Number($(this).attr('data-idx'));
                properties =  properties.buttonList[idx];
            }
            self.submitForm(properties).done(function(data){
                 self.submitFormLists().done(function(){
                     if(href){
                         window.location = href;
                     }
                 });
            });
        });
    },
    submitFormLists:function(){
        var formLists = [];
        var promises = [];
        this.getRoot().listByKlass('SnippetFormList',formLists);
        $.each(formLists,function(idx,formList){
            promises.push(formList.submitFormList());
        });
        return $.when.apply($, promises).promise();
    },
    submitForm:function(properties){
        var deferred = $.Deferred();
        console.log("Submit Form");
        console.log(properties);
        if(properties.submit){
            $.each(this.getRoot().listForms(),function(idx,form){
                if(form.properties.endpoint === properties.submit){
                    form.submitForm().done(function(data){
                        deferred.resolve(data);
                    });
                }
            });
        }else{
            deferred.resolve();
        }
        return deferred.promise();
    }
});
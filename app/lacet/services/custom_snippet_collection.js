(function () {
    var CustomSnippetService =  PagedCollection.extend({
        init:function() {
            if(!base_url){
                base_url = '../';
            }
            this._super(base_url + 'mongo/' +  app_name + '/custom_snippets');
        }
    });
    window.custom_snippets = new CustomSnippetService();
})(jQuery);
(function () {
    var PagesService =  PagedCollection.extend({
        init:function() {
            if(!base_url){
                base_url = '../';
            }
            this._super(base_url + 'mongo/' +  app_name + '/pages');
        } 
    });
    window.pages = new PagesService();
})(jQuery);
(function () {
    var FlowService =  PagedCollection.extend({
        init:function() {
            if(!base_url){
                base_url = '../';
            }
            this._super(base_url + 'conduit/flow');//'mongo/' +  app_name + '/flow'
        }
    });
    window.flows = new FlowService();
})(jQuery);
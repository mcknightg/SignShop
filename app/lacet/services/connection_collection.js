(function () {
    var ConnectionService =  PagedCollection.extend({
        init:function() {
            if(!base_url){
                base_url = '../';
            }
            this._super(base_url + '/mongo/connections');
        }
    });
    window.connections = new ConnectionService();
})(jQuery);
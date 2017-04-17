(function () {
    var ActivityService =  PagedCollection.extend({
        init:function() {
            if(!base_url){
                base_url = '../';
            }
            this._super(base_url + 'conduit/activity');
        },
        runActivity:function(id,input,cb){
            var url = base_url + 'conduit/activity/' + id + "/run";
            this.ajaxRequest(url,input,"post",cb);
        }
    });
    window.activities = new ActivityService();
})(jQuery);
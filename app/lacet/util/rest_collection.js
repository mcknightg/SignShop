var RestCollection =  Class.extend({
    init:function(url) {
        this.url = url;
        $.ajaxSetup({
            xhrFields: {
                withCredentials: true
            }
        });
    },
    call:function(action,json,type,cb){
        var data = null;
        if(json && json !== ''){
              data = JSON.stringify(json);
        }
        
        return this.ajaxRequest(this.url + '/' + action,data ,type,cb);
    },
    ajaxRequest:function(url,data,type,cb){

        return jQuery.ajax({
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            'type': type,
            'url': url,
            'data':data,
            'dataType': 'json',
            'success': cb
        });
    },
    /*,
     'error': function(data){
     throw(data);

     }*/
    getById:function(id,cb){
        console.log(this.url);
        return this.ajaxRequest(this.url + '/' + id ,{},'get',cb);
    },
    save:function(json,cb){
        console.log(this.url);
        return this.ajaxRequest(this.url, JSON.stringify(json),'post',cb);
    },
    insert:function(json,cb){
        json.id = null;
        return this.ajaxRequest(this.url,JSON.stringify(json),'post',cb);
    },
    update:function(selector,modifier,options,cb){
        var that = this;
        this.find(selector,options,function(data){
            $.each(data.rows,function(index,item){
                that.ajaxRequest( that.url,JSON.stringify($.extend(item,modifier)),'post',cb);
            });
        });
    },
    findOne:function(selector,options,cb){
        var url =  this.url;
        if(typeof selector !== 'object'){
            url = url + "/" + selector;
        }
        if(typeof options === 'function' && !cb ){
            cb = options;
        }

        return this.ajaxRequest(url,selector,'get',function(data){
              if(data.rows && data.rows.length > 0){
                  cb(data.rows[0]);
              }else if(data){
                  cb(data);
              }else{
                  cb(null);
              }
        });
    },
    find:function(selector,options,cb){

        if(typeof selector === 'function' && !options && !cb ){
            cb = selector;
            selector= {};
        }else if(typeof selector !== 'object'){
            selector = {id:selector};
        }
        if(typeof options === 'function' && !cb ){
            cb = options;
        }
        return this.ajaxRequest(this.url,selector,'get',cb);
    },
    remove:function(id,cb) {
        var url =  this.url + "/" + id;
        return this.ajaxRequest(url,{},'delete',cb);
    }
});

var PagedCollection =  RestCollection.extend({
    init:function(url) {
        this._super(url);
        this.page = 1;
        this.rows = 20;
        this.sord = 'ASC';
        this.sidx = 'id';
        this.criteria = {};
        this.totalpages = 0;
        this.totalrecords = 0;
        this.or = false;
    },
    setRows:function(rows){
        this.rows = rows;
        return this;
    },
    setPage:function(page){
        var totalPages = Number(this.totalpages);
        var pageNumber = Number(page);
        if(pageNumber > totalPages){ pageNumber = totalPages;}
        if(pageNumber < 1){ pageNumber =1;}
        this.page = Number(pageNumber);
        return this;
    },
    nextPage:function(){
        return this.setPage(Number(this.page)+1);
    },
    previousPage:function(){
        return this.setPage(Number(this.page)-1);
    },
    find:function(cb){
        var that = this;
        var data = {
            page:this.page,
            rows:this.rows,
            sord:this.sord,
            sidx:this.sidx,
            or:this.or,
            filterByFields: JSON.stringify(this.criteria)
        };

        return this._super(data,function(data){
            that.totalpages = data.totalpages;
            that.totalrecords = data.totalrecords;
            if(cb){
                cb(data);
            }
        });
    },
    toggleSort:function(){
      if(this.sord === 'ASC'){
          this.sord =  'DESC';
      } else{
          this.sord =  'ASC';
      }
        return this;
    },
    ascending:function(){
         this.sord = 'ASC';
        return this;
    },
    descending:function(){
        this.sord = 'DESC';
        return this;
    },
    orMode:function(){
        this.or = true;
        return this;
    },
    qry:function(){
        this.criteria = {};
        this.or = false;
        return this;
    },
    add:function(searchField,searchOper,searchString){
        var condition = {}, criteria = {};
        condition['$' + searchOper] = searchString;
        criteria[searchField] = condition;
        this.criteria = $.extend(this.criteria,criteria);
        return this;
    },
    cn:function(field,value){
         return this.add(field,'cn',value);
    },
    icn:function(field,value){
        return this.add(field,'icn',value);
    },
    bw:function(field,value){
        return this.add(field,'bw',value);
    },
    ew:function(field,value){
        return this.add(field,'ew',value);
    },
    eq:function(field,value){
        return this.add(field,'eq',value);
    },
    ne:function(field,value){
        return this.add(field,'ne',value);
    },
    nc:function(field,value){
        return this.add(field,'nc',value);
    },
    en:function(field,value){
        return this.add(field,'en',value);
    },
    bn:function(field,value){
        return this.add(field,'bn',value);
    },
    gt:function(field,value){
        return this.add(field,'gt',value);
    },
    ge:function(field,value){
        return this.add(field,'ge',value);
    },
    lt:function(field,value){
        return this.add(field,'lt',value);
    },
    le:function(field,value){
        return this.add(field,'le',value);
    },
    in:function(field,value){
        return this.add(field,'in',value);
    },
    nn:function(field,value){
        return this.add(field,'nn',value);
    }

});

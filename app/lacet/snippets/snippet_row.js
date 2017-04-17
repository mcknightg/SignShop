var SnippetCol =   SnippetContainer.extend( {
    init: function (  name) {
        this._super( name );
        this.klass = "SnippetCol";
        this.type = 'SnippetCol';
    }
});

var SnippetRow =   SnippetContainer.extend( {
    init: function ( name) {
        this._super( name );
        this.klass = "SnippetRow";
        this.height = 100;
        this.columns = "12";
        this.type = 'SnippetRow';
    } ,
    getColumns:function(){

        var columns =  this.columns.split(' ');
        var total = 0;
        jQuery.each(columns,function(index,columnSize){
            total += Number(columnSize);
        });
        if(total !== 12){
            var numColumns = columns.length;
            switch(numColumns){
                case 2:
                    columns = [6,6];
                    break;
                case 3:
                    columns = [4,4,4];
                    break;
                case 4:
                    columns = [3,3,3,3];
                    break;
            }
        }
        return columns;
    },
    adjustColumns:function(id,adjustment){
        
        var index = this.snippetIndex(id);
        var nextIndex = index+1;
        var columns = this.getColumns();

        if(columns[nextIndex]){
            var total = Number(columns[index]) + Number(columns[index+1]);
            columns[index] = (Number(columns[index]) +  adjustment);
            columns[nextIndex] = (Number(columns[nextIndex]) + (adjustment * -1));
            if(columns[nextIndex] < 1){
                columns[nextIndex] = 1;
                columns[index] =  total - 1;
            }
            if(columns[index] <1 ){
                columns[index] = 1;
                columns[nextIndex] =  total - 1;
            }
        }

        var that = this;
        jQuery.each(columns,function(index,column){
             if(index == 0){that.columns = column;
             }else{that.columns += ' ' + column;}
        });     
        //console.log(this.columns);
    },
    renderRow:function(){
        var that = this;
        var row = jQuery('<div></div>').addClass('row');


        if(this.edit_mode){
            row.addClass('container-padding');
            row.attr('id',this.snip_id).addClass('moveable');//).addClass('sortable')
        }

        return row;
    },
    render:function(){
        var that = this;
        var row = this.renderRow();
        var columns =  this.getColumns();

        if(this.snippets.length <1){
            jQuery.each(columns,function(index,columnSize){
                var col = new SnippetCol();
                console.log(col);
                that.add(col);
            });
        }
        jQuery.each(this.snippets,function(index,snippet){

            var col = snippet.render().addClass('col-sm-' + columns[index]);
            if(that.edit_mode){
               col.addClass('border_position').addClass('resizeable');
            }
            row.append(col);
        });

        return row;
    }
});

var SnippetRow2Col =   SnippetRow.extend( {init: function ( name) {
    this._super( name );
    this.klass = "SnippetRow2Col";
    this.columns = "2 10";
} });
var SnippetRow3Col =   SnippetRow.extend( {init: function ( name) {
    this._super( name );
    this.klass = "SnippetRow3Col";
    this.columns = "4 4 4";
} });
var SnippetRow4Col =   SnippetRow.extend( {init: function ( name) {
    this._super( name );
    this.klass = "SnippetRow4Col";
    this.columns = "3 3 3 3";
} });
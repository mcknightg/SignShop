(function () {
    function LacetViewer() {

    }
    LacetViewer.prototype.init = function (element,$scope) {
        var that = this;
        var pageName = $scope.page;
        $(element).load("lacet/viewer/lacet_viewer.html", function(responseTxt, statusTxt, xhr){
            if(pageName){
                that.renderPage(pageName,$scope);
            }else {
                that.renderLocalStorage();
            }
        });
    };

    LacetViewer.prototype.findPage = function(pageName,$scope){
        var self = this;
        $.getJSON( "lacet/pages/" + pageName + ".json" , function( page ){
            window.pages.save(page,function(data){
                self.render(data,$scope);
            });
        });
        //bootbox.alert("We are experiencing MONGO technical difficulties. For the best experience please try again later.");

    };

    LacetViewer.prototype.renderPage = function(pageName,$scope){
        var self = this;
        var timeout = setTimeout(function(){
            var spinner = jQuery('<div><p><i class="fa fa-spin fa-spinner"></i> Loading...</p></div>');
            spinner.append('<h4>We are experiencing a high volume of traffic.</h4><h5> For the best experience please try again later.</h5>');
            bootbox.alert(spinner.html());
        }, 2000);

        window.pages.qry().eq('name',pageName).find().done(function(data){
            var page = data.rows[0];
            if(!page){
                self.findPage(pageName,$scope);
            }
            if(pageName === 'Home'){
                self.render(page,$scope);
            }else {
                $scope.account_service.get(function(account){
                    window.session.init({account:account});
                    if(window.session.isAuthenticated()){
                        self.render(page,$scope);
                    }else{
                        window.location = '#/login';
                    }
                });
            }
        }).fail(function(e){
            self.findPage(pageName,$scope);
           //
        }).complete(function(){
            clearTimeout(timeout);
        });
    };
    LacetViewer.prototype.renderLocalStorage = function(){
        this.render(JSON.parse(localStorage["snippetData"]));
    };
    LacetViewer.prototype.render = function(pageData,$scope){

        var page = null;
        if (pageData) {
            page = new SnippetContainer().loadObject(pageData);
            page.setEditMode(false);
            page.addSessionVars($scope);
            page.render('#view-content').css('margin-bottom','50px')
                .find('[role="iconpicker"]').iconpicker();
        }
         
        if(page){
            var styles =  page.compileCSS();
            var snippetStyles = jQuery('#snippetStyles');
            if(snippetStyles.length == 0){
                $("head").append(jQuery('<style id="snippetStyles"></style>'));
                snippetStyles = jQuery('#snippetStyles');
            }
            snippetStyles.html('');
            $.each(styles,function(index,style){
                try{
                    snippetStyles.append(style);
                }catch(e){

                }
            });

        }
    };
    window.lacetViewer = new LacetViewer();
    // When the DOM is ready, run the application.
    jQuery(function () {

    });
    // Return a new application instance.
    return( window.lacetViewer );
})(jQuery);
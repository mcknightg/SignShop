(function () {
    function ConduitSocket() {
        this.connected = false;
        this.stompClient = null;
    }

    ConduitSocket.prototype.connect = function () {
        var self = this;
        var socket = new SockJS(base_url + 'gs-guide-websocket');
        this.stompClient = Stomp.over(socket);
         //Comment the next line to show debug messages
        this.stompClient.debug = null;

        this.stompClient.connect({}, function (frame) {
            self.connected = true;
            console.log('Connected: ' + frame);
            self.stompClient.subscribe('/conduit/subscribe', function (msg) {
                var flow = JSON.parse(msg.body);
                console.log(flow);
            });
        });
    };


    ConduitSocket.prototype.disconnect =function() {
        if (this.stompClient != null) {
            this.stompClient.disconnect();
        }
        self.connected = false;
        console.log("Disconnected");
    };
    window.conduitSocket = new ConduitSocket();
    // When the DOM is ready, run the application.
    jQuery(function () {

    });
    // Return a new application instance.
    return( window.conduitSocket );
})(jQuery);


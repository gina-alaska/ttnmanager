Geo.Util = {
    openUrl: function(url) {
        Ext.Msg.confirm('External Link', 'This link will open in an external browser window. Would you like to continue?', 
            function() {
                window.open(url, "_new");
            }
        );
    }
};
Blog = new Ext.Application({
    loadingMask: true,
    
    launch: function() {
        this.dispatch({
            controller: 'posts',
            action    : 'build'
        });
    }
});
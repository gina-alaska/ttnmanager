Ext.regController('application', {
    index: function() {
        this.viewport = this.render('application-index', {
            listeners: {
                '#menu': {
                    scope: this,
                    listchange: function(list, item) {
                        Blog.dispatch({
                            controller: item.controller,
                            action: 'index'
                        });
                    }
                }
            }
        });
        
        this.setRenderTarget(this.viewport); //.getComponent('mainPanel'));
    }
});
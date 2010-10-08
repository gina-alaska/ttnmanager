demos.SheetsOverlays = new Ext.Panel({
    layout: {
        type: 'vbox',
        pack: 'center',
        align: 'stretch'
    },
    defaults: {
        xtype: 'button',
        cls: 'demobtn'
    },
    items: [{
        text: 'Action Sheet',
        handler: function() {
            if (!this.actions) {
                this.actions = new Ext.ActionSheet({
                    items: [{
                        text: 'Delete draft',
                        ui: 'decline',
                        handler : Ext.emptyFn
                    },{
                        text : 'Save draft',
                        handler : Ext.emptyFn
                    },{
                        text : 'Cancel',
                        ui: 'confirm',
                        scope : this,
                        handler : function(){
                            this.actions.hide();
                        }
                    }]
                });
            }
            this.actions.show();
        }
    }, {
        text: 'Overlay',
        handler: function() {
            if (!this.popup) {
                this.popup = new Ext.Panel({
                    floating: true,
                    modal: true,
                    centered: true,
                    width: 300,
                    styleHtmlContent: true,
                    html: '<p>This is a modal, centered and floating panel. hideOnMaskTap is true by default so ' +
                          'we can tap anywhere outside the overlay to hide it.</p>',
                    dockedItems: [{
                        dock: 'top',
                        xtype: 'toolbar',
                        title: 'Overlay Title'
                    }],
                    scroll: 'vertical'
                });
            }
            this.popup.show('pop');
        }
    },{
        text: 'Alert',
        ui: 'decline',
        handler: function() {
            Ext.Msg.alert('Title', 'The quick brown fox jumped over the lazy dog.', Ext.emptyFn);
        }
    },{
        text: 'Prompt',
        ui: 'round',
        handler: function() {
            Ext.Msg.prompt("Welcome!", "What's your first name?", Ext.emptyFn);
        }
    },{
        text: 'Confirm',
        ui: 'confirm-round',
        handler: function() {
            Ext.Msg.confirm("Confirmation", "Are you sure you want to do that?", Ext.emptyFn);
        }
    }]
});
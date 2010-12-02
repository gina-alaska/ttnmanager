ATN.views.login = Ext.extend(Ext.form.FormPanel, {
  initComponent: function() {
    Ext.apply(this, {
      url: '/session',
      method: 'POST',
      standardSubmit: true,
      items: [{
        xtype: 'fieldset',
        title: 'Enter your Login PIN below',
        items: [{
          xtype: 'passwordfield',
          name: 'pin',
          label: 'PIN'
        }]
      },{
        xtype: 'button',
        text: 'Submit',
        ui: 'action',
        cls: 'button-spacer',
        scope: this,
        handler: function() {
          this.submit({ url: '/session', method: 'POST' });
        }
      },{
        xtype: 'button',
        text: 'Cancel',
        ui: 'drastic',
        scope: this,
        handler: function() {
          ATN.dispatch({
            controller: 'areas',
            action: 'index',
            historyUrl: 'areas'
          });
        }
      }]
    });
    
    ATN.views.login.superclass.initComponent.call(this);
  }
});
Ext.reg('session_new', ATN.views.login);
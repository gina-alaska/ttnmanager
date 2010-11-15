ATN.views.login = Ext.extend(Ext.form.FormPanel, {
  initComponent: function() {
    Ext.apply(this, {
      url: '/login',
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
        handler: function() {
          ATN.controller.fireEvent('login');
        }
      }]
    });
    
    ATN.views.login.superclass.initComponent.call(this);
  }
});
Ext.reg('atnLogin', ATN.views.login);
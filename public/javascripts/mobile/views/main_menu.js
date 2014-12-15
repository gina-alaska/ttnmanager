ATN.views.MainMenu = Ext.extend(Ext.Panel, {
  initComponent: function() {
    Ext.apply(this, {
      layout: { type: 'vbox', align: 'stretch' },
      defaults: {
        layout: {
          type: 'hbox',
          align: 'start',
          pack: 'start',
          padding: '5 5 5 5'
        },
        defaults: {
          ui: 'action-round',
          xtype: 'button',
          iconMask: true,
          iconAlign: 'top',
          cls: 'pagebutton',
          padding: 10,
          flex: 1
        }
      },
      items: [{
        items: [{
          iconCls: 'maps',
          text: 'Area Status',
          handler: function() {
            top.location.hash = 'areas';
          }
        },{
          iconCls: 'mail',
          text: 'Messages'
        }]
      }, {
        items: [{
          iconCls: 'bolt',
          text: 'Logout'
        }]
      }]
    });

    ATN.views.MainMenu.superclass.initComponent.call(this);
  }
})
Ext.reg('home_main_menu', ATN.views.MainMenu);
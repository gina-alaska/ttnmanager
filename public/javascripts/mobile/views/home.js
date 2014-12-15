ATN.views.HomeView = Ext.extend(Ext.Panel, {
  initComponent: function() {
    this.menu = {
      xtype: 'home_main_menu',
      bodyStyle: 'padding: 3px;'
    };

    this.toolbar = {
      xtype: 'toolbar',
      docked: 'top',
      title: 'ATN Mobile Manager'
    };

    this.overview = {
      flex: 1,
      bodyStyle: 'text-align:center;',
      html: '<img style="width: 100%; height: 100%" src="' + (ATN.getProfile() == 'tablet' ? 'areas/overview.png' : 'areas/overview.jpg') + '" alt="Travel Status Overview" />'
    };    

    this.dockedItems = [this.toolbar];
    this.items = [this.overview,this.menu];

    ATN.views.HomeView.superclass.initComponent.call(this);
  }
});

Ext.reg('home_view', ATN.views.HomeView);
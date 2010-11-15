new Ext.Application({
  name: 'ATN',
  defaultUrl: 'home',
  launch: function() {
    this.viewport = new Ext.Panel({
      fullscreen: true,
      id: 'viewport',
      layout: 'card'
    });
  },

  profiles: {
    'tablet': function() {
      return Ext.is.Tablet || Ext.is.Desktop;
    },
    'landscape': function() {
      return Ext.orientation == 'landscape';
    },
    'portrait': function() {
      return Ext.orientation == 'portrait';
    }
  }
});

Ext.Router.draw(function(map) {
  /* This goes last, default route */
  map.connect(':controller', { action: 'index' })
  map.connect(':controller/:action/:id');
  map.connect(':controller/:action');
});

/*
items: [{
  title: 'Home',
  itemId: 'home',
  iconCls: 'home',
  scroll: 'vertical',
  layout: {
    type: 'vbox',
    align: 'stretch'
  },
  items: [{
    flex: 2,
    bodyStyle: 'background: #eee;',
    html: '<div class="home">' +
          '<h1>Welcome to the ATN Mobile Manager</h1>' +
          '<p>Click on the "Areas" icon below to start managing travel status</p>' +
          '</div>'
  }, {
    xtype: 'atnLogin',
    itemId: 'login',
    title: 'Login',
    iconCls: 'user'
  }]
},{
  title: 'Areas',
  itemId: 'areas',
  iconCls: 'maps',
  layout: 'card',
  listeners: {
    scope: this,
    hide: function() {
      if (this.getComponent('areas').getActiveItem() != this.area_list) {
        this.getComponent('areas').setCard(this.area_list);
      }
    }
  }
}]
*/
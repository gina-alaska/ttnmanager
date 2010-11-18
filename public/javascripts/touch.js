new Ext.Application({
  name: 'ATN',
  defaultUrl: 'home',
  launch: function() {
    this.viewport = new Ext.Panel({
      fullscreen: true,
      id: 'viewport',
      layout: 'card'
    });

    new Ext.data.JsonStore({
      storeId: 'areas',
      proxy: {
        type: 'ajax',
        url: '/areas.json',
        reader: { type: 'json', root: 'areas' }
      },
      model: 'Area',
      autoLoad: true
    });
  },

  profiles: {
    'tablet': function() {
      return Ext.orientation == 'landscape';
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
  map.connect(':controller', { action: 'index' });
  map.connect(':controller/:action/:id');
  /* This goes last, default route */
  map.connect(':controller/:action');
});
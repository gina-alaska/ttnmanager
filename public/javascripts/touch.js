new Ext.Application({
  name: 'ATN',
  useLoadMask: true,
  defaultUrl: 'areas',
  launch: function() {
    Ext.Viewport.init();

    Ext.regStore('areas', {
      sorters: 'order',
      proxy: {
        id: 'areas',
        type: 'localstorage',
        url: '/areas.json',
        reader: { type: 'json', root: 'areas' }
      },
      model: 'Area'
    });
    Ext.getStore('areas').read();

    Ext.regStore('areasRemote', {
      proxy: {
        type: 'ajax',
        url: '/areas.json',
        reader: { type: 'json', root: 'areas' }
      },
      model: 'Area',
      listeners: {
        load: function(store, records, success) {
          if(success) {
            var local, index;
            var areas = Ext.getStore('areas');
            Ext.each(records, function(r) {
              index = areas.find('id', r.get('id'));
              local = areas.getAt(index);

              if(index < 0) {
                areas.add(r);
                local = r;
              }
              if(local.get('updated_at') > r.get('updated_at')) {
                r.set(local.data);
                r.save();
              } else if(local.get('updated_at') < r.get('updated_at')) {
                local.set(r.data);
              }
            }, this);
            areas.save();
          }
        }
      }
    });
    Ext.regStore('messages', {
      proxy: {
        type: 'ajax',
        url: '/messages.json',
        reader: { type: 'json', root: 'messages' }
      },
      model: 'Message',
      autoLoad: true
    });

    this.viewport = new Ext.Panel({
      fullscreen: true,
      id: 'viewport',
      layout: 'card'
    });

    new Ext.LoadMask(ATN.viewport.getEl(), {
      msg: 'Syncing...',
      store: Ext.getStore('areasRemote')
    });

    Ext.getStore('areasRemote').load();

    if(flash.error) {
      Ext.Msg.alert('Error', flash.error);
    } else if (flash.notice) {
      Ext.Msg.alert('Notice', flash.notice);
    } else if (flash.message) {
      Ext.Msg.alert('Message', flash.message);
    }

    Ext.Viewport.onOrientationChange();
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
  map.connect('login', { controller: 'session', action: 'new' })
  map.connect('logout', { controller: 'session', action: 'destroy' })

  map.connect(':controller', { action: 'index' });
  map.connect(':controller/:action/:id');
  /* This goes last, default route */
  map.connect(':controller/:action');
});
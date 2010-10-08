Ext.ns('ATN');

Ext.regModel('Zone', {
  fields: ['id', 'name', 'travel_status', 'snow_status', 'soil_status', 'created_at', 'updated_at']
});

Ext.regModel('Alert', {
  fields: ['id', 'text', 'created_at', 'updated_at']
});

Ext.regModel('ZonePage', {
  fields: [
    'text', 'card', 'data', 'model', 'leaf'
  ]
});

ATN.init = function() {
  this.ui = new ATN.UIPanel({
    title: Ext.is.Phone ? 'ATN' : 'Alaska Transportation Network',
    useTitleAsBackText: false
  });
};

ATN.ZoneStore = new Ext.data.JsonStore({
  storeId: 'zones',
  proxy: {
    type: 'ajax',
    url: '/zones.json',
    reader: { type: 'json', root: 'zones' }
  },
  model: 'Zone',
  autoLoad: true
});

ATN.AlertStore = new Ext.data.JsonStore({
  storeId: 'alerts',
  proxy: {
    type: 'ajax',
    url: '/alerts.json',
    reader: { type: 'json', root: 'alerts' }
  },
  model: 'Alert',
  autoLoad: true
});

ATN.ZoneList = new Ext.List({
  xtype: 'list',
  store: ATN.ZoneStore,
  tpl: '<tpl for="."><div class="zone">{name}</div></tpl>',
  itemSelector: 'div.zone'
});

ATN.UIPanel = Ext.extend(Ext.TabPanel, {
  fullscreen: true,
  ui: 'light',
  tabBar: {
    dock: 'bottom',
    layout: { pack: 'center' }
  },
  animation:{
    type: 'cardslide',
    cover: true
  },
  defaults: {
    scroll: 'vertical'
  },

  initComponent: function() {
    this.zone_list = new Ext.List({
      store: ATN.ZoneStore,
      tpl: '<tpl for="."><div class="zone">{name}: <span class="status-{travel_status}">{travel_status}</span></div></tpl>',
      itemSelector: 'div.zone',
      listeners: {
        itemtap: this.onZoneItemTap,
        scope: this
      }
    });

    this.alert_list = new Ext.List({
      store: ATN.AlertStore,
      tpl: '<tpl for="."><div class="alert">{text}</div></tpl>',
      itemSelector: 'div.alert',
      emptyText: 'No Alerts Found',
      listeners: {
        itemtap: this.onAlertItemTap,
        scope: this
      }
    });

    this.items = [{
      title: 'Home',
      itemId: 'home',
      iconCls: 'home',
      html: '<div class="home">' +
        '<h1>Welcome to the ATN Mobile Manager</h1>' +
        '<p>Click on the "Zones" icon below to start managing travel status</p>' +
        '</div>'
    },{
      title: 'Zones',
      itemId: 'zones',
      iconCls: 'maps',
      layout: 'card',
      items: [this.zone_list],
      listeners: {
        scope: this,
        hide: function() {
          if (this.getComponent('zones').getActiveItem() != this.zone_list) {
            this.getComponent('zones').setCard(this.zone_list);
          }
        }
      }
    }, {
      itemId: 'alerts',
      title: 'Alerts',
      iconCls: 'bolt',
      layout: 'card',
      items: [this.alert_list],
      badgeText: ATN.AlertStore.getCount()
    }, ATN.login]

    ATN.UIPanel.superclass.initComponent.call(this);

    ATN.controller.on('back_zone', this.onUIZoneBack, this);
    ATN.controller.on('after_zone_save', function() {
      this.zone_list.getStore().load();
      this.onUIZoneBack();
    }, this);
  },

  onUIBack: function() {
    /* Are we in the navigation panel? */
    if(this.getActiveItem() === this.navigation) {
      this.navigation.onBackTap();
    } else {
      this.setCard(this.navigation, {
        type: 'slide',
        reverse: true
      });
    }
    this.toggleBackButton();
    this.fireEvent('navigate', this, {});
  },

  onZoneItemTap: function(dataview, index, el, e) {
    var store = dataview.getStore(),
        record = store.getAt(index);

    ATN.zone_form.load(record);
    this.getComponent('zones').setCard(ATN.zone_form, {
      type: 'slide'
    });

//    if(Ext.is.Phone) {
//      this.navBar.setTitle(title || this.title);
//    }
//
//    this.toggleBackButton();
//    this.navBar.doLayout();

    this.fireEvent('navigate', this, 'zone', record);
  },

  onAlertItemTap: function(dataview, index, el, e) {
    var store = dataview.getStore(),
        record = store.getAt(index);

    this.fireEvent('navigate', this, 'alert', record);
  },

  onUIZoneBack: function() {
    var zone_list = this.getComponent('zones');

    if(zone_list.getActiveItem() != this.zone_list) {
      zone_list.setCard(this.zone_list, {
        type: 'slide',
        reverse: true
      });
    }
  },

  toggleBackButton: function() {
    /* This is automatically handled on the non-phone interface */
    if(!Ext.is.Phone) { return true; }

    var current = this.navigation.getActiveItem();

    if(this.getActiveItem() == this.navigation) {
          var index = this.navigation.items.indexOf(current),
          record = current.recordNode,
          title = this.navigation.renderTitleText(record),
          parent = record ? record.parentNode : null,
          backTxt = (parent && !parent.isRoot) ? this.navigation.renderTitleText(parent) : this.title || '';

      if(index <= 0) {
        /* top level hide back button */
        this.navBar.setTitle(this.title || '');
        this.backButton.hide();
      } else {
        this.navBar.setTitle(title);
        //this.backButton.setText(backTxt);
        this.backButton.show();
      }
    } else {
      var record = current.recordNode,
          backTxt = (record && !record.isRoot) ? this.navigation.renderTitleText(record) : this.title || '';
      //this.backButton.setText(backTxt);
      this.backButton.show();
    }

    this.navBar.doLayout();
  }
});

ATN.NavPanel = Ext.extend(Ext.NestedList, {
  cls: 'nav-panel',
  singleSelect: true
});

Ext.setup({
  onReady: function() {
    ATN.init();
  }
});

Ext.ux.EventManager = function(config) {
  config = config || {};
  this.initialConfig = config;

  this.listeners = config.listeners || {};

  if(config.events) {
    this.addEvents(config.events);
  }

  if(config.debug && this.listeners) {
    for(var event in this.listeners) {
      this.on(event, function() {
        console.log('DEBUG: ', this.event, arguments);
      }, { event: event });
    }
  }

  Ext.ux.EventManager.superclass.constructor.call(this);
};
Ext.extend(Ext.ux.EventManager, Ext.util.Observable, {
  init: function(item) {
    item.em = this;
  }
});

Ext.ux.Ajax = {
  formSubmit: function(request) {
    var values = request.form.getValues(),
        id = values.id,
        params = {};

    request = request || {};

    request.url += '/' + id;
    Ext.applyIf(request, {
      root: 'record',
      method: (id ? 'PUT' : 'POST'),
      success: Ext.ux.Ajax.success,
      failure: Ext.ux.Ajax.failure
    });

    if (request.root) {
      for(var ii in values) {
        params[request.root + '[' + ii + ']'] = values[ii];
      }
      request.params = params;
    }

    Ext.Ajax.request(request);
  },

  success: function(response, options) {
    if(options.listeners.success) {
      options.listeners.success.call(options.listeners.scope || this, response, options)
    }
  },

  failure: function(response, options) {
    if(options.listeners.failure) {
      options.listeners.failure.call(options.listeners.scope || this, response, options)
    }
  }
}
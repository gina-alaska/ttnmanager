Ext.ns('ATN');

Ext.regModel('Area', {
  fields: ['id', 'name', 'notes', 'travel_status', 'snow', 'soil', 'alerts', 'operationals', 'created_at', 'updated_at']
});

Ext.regModel('Message', {
  fields: ['id', 'text', 'system', 'area_id', 'area', 'created_at', {
    name: 'updated_at',
    type: 'date',
    dateFormat: 'c'
  }]
});

Ext.regModel('AreaPage', {
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

ATN.AreaStore = new Ext.data.JsonStore({
  storeId: 'areas',
  proxy: {
    type: 'ajax',
    url: '/areas.json',
    reader: { type: 'json', root: 'areas' }
  },
  model: 'Area'
});

ATN.MessageStore = new Ext.data.JsonStore({
  storeId: 'messages',
  proxy: {
    type: 'ajax',
    url: '/alerts.json',
    reader: { type: 'json', root: 'alerts' }
  },
  model: 'Message',
  listeners: {
    load: function(store, records, success) {
      ATN.controller.fireEvent('message_update', store.getCount())
    }
  }
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
    this.area_list = new Ext.List({
      dockedItems: [{
        dock: 'top',
        xtype: 'toolbar',
        title: 'Areas',
        items: [{
          iconMask: true,
          ui: 'plain',
          iconCls: 'refresh',
          scope: this,
          handler: function() {
            this.area_list.getStore().load();
          }
        }]
      }],
      store: ATN.AreaStore,
      loadingText: 'Loading area data...',
      tpl: '<tpl for="."><div class="area">{name}: <span class="status-{travel_status}">{travel_status}</span></div></tpl>',
      itemSelector: 'div.area',
      listeners: {
        itemtap: this.onAreaItemTap,
        scope: this
      }
    });

    this.message_list = new Ext.List({
      id: 'message-list',
      store: ATN.MessageStore,
      tpl: '<tpl for="."><div class="message"><tpl if="system == false">{updated_at:date("Y/m/d")}: </tpl>{text}</div></tpl>',
      itemSelector: 'div.message',
      emptyText: 'No Messages Found',
      loadingText: 'Loading messages...',
      dockedItems: [{
        dock: 'top',
        xtype: 'toolbar',
        title: 'Messages',
        defaults: { ui: 'plain', iconMask: true, scope: this },
        items: [{
          iconCls: 'refresh',
          handler: function() {
            this.message_list.getStore().load();
          }
        }, { xtype: 'spacer' },{
          iconCls: 'add',
          handler: function() {
            if(ATN.message_form.rendered) { ATN.message_form.reset(); }
            this.getComponent('messages').setCard(ATN.message_form, {
              type: 'slide'
            });
          }
        }]
      }],
      listeners: {
        scope: this,
        itemtap: this.onMessageItemTap
      }
    });

    this.items = [{
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
      }, ATN.login]
    },{
      title: 'Areas',
      itemId: 'areas',
      iconCls: 'maps',
      layout: 'card',
      items: [this.area_list],
      listeners: {
        scope: this,
        hide: function() {
          if (this.getComponent('areas').getActiveItem() != this.area_list) {
            this.getComponent('areas').setCard(this.area_list);
          }
        }
      }
    }, {
      itemId: 'messages',
      title: 'Messages',
      iconCls: 'mail',
      layout: 'card',
      items: [this.message_list],
      listeners: {
        scope: this,
        hide: function() {
          if (this.getComponent('messages').getActiveItem() != this.message_list) {
            this.getComponent('messages').setCard(this.message_list);
          }
        }
      }
    }]

    ATN.UIPanel.superclass.initComponent.call(this);

    ATN.controller.on('back_area', function() { this.onUIAreaBack(false) }, this);
    ATN.controller.on('after_area_save', function(area) {
      this.area_list.getStore().load();
      this.onUIAreaBack(area);
    }, this);
    ATN.controller.on('back_message', function() { this.onUIMessageBack(false) }, this);
    ATN.controller.on('after_message_save', function(message) {
      this.message_list.getStore().load();
      this.onUIMessageBack(message);
    }, this);
    ATN.controller.on('message_update', function(count) {
      var messages = this.getComponent('messages');
      if(messages.tab.rendered) {
        messages.tab.setBadge(count);
      } else {
        messages.tab.on('render', function() {
          this.setBadge(count);
        }, messages.tab, { single: true })
      }
    }, this);
    ATN.controller.on('edit_message', function() {
      this.getComponent('messages').setCard(ATN.message_form, {
        type: 'slide'
      });
      ATN.message_form.load(this.ctxMessageRecord);
    }, this);
    ATN.controller.on('edit_area', function() {
      this.getComponent('areas').setCard(ATN.area_form, {
        type: 'slide'
      });
      ATN.area_form.load(this.ctxAreaRecord);
    }, this);

    ATN.AreaStore.load();
    ATN.MessageStore.load();
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

  onAreaItemTap: function(dataview, index, el, e) {
    var store = dataview.getStore(),
        record = store.getAt(index);

    this.ctxAreaRecord = record;
    this.getComponent('areas').setCard(ATN.area_status, {
      type: 'slide'
    });
    ATN.area_status.load(record);

    this.fireEvent('navigate', this, 'area', record);
  },

  onMessageItemTap: function(dataview, index, el, e) {
    var store = dataview.getStore(),
        record = store.getAt(index);

    this.ctxMessageRecord = record;
    this.getComponent('messages').setCard(ATN.view_message, {
      type: 'slide'
    });
    ATN.view_message.load(record);

    this.fireEvent('navigate', this, 'message', record);
  },

  onUIAreaBack: function(area) {
    var returnTo,
        area_panel = this.getComponent('areas');

    switch(area_panel.getActiveItem()) {
      case this.area_list:
        break;
      case ATN.area_form:
        if(this.ctxAreaRecord) {
          console.log(area);
          if(area) { ATN.area_status.load(area); }
          returnTo = ATN.area_status;
        } else {
          returnTo = this.area_list;
        }
        break;
      default:
        this.ctxAreaRecord = null;
        returnTo = this.area_list;
        break;
    }

    if(returnTo) {
      area_panel.setCard(returnTo, {
        type: 'slide',
        reverse: true
      });
    }
  },
  onUIMessageBack: function(message) {
    var returnTo,
        message_panel = this.getComponent('messages');

    switch(message_panel.getActiveItem()) {
      case this.message_list:
        break;
      case ATN.message_form:
        if(this.ctxMessageRecord) {
          if(message) { ATN.view_message.load(message); }
          returnTo = ATN.view_message;
        } else {
          returnTo = this.message_list;
        }
        break;
      default:
        this.ctxMessageRecord = null;
        returnTo = this.message_list;
        break;
    }
    if(returnTo) {
      message_panel.setCard(returnTo, {
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

    if(id) {
      request.url += '/' + id;
    }
    
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
    if(response.getAllResponseHeaders()['content-type'].match(/json/)) {
      json = Ext.decode(response.responseText);
    }
    if(json.flash) {
      Ext.Msg.alert('Alert', json.flash);
    }

    if(options.listeners.success) {
      options.listeners.success.call(options.listeners.scope || this, response, options, json)
    }
  },

  failure: function(response, options) {
    var json = {};

    if(response.getAllResponseHeaders()['content-type'].match(/json/)) {
      json = Ext.decode(response.responseText);
    }
    if(json.flash) {
      Ext.Msg.alert('Error', json.flash);
    } else {
      Ext.Msg.alert('Error', 'An unknown error occurred during the request');
    }
    
    if(options.listeners.failure) {
      options.listeners.failure.call(options.listeners.scope || this, response, options, json)
    }
  }
}
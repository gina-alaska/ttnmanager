ATN.controller = new Ext.ux.EventManager({
  events: ['login', 'back_zone', 'save_zone', 'after_zone_save','back_alert', 'save_alert','after_alert_save', 'alert_update'],
  listeners: {
    scope: ATN,
    'save_zone': function() {
      Ext.ux.Ajax.formSubmit({
        "url": '/zones',
        "form": this.zone_form,
        "root": 'zone',
        listeners: {
          scope: this,
          success: function(response, options) {
            this.controller.fireEvent('after_zone_save');
          }
        }
      });
    },
    'save_alert': function() {
      Ext.ux.Ajax.formSubmit({
        "url": '/alerts',
        "form": this.alert_form,
        "root": 'alert',
        listeners: {
          scope: this,
          success: function(response, options) {
            this.controller.fireEvent('after_alert_save');
          }
        }
      });
    }
  }
});

ATN.alert_form = new Ext.form.FormPanel({
  title: 'Alert Form',
  url: '/alerts',
  scroll: 'vertical',
  monitorOrientation: true,  
  items: [{
    xtype: 'hidden',
    name: 'id'
  },{
    title: 'Alert Form',
    xtype: 'fieldset',
    items: [{
      xtype: 'select',
      name: 'zone_id',
      label: 'Zone',
      store: ATN.ZoneStore,
      displayField: 'name',
      valueField: 'id'
    }, {
      xtype: 'toggle',
      name: 'active',
      label: 'Active',
      value: 1
    },{
      xtype: 'textarea',
      name: 'text',
      label: 'Message'
    }]
  },{
    xtype: 'button',
    text: 'Cancel',
    cls: 'buttons',
    handler: function() {
      ATN.controller.fireEvent('back_alert');
    }
  }, {
    xtype: 'button',
    text: 'Save',
    ui: 'action',
    cls: 'buttons',
    handler: function() {
      ATN.controller.fireEvent('save_alert');
    }
  }]
});

ATN.view_alert = new Ext.Panel({
  title: 'Alert!',
  bodyStyle: 'padding: 3px;',
  tpl: new Ext.XTemplate(
    '<tpl for=".">' +
      '<div class="alert">' +
        '<p>Zone: {zone.name}</p><br />' +
        '<p>{text}</p>' +
      '</div>' +
    '</tpl>', {
    compile: true 
  }),

  dockedItems: [{
    dock: 'top',
    title: 'Alert Info',
    xtype: 'toolbar',
    defaults: { ui: 'plain', iconMask: true },
    items: [{
      iconCls: 'arrow_left',
      handler: function() {
        ATN.controller.fireEvent('back_alert');
      }
    }, { xtype: 'spacer' }, {
      iconCls: 'compose',
      handler: function() {
        ATN.controller.fireEvent('edit_alert');
      }
    }]
  }],
  load: function(record) {
    this.ctxRecord = record;
    var data = record.data;
    this.update(this.tpl.apply(data));
  }
});

ATN.zone_status = new Ext.Panel({
  title: 'Status',
  tpl: new Ext.Template(
    '<div class="zone_status">',
      '<h2>Zone: {name}</h2>',
      '<div><label>Status: </label><span class="status-{status}">{status}</span></div>',
      '<div><label>Message: </label><span class="message">{message}</span></div>',
    '</div>',
    { compiled: true }
  ),
  load: function(data) {
    this.update(this.tpl.apply({
      name: data.get('name'),
      status: data.get('status'),
      message: 'Testing'
    }));
  }
});

ATN.login = new Ext.form.FormPanel({
  itemId: 'login',
  title: 'Login',
  url: '/login',
  iconCls: 'user',
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

ATN.zone_form = new Ext.form.FormPanel({
  id: 'zone_editor',
  title: 'Zone Editor',
  url: '/zones',
  scroll: 'vertical',
  monitorOrientation: true,
  load: function(data) {
    this.getComponent('status').setTitle(data.get('name'));
    this.loadModel(data);
  },
  items: [{
    xtype: 'hidden',
    name: 'id'
  },{
    itemId: 'status',
    title: 'Zone name here',
    xtype: 'fieldset',
    items: [{
      xtype: 'select',
      name: 'travel_status',
      label: 'Travel Status',
      options: [
        { text: 'Open', value: 'Open' },
        { text: 'Limited', value: 'Limited' },
        { text: 'Closed', value: 'Closed' }
      ]
    },{
      xtype: 'select',
      name: 'soil_status',
      label: 'Soil Temp Status',
      options: [
        { text: 'Good', value: 'Good' },
        { text: 'Improving', value: 'Improving' },
        { text: 'Bad', value: 'Bad' }
      ]
    },{
      xtype: 'select',
      name: 'snow_status',
      label: 'Snow Status',
      options: [
        { text: 'Good', value: 'Good' },
        { text: 'Improving', value: 'Improving' },
        { text: 'Bad', value: 'Bad' }
      ]
    }, {
      xtype: 'textarea',
      name: 'notes',
      label: 'Notes'
    }]
  },{
    xtype: 'button',
    text: 'Cancel',
    cls: 'buttons',
    flex: 1,
    handler: function() {
      ATN.controller.fireEvent('back_zone');
    }
  }, {
    xtype: 'button',
    text: 'Save',
    ui: 'action',
    cls: 'buttons',
    flex: 1,
    handler: function() {
      ATN.controller.fireEvent('save_zone');
    }
  }]
});

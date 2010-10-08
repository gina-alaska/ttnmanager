ATN.controller = new Ext.ux.EventManager({
  events: ['login', 'back_zone', 'save_zone', 'after_zone_save'],
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
    }
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

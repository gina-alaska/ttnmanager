ATN.views.areas.edit = Ext.extend(Ext.form.FormPanel, {
  buildRadioButtons: function(name, messages) {
    var msgs = [];

    messages.each(function(m) {
      msgs.push({
        itemId: 'message_' + m.get('id'),
        xtype: 'radiofield',
        label: m.get('mobile_text'),
        name: 'messages['+ name +']',
        cls: 'message',
        value: m.get('id')
      });
    }, this);

    return msgs;
  },
  buildCheckButtons: function(messages) {
    var msgs = [];

    messages.each(function(m) {
      msgs.push({
        itemId: 'message_' + m.get('id'),
        xtype: 'checkboxfield',
        label: m.get('mobile_text'),
        name: 'messages['+ m.get('id') +']',
        cls: 'message',
        value: m.get('id')
      });
    }, this);

    return msgs;
  },

  initComponent: function() {
    var messages = Ext.getStore('messages');

    messages.clearFilter();
    messages.filter('group', 'soil');
    this.soil_status = {
      itemId: 'soil',
      title: 'Soil Status',
      xtype: 'fieldset',
      items: this.buildRadioButtons('soil', messages)
    };
    messages.clearFilter();
    messages.filter('group', 'snow');
    this.snow_status = {
      itemId: 'snow',
      title: 'Snow Status',
      xtype: 'fieldset',
      items: this.buildRadioButtons('snow', messages)
    };
    messages.clearFilter();
    messages.filter('group', 'alert');
    this.alert_status = {
      itemId: 'alert',
      title: 'Alerts',
      xtype: 'fieldset',
      items: this.buildCheckButtons(messages)
    };
    messages.clearFilter();
    messages.filter('group', 'operational');
    this.operational_status = {
      itemId: 'operational',
      title: 'Operational Considerations',
      xtype: 'fieldset',
      items: this.buildCheckButtons(messages)
    };

    Ext.apply(this, {
      title: 'Area Editor',
      cls: 'areas_editor',
      url: '/areas',
      scroll: 'vertical',
      monitorOrientation: true,
      dockedItems: [{
        itemId: 'area-toolbar',
        dock: 'top',
        title: 'Area Info',
        xtype: 'toolbar',
        items: [{
          text: 'Back',
          ui: 'back',
          scope: this,
          handler: function() {
            ATN.dispatch({
              controller: 'areas',
              action: 'show',
              id: this.area.get('id'),
              back: true,
              historyUrl: 'areas/show/' + this.area.get('id')
            });
          }
        }, { xtype: 'spacer' }, {
          text: 'Save',
          scope: this,
          handler: function() {
            ATN.dispatch({
              controller: 'areas',
              action: 'save'
            });
          }
        }]
      }],
      items: [{
        xtype: 'hiddenfield',
        name: 'id'
      },{
        itemId: 'status',
        title: 'Area name here',
        xtype: 'fieldset',
        items: [{
          xtype: 'selectfield',
          name: 'travel_status',
          label: 'Travel',
          options: [
            { text: 'Open', value: 'Open' },
    //        { text: 'Limited', value: 'Limited' },
            { text: 'Closed', value: 'Closed' }
          ]
        }, {
          xtype: 'textareafield',
          name: 'notes',
          label: 'Notes'
        }]
      },
        this.soil_status,
        this.snow_status,
        this.alert_status,
        this.operational_status
      ]
    });

    ATN.views.areas.edit.superclass.initComponent.call(this);
  },
  load: function(data) {
    this.area = data;
    this.getComponent('status').setTitle(data.get('name'));
    this.getComponent('area-toolbar').setTitle(data.get('name'));

    this.loadModel(data);
    this.loadMessages(data.get('alerts'));
    this.loadMessages(data.get('operationals'));
    this.loadMessages(data.get('soil'));
    this.loadMessages(data.get('snow'));
  },
  loadMessages: function(messages) {
    Ext.each(messages, function(message) {
      var group = message.group,
          itemId =  message.id,
          item = this.getComponent(group).getComponent('message_' + itemId);
      if(item) { item.check(); }
    }, this);
  }
});
Ext.reg('area_edit', ATN.views.areas.edit);

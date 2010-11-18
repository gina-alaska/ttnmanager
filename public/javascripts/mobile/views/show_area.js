ATN.views.ShowArea = Ext.extend(Ext.Panel, {
  initComponent: function() {
    Ext.apply(this, {
      scroll: 'vertical',
      dockedItems: [{
        itemId: 'area-toolbar',
        dock: 'top',
        title: 'Area Status',
        xtype: 'toolbar',
        defaults: { ui: 'plain', iconMask: true },
        items: [{
          scope: this,
          iconCls: 'arrow_left',
          handler: function() {
            ATN.dispatch({
              controller: 'areas',
              action: 'close_status'
            });
          }
        }, { xtype: 'spacer' }, {
          scope: this,
          iconCls: 'compose',
          handler: function() {
            ATN.dispatch({
              controller: 'areas',
              action: 'show_list'
            });
          }
        }]
      }],
      tpl: new Ext.XTemplate(
        '<tpl for=".">' +
        '<div class="area_status">' +
          '<div><label>Travel Status: </label><span class="status-{travel_status}">{travel_status}</span></div>' +
          '<tpl if="notes.length">' +
            '<div><label>Notes: </label><span class="notes">{notes}</span></div>' +
          '</tpl>' +
          '<tpl if="soil.length">' +
            '<h2>Soil Status:</h2>' +
            '<tpl for="soil">' +
              '<div class="message soil">' +
                '{full_text}' +
              '</div>' +
            '</tpl>' +
          '</tpl>' +
          '<tpl if="snow.length">' +
            '<h2>Snow Status:</h2>' +
            '<tpl for="snow">' +
              '<div class="message snow">' +
                '{full_text}' +
              '</div>' +
            '</tpl>' +
          '</tpl>' +
          '<tpl if="operationals.length">' +
            '<h2>Operational Considerations:</h2>' +
            '<tpl for="operationals">' +
              '<div class="message operational">' +
                '{full_text}' +
              '</div>' +
            '</tpl>' +
          '</tpl>' +
          '<tpl if="alerts.length">' +
            '<h2>Alerts:</h2>' +
            '<tpl for="alerts">' +
              '<div class="message alert">' +
                '{full_text}' +
              '</div>' +
            '</tpl>' +
          '</tpl>' +
        '</div>' +
        '</tpl>',
        { compiled: true }
      ),
      bodyStyle: 'padding: 0.5em;',
      items: [{
        itemId: 'status-text'
      }, {
        xtype: 'button',
        text: 'Send Email Update',
        handler: function() {
          ATN.controller.fireEvent('email_area');
        }
      }]
    });
    ATN.views.ShowArea.superclass.initComponent.call(this);
  },
  load: function(area) {
    this.getComponent('area-toolbar').setTitle(area.get('name'));
    this.getComponent('status-text').update(this.tpl.apply(area.data));
  }
});
Ext.reg('show_area', ATN.views.ShowArea);
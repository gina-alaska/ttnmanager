if(!ATN.views.areas) { ATN.views.areas = {}; }

ATN.views.areas.Show = Ext.extend(Ext.Panel, {
  initComponent: function() {
    this.actions = new Ext.ActionSheet({
      hideOnMaskTap: true,
      items: [{
        xtype: 'button',
        text: 'Edit Travel Status',
        scope: this,
        handler: function() {
          this.actions.hide();
          top.location.hash = 'areas/edit/' + this.area.get('id');
        }
      }, {
        xtype: 'button',
        text: 'Send Email',
        scope: this,
        handler: function() {
          this.actions.hide();
          Ext.Msg.alert('Warning', 'Not Implemented Yet');
        }
      },{
        text: 'Cancel',
        ui: 'decline',
        scope: this,
        handler: function() {
          this.actions.hide();
        }
      }]
    });

    Ext.apply(this, {
      scroll: 'vertical',
      dockedItems: [{
        itemId: 'area-toolbar',
        dock: 'top',
        title: 'Area Status',
        xtype: 'toolbar',
        items: [{
          scope: this,
          ui: 'back',
          text: 'Back',
          handler: function() {
            ATN.dispatch({
              controller: 'areas',
              action: 'index',
              back: true,
              historyUrl: 'areas'
            });
          }
        }, { xtype: 'spacer' }, {
          scope: this,
          text: 'Actions',
          handler: function() {
            this.actions.show();
          }
        }]
      }],
      tpl: new Ext.XTemplate(
        '<tpl for=".">' +
        '<div class="area_status">' +
          '<div><label>Travel Status:</label> <span class="{travel_status}">{travel_status}</span></div>' +
          '<tpl if="notes.length">' +
            '<div><label>Notes:</label> <span class="notes">{notes}</span></div>' +
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
          '<div><label>Last Updated:</label> <span>{updated_at:date("Y/m/d g:i:sA T")}</span></div>' +
        '</div>' +
        '</tpl>',
        { compiled: true }
      ),
      bodyStyle: 'padding: 0.5em;',
      items: [{
        itemId: 'status-text'
      }]
    });
    ATN.views.areas.Show.superclass.initComponent.call(this);
  },
  load: function(area) {
    this.area = area;
    this.getComponent('area-toolbar').setTitle(area.get('name'));
    this.getComponent('status-text').update(this.tpl.apply(area.data));
  }
});
Ext.reg('areas_show', ATN.views.areas.Show);

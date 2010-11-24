if(!ATN.views.areas) { ATN.views.areas = {}; }

ATN.views.areas.Index = Ext.extend(Ext.Panel, {
  initComponent: function() {
    this.actions = new Ext.ActionSheet({
      hideOnMaskTap: true,
      items: [{
        text: 'Login',
        scope: this,
        handler: function() {
          this.actions.hide();
          Ext.Msg.alert('Warning', 'Not Implemented Yet')
        }
      }, {
        text: 'Refresh Area Status',
        scope: this,
        handler: function() {
          this.actions.hide();
          Ext.getStore('areasRemote').load();
        }
      }, {
        text: 'Cancel',
        scope: this,
        ui: 'decline',
        handler: function() {
          this.actions.hide();
        }
      }]
    });

    this.list = new Ext.List({
      store: 'areas',
      cls: 'areas',
      loadingText: 'Loading data...',
      itemTpl: '<tpl for=".">' +
                '<div class="area">' +
                  '<span class="name">{name}</span>' +
                  '<span class="{travel_status} status">{travel_status}</span>' +
                  '<div class="updated_at">Updated: {updated_at:date("Y/m/d g:i:sA T")}</div>' +
                '</div>' +
                '</tpl>',
      itemSelector: 'div.area',
      listeners: {
        scope: this,
        itemtap: function(dataview, index, el, e) {
          var store = dataview.getStore(),
              record = store.getAt(index);
          ATN.dispatch({
            controller: 'areas',
            action: 'show',
            id: record.get('id'),
            historyUrl: 'areas/show/' + record.get('id')
          });
        }
      }
    });

    Ext.apply(this, {
      layout: 'card',
      items: [{
        itemId: 'list',
        scroll: true,
        layout: 'fit',
        dockedItems: [{
          dock: 'top',
          xtype: 'toolbar',
          title: 'Areas',
          items: [{ xtype: 'spacer' }, {
            text: 'Actions',
            scope: this,
            handler: function() {
              this.actions.show();
            }
          }]
        }],
        items: [this.list]
      }]
    });

    ATN.views.areas.Index.superclass.initComponent.call(this);
  }
});
Ext.reg('areas_index', ATN.views.areas.Index);

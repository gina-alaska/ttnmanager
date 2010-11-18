ATN.views.AreaList = Ext.extend(Ext.Panel, {
  initComponent: function() {
    this.list = new Ext.List({
      store: 'areas',
      loadingText: 'Loading data...',
      itemTpl: '<tpl for="."><div class="area">{name}: <span class="{travel_status}_status">{travel_status}</span></div></tpl>',
      itemSelector: 'div.area',
      listeners: {
        scope: this,
        beforeactivate: function() {
          this.setBlockRefresh(true);
          //this.setLoading(true);
        },
        activate: function() {
          this.setBlockRefresh(false);
          this.refresh();
          //this.setLoading(false);
        },
        itemtap: function(dataview, index, el, e) {
          var store = dataview.getStore(),
              record = store.getAt(index);
          top.location.hash = 'areas/show/' + record.get('id');
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
          items: [{
            iconMask: true,
            ui: 'plain',
            iconCls: 'arrow_left',
            scope: this,
            handler: function() {
              top.location.hash='home';
            }
          }, { xtype: 'spacer' }, {
            iconMask: true,
            ui: 'plain',
            iconCls: 'refresh',
            scope: this,
            handler: function() {
              this.list.getStore().load();
            }
          }]
        }],
        items: [this.list]
      }]
    });

    ATN.views.AreaList.superclass.initComponent.call(this);
  }
});
Ext.reg('arealist', ATN.views.AreaList);
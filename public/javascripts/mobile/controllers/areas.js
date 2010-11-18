Ext.regController('areas', {
  index: function() {
    if(!this.areas) {
      this.areas = ATN.viewport.add({
        itemId: 'area',
        xtype: 'arealist'
      });
    }
    ATN.viewport.setActiveItem(this.areas.itemId, {
      type: 'slide'
    });
  },

  show:function(params) {
    var areas = Ext.getStore('areas'),
        i = areas.find('id', params.id),
        r = areas.getAt(i);

    if (r) {
      var status = this.areas.add({
        itemId: 'show_area',
        xtype: 'show_area'
      });
      status.load(r);
      status.on('deactivate', function(oldcard) {
        oldcard.destroy();
      });

      this.areas.setActiveItem('show_area', { type: 'slide' });
    } else {
      if (areas.isLoading()) {
        Ext.Msg.alert('Loading', 'Loading');
      } else {
        Ext.Msg.alert('Error', 'Unable to locate the selected zone');
      }
    }
  },

  close_status: function(params) {
    this.areas.setActiveItem('list', { type: 'slide', reverse: true });
    top.location.hash = 'areas';
  }
});
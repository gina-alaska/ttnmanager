Ext.regController('areas', {
  index: function() {
    if(!this.areas) {
      this.areas = ATN.viewport.add({
        itemId: 'area-panel',
        xtype: 'arealist'
      });
      ATN.viewport.doLayout();
    }
    ATN.viewport.setActiveItem(this.areas.itemId, {
      type: 'slide'
    });
  },

  show:function(params) {
    alert(params.id);
  }
});
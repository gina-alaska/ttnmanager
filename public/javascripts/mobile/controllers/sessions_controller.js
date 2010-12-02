Ext.regController('sessions', {
  "new": function(params) {
    if(!this.login_form) {
      this.login_form = ATN.viewport.add({
        itemId: 'session_new',
        xtype: 'session_new'
      });
    }
    ATN.viewport.setActiveItem(this.login_form.itemId);
  },

  "destroy": function(params) {
    top.location = '/logout.json';
  }
});
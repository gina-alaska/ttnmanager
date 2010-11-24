Ext.regController('home', {
  index: function() {
    this.setupIndex();
    ATN.viewport.setActiveItem(this.determineActiveItem(), { type: 'slide', reverse: true });
  },

  /* Private */
  setupIndex: function() {
    if (this.indexReady) { return true; }

    this.welcome_landscape = {
      xtype: 'home_view',
      itemId: 'welcome_landscape',
      layout: {
        type: 'hbox',
        align: 'stretch'
      }
    };

    this.welcome_portrait = {
      xtype: 'home_view',
      itemId: 'welcome_portrait',
      layout: {
        type: 'vbox',
        align: 'stretch'
      }
    };
    
    ATN.viewport.add([this.welcome_landscape, this.welcome_portrait]);

    ATN.on('profilechange', function(profile) {
      var active = ATN.viewport.getActiveItem();
      
      if(active.itemId == 'welcome_landscape' || active.itemId == 'welcome_portrait') {
        ATN.viewport.setActiveItem(this.determineActiveItem(profile));
      }
    }, this);

    this.indexReady = true;
  },

  determineActiveItem: function(profile) {
    if(!profile) { profile = ATN.getProfile(); }
    switch(profile) {
      case 'tablet':
      case 'landscape':
        return 'welcome_landscape';
      case 'portrait':
        return 'welcome_portrait';
    }
  }  
});
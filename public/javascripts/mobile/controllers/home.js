Ext.regController('home', {
  index: function() {
    this.setupIndex();
    ATN.viewport.setActiveItem(this.determineActiveItem(), { type: 'slide' });
  },

  /* Private */
  setupIndex: function() {
    if(this.indexReady) { return true; }

    this.menu = {
      bodyStyle: 'padding: 3px;',
      layout: { type: 'vbox', align: 'stretch' },
      defaults: {
        layout: {
          type: 'hbox',
          align: 'start',
          pack: 'start',
          padding: '5 5 5 5'
        },
        defaults: {
          ui: 'action-round',
          xtype: 'button',
          iconMask: true,
          iconAlign: 'top',
          cls: 'pagebutton',
          padding: 10,
          flex: 1
        }
      },
      items: [{
        items: [{
          iconCls: 'maps',
          text: 'Area Status',
          handler: function() {
            top.location.hash = 'areas';
          }
        },{
          iconCls: 'mail',
          text: 'Messages'
        }]
      }, {
        items: [{
          iconCls: 'bolt',
          text: 'Logout'
        }]
      }]
    };

    this.toolbar = {
      xtype: 'toolbar',
      docked: 'top',
      title: 'ATN Mobile Manager'
    };

    this.overview = {
      flex: 1,
      bodyStyle: 'text-align:center;',
      html: '<img style="width: 100%; height: 100%" src="' + (ATN.getProfile() == 'tablet' ? 'areas/overview.png' : 'areas/overview.jpg') + '" alt="Travel Status Overview" />'
    };

    this.welcome_landscape = {
      itemId: 'welcome_landscape',
      dockedItems: [this.toolbar],
      layout: {
        type: 'hbox',
        align: 'stretch'
      },
      items: [this.overview,this.menu]
    };

    this.welcome_portrait = {
      itemId: 'welcome_portrait',
      dockedItems: [this.toolbar],
      layout: {
        type: 'vbox',
        align: 'stretch'
      },
      items: [this.overview,this.menu]
    };
    
    ATN.viewport.add(this.welcome_landscape, this.welcome_portrait);
    ATN.viewport.doLayout();

    ATN.on('profilechange', function(profile) {
      var active = ATN.viewport.getActiveItem();
      console.log(active.itemId);
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
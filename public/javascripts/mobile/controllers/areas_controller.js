Ext.regController('areas', {
  index: function(params) {
    if(!this.areas) {
      this.areas = ATN.viewport.add({
        itemId: 'area',
        xtype: 'areas_index'
      });
      ATN.viewport.setActiveItem(this.areas.itemId);
    }
    this.areas.setActiveItem('list', { type: 'slide', reverse: params.back });
  },

  show:function(params) {
    var areas = Ext.getStore('areas'),
        i = areas.find('id', params.id),
        r = areas.getAt(i);
    
    if (r) {
      var status = this.areas.add({
        itemId: 'show_area',
        xtype: 'areas_show'
      });
      status.load(r);
      status.on('deactivate', function(oldcard) {
        oldcard.destroy();
      });

      this.areas.setActiveItem('show_area', { type: 'slide', reverse: params.back });
    } else {
      return this.show_list();
    }
  },

  edit:function(params) {
    var areas = Ext.getStore('areas'),
        i = areas.find('id', params.id),
        r = areas.getAt(i);

    if(!r) {
      return this.show_list();
    }

    var form = this.areas.add({
      itemId: 'area_edit',
      xtype: 'area_edit'
    });
    form.load(r);
    form.on('deactivate', function(oldcard) {
      oldcard.destroy();
    });
    this.areas.setActiveItem('area_edit', { type: 'slide' });
  },

  save: function(params) {
    var editor = this.areas.getComponent('area_edit'),
        values = editor.getValues(),
        area = {},
        loading = new Ext.LoadMask(ATN.viewport.getEl(), {
          msg: 'Saving...'
        });

    loading.show();

    for(var ii in values) {
      area['area[' + ii + ']'] = values[ii];
    }

    Ext.Ajax.request({
      url: '/areas/' + values.id,
      method: 'PUT',
      params: area,
      success: function(response, options) {
        var json = {},
            store = Ext.getStore('areas'),
            index = store.find('id', values.id),
            record = store.getAt(index);

        if(response.getAllResponseHeaders()['content-type'].match(/json/)) {
          json = Ext.decode(response.responseText);
        }
        loading.hide();
        if(json.flash) {
          Ext.Msg.alert(json.success ? 'Success' : 'Error', json.flash);
        } else {
          Ext.Msg.alert(json.success ? 'Success' : 'Error', 'Save finished');
        }
        if(json.success && record) {
          record.set(json.area);
        }

        ATN.dispatch({
          controller: 'areas',
          action: 'show',
          id: values.id,
          back: true,
          historyUrl: 'areas/show/' + values.id
        });
      },
      failure: function(response, options) {
        var json = {};

        if(response.getAllResponseHeaders()['content-type'].match(/json/)) {
          json = Ext.decode(response.responseText);
        }
        loading.hide();
        if(json.flash) {
          Ext.Msg.alert('Error', json.flash);
        } else {
          Ext.Msg.alert('Error', 'An unknown error occurred during the request');
        }
      }
    });
  },

  show_list: function(params) {
    ATN.dispatch({
      controller: 'areas',
      action: 'index',
      back: true,
      historyUrl: 'areas'
    });
  }
});
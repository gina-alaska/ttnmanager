Ext.regModel('Area', {
  fields: ['id', 'name', 'notes', 'travel_status', 'messages', 'alerts', 'operationals', 'snow', 'soil', 'order', 'created_at', {
    name: 'updated_at',
    type: 'date',
    dateFormat: 'c'
  }]
});
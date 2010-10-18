Ext.regModel("Post", {
    fields: [
        {name: 'id',      type: 'int'},
        {name: 'user_id', type: 'int'},
        {name: 'title',   type: 'string'},
        {name: 'body',    type: 'string'}
    ],
    
    validations: [
        {type: 'presence', fields: ['user_id', 'title', 'body']}
    ],
    
    associations: [
        {type: 'belongsTo', model: 'User'},
        {type: 'hasMany',   model: 'Comment'}
    ],
    
    proxy: {
        type: 'localstorage',
        id  : 'Posts'
    }
});
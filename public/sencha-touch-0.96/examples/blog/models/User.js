Ext.regModel("User", {
    fields: [
        {name: 'id',       type: 'int'},
        {name: 'username', type: 'string'},
        {name: 'email',    type: 'string'}
    ],
    
    validations: [
        {type: 'presence', fields: ['username', 'email']}
    ],
    
    associations: [
        {type: 'hasMany', model: 'Post'}
    ],
    
    proxy: {
        type: 'localstorage',
        id  : 'Users'
    }
});
Ext.regModel("Comment", {
    fields: [
        {name: 'post_id', type: 'int'},
        {name: 'content', type: 'string'}
    ],
    
    validations: [
        {type: 'presence', fields: ['post_id', 'content']}
    ],
    
    associations: [
        {type: 'belongsTo', model: 'Post'}
    ],
    
    proxy: {
        type: 'localstorage',
        id  : 'Comments'
    }
});
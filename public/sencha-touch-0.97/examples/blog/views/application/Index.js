Ext.regView('application-index', {
    xtype: 'tabpanel',
    fullscreen: true,
    
    dockedItems: [
        {
            dock  : 'left',
            xtype : 'nestedlist',
            width : 200,
            id: 'menu',
            items : [
                {controller: 'posts',    text: 'Posts'},
                {controller: 'comments', text: 'Comments'},
                {controller: 'users',    text: 'Users'}
            ]
        }
    ],
    
    items: [
        {
            title: 'Dashboard',
            html: 'Welcome'
        }
    ]
});
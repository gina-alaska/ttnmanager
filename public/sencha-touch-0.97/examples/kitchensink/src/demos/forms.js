demos.Forms = new Ext.TabPanel({
    items: [{
        title: 'Basic',
        xtype: 'form',
        id: 'basicform',
        scroll: 'vertical',
        items: [{
            xtype: 'fieldset',
            title: 'Personal Info',
            instructions: 'Please enter the information above.',
            defaults: {
                // labelAlign: 'right'
            },
            items: [{
                xtype: 'textfield',
                name: 'name',
                label: 'Name',
                placeHolder: 'Johnny Appleseed',
                autoCapitalize : true,
                required: true,
                showClear: true
            }, {
                xtype: 'passwordfield',
                name: 'password',
                label: 'Password',
                showClear: true
            }, {
                xtype: 'emailfield',
                name: 'email',
                label: 'Email',
                placeHolder: 'you@domain.com'
            }, {
                xtype: 'urlfield',
                name: 'url',
                label: 'Url',
                placeHolder: 'http://google.com'
            }, {
                xtype: 'checkbox',
                name: 'cool',
                label: 'Cool'
            }, {
                xtype: 'datepickerfield',
                name: 'birthday',
                label: 'Birthday',
                datePickerConfig: { yearFrom: 1900 }
            }, {
                xtype: 'select',
                name: 'rank',
                label: 'Rank',
                options: [{
                    text: 'Master',
                    value: 'master'
                }, {
                    text: 'Journeyman',
                    value: 'journeyman'
                }, {
                    text: 'Apprentice',
                    value: 'apprentice'
                }]
            }, {
                xtype: 'hidden',
                name: 'secret',
                value: false
            }, {
                xtype: 'textarea',
                name: 'bio',
                label: 'Bio'
            }]
        }, {
            xtype: 'fieldset',
            title: 'Favorite color',
            defaults: {
                xtype: 'radio'
            },
            items: [{
                name: 'color',
                label: 'Red'
            }, {
                name: 'color',
                label: 'Blue'
            }, {
                name: 'color',
                label: 'Green'
            }, {
                name: 'color',
                label: 'Purple'
            }]
        }, {
            layout: 'hbox',
            defaults: {xtype: 'button', flex: 1, style: 'margin: .5em;'},
            items: [{
                text: 'Disable fields',
                scope: this,
                hasDisabled: false,
                handler: function(btn){
                    var fields = Ext.ComponentQuery.query('#basicform field');
                    if (btn.hasDisabled) {
                        for (var i = fields.length - 1; i >= 0; i--){
                            var f = fields[i];
                            f.enable();
                        };                        
                    } else {
                        for (var i = fields.length - 1; i >= 0; i--){
                            var f = fields[i];
                            f.disable();
                        };
                        btn.hasDisabled = true;
                        btn.setText('Enable fields');
                    }
                },
            }, {
                text: 'Reset form',
                handler: function(){
                    Ext.getCmp('basicform').reset();
                },
            }]
        }]
    }, {
        title: 'Sliders',
        xtype: 'form',
        items: [{
            xtype: 'fieldset',
            defaults: {
                labelAlign: 'right'
            },
            items: [{
                xtype: 'slider',
                name: 'value',
                label: 'Value'
            }, {
                xtype: 'toggle',
                name: 'enable',
                label: 'Enable'
            }]
        }]
    }, {
        title: 'Toolbars',
        xtype: 'panel',
        styleHtmlContent: true,
        dockedItems: {
            xtype: 'toolbar',
            dock: 'top',
            items: [{
                xtype: 'searchfield',
                placeHolder: 'Search',
                name: 'searchfield'
            }, {
                xtype: 'textfield',
                placeHolder: 'Text',
                name: 'searchfield'
            }, {
                xtype: 'select',
                name: 'options',
                options: [
                    {text: 'This is just a big select',  value: '1'},
                    {text: '2', value: '2'}
                ]
            }]
        }
    }]
});



// if (Ext.is.Android) {
//     demos.Forms.insert(0, {
//         xtype: 'component',
//         styleHtmlContent: true,
//         html: '<span style="color: red">Forms on Android are currently under development. We are working hard to improve this in upcoming releases.</span>'
//     });
// }
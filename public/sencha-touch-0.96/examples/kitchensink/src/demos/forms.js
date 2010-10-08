demos.Forms = new Ext.TabPanel({
    animation: {
        type: 'cardslide'
    },
    items: [{
        title: 'Basic',
        xtype: 'form',
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
                    text: 'Student',
                    value: 'padawan'
                }, {
                    text: 'Slave',
                    value: 'slave'
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
    }]
});

// if (Ext.is.Android) {
//     demos.Forms.insert(0, {
//         xtype: 'component',
//         styleHtmlContent: true,
//         html: '<span style="color: red">Forms on Android are currently under development. We are working hard to improve this in upcoming releases.</span>'
//     });
// }
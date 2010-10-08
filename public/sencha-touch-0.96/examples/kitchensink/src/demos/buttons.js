// demos.Buttons = new Ext.Carousel({
//     items: [{
//         dockedItems: [{
//             xtype: 'toolbar',
//             dock: 'top',
//             ui: 'light',
//             title: 'Default'
//         }, {
//             xtype: 'toolbar',
//             dock: 'bottom',
//             ui: 'light',
//             defaults: { xtype: 'button' },
//             items: [{
//                 text: 'Default'
//             }, {
//                 ui: 'round',
//                 text: 'Round UI'
//             }, {
//                 ui: 'small',
//                 text: 'Small UI'
//             }]
//         }],
//         cls: 'card1',
//         defaults: {
//             xtype: 'button'
//         },
//         items: [{
//             text: 'blah'
//         }]
//     }]
// });








// wrapping in closure to avoid global var
(function() {

var cfg = {
    layout: {
        type: 'vbox',
        pack: 'center',
        align: 'stretch'
    },
    cls: 'card1',
    scroll: 'vertical',
    defaults: {
        layout: {
            type: 'hbox'
        },
        flex: 1,
        defaults: {
            xtype: 'button',
            cls: 'demobtn',
            flex: 1
        }
    },
    items: [{
        items: [{
            text: 'Normal'
        }, {
            ui: 'round',
            text: 'Round'
        }, {
            ui: 'small',
            text: 'Small'
        }]
    }, {
        items: [{
            ui: 'decline',
            text: 'Drastic'
        }, {
            ui: 'decline-round',
            text: 'Round'
        }, {
            ui: 'decline-small',
            text: 'Small'
        }]
    }, {
        items: [{
            ui: 'confirm',
            text: 'Confirm'
        }, {
            ui: 'confirm-round',
            text: 'Round'
        }, {
            ui: 'confirm-small',
            text: 'Small'
        }]
    }]
};

if (Ext.is.Phone) {
    demos.Buttons = new Ext.Panel(cfg);
// tablet devices have more room to accomodate
// some sample buttons
} else {
    cfg.items[2].items.push({
        ui: 'back',
        text: 'Back'
    });
    cfg.dockedItems = [{
        xtype: 'toolbar',
        dock: 'bottom',
        defaults: {
            xtype: 'button',
            text: 'Test',
            flex: 1
        },
        items: [{
            ui: 'round'
        }, {
            ui: 'drastic'
        }, {
            ui: 'action'
        }, {
            ui: 'decline-round'
        }, {
            ui: 'decline-small'
        }, {
            ui: 'confirm-round'
        }, {
            ui: 'confirm-small'
        }]
    }];
    demos.Buttons = new Ext.Panel(cfg);
}


})();
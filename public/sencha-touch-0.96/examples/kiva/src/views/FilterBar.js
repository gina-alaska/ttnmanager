kiva.ui.FilterBar = Ext.extend(Ext.form.FormPanel, {
    baseCls: 'x-toolbar',
    cls: 'x-toolbar-dark',
    ui: 'green',

    initComponent : function() {
        this.layout = {
            type: 'hbox',
            pack: 'center',
            align: 'center'
        };

        this.defaults = {
            listeners: {
                select: this.onFieldChange,
                scope: this
            }
        };

        this.items = [{
            xtype: 'select',
            name: 'gender',
            prependText: 'Gender:',
            options: [
                {text: 'Both',  value: ''},
                {text: 'Male',  value: 'male'},
                {text: 'Female', value: 'female'}
            ]
        }, {
            xtype: 'select',
            name: 'sector',
            prependText: 'Sector:',
            options: [
                {text: 'All', value: ''},
                {text: 'Agriculture', value: 'agriculture'},
                {text: 'Transportation', value: 'transportation'},
                {text: 'Services', value: 'services'},
                {text: 'Clothing', value: 'clothing'},
                {text: 'Health', value: 'health'},
                {text: 'Retail', value: 'retail'},
                {text: 'Manufacturing', value: 'manufacturing'},
                {text: 'Arts', value: 'arts'},
                {text: 'Housing', value: 'housing'},
                {text: 'Food', value: 'food'},
                {text: 'Wholesale', value: 'wholesale'},
                {text: 'Construction', value: 'construction'},
                {text: 'Education', value: 'education'},
                {text: 'Personal Use', value: 'personal'},
                {text: 'Entertainment', value: 'entertainment'},
                {text: 'Green', value: 'green'}
            ]
        }, {xtype: 'spacer'}, {
            xtype: 'select',
            name: 'sort_by',
            prependText: 'Sort by:',
            options: [
                // popularity, loan_amount, oldest, expiration, newest, amount_remaining, repayment_term
                {text: 'Newest', value: 'newest'},
                {text: 'Oldest', value: 'oldest'},
                {text: 'Expiring', value: 'expiration'},
                {text: 'Amount Remaining', value: 'amount_remaining'},
                // {text: 'Repayment term', value: 'repayment_term'},
                {text: 'Popularity', value: 'popularity'},
                {text: 'Loan Amount', value: 'loan_amount'}
            ]
        }, {xtype: 'spacer'}, {
            xtype: 'searchfield',
            name: 'q',
            placeholder: 'Search',
            listeners : {
                change: this.onFieldChange,
                keyup: function(field, e) {
                    var key = e.browserEvent.keyCode;
                    // blur field when user presses enter/search
                    // which will trigger a change if necessary.
                    if (key === 13) {
                        field.blur();
                    }
                },
                scope : this
            }
        }];

        this.addEvents('change');

        kiva.ui.FilterBar.superclass.initComponent.call(this);
    },

    onFieldChange : function(comp, value) {
        this.fireEvent('change', this, this.getValues());
    }
});

Ext.reg('kiva-filterbar', kiva.ui.FilterBar);
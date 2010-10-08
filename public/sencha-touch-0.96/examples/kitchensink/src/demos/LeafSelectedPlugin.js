/**
 * @class Ext.LeafSelectedPlugin
 * @extends Object
 *
 * A simple plugin for a NestedList which adds a "leafselected"
 * event which accounts for cardswitching and selectionchange.
 *
 * This is useful when you want to enable editing of all leaf items.
 */
Ext.LeafSelectedPlugin = Ext.extend(Object, {
    init: function(nestedList) {
        this.nestedList = nestedList;
        nestedList.addEvents('leafselected');
        nestedList.on('cardswitch', this.onCardSwitch, this);
        nestedList.on('selectionchange', this.onSelectionChange, this);
    },

    onCardSwitch: function(ct, newCard, oldCard, newIndex, animated) {
        var nestedList = this.nestedList;
        if (newCard.getSelectedRecords) {
            var record = newCard.getSelectedRecords()[0];
            if (record) {
                nestedList.fireEvent('leafselected', record.node.leaf);
            } else {
                nestedList.fireEvent('leafselected', false);
            }
        } else {
            nestedList.fireEvent('leafselected', false);
        }
    },

    onSelectionChange: function(subList, elements, records) {
        var nestedList = this.nestedList;
        if (nestedList.getActiveItem() === subList) {
            if (records[0]) {
                nestedList.fireEvent('leafselected', records[0].node.leaf);
            } else {
                nestedList.fireEvent('leafselected', false);
            }
        }
    }
});

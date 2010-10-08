/**
 * @class Ext.layout.Layout
 * @extends Object
 * Base Layout class - extended by ComponentLayout and ContainerLayout
 */

Ext.layout.Layout = Ext.extend(Object, {
    type: 'layout',
    isLayout: true,
    initialized: false,
    
    constructor : function(config) {
        this.id = Ext.id(null, 'ext-layout-');
        Ext.apply(this, config);
    },

    /**
     * @private
     */
    layout : function() {
        this.layoutBusy = true;
        this.initLayout();

        if (this.beforeLayout.apply(this, arguments) !== false) {
            this.onLayout.apply(this, arguments);
            this.afterLayout();
            this.layoutBusy = false;
        }
    },

    beforeLayout : function() {
        this.renderItems(this.getLayoutItems(), this.getTarget());
        return true;
    },
    
    /**
     * @private
     * Iterates over all passed items, enuring they are rendered.  If the items are already rendered,
     * also determines if the items are in the proper place dom.
     */
    renderItems : function(items, target) {
        var ln = items.length,
            i, item;

        for (i = 0; i < ln; i++) {
            item = items[i];
            if (item && !item.rendered) {
                this.renderItem(item, i, target);
            }
            else if (!this.isValidParent(item, target)) {
                this.moveItem(item, i, target);
            }
        }
    },

    /**
     * @private
     * Renders the given Component into the target Element.
     * @param {Ext.Component} c The Component to render
     * @param {Number} position The position within the target to render the item to
     * @param {Ext.Element} target The target Element
     */
    renderItem : function(item, position, target) {
        if (!item.rendered) {
            item.render(target, position);            
            this.configureItem(item, position);
            this.childrenChanged = true;
        }
    },

    /**
     * @private
     * Moved Component to the provided target instead.
     */
    moveItem : function(item, position, target) {
        if (typeof position == 'number') {
            position = target.dom.childNodes[position];
        }
        // Make sure target is a dom element
        target = target.dom || target;
        target.insertBefore(item.el.dom, position || null);
        item.container = target;        
        this.configureItem(item, position);
        this.childrenChanged = true;
    },
    
    /**
     * @private
     * Adds the layout's targetCls if necessary and sets
     * initialized flag when complete.
     */
    initLayout : function() {
        if (!this.initialized && !Ext.isEmpty(this.targetCls)) {
            this.getTarget().addClass(this.targetCls);          
        }
        this.initialized = true;        
    },

    // @private Sets the layout owner
    setOwner : function(owner) {
        this.owner = owner;
    },

    // @private - Returns empty array
    getLayoutItems : function() {
        return [];
    },
 
    // @private - Validates item is in the proper place in the dom.
    isValidParent : function(item, target) {
        var dom = item.el ? item.el.dom : Ext.getDom(item);
        return target && (dom.parentNode == (target.dom || target));
    },

    /**
     * @private
     * Applies extraCls
     */
    configureItem: function(item, position) {
        if (this.extraCls) {
            item.el.addClass(this.extraCls);
        }
    },
    
    // Placeholder empty functions for subclasses to extend
    onLayout : Ext.emptyFn,
    afterLayout : Ext.emptyFn,
    onRemove : Ext.emptyFn,
    onDestroy : Ext.emptyFn,

    /**
     * @private
     * Removes extraCls
     */
    afterRemove : function(item) {
        if (this.extraCls && item.rendered) {
            item.el.removeClass(this.extraCls);
        }
    },

    /*
     * Destroys this layout. This is a template method that is empty by default, but should be implemented
     * by subclasses that require explicit destruction to purge event handlers or remove DOM nodes.
     * @protected
     */
    destroy : function() {
        if (!Ext.isEmpty(this.targetCls)) {
            var target = this.getTarget();
            if (target) {
                target.removeClass(this.targetCls);
            }
        }
        this.onDestroy();
    }
});
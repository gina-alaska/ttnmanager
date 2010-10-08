/**
 * @class Ext.layout.BoxLayout
 * @extends Ext.layout.ContainerLayout
 * <p>Base Class for HBoxLayout and VBoxLayout Classes. Generally it should not need to be used directly.</p>
 */
Ext.layout.BoxLayout = Ext.extend(Ext.layout.ContainerLayout, {
    type: 'box',

    targetCls: 'x-layout-box',
    //wrapCls: 'x-layout-box-wrap',
    innerCls: 'x-layout-box-inner',

    pack : 'start',
    direction: 'horizontal',
    align: 'center',

    /**
     * @private
     * Runs the child box calculations and caches them in childBoxCache. Subclasses can used these cached values
     * when laying out
     */
    onLayout: function() {
        Ext.layout.BoxLayout.superclass.onLayout.call(this);
        
        if (this.pack === 'left' || this.pack === 'top') {
            this.pack = 'start';
        }
        else if (this.pack === 'right' || this.pack === 'bottom') {
            this.pack = 'end';
        }

        var target = this.getTarget(),
            ct = target.parent(),
            targetWidth = (ct.getWidth() - ct.getPadding('lr') - ct.getBorderWidth('lr')) + 'px',
            targetHeight = (ct.getHeight() - ct.getPadding('tb') - ct.getBorderWidth('tb')) + 'px';
            
        target.setStyle({
            '-webkit-box-orient': this.orientation,
            '-webkit-box-direction': this.direction,
            '-webkit-box-pack': this.pack,
            '-webkit-box-align': this.align
        });
        
        if (this.orientation == 'horizontal') {
            target.setStyle({
                'min-width': targetWidth,
                'height': targetHeight
            });
        }
        else {
            target.setStyle({
                'min-height': targetHeight,
                'width': targetWidth
            });
        }

        this.prepareFlexedItems();
        this.setFlexedItems();
    },
    
    prepareFlexedItems : function() {        
        var items = this.getLayoutItems(),
            ln = items.length,
            item, i;

        for (i = 0; i < ln; i++) {
            item = items[i];
            if (item.flex != undefined) {
                item.el.setStyle('position', 'absolute');
                item.boxEl = this.createBoxEl(item);
            }
            else {
                item.doComponentLayout();
            }
        }
    },    
        
    setFlexedItems : function() {
        var items = this.getLayoutItems(),
            ln = items.length,
            item, i;
            
        for (i = 0; i < ln; i++) {
            item = items[i];
            if (item.flex != undefined) {
                item.boxSize = item.boxEl.getSize();
            }
        }

        for (i = 0; i < ln; i++) {
            item = items[i];
            if (item.flex != undefined) {
                item.el.setStyle('position', '');
                if (this.align == 'stretch') {
                    item.setSize(item.boxSize);
                }
                else {
                    if (this.direction == 'horizontal') {
                        item.setWidth(item.boxSize.width);
                    }
                    else {
                        item.setHeight(item.boxSize.height);
                    }
                }                
                item.boxEl.remove();
                delete item.boxEl;
                delete item.boxSize;
            }
        }
    },
    
    getTarget : function() {
        var owner = this.owner,
            innerCt = this.innerCt;
        
        if (!innerCt) {
            if (owner.scrollEl) {
                innerCt = owner.scrollEl.addClass(this.innerCls);
            }
            else {
                innerCt = owner.getTargetEl().createChild({cls: this.innerCls});
            }
            this.innerCt = innerCt;
        }

        return innerCt;
    }
});

/**
 * @class Ext.layout.HBoxLayout
 * @extends Ext.layout.BoxLayout
 * <p>A layout that arranges items horizontally across a Container. This layout optionally divides available horizontal
 * space between child items containing a numeric <code>flex</code> configuration.</p>
 * This layout may also be used to set the heights of child items by configuring it with the {@link #align} option.
 */
Ext.layout.HBoxLayout = Ext.extend(Ext.layout.BoxLayout, {
    orientation: 'horizontal',
    
    createBoxEl : function(item) {
        return item.el.insertSibling({
            style: 'margin-left: ' + item.el.getMargin('lr') + 'px; -webkit-box-flex: ' + item.flex
        });
    }
});

Ext.regLayout('hbox', Ext.layout.HBoxLayout);

/**
 * @class Ext.layout.VBoxLayout
 * @extends Ext.layout.BoxLayout
 * <p>A layout that arranges items vertically down a Container. This layout optionally divides available vertical
 * space between child items containing a numeric <code>flex</code> configuration.</p>
 * This layout may also be used to set the widths of child items by configuring it with the {@link #align} option.
 */
Ext.layout.VBoxLayout = Ext.extend(Ext.layout.BoxLayout, {
    orientation: 'vertical',
    
    createBoxEl : function(item) {
        return item.el.insertSibling({
            style: 'margin-top: ' + item.el.getMargin('tb') + 'px; -webkit-box-flex: ' + item.flex
        });
    }
});

Ext.regLayout('vbox', Ext.layout.VBoxLayout);
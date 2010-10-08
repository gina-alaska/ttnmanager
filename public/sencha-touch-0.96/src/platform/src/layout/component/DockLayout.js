/**
 * @class Ext.layout.DockLayout
 * @extends Ext.layout.ComponentLayout
 * This ComponentLayout handles docking for Panels. It takes care of panels that are
 * part of a ContainerLayout that sets this Panel's size and Panels that are part of
 * an AutoContainerLayout in which this panel get his height based of the CSS or
 * or its content.
 */
Ext.layout.DockLayout = Ext.extend(Ext.layout.ComponentLayout, {
    type: 'dock',

    /**
     * @property extraCls
     * @type String
     * This class is automatically added to each docked item within this layout.
     * We also use this as a prefix for the position class e.g. x-docked-bottom
     */
    extraCls: 'x-docked',

    /**
     * @protected
     * @param {Ext.Component} owner The Panel that owns this DockLayout
     * @param {Ext.Element} target The target in which we are going to render the docked items
     * @param {Array} args The arguments passed to the ComponentLayout.layout method
     */
    onLayout: function(width, height) {
        var layout = this.owner.layout,
            target = this.getTarget();
        
        // We start of by resetting all the layouts info
        var info = this.info = {
            boxes: [],
            size: {
                width: width,
                height: height
            },
            padding: {
                top: target.getPadding('t'),
                right: target.getPadding('r'),
                bottom: target.getPadding('b'),
                left: target.getPadding('l')                
            }, 
            border: {
                top: target.getBorderWidth('t'),
                right: target.getBorderWidth('r'),
                bottom: target.getBorderWidth('b'),
                left: target.getBorderWidth('l')                
            },
            bodyBox: {}
        };
        
        // Height is either the height passed to setSize or the this.height on the component.
        if (height === undefined || height === null) {
            // Clear any sizing that we already set in a previous layout
            this.setTargetSize((width === undefined) ? null : width, null);
            this.updateBodyBox({width: null, height: null});

            // Run the container layout first
            if (layout && layout.isLayout) {
                layout.layout();
            }

            // The dockItems method will add all the top and bottom docked items height
            // to the info.panelSize height. Thats why we have to call setSize after
            // we dock all the items to actually set the panel's width and height.
            // We have to do this because the panel body and docked items will be position
            // absolute which doesnt stretch the panel.
            this.dockItems(true);
            this.setTargetSize(info.size.width, info.size.height);            
        }
        else {
            // If we get inside this else statement, it means that the Panel has been
            // given a size by its parents container layout. In this case we want to
            // actualy set the Panel's dimensions and dock all the items.
            this.setTargetSize(width, height);
            this.dockItems();            
        }

        Ext.layout.DockLayout.superclass.onLayout.call(this, width, height);
    },
    
    afterLayout : function() {
        Ext.layout.DockLayout.superclass.afterLayout.call(this);
    },

    /**
     * @protected
     * This method will first update all the information about the docked items,
     * body dimensions and position, the panel's total size. It will then
     * set all these values on the docked items and panel body.
     * @param {Array} items Array containing all the docked items
     * @param {Boolean} autoBoxes Set this to true if the Panel is part of an
     * AutoContainerLayout
     */
    dockItems : function(autoHeight) {
        this.calculateDockBoxes(autoHeight);

        // Both calculateAutoBoxes and calculateSizedBoxes are changing the
        // information about the body, panel size, and boxes for docked items
        // inside a property called info.
        var info = this.info,
            boxes = info.boxes,
            ln = boxes.length,
            dock, i;

        // We are going to loop over all the boxes that were calculated
        // and set the position and size of each item the box belongs to.
        for (i = 0; i < ln; i++) {
            dock = boxes[i];
            dock.item.setPosition(dock.x, dock.y);
        }

        // If the bodyBox has been adjusted because of the docked items
        // we will update the dimensions and position of the panel's body.
        this.updateBodyBox(info.bodyBox);     
    },

    /**
     * @protected
     * This method will set up some initial information about the panel size and bodybox
     * and then loop over all the items you pass it to take care of stretching, aligning,
     * dock position and all calculations involved with adjusting the body box.
     * @param {Array} items Array containing all the docked items we have to layout
     */
    calculateDockBoxes : function(autoHeight) {
        // We want to use the Panel's el width, and the Panel's body height as the initial
        // size we are going to use in calculateDockBoxes. We also want to account for
        // the border of the panel.
        var target = this.getTarget(),
            items = this.getLayoutItems(),
            owner = this.owner,
            bodyEl = owner.body,
            info = this.info,
            size = info.size,
            ln = items.length,
            padding = info.padding,
            border = info.border,
            item, i, box, w, h;

        size.width = (info.width === undefined) ? target.getWidth() : info.width;
        // If this Panel is inside an AutoContainerLayout, we will base all the calculations
        // around the height of the body and the width of the panel.
        if (autoHeight) {
            size.height = Math.max(owner.el.getHeight(), bodyEl.getHeight() + padding.top + border.top + padding.bottom + border.bottom);
        }
        info.bodyBox = {
            x: border.left + padding.left, 
            y: border.top + padding.top,
            width: size.width - padding.left - border.left - padding.right - border.right,
            height: size.height - border.top - padding.top - border.bottom - padding.bottom
        };

        // Loop over all the docked items
        for (i = 0; i < ln; i++) {
            item = items[i];
            // The initBox method will take care of stretching and alignment
            // In some cases it will also layout the dock items to be able to
            // get a width or height measurement
            box = this.initBox(item);

            if (autoHeight === true) {
                box = this.adjustAutoBox(box, i);
            }
            else {
                box = this.adjustSizedBox(box, i);
            }

            // Save our box. This allows us to loop over all docked items and do all
            // calculations first. Then in one loop we will actually size and position
            // all the docked items that have changed.
            info.boxes.push(box);
        }
    },

    /**
     * @protected
     * This method will adjust the position of the docked item and adjust the body box
     * accordingly.
     * @param {Object} box The box containing information about the width and height
     * of this docked item
     * @param {Number} index The index position of this docked item
     * @return {Object} The adjusted box
     */
    adjustSizedBox : function(box, index) {
        var bodyBox = this.info.bodyBox;
        switch (box.type) {
            case 'top':
                box.y = bodyBox.y;
                break;

            case 'left':
                box.x = bodyBox.x;
                break;

            case 'bottom':
                box.y = (bodyBox.y + bodyBox.height) - box.height;
                break;

            case 'right':
                box.x = (bodyBox.x + bodyBox.width) - box.width;
                break;
        }
        
        // If this is not an overlaying docked item, we have to adjust the body box
        if (!box.overlay) {
            switch (box.type) {
                case 'top':
                    bodyBox.y += box.height;
                    bodyBox.height -= box.height;
                    break;

                case 'left':
                    bodyBox.x += box.width;
                    bodyBox.width -= box.width;
                    break;

                case 'bottom':
                    bodyBox.height -= box.height;
                    break;

                case 'right':
                    bodyBox.width -= box.width;
                    break;
            }
        }
        return box;
    },

    /**
     * @protected
     * This method will adjust the position of the docked item inside an AutoContainerLayout
     * and adjust the body box accordingly.
     * @param {Object} box The box containing information about the width and height
     * of this docked item
     * @param {Number} index The index position of this docked item
     * @return {Object} The adjusted box
     */
    adjustAutoBox : function (box, index) {
        var info = this.info,
            bodyBox = info.bodyBox,
            size = info.size,
            boxes = info.boxes,
            pos = box.type,
            i, adjustBox;

        if (pos == 'top' || pos == 'bottom') {
            // This can affect the previously set left and right and bottom docked items
            for (i = 0; i < index; i++) {
                adjustBox = boxes[i];
                if (adjustBox.stretched && adjustBox.type == 'left' || adjustBox.type == 'right') {
                    adjustBox.height += box.height;
                }
                else if (adjustBox.type == 'bottom') {
                    adjustBox.y += box.height;
                }
            }
        }

        switch (pos) {
            case 'top':
                box.y = bodyBox.y;
                if (!box.overlay) {
                    bodyBox.y += box.height;
                }                
                size.height += box.height;
                break;

            case 'bottom':
                box.y = (bodyBox.y + bodyBox.height);
                size.height += box.height;
                break;
                    
            case 'left':
                box.x = bodyBox.x;
                if (!box.overlay) {
                    bodyBox.x += box.width;
                    bodyBox.width -= box.width;
                }
                break;

            case 'right':
                if (!box.overlay) {
                    bodyBox.width -= box.width;
                }
                box.x = (bodyBox.x + bodyBox.width);
                break;
        }
        return box;
    },

    /**
     * @protected
     * This method will create a box object, with a reference to the item, the type of dock
     * (top, left, bottom, right). It will also take care of stretching and aligning of the
     * docked items.
     * @param {Ext.Component} item The docked item we want to initialize the box for
     * @return {Object} The initial box containing width and height and other useful information
     */
    initBox : function(item) {
        var bodyBox = this.info.bodyBox,
            horizontal = (item.dock == 'top' || item.dock == 'bottom'),
            box = {
                item: item,
                overlay: item.overlay,
                type: item.dock
            };
        // First we are going to take care of stretch and align properties for all four dock scenarios.
        if (item.stretch !== false) {
            box.stretched = true;
            if (horizontal) {
                box.x = bodyBox.x;
                box.width = bodyBox.width;
                item.doComponentLayout(box.width - item.el.getMargin('lr'));
            }
            else {
                box.y = bodyBox.y;
                box.height = bodyBox.height;
                item.doComponentLayout(undefined, box.height - item.el.getMargin('tb'));
            }            
        }
        else {
            item.doComponentLayout();
            box.width = item.getWidth();
            box.height = item.getHeight();
            if (horizontal) {
                box.x = (item.align == 'right') ? bodyBox.width - box.width : bodyBox.x;
            }
        }
        
        // If we havent calculated the width or height of the docked item yet
        // do so, since we need this for our upcoming calculations
        if (box.width == undefined) {
            box.width = item.getWidth() + item.el.getMargin('lr');
        }
        if (box.height == undefined) {
            box.height = item.getHeight() + item.el.getMargin('tb');
        }
        
        return box;
    },    
    
    /**
     * @protected
     * Returns an array containing all the docked items inside this layout's owner panel
     * @return {Array} An array containing all the docked items of the Panel
     */
    getLayoutItems : function() {
        return this.owner.getDockedItems();
    },

    /**
     * @protected
     * This function will be called by the dockItems method. Since the body is positioned absolute,
     * we need to give it dimensions and a position so that it is in the middle surrounded by
     * docked items
     * @param {Object} box An object containing new x, y, width and height values for the
     * Panel's body
     */
    updateBodyBox : function(box) {
        var body = this.owner.body,
            info = this.info,
            padding = info.padding,
            border = info.border;
        
        if (Ext.isNumber(box.width)) {
            box.width -= body.getMargin('lr');
        }
        if (Ext.isNumber(box.height)) {
            box.height -= body.getMargin('tb');
        }
        
        this.setElementSize(body, box.width, box.height);
        body.setLeft(box.x - padding.left - border.left);
        body.setTop(box.y - padding.top - border.top);
    },

    /**
     * @protected
     * We are overriding the Ext.layout.Layout configureItem method to also add a class that
     * indicates the position of the docked item. We use the extraCls (x-docked) as a prefix.
     * An example of a class added to a dock: right item is x-docked-right
     * @param {Ext.Component} item The item we are configuring
     */
    configureItem : function(item, pos) {
        Ext.layout.DockLayout.superclass.configureItem.call(this, item, pos);

        var el = item.el || Ext.get(item);
        if (this.extraCls) {
            el.addClass(this.extraCls + '-' + item.dock);
        }
    },

    afterRemove : function(item) {
        Ext.layout.DockLayout.superclass.afterRemove.call(this, item);
        if (this.extraCls) {
            item.el.removeClass(this.extraCls + '-' + item.dock);
        }
        item.el.dom.parentNode.removeChild(item.el.dom);
        this.childrenChanged = true;
    }
});

Ext.regLayout('dock', Ext.layout.DockLayout);
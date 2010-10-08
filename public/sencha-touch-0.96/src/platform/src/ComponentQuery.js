Ext.ComponentQuery = {
    modeRe: /^(\s?[>]\s?|\s|$)/,
    tokenRe: /^(#)?([\w-\*]+)/,

    matchers : [{
        re: /^\.([\w-]+)/,
        method: 'getByXType'
    },{
        re: /^(?:[\[\{](?:@)?([\w-]+)\s?(?:(=|.=)\s?['"]?(.*?)["']?)?[\]\}])/,
        method: 'getByAttribute'
    }, {
        re: /^#([\w-]+)/,
        method: 'getById'
    }],

    cache: {},
    
    query: function(selector, root) {
        var selectors = selector.split(','),
            ln = selectors.length, 
            i, query, results = [];
            
        for (i = 0; i < ln; i++) {
            selector = Ext.util.Format.trim(selectors[i]);
            query = this.cache[selector];
            if (!query) {
                this.cache[selector] = query = this.parse(selector);                
            }
            results = results.concat(query.execute(root));
        }
        
        return results;
    },
    
    parse: function(selector) {  
        var matchers = this.matchers,
            operations = [],
            ln = matchers.length,
            lastSelector,
            tokenMatch,
            modeMatch,
            selectorMatch,
            args,
            i, matcher;

        // We are going to parse the beginning of the selector over and
        // over again, slicing of any portions we converted into an
        // operation of the selector until it is an empty string.
        while (selector && lastSelector != selector) {
            lastSelector = selector;
            
            // First we check if we are dealing with a token like #, * or an xtype
            tokenMatch = selector.match(this.tokenRe);
            
            if (tokenMatch) {
                // If the token is a # we push a getById operation to our stack
                if (tokenMatch[1] == '#') {
                    operations.push({
                        method: 'getById',
                        args: [Ext.util.Format.trim(tokenMatch[2])]
                    });
                }
                // If the token is a * or an xtype string, we push a getByXType
                // operation to the stack.
                else {
                    operations.push({
                        method: 'getByXType',
                        args: [Ext.util.Format.trim(tokenMatch[2])]
                    });
                }
                
                // Now we slice of the part we just converted into an operation
                selector = selector.replace(tokenMatch[0], '');
            }
            
            // If the next part of the query is not a space or >, it means we
            // are going to check for more things that our current selection
            // has to comply to.
            while (!(modeMatch = selector.match(this.modeRe))) {    
                // Lets loop over each type of matcher and execute it
                // on our current selector.
                for (i = 0; i < ln; i++) {
                    matcher = matchers[i];                    
                    selectorMatch = selector.match(matcher.re);  
                    
                    // If we have a match, add an operation with the method
                    // associated with this matcher, and pass the regular
                    // expression matches are arguments to the operation.
                    if (selectorMatch) {
                        operations.push({
                            method: matcher.method,
                            args: selectorMatch.splice(1)
                        });
                        selector = selector.replace(selectorMatch[0], '');
                        // dont think the break is required
                        //break;
                    }
                }            
            }

            // Now we are going to check for a mode change. This means a space
            // or a > to determine if we are going to select all the children
            // of the currently matched items.            
            if (modeMatch[1]) {
                operations.push({
                    mode: modeMatch[1]
                });
                selector = selector.replace(modeMatch[1], '');
            }
        }
        
        //  Now that we have all our operations in an array, we are going
        // to create a new Query using these operations.
        return new Ext.ComponentQuery.Query({
            operations: operations
        });
    }
};

Ext.ComponentQuery.Query = Ext.extend(Object, {
    constructor: function(cfg) {
        cfg = cfg || {};
        Ext.apply(this, cfg);
    },
    
    execute : function(root) { 
        var operations = this.operations,
            ln = operations.length,
            operation, i,
            workingItems;

        if (!root) {
            workingItems = Ext.ComponentMgr.all.items.slice();
        }
        
        // We are going to loop over our operations and take care of them
        // one by one.
        for (i = 0; i < ln; i++) {
            operation = operations[i];

            // The mode operation requires some custom handling.
            // All other operations essentially filter down our current
            // working items, while mode replaces our current working
            // items by getting children from each one of our current
            // working items. The type of mode determines the type of
            // children we get. (e.g. > only gets direct children)            
            if (operation.mode) {
                workingItems = this.getItems(workingItems || [root], operation.mode);
            }
            else {
                workingItems = this.filterItems(workingItems || this.getItems([root]), operation);
            }
            
            // If this is the last operation, it means our current working
            // items are the final matched items. Thus return them!
            if (i == ln -1) {
                return workingItems;
            }
        }
        
        return [];
    },
    
    filterItems : function(items, operation) {
        var matchedItems = [],
            ln = items.length,
            i, item,
            args, matches;
        
        // Loop over each item, execute the operation. If the operation
        // returns true, it means the item should still be in our working
        // items.
        for (i = 0; i < ln; i++) {
            item = items[i];
            
            // We add the item as the first argument to the operation arguments.
            args = [item].concat(operation.args);
            
            // Execute the operation
            matches = this[operation.method].apply(this, args);
            if (matches) {
                matchedItems.push(item);
            }
        }
        
        return matchedItems;
    },
    
    getItems: function(items, mode) {
        var workingItems = [],
            ln = items.length,
            item, i;
        
        mode = mode ? Ext.util.Format.trim(mode) : '';
        
        for (i = 0; i < ln; i++) {
            item = items[i];
            if (item.getRefItems) {
                workingItems = workingItems.concat(item.getRefItems(mode != '>'));
            }
        }
        
        return workingItems;
    },
        
    // private
    getByXType : function(cmp, xtype) {
        return xtype === '*' || cmp.isXType(xtype);
    },
    
    // private
    getByAttribute : function(cmp, property, operator, value) {
        return (value === undefined) ? !!cmp[property] : (cmp[property] == value);
    },
    
    // private
    getById : function(cmp, id) {
        return cmp.getItemId() == id;
    }
});
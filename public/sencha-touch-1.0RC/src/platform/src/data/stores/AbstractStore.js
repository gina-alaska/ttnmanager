/**
 * @author Ed Spencer
 * @class Ext.data.AbstractStore
 * @extends Ext.util.Observable
 *
 * <p>AbstractStore which provides interactivity with proxies and readers but
 * does NOT rely on any internal data storage representation. Subclasses of
 * Store and TreeStore use the internal representation of Ext.util.MixedCollection
 * and Ext.data.Tree respectively.</p>
 * 
 */
Ext.data.AbstractStore = Ext.extend(Ext.util.Observable, {
    remoteSort  : false,
    remoteFilter: false,

    /**
     * @cfg {String/Ext.data.Proxy/Object} proxy The Proxy to use for this Store. This can be either a string, a config
     * object or a Proxy instance - see {@link #setProxy} for details.
     */

    /**
     * @cfg {Boolean/Object} autoLoad If data is not specified, and if autoLoad is true or an Object, this store's load method
     * is automatically called after creation. If the value of autoLoad is an Object, this Object will be passed to the store's
     * load method. Defaults to false.
     */
    autoLoad: false,

    /**
     * @cfg {Boolean} autoSave True to automatically sync the Store with its Proxy after every edit to one of its Records.
     * Defaults to false.
     */
    autoSave: false,

    /**
     * Sets the updating behavior based on batch synchronization. 'operation' (the default) will update the Store's
     * internal representation of the data after each operation of the batch has completed, 'complete' will wait until
     * the entire batch has been completed before updating the Store's data. 'complete' is a good choice for local
     * storage proxies, 'operation' is better for remote proxies, where there is a comparatively high latency.
     * @property batchUpdateMode
     * @type String
     */
    batchUpdateMode: 'operation',

    /**
     * If true, any filters attached to this Store will be run after loading data, before the datachanged event is fired.
     * Defaults to true, ignored if {@link #remoteFilter} is true
     * @property filterOnLoad
     * @type Boolean
     */
    filterOnLoad: true,

    /**
     * If true, any sorters attached to this Store will be run after loading data, before the datachanged event is fired.
     * Defaults to true, igored if {@link #remoteSort} is true
     * @property sortOnLoad
     * @type Boolean
     */
    sortOnLoad: true,

    /**
     * The default sort direction to use if one is not specified (defaults to "ASC")
     * @property defaultSortDirection
     * @type String
     */
    defaultSortDirection: "ASC",

    /**
     * True if a model was created implicitly for this Store. This happens if a fields array is passed to the Store's constructor
     * instead of a model constructor or name.
     * @property implicitModel
     * @type Boolean
     * @private
     */
    implicitModel: false,

    /**
     * The string type of the Proxy to create if none is specified. This defaults to creating a {@link Ext.data.MemoryProxy memory proxy}.
     * @property defaultProxyType
     * @type String
     */
    defaultProxyType: 'memory',

    /**
     * True if the Store has already been destroyed via {@link #destroyStore}. If this is true, the reference to Store should be deleted
     * as it will not function correctly any more.
     * @property isDestroyed
     * @type Boolean
     */
    isDestroyed: false,

    isStore: true,

    /**
     * @cfg {String} storeId Optional unique identifier for this store. If present, this Store will be registered with 
     * the {@link Ext.StoreMgr}, making it easy to reuse elsewhere. Defaults to undefined.
     */

    //documented above
    constructor: function(config) {
        this.addEvents(
            /**
             * @event add
             * Fired when a Model instance has been added to this Store
             * @param {Ext.data.Store} store The store
             * @param {Array} records The Model instances that were added
             * @param {Number} index The index at which the instances were inserted
             */
            'add',

            /**
             * @event remove
             * Fired when a Model instance has been removed from this Store
             * @param {Ext.data.Model} record The record that was removed
             */
            'remove',
            
            /**
             * @event update
             * Fires when a Record has been updated
             * @param {Store} this
             * @param {Ext.data.Model} record The Model instance that was updated
             * @param {String} operation The update operation being performed. Value may be one of:
             * <pre><code>
               Ext.data.Model.EDIT
               Ext.data.Model.REJECT
               Ext.data.Model.COMMIT
             * </code></pre>
             */
            'update',

            /**
             * @event datachanged
             * Fires whenever the records in the Store have changed in some way - this could include adding or removing records,
             * or updating the data in existing records
             * @param {Ext.data.Store} this The data store
             */
            'datachanged',

            /**
             * @event beforeload
             * Event description
             * @param {Ext.data.Store} store This Store
             * @param {Ext.data.Operation} operation The Ext.data.Operation object that will be passed to the Proxy to load the Store
             */
            'beforeload',

            /**
             * @event load
             * Fires whenever the store reads data from a remote data source.
             * @param {Ext.data.store} this
             * @param {Array} records An array of records
             * @param {Boolean} successful True if the operation was successful.
             */
            'load',

            /**
             * @event beforesync
             * Called before a call to {@link #sync} is executed. Return false from any listener to cancel the synv
             * @param {Object} options Hash of all records to be synchronized, broken down into create, update and destroy
             */
            'beforesync'
        );
        
        Ext.apply(this, config);

        /**
         * Temporary cache in which removed model instances are kept until successfully synchronised with a Proxy,
         * at which point this is cleared.
         * @private
         * @property removed
         * @type Array
         */
        this.removed = [];

        /**
         * Stores the current sort direction ('ASC' or 'DESC') for each field. Used internally to manage the toggling
         * of sort direction per field. Read only
         * @property sortToggle
         * @type Object
         */
        this.sortToggle = {};

        Ext.data.AbstractStore.superclass.constructor.apply(this, arguments);

        this.model = Ext.ModelMgr.getModel(config.model);
        
        /**
         * @property modelDefaults
         * @type Object
         * @private
         * A set of default values to be applied to every model instance added via {@link #insert} or created via {@link #create}.
         * This is used internally by associations to set foreign keys and other fields. See the Association classes source code
         * for examples. This should not need to be used by application developers.
         */
        Ext.applyIf(this, {
            modelDefaults: {}
        });

        //Supports the 3.x style of simply passing an array of fields to the store, implicitly creating a model
        if (!this.model && config.fields) {
            this.model = Ext.regModel('ImplicitModel-' + this.storeId || Ext.id(), {
                fields: config.fields
            });

            delete this.fields;

            this.implicitModel = true;
        }

        //ensures that the Proxy is instantiated correctly
        this.setProxy(config.proxy || this.model.proxy);

        if (this.id && !this.storeId) {
            this.storeId = this.id;
            delete this.id;
        }

        if (this.storeId) {
            Ext.StoreMgr.register(this);
        }
        
        /**
         * The collection of {@link Ext.util.Sorter Sorters} currently applied to this Store. 
         * @property sorters
         * @type Ext.util.MixedCollection
         */
        this.sorters = new Ext.util.MixedCollection();
        this.sorters.addAll(this.decodeSorters(config.sorters));
        
        /**
         * The collection of {@link Ext.util.Filter Filters} currently applied to this Store
         * @property filters
         * @type Ext.util.MixedCollection
         */
        this.filters = new Ext.util.MixedCollection();
        this.filters.addAll(this.decodeFilters(config.filters));
    },


    /**
     * Sets the Store's Proxy by string, config object or Proxy instance
     * @param {String|Object|Ext.data.Proxy} proxy The new Proxy, which can be either a type string, a configuration object
     * or an Ext.data.Proxy instance
     * @return {Ext.data.Proxy} The attached Proxy object
     */
    setProxy: function(proxy) {
        if (proxy instanceof Ext.data.Proxy) {
            proxy.setModel(this.model);
        } else {
            Ext.applyIf(proxy, {
                model: this.model
            });
            
            proxy = Ext.data.ProxyMgr.create(proxy);
        }
        
        this.proxy = proxy;
        
        return this.proxy;
    },

    /**
     * Returns the proxy currently attached to this proxy instance
     * @return {Ext.data.Proxy} The Proxy instance
     */
    getProxy: function() {
        return this.proxy;
    },

    //saves any phantom records
    create: function(data, options) {
        var instance = Ext.ModelMgr.create(Ext.applyIf(data, this.modelDefaults), this.model.modelName),
            operation;
        
        options = options || {};

        Ext.applyIf(options, {
            action : 'create',
            records: [instance]
        });

        operation = new Ext.data.Operation(options);

        this.proxy.create(operation, this.onProxyWrite, this);
        
        return instance;
    },

    read: function() {
        return this.load.apply(this, arguments);
    },

    onProxyRead: Ext.emptyFn,

    update: function(options) {
        options = options || {};

        Ext.applyIf(options, {
            action : 'update',
            records: this.getUpdatedRecords()
        });

        var operation = new Ext.data.Operation(options);

        return this.proxy.update(operation, this.onProxyWrite, this);
    },

    onProxyWrite: Ext.emptyFn,


    //tells the attached proxy to destroy the given records
    destroy: function(options) {
        options = options || {};

        Ext.applyIf(options, {
            action : 'destroy',
            records: this.getRemovedRecords()
        });

        var operation = new Ext.data.Operation(options);

        return this.proxy.destroy(operation, this.onProxyWrite, this);
    },


    onBatchOperationComplete: function(batch, operation) {
        if (operation.action == 'create') {
            var records = operation.records,
                length  = records.length,
                i;

            for (i = 0; i < length; i++) {
                records[i].needsAdd = false;
            }
        }
        
        this.fireEvent('datachanged', this);
    },

    /**
     * @private
     * Attached as the 'complete' event listener to a proxy's Batch object. Iterates over the batch operations
     * and updates the Store's internal data MixedCollection.
     */
    onBatchComplete: function(batch, operation) {
        var operations = batch.operations,
            length = operations.length,
            i;

        this.suspendEvents();

        for (i = 0; i < length; i++) {
            this.onProxyWrite(operations[i]);
        }

        this.resumeEvents();

        this.fireEvent('datachanged', this);
    },

    onBatchException: function(batch, operation) {
        // //decide what to do... could continue with the next operation
        // batch.start();
        //
        // //or retry the last operation
        // batch.retry();
    },

    /**
     * @private
     * Filter function for new records.
     */
    filterNew: function(item) {
        return item.phantom == true || item.needsAdd == true;
    },

    /**
     * Returns all Model instances that are either currently a phantom (e.g. have no id), or have an ID but have not
     * yet been saved on this Store (this happens when adding a non-phantom record from another Store into this one)
     * @return {Array} The Model instances
     */
    getNewRecords: function() {
        return [];
    },

    /**
     * Returns all Model instances that have been updated in the Store but not yet synchronized with the Proxy
     * @return {Array} The updated Model instances
     */
    getUpdatedRecords: function() {
        return [];
    },

    /**
     * @private
     * Filter function for dirty records.
     */
    filterDirty: function(item) {
        return item.dirty == true;
    },

    //returns any records that have been removed from the store but not yet destroyed on the proxy
    getRemovedRecords: function() {
        return this.removed;
    },


    sort: function(sorters, direction) {

    },

    /**
     * @private
     * Normalizes an array of sorter objects, ensuring that they are all Ext.util.Sorter instances
     * @param {Array} sorters The sorters array
     * @return {Array} Array of Ext.util.Sorter objects
     */
    decodeSorters: function(sorters) {
        if (!Ext.isArray(sorters)) {
            if (sorters == undefined) {
                sorters = [];
            } else {
                sorters = [sorters];
            }
        }

        var length = sorters.length,
            Sorter = Ext.util.Sorter,
            config, i;

        for (i = 0; i < length; i++) {
            config = sorters[i];

            if (!(config instanceof Sorter)) {
                if (Ext.isString(config)) {
                    config = {
                        property: config
                    };
                }
                
                Ext.applyIf(config, {
                    root     : 'data',
                    direction: "ASC"
                });

                //support for 3.x style sorters where a function can be defined as 'fn'
                if (config.fn) {
                    config.sorterFn = config.fn;
                }

                //support a function to be passed as a sorter definition
                if (typeof config == 'function') {
                    config = {
                        sorterFn: config
                    };
                }

                sorters[i] = new Sorter(config);
            }
        }

        return sorters;
    },

    filter: function(filters, value) {

    },

    /**
     * @private
     * Creates and returns a function which sorts an array by the given field and direction
     * @param {String} field The field to create the sorter for
     * @param {String} direction The direction to sort by (defaults to "ASC")
     * @return {Function} A function which sorts by the field/direction combination provided
     */
    createSortFunction: function(field, direction) {
        direction = direction || "ASC";
        var directionModifier = direction.toUpperCase() == "DESC" ? -1 : 1;

        var fields   = this.model.prototype.fields,
            sortType = fields.get(field).sortType;

        //create a comparison function. Takes 2 records, returns 1 if record 1 is greater,
        //-1 if record 2 is greater or 0 if they are equal
        return function(r1, r2) {
            var v1 = sortType(r1.data[field]),
                v2 = sortType(r2.data[field]);

            return directionModifier * (v1 > v2 ? 1 : (v1 < v2 ? -1 : 0));
        };
    },

    /**
     * @private
     * Normalizes an array of filter objects, ensuring that they are all Ext.util.Filter instances
     * @param {Array} filters The filters array
     * @return {Array} Array of Ext.util.Filter objects
     */
    decodeFilters: function(filters) {
        if (!Ext.isArray(filters)) {
            if (filters == undefined) {
                filters = [];
            } else {
                filters = [filters];
            }
        }

        var length = filters.length,
            Filter = Ext.util.Filter,
            config, i;

        for (i = 0; i < length; i++) {
            config = filters[i];

            if (!(config instanceof Filter)) {
                Ext.apply(config, {
                    root: 'data'
                });

                //support for 3.x style filters where a function can be defined as 'fn'
                if (config.fn) {
                    config.filterFn = config.fn;
                }

                //support a function to be passed as a filter definition
                if (typeof config == 'function') {
                    config = {
                        filterFn: config
                    };
                }

                filters[i] = new Filter(config);
            }
        }

        return filters;
    },

    clearFilter: function(supressEvent) {

    },

    isFiltered: function() {

    },

    filterBy: function(fn, scope) {

    },


    /**
     * Synchronizes the Store with its Proxy. This asks the Proxy to batch together any new, updated
     * and deleted records in the store, updating the Store's internal representation of the records
     * as each operation completes.
     */
    sync: function() {
        var me        = this,
            options   = {},
            toCreate  = me.getNewRecords(),
            toUpdate  = me.getUpdatedRecords(),
            toDestroy = me.getRemovedRecords(),
            needsSync = false;

        if (toCreate.length > 0) {
            options.create = toCreate;
            needsSync = true;
        }

        if (toUpdate.length > 0) {
            options.update = toUpdate;
            needsSync = true;
        }

        if (toDestroy.length > 0) {
            options.destroy = toDestroy;
            needsSync = true;
        }

        if (needsSync && me.fireEvent('beforesync', options) !== false) {
            me.proxy.batch(options, me.getBatchListeners());
        }
    },


    /**
     * @private
     * Returns an object which is passed in as the listeners argument to proxy.batch inside this.sync.
     * This is broken out into a separate function to allow for customisation of the listeners
     * @return {Object} The listeners object
     */
    getBatchListeners: function() {
        var listeners = {
            scope: this,
            exception: this.onBatchException
        };

        if (this.batchUpdateMode == 'operation') {
            listeners['operationcomplete'] = this.onBatchOperationComplete;
        } else {
            listeners['complete'] = this.onBatchComplete;
        }

        return listeners;
    },

    //deprecated, will be removed in 5.0
    save: function() {
        return this.sync.apply(this, arguments);
    },

    /**
     * Loads the Store using its configured {@link #proxy}.
     * @param {Object} options Optional config object. This is passed into the {@link Ext.data.Operation Operation}
     * object that is created and then sent to the proxy's {@link Ext.data.Proxy#read} function
     */
    load: function(options) {
        var me = this,
            operation;

        options = options || {};

        Ext.applyIf(options, {
            action : 'read',
            filters: me.filters.items,
            sorters: me.sorters.items
        });

        operation = new Ext.data.Operation(options);

        if (me.fireEvent('beforeload', me, operation) !== false) {
            me.loading = true;
            me.proxy.read(operation, me.onProxyLoad, me);
        }
        
        return me;
    },

    /**
     * @private
     * A model instance should call this method on the Store it has been {@link Ext.data.Model#join joined} to.
     * @param {Ext.data.Model} record The model instance that was edited
     */
    afterEdit : function(record) {
        this.fireEvent('update', this, record, Ext.data.Model.EDIT);
    },

    /**
     * @private
     * A model instance should call this method on the Store it has been {@link Ext.data.Model#join joined} to..
     * @param {Ext.data.Model} record The model instance that was edited
     */
    afterReject : function(record) {
        this.fireEvent('update', this, record, Ext.data.Model.REJECT);
    },

    /**
     * @private
     * A model instance should call this method on the Store it has been {@link Ext.data.Model#join joined} to.
     * @param {Ext.data.Model} record The model instance that was edited
     */
    afterCommit : function(record) {
        if (this.autoSave) {
            this.sync();
        }

        this.fireEvent('update', this, record, Ext.data.Model.COMMIT);
    },

    clearData: Ext.emptFn,

    destroyStore: function() {
        if (!this.isDestroyed) {
            if (this.storeId) {
                Ext.StoreMgr.unregister(this);
            }
            this.clearData();
            this.data = null;
            this.tree = null;
            // Ext.destroy(this.proxy);
            this.reader = this.writer = null;
            this.clearListeners();
            this.isDestroyed = true;

            if (this.implicitModel) {
                Ext.destroy(this.model);
            }
        }
    },

    /**
     * Returns an object describing the current sort state of this Store.
     * @return {Object} The sort state of the Store. An object with two properties:<ul>
     * <li><b>field : String<p class="sub-desc">The name of the field by which the Records are sorted.</p></li>
     * <li><b>direction : String<p class="sub-desc">The sort order, 'ASC' or 'DESC' (case-sensitive).</p></li>
     * </ul>
     * See <tt>{@link #sortInfo}</tt> for additional details.
     */
    getSortState : function() {
        return this.sortInfo;
    },

    getCount: function() {

    },

    getById: function(id) {

    },

    // individual substores should implement a "fast" remove
    // and fire a clear event afterwards
    removeAll: function() {

    }
});
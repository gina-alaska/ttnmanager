/**
 * @class Ext.Application
 * @extends Ext.util.Observable
 * Represents an Application.
 */
Ext.Application = Ext.extend(Ext.util.Observable, {
    /**
     * @cfg {Object} scope The scope to execute the {@link #launch} function in. Defaults to the Application
     * instance.
     */
    scope: undefined,
    
    /**
     * @cfg {Boolean} useHistory True to automatically set up Ext.History support (defaults to true)
     */
    useHistory: true,
    
    /**
     * @cfg {String} defaultUrl When the app is first loaded, this url will be redirected to. Defaults to undefined
     */
    
    constructor: function(config) {
        Ext.Application.superclass.constructor.call(this, config);
        
        this.bindReady();
    },
    
    bindReady : function() {
        Ext.onReady(this.onReady, this);
    },
    
    /**
     * Called automatically when the page has completely loaded. This is an empty function that should be
     * overridden by each application that needs to take action on page load
     * @property launch
     * @type Function
     * @return {Boolean} By default, the Application will dispatch to the configured startup controller and
     * action immediately after running the launch function. Return false to prevent this behavior.
     */
    launch: Ext.emptyFn,
    
    /**
     * @cfg {Boolean/String} useLoadMask True to automatically remove an application loading mask when the 
     * DOM is ready. If set to true, this expects a div called "loading-mask" to be present in the body.
     * Pass the id of some other DOM node if using a custom loading mask element. Defaults to false.
     */
    useLoadMask: false,
    
    /**
     * @cfg {Number} loadMaskFadeDuration The number of milliseconds the load mask takes to fade out. Defaults to 1000
     */
    loadMaskFadeDuration: 1000,
    
    /**
     * @cfg {Number} loadMaskRemoveDuration The number of milliseconds until the load mask is removed after starting the 
     * {@link #loadMaskFadeDuration fadeout}. Defaults to 1050.
     */
    loadMaskRemoveDuration: 1050,
    
    /**
     * Dispatches to a given controller/action combo with optional arguments. 
     * @param {Object} options Object containing strings referencing the controller and action to dispatch
     * to, plus optional args array
     * @return {Boolean} True if the controller and action were found and dispatched to, false otherwise
     */
    dispatch: function(options) {
        return Ext.dispatch(options);
    },
    
    /**
     * @private
     * Initializes the loading mask, called automatically by onReady if {@link #useLoadMask} is configured
     */
    initLoadMask: function() {
        var useLoadMask = this.useLoadMask,
            defaultId   = 'loading-mask',
            loadMaskId  = typeof useLoadMask == 'string' ? useLoadMask : defaultId;
        
        if (useLoadMask) {
            if (loadMaskId == defaultId) {
                Ext.getBody().createChild({id: defaultId});
            }
            
            var loadingMask  = Ext.get('loading-mask'),  
                fadeDuration = this.loadMaskFadeDuration,
                hideDuration = this.loadMaskRemoveDuration;

            Ext.defer(function() {
                loadingMask.addClass('fadeout');

                Ext.defer(function() {
                    loadingMask.remove();
                }, hideDuration);
            }, fadeDuration);
        }
    },
    
    /**
     * @private
     * Called when the DOM is ready. Calls the application-specific launch function and dispatches to the
     * first controller/action combo
     */
    onReady: function() {
        var History = Ext.History,
            useHistory = History && this.useHistory;
        
        if (this.defaultTarget != undefined) {
            Ext.Controller.defaultTarget = this.defaultTarget;
        }
        
        if (this.useLoadMask) {
            this.initLoadMask();
        }
        
        if (useHistory) {
            this.historyForm = Ext.getBody().createChild({
                id    : 'history-form',
                cls   : 'x-hide-display',
                style : 'display: none;',
                tag   : 'form',
                action: '#',
                children: [
                    {
                        tag: 'div',
                        children: [
                            {
                                tag : 'input',
                                id  : History.fieldId,
                                type: 'hidden'
                            },
                            {
                                tag: 'iframe',
                                id : History.iframeId
                            }
                        ]
                    }
                ]
            });
            
            History.init();
            History.on('change', this.onHistoryChange, this);
            
            var token = History.getToken();
            
            if (this.launch.call(this.scope || this) !== false) {
                return Ext.redirect(token || this.defaultUrl ||  {controller: 'application', action: 'index'});
            }
        } else {
            this.launch.call(this.scope || this);
        }
        return this;
    },
    
    /**
     * @private
     */
    onHistoryChange: function(token) {
        return Ext.redirect(token);
    }
});
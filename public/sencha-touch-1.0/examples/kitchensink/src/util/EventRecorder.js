// This class is still experimental, docs will be added at a later time
Ext.util.EventRecorder = Ext.extend(Ext.util.Observable, {

    eventCollection: null,

    currentEventSetName: null,

    constructor: function() {
        this.addEvents(
            'replaystart',
            'beforecalculatetarget',
            'beforefire',
            'afterfire',
            'aftercalculatetarget',
            'replayend'
        );
        this.eventSets = {};

        return this;
    },

    getEventSet: function(name) {
        if (typeof name != 'string') {
            if (this.currentEventSetName == null)
                throw new Error('No EventSet is currently used');

            name = this.currentEventSetName;
        }

        if (typeof this.eventSets[name] == 'undefined') {
            this.eventSets[name] = [];
        }
        return this.eventSets[name];
    },

    start: function(name) {
        this.currentEventSetName = name;
    },

    record: function(name, event) {
        if (typeof name != 'string') {
            // Not being recorded since either it's not started or is already ended
            if (this.currentEventSetName == null)
                return;

            event = name;
            name = this.currentEventSetName;
        }

        var eventData = this.getEventSimulator().createEventData(event, true);

        this.getEventSet(name).push(eventData);
    },

    setEventSet: function(name, events) {
        this.eventSets[name] = events;
    },

    erase: function(name) {
        // Empty the array
        this.getEventSet(name).length = 0;
    },

    replay: function(name) {
        var simulator = this.getEventSimulator(),
            events = this.getEventSet(name),
            delay = 0,
            index = 0,
            numEvents = events.length,
            event,
            point,
            target,
            me = this;


        if (numEvents > 0) {
            this.fireEvent('replaystart', name);
            setTimeout(function() {
                event = events[index];
                
                if (event) {

                    me.fireEvent('beforecalculatetarget', event.type, event);
                    if (event.type != 'touchmove' && event.type != 'touchend') {
                        point = Ext.util.Point.fromEvent(event);
                        target = document.elementFromPoint(point.x, point.y);
                    }
                    me.fireEvent('aftercalculatetarget', event.type, target, event);
                    
                    if (target) {
                        me.fireEvent('beforefire', event.type, target, event);
                        simulator.fire(event.type, target, event);
                        me.fireEvent('afterfire', event.type, target, event);
                    }

                    if (++index < numEvents) {
                        setTimeout(arguments.callee, events[index].timeStamp - event.timeStamp);
                    } else {
                        me.fireEvent('replayend', name);
                    }
                }
            }, delay);
        }
    },

    end: function() {
        this.currentEventSetName = null;
    },

    getEventSimulator: function() {
        if (!this._eventSimulator) {
            this._eventSimulator = new Ext.util.EventSimulator();
        }

        return this._eventSimulator;
    },

    setEventSimulator: function(eventSimulator) {
        if (!(eventSimulator instanceof Ext.util.EventSimulator))
            throw new Error('eventSimulator must be an instance of Ext.util.EventSimulator');

        this._eventSimulator = eventSimulator;
    },

    // TODO
    save: function(name) {

    }
});
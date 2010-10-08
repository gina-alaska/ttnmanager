/**
 * @class Ext.util.Date
 * @singleton
 */

Ext.util.Date = {
    /**
     * Returns the number of milliseconds between this date and date
     * @param {Date} date (optional) Defaults to now
     * @return {Number} The diff in milliseconds
     */
    getElapsed: function(date) {
        return Math.abs((date || new Date) - this);
    }
};
Geo.CongressServiceImpl = Ext.extend(Object, {
    apiKey: "8a341f85c657435989e75c9a83294762",

    districtQuery: new Ext.Template('SELECT * FROM sunlight.districts.getDistrictFromLatLong WHERE apikey="{apiKey}" and latitude={latitude} and longitude={longitude}'),
    legislatorQuery: new Ext.Template('SELECT * from sunlight.legislators.getList  WHERE apikey="{apiKey}" and state="{state}" and (district={number} or title="sen")'),
    committeesQuery: new Ext.Template('use "http://github.com/extjs/YQL-Tables/raw/master/geocongress/allForLegislator.xml" as allForLegislator; SELECT * from allForLegislator WHERE apikey="{apiKey}" and bioguide_id="{bioguide_id}"'),
    billsQuery: new Ext.Template('use "http://github.com/extjs/YQL-Tables/raw/master/geocongress/billSearch.xml" as billsearch; select * from billsearch where sponsor = "{sponsor}"'),
    votesQuery: new Ext.XTemplate('use "http://github.com/extjs/YQL-Tables/raw/master/geocongress/voteSearch.xml" as votessearch; select * from votessearch where person = "{person}" and fts = "On Passage" <tpl if="limit">LIMIT {limit}</tpl>'),
    billSummaryQuery: new Ext.Template('use "http://github.com/extjs/YQL-Tables/raw/master/geocongress/billSummary.xml" as billsummary; select * from billsummary where bill="{bill}" and session="{session}"'),

    onDistrictFromCoords: function(result, cb, scope) {
        var district = [];
        if (result.query && result.query.results) {
            district = result.query.results.district;
            cb.call(scope || window, district);
        }
    },

    getDistrictFromCoords: function(coords, cb, scope) {
        var params = Ext.apply(this.getBaseParams(), coords);
        var query = this.districtQuery.applyTemplate(params);

        this.onDistrictFromCoords = Ext.createDelegate(Geo.CongressServiceImpl.prototype.onDistrictFromCoords, this || window, [cb, scope], true);
        Ext.YQL.request({
            query: query,
            callback: this.onDistrictFromCoords,
            scope: this
        });
    },

    onLegislatorsByDistrict: function(result, cb, scope) {
        var legislators = [];
        if (result.query && result.query.results) {
            legislators = result.query.results.legislator;
        }
        cb.call(scope || window, legislators);
    },

    getLegislatorsByDistrict: function(district, cb, scope) {
        var params = Ext.apply(this.getBaseParams(), district),
            query = this.legislatorQuery.applyTemplate(params);

        this.onLegislatorsByDistrict = Ext.createDelegate(Geo.CongressServiceImpl.prototype.onLegislatorsByDistrict, scope || window, [cb, scope], true);
        Ext.YQL.request({
            query: query,
            callback: this.onLegislatorsByDistrict,
            scope: scope
        });
    },

    onCommitteesForLegislator: function(result, cb, scope) {
        var committees = [];
        if (result.query && result.query.results) {
            committees = result.query.results.committee;
            if (!committees.slice) {
                committees = [committees];
            }
        }
        cb.call(scope || window, committees);
    },

    getCommitteesForLegislator: function(bioGuideId, cb, scope) {
        var params = Ext.apply(this.getBaseParams(), {
            bioguide_id: bioGuideId
        });
        var query = this.committeesQuery.applyTemplate(params);

        this.onCommitteesForLegislator = Ext.createDelegate(Geo.CongressServiceImpl.prototype.onCommitteesForLegislator, scope || window, [cb, scope], true);
        Ext.YQL.request({
            query: query,
            callback: this.onCommitteesForLegislator,
            scope: scope
        });
    },

    onBillsForLegislator: function(result, cb, scope) {
        var bills = [];
        if (result.query && result.query.results) {
            bills = result.query.results.result;
        }
        cb.call(scope || window, bills);
    },

    getBillsForLegislator: function(govTrackId, cb, scope) {
        var params = {
            sponsor: govTrackId
        };
        var query = this.billsQuery.applyTemplate(params);

        this.onBillsForLegislator = Ext.createDelegate(Geo.CongressServiceImpl.prototype.onBillsForLegislator, scope || window, [cb, scope], true);

        Ext.YQL.request({
            query: query,
            callback: this.onBillsForLegislator,
            scope: scope
        });
    },

    onVotesForLegislator: function(result, cb, scope) {
        var votes = [];
        if (result.query) {
            votes = result.query.results.vote;
        }
        cb.call(scope || window, votes);
    },

    getVotesForLegislator: function(govTrackId, limit, cb, scope) {
        var params = {
            person: govTrackId,
            limit: limit
        };
        var query = this.votesQuery.applyTemplate(params);

        this.onVotesForLegislator = Ext.createDelegate(Geo.CongressServiceImpl.prototype.onVotesForLegislator, scope || window, [cb, scope], true);

        Ext.YQL.request({
            query: query,
            callback: this.onVotesForLegislator,
            scope: scope
        });
    },

    onBillSummary: function(result, cb, scope) {
        if (result.query) {
            var summary = result.query.results.summary || {};
            for (var i = 0, ln = summary.Paragraph.length; i < ln; i++) {
                if (typeof summary.Paragraph[i] == 'object') {
                    delete summary.Paragraph[i];
                }
            }
            cb.call(scope || window, summary);
        }
    },

    // params are bill and session (optional)
    getBillSummary: function(params, cb, scope) {
        var query = this.billSummaryQuery.applyTemplate(params);

        this.onBillSummary = Ext.createDelegate(Geo.CongressServiceImpl.prototype.onBillSummary, scope || window, [cb, scope], true);
        Ext.YQL.request({
            query: query,
            callback: this.onBillSummary,
            scope: scope
        });
    },

    getBaseParams: function() {
        return {
            apiKey: this.apiKey
        };
    }
});

Geo.CongressService = new Geo.CongressServiceImpl();
kiva.ui.LoanInfo = Ext.extend(Ext.Sheet, {
    modal: true,
    centered : false,
    hideOnMaskTap : true,
    
    data: null,
    cls: 'loaninfo',
    layout: 'fit',
    arrive : 'right',
    depart: 'right',
        
    width: 400,
    
    initComponent : function() {        
        var cardItems = [];
        
        // Basic info card
        this.basicCard = new Ext.Component({
            tpl: new Ext.XTemplate.from('loaninfo-basic', {compiled: true}),
            scroll: 'vertical',
            styleHtmlContent: true,
            html: '',
            listeners : {
                activate : function(){
                    this.scroller && this.scroller.scrollTo({x:0, y:0});
                }
            }
        });
        cardItems.push(this.basicCard);

        // Repayment schedule card
        
        this.paymentsCard = new Ext.Component({
            scroll: 'vertical',
            styleHtmlContent: true,
            tpl: new Ext.XTemplate.from('loaninfo-payment', {compiled: true}),
            html: '',
            listeners : {
                activate : function(){
                    this.scroller && this.scroller.scrollTo({x:0, y:0});
                }
            }
        });
        cardItems.push(this.paymentsCard);
        
        // Map card
        this.mapCard = new Ext.Map({
            mapOptions: {
                center: this.mapPosition,
                disableDefaultUI: true,
                zoom: 5
            },
            maskMap: true,
            listeners : {
                activate : function(){
                    if (this.marker) {
                        this.update(this.marker.position);
                    }
                },
                resize : function(){
                    if (this.marker) {
                        this.update(this.marker.position);
                    }
                }
            }
        });

        cardItems.push(this.mapCard);
        
        this.carousel = new Ext.Carousel({
            items: cardItems
        });
        
        this.items = [this.carousel];
        this.dockedItems = {
            xtype: 'button',
            text: 'Lend $25',
            ui: 'action',
            dock: 'bottom'
        };
        
        kiva.ui.LoanInfo.superclass.initComponent.call(this);
        
    },
    
    onFieldChange : function() {
        this.fireEvent('change', this, this.getValues());
    },

    setLoanInfo : function(record) {
        record = record || this.record;
        
        if (record && record.data) {            
            this.getDockedItems()[0].setText(Ext.util.Format.format(
                '<a href="http://www.kiva.org/lend/{0}" target="_blank">Lend $25</a>',
                 record.data.id
            ));
                 
            this.basicCard.update(record.data);       
            this.paymentsCard.update(record.data.terms.scheduled_payments);
            this.mapCard.on({
                activate: function() {
                    if (this.mapCard.marker) {
                        this.mapCard.marker.setMap(null);  //remove from map
                        delete this.mapCard.marker;
                    }

                    var geo = record.data.location.geo.pairs.split(' ').map(parseFloat);
                    this.mapCard.marker = new google.maps.Marker({ 
                        map: this.mapCard.map, 
                        title : record.data.name,
                        position: new google.maps.LatLng(geo[0], geo[1])  
                    });

                    this.mapCard.update(this.mapCard.marker.position);                    
                },
                single: true,
                scope: this
            });
            
            this.record = record;
        }
    }
});

Ext.reg('kiva-loaninfo', kiva.ui.LoanInfo);
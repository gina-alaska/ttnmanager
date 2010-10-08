class MobileController < ApplicationController
  def index
    @zones = Zone.all.collect do |z|
      {
        :text => z.name,
        :leaf => true,
        :card => 'zone_editor',
        :data => z,
        :model => 'Zone'
      }
    end

    @pages = {
      :id => 'root',
      :text => 'Root',
      :items => [{
        :text => 'Zones',
        :items => @zones
      }, {
        :text => 'Alerts',
        :leaf => true
      }]
    }

    respond_to do |format|
      format.html
      format.json { render :json => @pages }
    end
  end
end

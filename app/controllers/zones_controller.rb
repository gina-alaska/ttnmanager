class ZonesController < ApplicationController
  def index
    if params.include? :node and params[:node] != 'root'
      @zones = []
    else
      @zones = Zone.all(:order => 'name ASC')
    end

    respond_to do |format|
      format.json { render :json => { :zones => @zones } }
    end
  end

  def update
    @zone = Zone.find(params[:id])

    zone_params = params[:zone]
    notes = zone_params.delete :notes

    if @zone.update_attributes(zone_params)
      response = {
        :success => true,
        :zone => @zone,
        :flash => "Updated Zone Information"
      }
    else
      response = {
        :success => false,
        :errors => @zone.errors,
        :flash => "Error Updating Zone Information"
      }
    end

    respond_to do |format|
      format.json { render :json => response }
    end
  end
end

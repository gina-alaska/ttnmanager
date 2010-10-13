class AreasController < ApplicationController
  def index
    if params.include? :node and params[:node] != 'root'
      @areas = []
    else
      @areas = Area.all(:include => :messages, :order => 'name ASC')
    end

    respond_to do |format|
      format.json {
        render :json => {
          :areas => @areas
        }.to_json(:methods => [:alerts, :operationals, :soil, :snow])
      }
    end
  end

  def update
    @area = Area.find(params[:id])

    area_params = params[:area]
    notes = area_params.delete :notes
    messages = area_params.delete :messages
    area_params[:message_ids] = messages.reject { |k,v| v == 'false' }.keys

    if @area.update_attributes(area_params)
      response = {
        :success => true,
        :area => @area,
        :flash => "Updated #{area.name} Information"
      }
    else
      response = {
        :success => false,
        :errors => @area.errors,
        :flash => "Error Updating Area Information"
      }
    end

    respond_to do |format|
      format.json { render :json => response }
    end
  end
end

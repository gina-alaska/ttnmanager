class AlertsController < ApplicationController
  def index
    if params.include? :node and params[:node] != 'root'
      @alerts = []
    else
      @alerts = Alert.active(:include => :area)
    end

    respond_to do |format|
      format.json { render :json => { :alerts => @alerts }.to_json(:include => :area) }
    end
  end

  def update
    @alert = Alert.find(params[:id])

    alert_params = params[:alert]

    if @alert.update_attributes(alert_params)
      response = {
        :success => true,
        :alert => @alert,
        :flash => "Updated Message"
      }
    else
      response = {
        :success => false,
        :errors => @alert.errors,
        :flash => "Error Updating Message"
      }
    end

    respond_to do |format|
      format.json { render :json => response.to_json(:include => :area) }
    end
  end

  def create
    @alert = Alert.new(params[:alert])

    if @alert.save
      response = {
        :success => true,
        :alert => @alert,
        :flash => "Created Alert"
      }
    else
      response = {
        :success => false,
        :errors => @alert.errors,
        :flash => "Error Creating Alert"
      }
    end

    respond_to do |format|
      format.json { render :json => response.to_json(:include => :area) }
    end
  end
end

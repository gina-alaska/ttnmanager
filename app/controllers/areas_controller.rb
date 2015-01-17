class AreasController < ApplicationController
  before_action :set_area, only: [:show, :edit, :update, :destroy]
  authorize_resource

  # GET /areas
  # GET /areas.json
  def index
    @areas = Area.all
  end

  # GET /areas/1
  # GET /areas/1.json
  def show
  end

  # GET /areas/1/edit
  def edit
  end

  def overview
    @image = Image.where(name: 'overview', size: (params[:size] || 'medium')).first
    respond_to do |format|
      format.png do
        send_data Base64.decode64(@image.try(:data)), type: 'image/png', disposition: 'inline'
      end
      format.jpg do
        send_data Base64.decode64(@image.try(:data)), type: 'image/jpg', disposition: 'inline'
      end
    end
  end

  # PATCH/PUT /areas/1
  # PATCH/PUT /areas/1.json
  def update
    respond_to do |format|
      if @area.update(area_params)
        format.html { redirect_to @area, notice: 'Area was successfully updated.' }
        format.json { render :show, status: :ok, location: @area }
      else
        format.html { render :edit }
        format.json { render json: @area.errors, status: :unprocessable_entity }
      end
    end
  end

  def open
    @areas = Area.where(travel_status: 'Open')
    respond_to do |format|
      format.geojson
    end
  end

  def closed
    @areas = Area.where(travel_status: 'Closed')
    respond_to do |format|
      format.geojson
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_area
      @area = Area.friendly.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def area_params
      params.require(:area).permit(:name, :travel_status, :geom, :notes, :order, :message_ids,
        :snow_message_id, :soil_message_id, :alert_message_ids => [], :operational_message_ids => [])
    end

end

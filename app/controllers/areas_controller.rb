class AreasController < ApplicationController
  before_action :set_area, only: [:show, :edit, :update, :destroy]

  # GET /areas
  # GET /areas.json
  def index
    @areas = Area.all
  end

  # GET /areas/1
  # GET /areas/1.json
  def show
  end

  # GET /areas/new
  def new
    @area = Area.new
  end

  # GET /areas/1/edit
  def edit
  end

  def overview
    respond_to do |format|
      format.png do
        send_file get_overview('image/png', params[:size]), type: 'image/png', disposition: 'inline'
      end
      format.jpg do
        send_file get_overview('image/jpg', params[:size]), type: 'image/jpg', disposition: 'inline'
      end
    end
  end

  # POST /areas
  # POST /areas.json
  def create
    @area = Area.new(area_params)

    respond_to do |format|
      if @area.save
        format.html { redirect_to @area, notice: 'Area was successfully created.' }
        format.json { render :show, status: :created, location: @area }
      else
        format.html { render :new }
        format.json { render json: @area.errors, status: :unprocessable_entity }
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

  # DELETE /areas/1
  # DELETE /areas/1.json
  def destroy
    @area.destroy
    respond_to do |format|
      format.html { redirect_to areas_url, notice: 'Area was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_area
      @area = Area.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def area_params
      params.require(:area).permit(:name, :travel_status, :snow_status, :soil_status, :geom, :notes, :order)
    end

    def get_overview imgtype, size
      width, height = determine_size(size)
      layers = %w{landsat_pan zones roads labels}.join(",")

      "http://atn.proto.gina.alaska.edu/atn??VERSION=1.1.1&REQUEST=GetMap&SRS=EPSG:3338&BBOX=-93449.8805055504,2003772.41212257,389482.569861798,2337148.0788739&WIDTH=#{width}&HEIGHT=#{height}&LAYERS=#{layers}&STYLES=&EXCEPTIONS=application/vnd.ogc.se_xml&FORMAT=#{imgtype}&BGCOLOR=0xFFFFFF&TRANSPARENT=TRU"
    end

    def determine_size(size)
      case size.to_sym
      when :small
        [300,200]
      when :medium
        [800,600]
      when :large
        [1600,1200]
      else
        [550,300]
      end
    end

end

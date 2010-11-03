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
        }.to_json(:methods => [:alerts, :operationals, :soil, :snow]), :callback => params[:callback]
      }
      format.xml {
        render :xml => @areas.to_xml(:root => :areas, :methods => [:alerts, :operationals, :soil, :snow])
      }
    end
  end

  def overview
    respond_to do |format|
      format.png do
        imgtype = 'image/png'
        outfile = 'public/images/overview.png'
        img_template = "http://atn.proto.gina.alaska.edu//atn?VERSION=1.1.1&REQUEST=GetMap&SRS=EPSG:3338&BBOX=-93449.8805055504,2003772.41212257,389482.569861798,2337148.0788739&WIDTH=887&HEIGHT=613&LAYERS=landsat_pan,road_status,roads&STYLES=&EXCEPTIONS=application/vnd.ogc.se_xml&FORMAT=#{imgtype}&BGCOLOR=0xFFFFFF&TRANSPARENT=TRUE"
        RAILS_DEFAULT_LOGGER.info `wget '#{img_template}' -O '#{outfile}'` unless File.exists? outfile

        send_file(outfile, :type => imgtype, :disposition => 'inline')
      end
      format.jpg do
        imgtype = 'image/jpeg'
        outfile = 'public/images/overview.jpg'
        img_template = "http://atn.proto.gina.alaska.edu//atn?VERSION=1.1.1&REQUEST=GetMap&SRS=EPSG:3338&BBOX=-93449.8805055504,2003772.41212257,389482.569861798,2337148.0788739&WIDTH=887&HEIGHT=613&LAYERS=landsat_pan,road_status,roads&STYLES=&EXCEPTIONS=application/vnd.ogc.se_xml&FORMAT=#{imgtype}&BGCOLOR=0xFFFFFF&TRANSPARENT=TRUE"
        RAILS_DEFAULT_LOGGER.info `wget '#{img_template}' -O '#{outfile}'` unless File.exists? outfile

        send_file(outfile, :type => imgtype, :disposition => 'inline')
      end
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
        :flash => "Updated #{@area.name} Information"
      }
    else
      response = {
        :success => false,
        :errors => @area.errors,
        :flash => "Error Updating Area Information"
      }
    end

    respond_to do |format|
      format.json { render :json => response.to_json(:methods => [:alerts, :operationals, :soil, :snow]) }
    end
  end
end

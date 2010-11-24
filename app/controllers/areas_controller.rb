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
        }.to_json(:methods => [:alerts, :operationals, :soil, :snow], :except => [:geom]), :callback => params[:callback]
      }
      format.xml {
        render :xml => @areas.to_xml(:root => :areas, :only => [:name,:notes,:travel_status,:full_text, :mobile_text, :updated_at], :methods => [:alerts, :operationals, :soil, :snow])
      }
    end
  end

  def overview
    respond_to do |format|
      format.png do
        send_file(get_overview('image/png', params[:size]), :type => 'image/png', :disposition => 'inline')
      end
      format.jpg do
        send_file(get_overview('image/jpeg', params[:size]), :type => 'image/jpeg', :disposition => 'inline')
      end
    end
  end

  def update
    @area = Area.find(params[:id])

    area_params = params[:area]
    messages = area_params.delete :messages
    area_params[:message_ids] = messages.inject([]) { |c,i|
      c << i[1] unless i[1].empty? or i[1].nil?
      c
    }

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
   
    
    FileUtils.rm('public/images/overview.png') if File.exists? 'public/images/overview.png'
    FileUtils.rm('public/images/overview.jpg') if File.exists? 'public/images/overview.jpg'

    respond_to do |format|
      format.json { render :json => response.to_json(:methods => [:alerts, :operationals, :soil, :snow], :except => [:geom]) }
    end
  end

  protected
  def get_overview(imgtype, size)
    size ||= :medium
    outfile = "public/images/overview_#{size.to_s}#{determine_extension(imgtype)}"
    width,height = determine_size(size)
    layers = "landsat_pan,zones,roads"
    #layers += Area.all.collect { |a| a.name.underscore.gsub(' ', '_') }.join(',')

    img_template = "http://atn.proto.gina.alaska.edu/atn?VERSION=1.1.1&REQUEST=GetMap&SRS=EPSG:3338&BBOX=-93449.8805055504,2003772.41212257,389482.569861798,2337148.0788739&WIDTH=#{width}&HEIGHT=#{height}&LAYERS=#{layers}&STYLES=&EXCEPTIONS=application/vnd.ogc.se_xml&FORMAT=#{imgtype}&BGCOLOR=0xFFFFFF&TRANSPARENT=TRUE"

    RAILS_DEFAULT_LOGGER.info img_template
    RAILS_DEFAULT_LOGGER.info `wget '#{img_template}' -O '#{outfile}'` unless File.exists? outfile
  
    outfile
  end

  def determine_extension(type)
    case type
      when 'image/png'
        '.png'
      when 'image/jpeg'
        '.jpg'
    end
  end

  def determine_size(size)
    case size.to_sym
      when :preview
        [550,300]
      when :small
        [300,200]
      when :medium
        [800,600]
      when :large
        [1600,1200]
    end
  end
end

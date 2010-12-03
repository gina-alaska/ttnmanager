class AreasController < ApplicationController
  before_filter :login_required, :only => [:update]

  STATUS_EMAILS_DEV = {
    "Western Coastal" => ['notice_all_dev@arctic-transportation.org', 'notice_westcoastal_dev@arctic-transportation.org'],
    "Eastern Coastal" => ['notice_all_dev@arctic-transportation.org', 'notice_eastcoastal_dev@arctic-transportation.org'],
    "Lower Foothills" => ['notice_all_dev@arctic-transportation.org', 'notice_lowerfoot_dev@arctic-transportation.org'],
    "Upper Foothills" => ['notice_all_dev@arctic-transportation.org', 'notice_upperfoot_dev@arctic-transportation.org']
  }
  STATUS_EMAILS = {
    "Western Coastal" => ['notice_all@arctic-transportation.org', 'notice_westcoastal@arctic-transportation.org'],
    "Eastern Coastal" => ['notice_all@arctic-transportation.org', 'notice_eastcoastal@arctic-transportation.org'],
    "Lower Foothills" => ['notice_all@arctic-transportation.org', 'notice_lowerfoot@arctic-transportation.org'],
    "Upper Foothills" => ['notice_all@arctic-transportation.org', 'notice_upperfoot@arctic-transportation.org']
  }
  
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
    current_travel_status = @area.travel_status
    alert_ids = @area.alerts.collect(&:id)
    op_ids = @area.operationals.collect(&:id)

    area_params = params[:area]
    messages = area_params.delete :messages
    area_params[:message_ids] = messages.inject([]) { |c,i|
      c << i[1] unless i[1].empty? or i[1].nil?
      c
    }
    @area.attributes = area_params

    changed = false
    if @area.changed?
      changed = true
    end

    if @area.save 
      response = {
        :success => true,
        :area => @area,
        :flash => "Updated #{@area.name} Information"
      }

      if Rails.env.production?
        emails = STATUS_EMAILS[@area.name]
      else
        emails = STATUS_EMAILS_DEV[@area.name]
      end
      AreaMailer.delay.current_status(emails, @area) if changed      
#      if(@area.travel_status != current_travel_status)
#        AreaMailer.delay.status_update(emails, @area)
#      end
#      if(@area.alerts.collect(&:id) != alert_ids)
#        AreaMailer.delay.alert_updates(emails, @area)
#      end

      #FIXME: Do this dynamically
      FileUtils.rm('public/images/overview.png') if File.exists? 'public/images/overview.png'
      FileUtils.rm('public/images/overview_small.png') if File.exists? 'public/images/overview_small.png'
      FileUtils.rm('public/images/overview_medium.png') if File.exists? 'public/images/overview_medium.png'
      FileUtils.rm('public/images/overview_large.png') if File.exists? 'public/images/overview_large.png'
      FileUtils.rm('public/images/overview_preview.png') if File.exists? 'public/images/overview_preview.png'
      FileUtils.rm('public/images/overview.jpg') if File.exists? 'public/images/overview.jpg'
      FileUtils.rm('public/images/overview_small.jpg') if File.exists? 'public/images/overview_small.jpg'
      FileUtils.rm('public/images/overview_medium.jpg') if File.exists? 'public/images/overview_medium.jpg'
      FileUtils.rm('public/images/overview_large.jpg') if File.exists? 'public/images/overview_large.jpg'
      FileUtils.rm('public/images/overview_preview.jpg') if File.exists? 'public/images/overview_preview.jpg'
    else
      response = {
        :success => false,
        :errors => @area.errors,
        :flash => "Error Updating Area Information"
      }
    end

    respond_to do |format|
      format.json { render :json => response.to_json(:methods => [:alerts, :operationals, :soil, :snow], :except => [:geom]) }
    end
  end

  protected
  def get_overview(imgtype, size)
    size ||= :medium
    outfile = "public/images/overview_#{size.to_s}#{determine_extension(imgtype)}"
    width,height = determine_size(size)
    layers = "landsat_pan,zones,roads,labels"
    #layers += Area.all.collect { |a| a.name.underscore.gsub(' ', '_') }.join(',')

    img_template = "http://atn.proto.gina.alaska.edu/atn?VERSION=1.1.1&REQUEST=GetMap&SRS=EPSG:3338&BBOX=-93449.8805055504,2003772.41212257,389482.569861798,2337148.0788739&WIDTH=#{width}&HEIGHT=#{height}&LAYERS=#{layers}&STYLES=&EXCEPTIONS=application/vnd.ogc.se_xml&FORMAT=#{imgtype}&BGCOLOR=0xFFFFFF&TRANSPARENT=TRUE"

    ::Rails.logger.info `wget '#{img_template}' -O '#{outfile}'` unless File.exists? outfile
  
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

class ImageCacheJob < ActiveJob::Base
  queue_as :default

  def perform(name)
    # Do something later
    [:small, :medium, :large].each do |size|
      response = HTTParty.get(overview_url('image/jpeg', size))
      i = Image.where(name: name, size: size.to_s).first_or_initialize
      i.data = Base64.encode64(response.body)
      i.save!
    end
  end

  def overview_url imgtype, size
    width, height = determine_size(size)
    layers = %w{landsat_pan zones roads labels}.join(",")

    "http://ogc.gina.alaska.edu/ttn?VERSION=1.1.1&REQUEST=GetMap&SRS=EPSG:3338&BBOX=-93449.8805055504,2003772.41212257,389482.569861798,2337148.0788739&WIDTH=#{width}&HEIGHT=#{height}&LAYERS=#{layers}&STYLES=&EXCEPTIONS=application/vnd.ogc.se_xml&FORMAT=#{imgtype}&BGCOLOR=0xFFFFFF&TRANSPARENT=TRU"
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

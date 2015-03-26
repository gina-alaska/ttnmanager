module WelcomeHelper
  def show_map_image(size)
    link_to_unless browser.mobile?, map_image_tag(size), map_image_url, target: :_blank
  end

  def map_image_tag(size = 'large')
    image_tag(map_image_url(size), alt: "Tundra Area Travel Status")
  end

  def map_image_url(image_size = 'large')
    "#{areas_path}/overview.jpg?size=#{image_size}"
  end
end

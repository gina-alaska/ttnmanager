class Area < ActiveRecord::Base
  extend FriendlyId
  friendly_id :name, use: :slugged

  has_many :areas_messages
  has_many :messages, through: :areas_messages

  has_many :snow_messages, -> {snow}, through: :areas_messages, source: :message
  has_many :soil_messages, -> {soil}, through: :areas_messages, source: :message
  has_many :alert_messages, -> {alert}, through: :areas_messages, source: :message
  has_many :operational_messages, -> {operational}, through: :areas_messages, source: :message

  after_commit :regenerate_overview_image, on: :update

  TravelStatus = %w{Open Closed}.map{|s| [s, s]}

  %w{snow_message_id soil_message_id }.each do |field|
    define_method("#{field}=".to_sym) do |id|  # def snow_message_id=(id)
      self.send("#{field}s=".to_sym, id)       #   self.send(:snow_message_ids=, id)
    end                                        # end
    define_method(field) do                    # def snow_message_id
      self.send("#{field}s".to_sym).first      #   self.send(:snow_message_ids).first
    end                                        # end
    define_method(field.chomp("_id")) do       # def snow_message
      self.send("#{field}s".to_sym).first      #   self.send(:snow_messages).first
    end                                        # end
  end

  def geometry
    GeoRuby::SimpleFeatures::Geometry.from_ewkt(geom)
  end

  private
  def regenerate_overview_image
    ImageCacheJob.perform_later('overview')
  end
end

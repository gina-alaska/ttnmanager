class Area < ActiveRecord::Base
  has_many :areas_messages
  has_many :messages, through: :areas_messages

  has_many :snow_messages, -> {snow}, through: :areas_messages, source: :message
  has_many :soil_messages, -> {soil}, through: :areas_messages, source: :message
  has_many :alert_messages, -> {alert}, through: :areas_messages, source: :message
  has_many :operational_messages, -> {operational}, through: :areas_messages, source: :message


  TravelStatus = %w{open closed}.map{|s| [s.capitalize, s]}

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
end

class Area < ActiveRecord::Base
  has_many :areas_messages
  has_many :messages, through: :areas_messages

end

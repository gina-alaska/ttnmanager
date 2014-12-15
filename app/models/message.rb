class Message < ActiveRecord::Base
  has_many :areas_messages
  has_many :areas, through: :areas_messages

  scope :alert, -> { where(group: 'alert') }
  scope :operational, -> { where(group: 'operational') }
  scope :snow, -> { where(group: 'snow') }
  scope :soil, -> { where(group: 'soil') }
end

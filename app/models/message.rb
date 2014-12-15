class Message < ActiveRecord::Base
  has_and_belongs_to_many :areas

  scope :soil, :conditions => { :group => 'soil' }
  scope :snow, :conditions => { :group => 'snow' }
  scope :operational, :conditions => { :group => 'operational' }
  scope :alert, :conditions => { :group => 'alert' }
end

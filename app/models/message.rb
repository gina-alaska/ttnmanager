class Message < ActiveRecord::Base
  has_and_belongs_to_many :zones

  named_scope :soil, :conditions => { :group => 'soil' }
  named_scope :snow, :conditions => { :group => 'snow' }
  named_scope :operational, :conditions => { :group => 'operational' }
  named_scope :alert, :conditions => { :group => 'alert' }
end

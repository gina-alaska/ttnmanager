class Alert < ActiveRecord::Base
  belongs_to :area
  
  scope :active, { :conditions => { :active => true }, :order => 'system DESC, updated_at DESC' }
end

class Alert < ActiveRecord::Base
  belongs_to :area
  
  named_scope :active, { :conditions => { :active => true }, :order => 'system DESC, updated_at DESC' }
end

class Alert < ActiveRecord::Base
  belongs_to :zone
  
  named_scope :active, { :conditions => { :active => true }, :order => 'system DESC, updated_at DESC' }
end

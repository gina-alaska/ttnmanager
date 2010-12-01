class AddPinAcceptedFlag < ActiveRecord::Migration
  def self.up
    add_column :users, :mobile_pin_accepted, :boolean, :default => false, :null => false
    remove_column :users, :mobile_pin
    add_column :users, :mobile_pin, :string, :length => 18, :null => true
  end

  def self.down
    remove_column :users, :mobile_pin_accepted
  end
end

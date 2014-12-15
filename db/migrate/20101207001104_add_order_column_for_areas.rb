class AddOrderColumnForAreas < ActiveRecord::Migration
  def self.up
    add_column  :areas, :order, :integer
  end

  def self.down
    remove_column :areas, :order
  end
end

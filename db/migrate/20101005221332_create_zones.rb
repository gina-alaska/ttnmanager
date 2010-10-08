class CreateZones < ActiveRecord::Migration
  def self.up
    create_table :zones do |t|
      t.string    :name
      t.string    :travel_status
      t.string    :snow_status
      t.string    :soil_status
      t.timestamps
    end
  end

  def self.down
    drop_table :zones
  end
end

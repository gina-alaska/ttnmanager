class RenameZoneToArea < ActiveRecord::Migration
  def self.up
    rename_table :zones, :areas
    rename_table :messages_zones, :areas_messages
    rename_column :areas_messages, :zone_id, :area_id
    rename_column :alerts, :zone_id, :area_id
  end

  def self.down
    rename_table :areas, :zones
    rename_table :areas_messages, :messages_zones
    rename_column :areas_messages, :area_id, :zone_id
    rename_column :alerts, :area_id, :zone_id
 end
end

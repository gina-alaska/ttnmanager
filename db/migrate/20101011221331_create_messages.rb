class CreateMessages < ActiveRecord::Migration
  def self.up
    create_table :messages do |t|
      t.string    :mobile_text
      t.string    :full_text
      t.string    :group, :null => false
      t.timestamps
    end

    create_table :messages_zones, :id => false do |t|
      t.integer :zone_id
      t.integer :message_id
    end
  end

  def self.down
    drop_table :messages
    drop_table :messages_zones
  end
end

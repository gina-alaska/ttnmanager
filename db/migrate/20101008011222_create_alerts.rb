class CreateAlerts < ActiveRecord::Migration
  def self.up
    create_table :alerts do |t|
      t.text        :text
      t.boolean     :active, :default => true, :null => false
      t.timestamps
    end
  end

  def self.down
    drop_table :alerts
  end
end

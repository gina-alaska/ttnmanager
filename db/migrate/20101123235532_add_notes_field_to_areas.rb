class AddNotesFieldToAreas < ActiveRecord::Migration
  def self.up
    add_column :areas, :notes, :text
  end

  def self.down
    remove_column :areas, :notes
  end
end

class CreateAreas < ActiveRecord::Migration
  def change
    create_table :areas do |t|
      t.string :name
      t.string :travel_status
      t.string :snow_status
      t.string :soil_status
      t.string :geom
      t.text :notes
      t.integer :order

      t.timestamps
    end
  end
end

class ChangeGeomToTextInArea < ActiveRecord::Migration
  def change
    change_column :areas, :geom, :text
  end
end

class RemoveStatusFieldsFromArea < ActiveRecord::Migration
  def change
    remove_column :areas, :snow_status
    remove_column :areas, :soil_status
  end
end

class AddAsOfDateToAreas < ActiveRecord::Migration
  def change
    add_column :areas, :as_of, :date
  end
end

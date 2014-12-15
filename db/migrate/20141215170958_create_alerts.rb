class CreateAlerts < ActiveRecord::Migration
  def change
    create_table :alerts do |t|
      t.integer :area_id
      t.text :text
      t.boolean :active, default: true, null: false
      t.boolean :system, default:false, null: false

      t.timestamps
    end
  end
end

class CreateAreasMessages < ActiveRecord::Migration
  def change
    drop_table :areas_messages, id: false do |t|
      t.integer :area_id
      t.integer :message_id
    end

    create_table :areas_messages do |t|
      t.integer :area_id
      t.integer :message_id
      t.timestamps
    end

  end
end

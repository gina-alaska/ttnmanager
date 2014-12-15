class CreateMessages < ActiveRecord::Migration
  def change
    create_table :messages do |t|
      t.string :mobile_text
      t.string :full_text
      t.string :group, null: false

      t.timestamps
    end

    create_table :areas_messages, id: false do |t|
      t.integer :area_id
      t.integer :message_id
    end
  end
end

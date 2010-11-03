# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20101019204102) do

  create_table "alerts", :force => true do |t|
    t.integer  "area_id"
    t.text     "text"
    t.boolean  "active",     :default => true,  :null => false
    t.boolean  "system",     :default => false, :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "areas", :force => true do |t|
    t.string        "name"
    t.string        "travel_status"
    t.string        "snow_status"
    t.string        "soil_status"
    t.datetime      "created_at"
    t.datetime      "updated_at"
    t.multi_polygon "geom",          :limit => nil, :srid => 9102634
  end

  add_index "areas", ["geom"], :name => "index_areas_on_geom", :spatial => true

  create_table "areas_messages", :id => false, :force => true do |t|
    t.integer "area_id"
    t.integer "message_id"
  end

  create_table "messages", :force => true do |t|
    t.string   "mobile_text"
    t.string   "full_text"
    t.string   "group",       :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end

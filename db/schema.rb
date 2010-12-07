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

ActiveRecord::Schema.define(:version => 20101207001104) do

  create_table "alerts", :force => true do |t|
    t.integer  "area_id"
    t.text     "text"
    t.boolean  "active",     :default => true,  :null => false
    t.boolean  "system",     :default => false, :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

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
    t.text          "notes"
    t.integer       "order"
  end

  add_index "areas", ["geom"], :name => "index_areas_on_geom", :spatial => true

  create_table "areas_messages", :id => false, :force => true do |t|
    t.integer "area_id"
    t.integer "message_id"
  end

  create_table "delayed_jobs", :force => true do |t|
    t.integer  "priority",   :default => 0
    t.integer  "attempts",   :default => 0
    t.text     "handler"
    t.text     "last_error"
    t.datetime "run_at"
    t.datetime "locked_at"
    t.datetime "failed_at"
    t.string   "locked_by"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "delayed_jobs", ["priority", "run_at"], :name => "delayed_jobs_priority"

  create_table "messages", :force => true do |t|
    t.string   "mobile_text"
    t.string   "full_text"
    t.string   "group",       :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "messages", :force => true do |t|
    t.string   "mobile_text"
    t.string   "full_text"
    t.string   "group",       :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "messages_zones", :id => false, :force => true do |t|
    t.integer "zone_id"
    t.integer "message_id"
  end

  create_table "sessions", :force => true do |t|
    t.string   "session_id", :null => false
    t.text     "data"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "sessions", ["session_id"], :name => "index_sessions_on_session_id"
  add_index "sessions", ["updated_at"], :name => "index_sessions_on_updated_at"

  create_table "users", :force => true do |t|
    t.string   "login",                     :limit => 40
    t.string   "name",                      :limit => 100, :default => ""
    t.string   "identity_url"
    t.string   "email",                     :limit => 100
    t.string   "crypted_password",          :limit => 40
    t.string   "salt",                      :limit => 40
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "remember_token",            :limit => 40
    t.datetime "remember_token_expires_at"
    t.boolean  "mobile_pin_accepted",                      :default => false, :null => false
    t.string   "mobile_pin"
  end

  create_table "zones", :force => true do |t|
    t.string   "name"
    t.string   "travel_status"
    t.string   "snow_status"
    t.string   "soil_status"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end

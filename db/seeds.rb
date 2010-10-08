# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#   
#   cities = City.create([{ :name => 'Chicago' }, { :name => 'Copenhagen' }])
#   Major.create(:name => 'Daley', :city => cities.first)

Zone.create([{ :name => 'Western Coastal', :travel_status => 'Open', :snow_status => 'Good', :soil_status => 'Good'},{ :name => 'Eastern Coastal', :travel_status => 'Open', :snow_status => 'Good', :soil_status => 'Good' },{ :name => 'Lower Foothills', :travel_status => 'Limited', :soil_status => 'Good', :snow_status => 'Improving' },{ :name => 'Upper Foothills', :travel_status => 'Closed', :soil_status => 'Improving', :snow_status => 'Bad' }])

Alert.create([{ :text => 'Test Alert' }])

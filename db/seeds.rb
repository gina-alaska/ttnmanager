# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#   
#   cities = City.create([{ :name => 'Chicago' }, { :name => 'Copenhagen' }])
#   Major.create(:name => 'Daley', :city => cities.first)

Zone.create([{ :name => 'Western Coastal', :travel_status => 'Open', :snow_status => 'Good', :soil_status => 'Good'},{ :name => 'Eastern Coastal', :travel_status => 'Open', :snow_status => 'Good', :soil_status => 'Good' },{ :name => 'Lower Foothills', :travel_status => 'Closed', :soil_status => 'Good', :snow_status => 'Improving' },{ :name => 'Upper Foothills', :travel_status => 'Closed', :soil_status => 'Improving', :snow_status => 'Bad' }])

Alert.create([{ :text => 'Test Alert' }])

Message.create([
  { :group => 'soil', :mobile_text => 'Criteria Met', :full_text => 'Criteria Met' },
  { :group => 'soil', :mobile_text => 'Too Warm', :full_text => 'Too Warm' },
  { :group => 'snow', :mobile_text => 'Depth Criteria Met', :full_text => 'Depth Criteria Met' },
  { :group => 'snow', :mobile_text => 'Low Snow', :full_text => 'Low Snow' },
  { :group => 'snow', :mobile_text => 'Poor Quality Snow', :full_text => 'Poor Quality Snow' },
  { :group => 'operational', :mobile_text => 'Summer vehicle use w/ DNR approval', :full_text => 'Summer vehicle use permitted with DNR approval' },
  { :group => 'operational', :mobile_text => 'Snowmobile use w/ approval', :full_text => 'Snowmobile use permitted with approval from company Environmental Advisor' },
  { :group => 'operational', :mobile_text => 'Avoid areas of low snow', :full_text => 'Avoid areas of low snow' },
  { :group => 'operational', :mobile_text => 'Avoid high exposed tundra', :full_text => 'Avoid high exposed tundra' },
  { :group => 'operational', :mobile_text => 'Consider commencing pre-packing activities w/ DNR approval', :full_text => 'Consider commencing pre-packing activities with DNR approval' },
  { :group => 'operational', :mobile_text => 'Consider using only summer approved vehicles', :full_text => 'Consider using only summer approved vehicles' },
  { :group => 'operational', :mobile_text => 'Consider harvesting ice chips for use in low snow areas', :full_text => 'Consider harvesting ice chips for use in low snow areas' },
  { :group => 'operational', :mobile_text => 'Consider protecting exposed areas by collecting snow with snow fences', :full_text => 'Consider protecting exposed areas by collecting snow with snow fences' },
  { :group => 'alert', :mobile_text => 'Wind warning, high winds may result in loss of snow', :full_text => 'Wind warning, high winds may result in loss of snow' },
  { :group => 'alert', :mobile_text => 'Thaw potential, recommend commencing night only operations', :full_text => 'Thaw potential, recommend commencing night only operations' },
  { :group => 'alert', :mobile_text => 'Break-up imminent', :full_text => 'Break-up imminent' },
  { :group => 'alert', :mobile_text => 'Rain warning, rain may result in loss of snow', :full_text => 'Rain warning, rain may result in loss of snow' },
  { :group => 'alert', :mobile_text => 'Big snow event expected', :full_text => 'Big snow event expected' }
])

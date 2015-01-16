json.type 'Feature'
json.geometry GeoRuby::SimpleFeatures::Geometry.from_ewkt(area.geom).as_json
json.properties do
  json.alerts area.alert_messages unless area.alert_messages.blank?
  json.operational_considerations area.operational_messages unless area.operational_messages.blank?
  json.soil_status area.soil_message
  json.snow_status area.snow_message
  json.travel_status area.travel_status
  json.notes area.notes unless area.notes.blank?
  json.name area.name
end

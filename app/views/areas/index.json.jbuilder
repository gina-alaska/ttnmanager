json.array!(@areas) do |area|
  json.extract! area, :id, :name, :travel_status, :snow_status, :soil_status, :geom, :notes, :order
  json.url area_url(area, format: :json)
end

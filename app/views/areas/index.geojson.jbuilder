json.type 'FeatureCollection'
json.features do
  json.array! @areas, partial: 'areas/area', as: :area
end

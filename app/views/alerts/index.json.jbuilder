json.array!(@alerts) do |alert|
  json.extract! alert, :id, :area_id, :text, :active, :system
  json.url alert_url(alert, format: :json)
end

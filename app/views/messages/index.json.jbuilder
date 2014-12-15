json.array!(@messages) do |message|
  json.extract! message, :id, :mobile_text, :full_text, :group
  json.url message_url(message, format: :json)
end

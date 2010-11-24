module MobileHelper
  def message_checkbox(m)
    return <<-EOJSON
{
  itemId: 'message_#{m.id}',
  xtype: 'checkbox',
  label: '#{m.mobile_text}',
  name: 'messages[#{m.id}]',
  cls: 'zone_message',
  value: false
}
    EOJSON
  end

  def message_radio(name, m)
    return <<-EOJSON
{
  itemId: 'message_#{m.id}',
  xtype: 'radio',
  label: '#{m.mobile_text}',
  name: 'messages[#{name}]',
  cls: 'zone_message',
  value: false
}
    EOJSON
  end
end

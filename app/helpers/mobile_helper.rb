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
end

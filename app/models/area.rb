class Area < ActiveRecord::Base
  has_and_belongs_to_many :messages

  def alerts
    #messages.alert
    messages.inject([]) do |msgs,m|
      msgs << m if m.group == 'alert'
      msgs
    end
  end

  def operationals
    #messages.operational
    messages.inject([]) do |msgs,m|
      msgs << m if m.group == 'operational'
      msgs
    end
  end

  def snow
    #messages.snow
    messages.inject([]) do |msgs,m|
      msgs << m if m.group == 'snow'
      msgs
    end
  end

  def soil
    #messages.soil
    messages.inject([]) do |msgs,m|
      msgs << m if m.group == 'soil'
      msgs
    end
  end
end

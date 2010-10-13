class Area < ActiveRecord::Base
  has_and_belongs_to_many :messages

  def alerts
    messages.alert
  end

  def operationals
    messages.operational
  end

  def snow
    messages.snow
  end

  def soil
    messages.soil
  end
end

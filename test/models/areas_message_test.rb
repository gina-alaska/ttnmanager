require 'test_helper'

class AreasMessageTest < ActiveSupport::TestCase
  def setup
    @alert = areas_messages(:alert)
    @operational = areas_messages(:operational)
    @snow = areas_messages(:snow)
    @soil = areas_messages(:soil)
  end

end

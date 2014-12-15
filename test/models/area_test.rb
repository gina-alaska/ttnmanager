require 'test_helper'

class AreaTest < ActiveSupport::TestCase
  should have_many(:areas_messages)
  should have_many(:messages).through(:areas_messages)
end

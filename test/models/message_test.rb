require 'test_helper'

class MessageTest < ActiveSupport::TestCase
  should have_many(:areas_messages)
  should have_many(:areas).through(:areas_messages)
end

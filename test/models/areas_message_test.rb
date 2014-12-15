require 'test_helper'

class AreasMessageTest < ActiveSupport::TestCase
  should belong_to(:area)
  should belong_to(:message)
end

require 'test_helper'

class AreaTest < ActiveSupport::TestCase
  should have_many(:areas_messages)
  should have_many(:messages).through(:areas_messages)
  
  # should have_and_belong_to_many(:alerts).class_name("Message").conditions('alert')
end

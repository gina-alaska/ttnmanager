require 'test_helper'

class MessageTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end

  should have_many(:areas_messages)
  should have_many(:areas).through(:areas_messages)
end

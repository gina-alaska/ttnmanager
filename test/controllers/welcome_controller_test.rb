require 'test_helper'

class WelcomeControllerTest < ActionController::TestCase
  # test "the truth" do
  #   assert true
  # end

  test 'should get index' do
    assert :get, root_url
    assert_response :success

  end

end

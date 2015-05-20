require 'test_helper'

class HighVoltage::PagesControllerTest < ActionController::TestCase
  test "it should show about page" do
    get :show, id: 'about'
    assert_response :success
  end
end

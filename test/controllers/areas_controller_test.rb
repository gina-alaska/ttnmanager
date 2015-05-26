require 'test_helper'

class AreasControllerTest < ActionController::TestCase
  setup do
    @area = areas(:one)
  end


  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:areas)
  end

  test "should show area" do
    get :show, id: @area
    assert_response :success
  end

  test "should get edit" do
    login_user(:manager)
    get :edit, id: @area
    assert_response :success
  end

  test "should update area" do
    login_user(:manager)
    patch :update, id: @area, area: { geom: @area.geom, name: @area.name, notes: @area.notes, order: @area.order, travel_status: @area.travel_status }
    assert_redirected_to area_path(assigns(:area))
  end

end

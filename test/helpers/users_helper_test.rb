require 'test_helper'

class UsersHelperTest < ActionView::TestCase
  include UsersHelper

  test 'role help is a description list' do
    assert_includes role_help, "Guest"
    assert_includes role_help, "Manager"
    assert_includes role_help, "Admin"
  end
end

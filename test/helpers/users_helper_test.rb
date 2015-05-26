require 'test_helper'

class UsersHelperTest < ActionView::TestCase
  include UsersHelper

  test 'role help is a description list' do
    role_items = role_help.map(&:first)
    assert_includes role_items, "Guest"
    assert_includes role_items, "Manager"
    assert_includes role_items, "Admin"
  end
end

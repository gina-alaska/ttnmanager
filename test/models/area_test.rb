require 'test_helper'

class AreaTest < ActiveSupport::TestCase
  should have_many(:areas_messages)
  should have_many(:messages).through(:areas_messages)

  def setup
    @area = areas(:one)
  end

  test 'geometry should return GeoRuby' do
    assert_instance_of GeoRuby::SimpleFeatures::MultiPolygon, @area.geometry
  end
end

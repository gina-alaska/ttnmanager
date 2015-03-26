module AreasHelper
  def area_content_id(area)
    "#area-#{area.name.parameterize}-content"
  end

  def area_heading_id(area)
    "#area-#{area.name.parameterize}"
  end

  def area_class(area)
    case area.travel_status.downcase
    when 'open'
      'list-group-item-success'
    when 'closed'
      'list-group-item-danger'
    else
      'list-group-item-default'
    end
  end
end

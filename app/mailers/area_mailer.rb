class AreaMailer < ActionMailer::Base
  default :from => "atn@gina.alaska.edu"

  def status_update(to, area)
    @area = area
    mail(:to => to, :subject => "North Slope Off-road Travel Status Report")
  end

  def alert_updates(to, area)
    @area = area
    mail(:to => to, :subject => "North Slope Off-road Alerts Update")
  end
end

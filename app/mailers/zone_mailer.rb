class ZoneMailer < ActionMailer::Base
  default :from => "webdev@gina.alaska.edu"

  def status_update(zone)
    @zone = zone
    mail(:to => 'will@gina.alaska.edu',
         :subject => '')
  end
end

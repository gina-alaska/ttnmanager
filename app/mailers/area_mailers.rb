class AreaMailer < ActionMailer::Base
  default :from => "webdev@gina.alaska.edu"

  def status_update(area)
    @area = area
    mail(:to => 'will@gina.alaska.edu',
         :subject => '')
  end
end

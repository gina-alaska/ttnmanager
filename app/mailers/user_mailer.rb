class UserMailer < ActionMailer::Base
  default :from => "atn@gina.alaska.edu"

  def request_pin(user)
    @user = user
    mail(:to => 'atn@gina.alaska.edu', :subject => '[ATN] Pin request')
  end

  def pin_accepted(user)
    @user = user
    mail(:to => @user.email, :subject => '[ATN] Pin request')
  end
end

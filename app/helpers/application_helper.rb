module ApplicationHelper
  def login_helper
    #if current_user.logged_in?
      #"Logout"
    #else
    link_to "Login", "#"
  end
end

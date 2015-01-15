class ApplicationController < ActionController::Base
  include GinaAuthentication::AppHelpers
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  rescue_from CanCan::AccessDenied do |exception|
    # if signed_in?
    #   render template: 'welcome/permission_denied', status: :forbidden
    # else
      session[:redirect_back_to] = request.original_url
      redirect_to root_url
    # end
  end
end

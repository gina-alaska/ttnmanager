class ApplicationController < ActionController::Base
  include GinaAuthentication::AppHelpers
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  before_action :set_variant

  rescue_from CanCan::AccessDenied do |exception|
    # if signed_in?
    #   render template: 'welcome/permission_denied', status: :forbidden
    # else
      session[:redirect_back_to] = request.original_url
      redirect_to root_url
    # end
  end

  private
  def set_variant
    request.variant = :mobile if browser.mobile? or browser.tablet?
    request.variant = :mobile if params[:mobile].present?
  end
end

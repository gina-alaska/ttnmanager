# This controller handles the login/logout function of the site.  
class SessionsController < ApplicationController
  # render new.rhtml
  def new
  end

  def create
    logout_keeping_session!
    if using_open_id?
      open_id_authentication
    elsif using_gina_id?
      params[:openid_identifier] = "http://id.gina.alaska.edu/#{params[:gina_username]}"
      open_id_authentication
    elsif using_pin?
      pin_authentication
    else
      failed_login "Sorry, invalid credentials given"
    end
  end

  def using_gina_id?
    params[:gina_username]
  end

  def using_pin?
    params[:pin]
  end

  def open_id_authentication
    # Pass optional :required and :optional keys to specify what sreg fields you want.
    # Be sure to yield registration, a third argument in the #authenticate_with_open_id block.
    authenticate_with_open_id(open_id_identifier,
            :required => [ :nickname, :email ], :optional => :fullname) do |result, identity_url, registration|
      case result.status
      when :missing
        failed_login "Sorry, the OpenID server couldn't be found"
      when :invalid
        failed_login "Sorry, but this does not appear to be a valid OpenID"
      when :canceled
        failed_login "OpenID verification was canceled"
      when :failed
        failed_login "Sorry, the OpenID verification failed"
      when :successful
        if user = User.find_by_identity_url(open_id_identifier)
          assign_registration_attributes!(user, registration)

          if user.save
            successful_login(user)
          else
            failed_login "Your OpenID profile registration failed: " +
              user.errors.full_messages.to_sentence
          end
        else
          user = User.new
          assign_registration_attributes!(user, registration)

          if user.save
            successful_login(user, true)
            redirect_to(settings_path)
          else
            ::Rails.logger.info user.errors.inspect
            failed_login "Could not create a new user with that identity url" +
              user.errors.full_messages.to_sentence
          end
        end
      end
    end
  end

  # registration is a hash containing the valid sreg keys given above
  # use this to map them to fields of your user model
  def assign_registration_attributes!(user, registration)
    model_to_registration_mapping.each do |model_attribute, registration_attribute|
      unless registration[registration_attribute].blank?
        user.send("#{model_attribute}=", registration[registration_attribute])
      end
    end
  end

  def model_to_registration_mapping
    { :login => 'nickname', :email => 'email', :name => 'fullname' }
  end

  def password_authentication
    user = User.authenticate(params[:login], params[:password])
    if user
      # Protects against session fixation attacks, causes request forgery
      # protection if user resubmits an earlier form using back
      # button. Uncomment if you understand the tradeoffs.
      # reset_session
      successful_login(user)
    else
      note_failed_signin
      @login       = params[:login]
      @remember_me = params[:remember_me]
      render :action => 'new'
    end
  end

  def pin_authentication
    user = User.find_by_mobile_pin(params[:pin])
    if user
      # Protects against session fixation attacks, causes request forgery
      # protection if user resubmits an earlier form using back
      # button. Uncomment if you understand the tradeoffs.
      # reset_session
      successful_login(user)
    else
      note_failed_signin
      redirect_back_or_default('/m', :notice => "Unable to authenticate using pin")
    end
  end

  def destroy
    logout_killing_session!
    redirect_back_or_default('/', :notice => "You have been logged out.")
  end

protected
  # Track failed login attempts
  def note_failed_signin
    flash.now[:error] = "Couldn't log you in as '#{params[:login]}'"
    logger.warn "Failed login for '#{params[:login]}' from #{request.remote_ip} at #{Time.now.utc}"
  end

private
  def successful_login(user, skip_redirect=false)
    self.current_user = user
    new_cookie_flag = (params[:remember_me] == "1")
    handle_remember_cookie! new_cookie_flag
    redirect_back_or_default('/', :notice => "Logged in successfully") unless skip_redirect
  end

  def failed_login(message)
    flash[:error] = message
    redirect_to(new_session_url)
  end
end

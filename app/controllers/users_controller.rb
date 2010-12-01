class UsersController < ApplicationController
  def edit
    @user = current_user
  end

  def pin
    
  end
  
  def update
    @user = current_user
    @user.mobile_pin

    if @user.update_attributes(params[:user])
      flash[:notice] = "Successfully updated your settings"
      redirect_to('/')
    else
      flash.now[:error] = "An error was encountered while updating your settings"
      ::Rails.logger.info "ERRORS"
      ::Rails.logger.info @user.errors.full_messages.inspect
      render 'edit'
    end
  end
end

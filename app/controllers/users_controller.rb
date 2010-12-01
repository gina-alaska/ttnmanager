class UsersController < ApplicationController
  before_filter :login_required, :only => [:edit, :update]

  def edit
    @user = current_user
  end

  def update
    @user = current_user
    @user.mobile_pin

    if @user.update_attributes(params[:user])
      flash[:notice] = "Successfully updated your settings"
      redirect_to('/')
    else
      render 'edit'
    end
  end
end

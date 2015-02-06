class Admin::UsersController < AdminController
  before_action :set_user, only: [:show, :edit, :update, :destroy]
  authorize_resource

  def index
    @users = User.all
  end

  def edit

  end

  def update
    if @user.update_attributes user_params
      redirect_to admin_users_path
    else
      render :edit
    end
  end


  private
  def set_user
    @user = User.find(params[:id])
  end

  def user_params
    params.require(:user).permit(:role)
  end
end

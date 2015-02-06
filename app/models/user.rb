class User < ActiveRecord::Base
  include GinaAuthentication::UserModel

  ROLES = %w{guest manager admin}

  def admin?
    role == 'admin'
  end

  def manager?
    role == 'manager'
  end

end

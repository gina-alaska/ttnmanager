class User < ActiveRecord::Base
  include GinaAuthentication::UserModel

  def admin?
    role == 'admin'
  end

end

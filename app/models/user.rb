require 'digest/sha1'

class User < ActiveRecord::Base
  include Authentication
  include Authentication::ByCookieToken

  validates :login, :presence   => true,
                    :length     => { :within => 3..40 },
                    :format     => { :with => Authentication.login_regex, :message => Authentication.bad_login_message }

  validates :name,  :format     => { :with => Authentication.name_regex, :message => Authentication.bad_name_message },
                    :length     => { :maximum => 100 },
                    :allow_nil  => true

  validates :email, :presence   => true,
                    :uniqueness => true,
                    :format     => { :with => Authentication.email_regex, :message => Authentication.bad_email_message },
                    :length     => { :within => 6..100 }

  validates :identity_url,
                    :presence   => true,
                    :uniqueness => true

  validates :mobile_pin,
                    :uniqueness => true,
                    :length     => { :maximum => 18 },
                    :allow_nil  => true,
                    :allow_blank => true


  # HACK HACK HACK -- how to do attr_accessible from here?
  # prevents a user from submitting a crafted form that bypasses activation
  # anything else you want your user to change should be added here.
  attr_accessor :mobile_pin_request
  
  attr_accessible :login, :email, :name, :mobile_pin_request
  # Authenticates a user by their login name and unencrypted password.  Returns the user or nil.
  # uff.  this is really an authorization, not authentication routine.
  # We really need a Dispatch Chain here or something.
  # This will also let us return a human error message.
  #
  def self.authenticate(login, password)
    return nil if login.blank? || password.blank?
    u = find_by_login(login.downcase) # need to get the salt
    u && u.authenticated?(password) ? u : nil
  end

  def self.create_pin_for(id)
    user = User.find_by_id(id)
    user.mobile_pin = rand(99999)
    user.mobile_pin_accepted = true
    user.save!
  end  

  def login=(value)
    write_attribute :login, (value ? value.downcase : nil)
  end

  def email=(value)
    write_attribute :email, (value ? value.downcase : nil)
  end
end

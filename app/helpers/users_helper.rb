module UsersHelper

  def role_help
    [
      [ "Guest", "Has no special priviledges." ],
      [ "Manager", "Can update areas." ],
      [ "Admin", "Has Manager priviledges and can modify users permissions" ]
    ]
  end
end

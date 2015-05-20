module UsersHelper

  def role_help
    @role_descriptions = [
      [ "Guest", "Has no special priviledges." ],
      [ "Manager", "Can update areas." ],
      [ "Admin", "Has Manager priviledges and can modify users permissions" ]
    ]

    content_tag :dl, class: 'dl-horizontal' do
      @role_descriptions.reduce('') do |content, role|
        content << content_tag(:dt, role.first)
        content << content_tag(:dd, role.last)
        content
      end.html_safe
    end
  end
end

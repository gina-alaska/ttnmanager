class WelcomeController < ApplicationController
  def index
    @areas = Area.order(:name)
  end
end

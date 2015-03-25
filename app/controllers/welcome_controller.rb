class WelcomeController < ApplicationController
  def index
    @areas = Area.order(order: :asc)
  end
end

class WelcomeController < ApplicationController
  def index
    @areas = Area.all    
  end
end

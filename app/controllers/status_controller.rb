class StatusController < ApplicationController
  def index
    render :index, layout: 'status'
  end
end
class MobileController < ApplicationController
  def index
    respond_to do |format|
      format.html
      format.manifest
    end
  end
end

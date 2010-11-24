class MessagesController < ApplicationController
  def index
    respond_to do |format|
      format.json { render :json => { :messages => Message.all } }
    end
  end
end

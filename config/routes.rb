Rails.application.routes.draw do
  resources :messages
  resources :areas, except: [:create, :destroy] do
    collection do
      get :overview
      get :open
      get :closed
    end
  end

  get '/status', to: 'status#index'
  get '/docs', to: 'doc#index'
  root :to => 'welcome#index'

  get '/logout', to: 'sessions#destroy'
  get '/login', to: 'sessions#new'
  get '/auth/:provider/disable', to: 'users#disable_provider'
  post '/auth/:provider/callback', to: 'sessions#create'
  get '/auth/:provider/callback', to: 'sessions#create'
  get '/auth/failure', to: 'sessions#failure'
  resources :sessions
  resources :memberships

  resources :users

  namespace :admin do
    resources :users
    # resources :areas
  end
end

Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  root 'home#index', as: 'home'

  post 'problem' , to: 'problem#create', as: 'problems'
  post 'transcript' , to: 'transcript#create', as: 'transcripts'

  get 'transcript_users', to: 'transcript#users', as: 'transcript_users'
end

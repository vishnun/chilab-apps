Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  root 'home#index', as: 'home'

  get 'smart_conversation', to: 'home#smart_conversation', as: 'smart_conversation'

  post 'problem', to: 'problem#create', as: 'problems'

  post 'transcript', to: 'transcript#create', as: 'transcripts'
  post 'dialogue', to: 'transcript#create_dialogue', as: 'dialogues'
  get 'dialogues', to: 'transcript#dialogues', as: 'get_dialogues'

  get 'transcript_users', to: 'transcript#users', as: 'transcript_users'

  resources :topic

end

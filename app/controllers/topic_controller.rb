class TopicController < ApplicationController

  def create
    Topic.create(name: topic_params[:name], words: get_words())
    redirect_to home_path
  end

  def index
  end

  def show
    render json: Topic.find(topic_id)
  end

  private

  def topic_id
    params[:id]
  end

  def get_words
    topic_params[:words].split(',').map(&:strip).map(&:downcase)
  end

  def topic_params
    params.require(:topic).permit(:name, :words)
  end

end



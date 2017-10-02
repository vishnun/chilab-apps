class HomeController < ApplicationController
  def smart_conversation
    @problems = Problem.all
    @problem = Problem.new

    @transcript = Transcript.new
    @transcripts = Transcript.all

    @topic = Topic.new
    @topics = Topic.all
  end

  def index
  end
end

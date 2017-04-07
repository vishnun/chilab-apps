class HomeController < ApplicationController
  def index
    @problems = Problem.all
    @problem = Problem.new

    @transcript = Transcript.new
    @transcripts = Transcript.all
  end
end

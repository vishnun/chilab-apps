class HomeController < ApplicationController
  def index
    @problems = Problem.all
    @problem = Problem.new
  end
end

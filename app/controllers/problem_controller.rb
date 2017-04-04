class ProblemController < ApplicationController

  def create
    @problem = Problem.create(problem_params)
    redirect_to home_path
  end

  private
  def problem_params
    params.require(:problem).permit(:document)
  end
end

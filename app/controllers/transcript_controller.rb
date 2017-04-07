class TranscriptController < ApplicationController

  def create
    Transcript.create(transcript_params)
  end

  def users
    transcript = Transcript.where(users_param)[0]
    render json: [transcript.user1, transcript.user2]
  end

  private
  def transcript_params
    params.require(:transcript).permit(:name, :user1, :user2)
  end

  def users_param
    params.require(:transcript).permit(:id)
  end

end

class TranscriptController < ApplicationController

  def create
    Transcript.create(transcript_params)
  end

  def add_dialogue
    Dialogue.create(dialogue_params)
  end

  def users
    transcript = Transcript.where(users_params)[0]
    render json: [transcript.user1, transcript.user2]
  end

  private
  def transcript_params
    params.require(:transcript).permit(:name, :user1, :user2)
  end

  def users_params
    params.require(:transcript).permit(:id)
  end

  def dialogue_params
    params.require(:dialogue).permit(:transcript_id, :user, :sentence)
  end
end

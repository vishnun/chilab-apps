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

  def dialogues
    transcript = Transcript.where(dialogues_params)[0]
    @dialogues = transcript.dialogues

    respond_to do |format|
      format.json { render json: @dialogues, status: :ok }
      format.csv { send_data Dialogue.to_csv(@dialogues), filename: "transcript-#{transcript.name}-#{Date.today}.csv" }
    end
  end

  private
  def dialogues_params
    params.require(:transcript).permit(:id)
  end

  def transcript_params
    params.require(:transcript).permit(:name, :user1, :user2)
  end

  def users_params
    params.require(:transcript).permit(:id)
  end

  def dialogue_params
    params.require(:dialogue).permit(:transcript_id, :user, :sentence, :word_detected)
  end
end

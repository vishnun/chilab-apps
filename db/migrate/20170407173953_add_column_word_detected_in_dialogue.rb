class AddColumnWordDetectedInDialogue < ActiveRecord::Migration[5.0]
  def change
    add_column :dialogues, :word_detected, :string
  end
end

class CreateDialogues < ActiveRecord::Migration[5.0]
  def change
    create_table :dialogues do |t|
      t.belongs_to :transcript, index: true
      t.string :user
      t.string :sentence
      t.timestamps
    end
  end
end

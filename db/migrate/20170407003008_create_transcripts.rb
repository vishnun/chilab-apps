class CreateTranscripts < ActiveRecord::Migration[5.0]
  def change
    create_table :transcripts do |t|
      t.string :name
      t.string :user1
      t.string :user2
      t.timestamps
    end
  end
end

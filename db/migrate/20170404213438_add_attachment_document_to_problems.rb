class AddAttachmentDocumentToProblems < ActiveRecord::Migration
  def self.up
    change_table :problems do |t|
      t.attachment :document
    end
  end

  def self.down
    remove_attachment :problems, :document
  end
end

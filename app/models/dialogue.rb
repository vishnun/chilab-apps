class Dialogue < ApplicationRecord
  belongs_to :transcript

  def self.to_csv(dialogues)
    attributes = %w{user sentence word_detected created_at}

    CSV.generate(headers: true) do |csv|
      csv << attributes

      dialogues.each do |dialogue|
        csv << attributes.map { |attr| dialogue.send(attr) }
      end
    end
  end
end

class Problem < ApplicationRecord

  has_attached_file :document
  validates_attachment :document, :content_type => { :content_type => %w(application/pdf application/msword application/vnd.openxmlformats-officedocument.wordprocessingml.document) }


  def url
    document.url
  end

  def name
    document.original_filename
  end

end

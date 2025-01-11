class Badge < ApplicationRecord
  belongs_to :shop
  has_many :badge_assignments, dependent: :destroy
  
  validates :name, presence: true
  validates :text, presence: true
  validates :position, inclusion: { in: %w[top-left top-right bottom-left bottom-right] }
  validates :background_color, format: { with: /\A#(?:[0-9a-fA-F]{3}){1,2}\z/, message: "must be a valid hex color" }
  validates :text_color, format: { with: /\A#(?:[0-9a-fA-F]{3}){1,2}\z/, message: "must be a valid hex color" }
end 
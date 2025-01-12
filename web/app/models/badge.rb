class Badge < ApplicationRecord
  belongs_to :shop
  has_many :badge_assignments, dependent: :destroy
  
  validates :name, presence: true
  validates :text, presence: true
  validates :position, presence: true
  validates :background_color, format: { with: /\A#(?:[0-9a-fA-F]{3}){1,2}\z/, message: "must be a valid hex color" }
  validates :text_color, format: { with: /\A#(?:[0-9a-fA-F]{3}){1,2}\z/, message: "must be a valid hex color" }

  private

  def position_format_valid
    return errors.add(:position, "must contain x and y coordinates") unless position.is_a?(Hash) && position["x"].present? && position["y"].present?
  end
end 
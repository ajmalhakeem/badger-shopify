class BadgeAssignment < ApplicationRecord
  belongs_to :badge
  
  validates :product_id, presence: true
  validates :product_id, uniqueness: { scope: :badge_id }
end 
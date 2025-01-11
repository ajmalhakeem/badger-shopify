class CreateBadgeAssignments < ActiveRecord::Migration[7.0]
  def change
    create_table :badge_assignments do |t|
      t.references :badge, foreign_key: true
      t.bigint :product_id, null: false
      t.boolean :active, default: true
      
      t.timestamps
    end
    
    add_index :badge_assignments, [:badge_id, :product_id], unique: true
  end
end

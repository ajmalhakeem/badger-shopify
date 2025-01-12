class CreateBadges < ActiveRecord::Migration[7.0]
  def change
    create_table :badges do |t|
      t.string :name, null: false
      t.string :text, null: false
      t.string :background_color, default: '#000000'
      t.string :text_color, default: '#FFFFFF'
      t.json :position, default: { x: 0, y: 0 }
      t.boolean :active, default: true
      t.references :shop, foreign_key: true

      t.timestamps
    end
  end
end

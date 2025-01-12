# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2025_01_11_044913) do
  create_table "badge_assignments", force: :cascade do |t|
    t.integer "badge_id"
    t.bigint "product_id", null: false
    t.boolean "active", default: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["badge_id", "product_id"], name: "index_badge_assignments_on_badge_id_and_product_id", unique: true
    t.index ["badge_id"], name: "index_badge_assignments_on_badge_id"
  end

  create_table "badges", force: :cascade do |t|
    t.string "name", null: false
    t.string "text", null: false
    t.string "background_color", default: "#000000"
    t.string "text_color", default: "#FFFFFF"
    t.json "position", default: {"x"=>0, "y"=>0}
    t.boolean "active", default: true
    t.integer "shop_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["shop_id"], name: "index_badges_on_shop_id"
  end

  create_table "shops", force: :cascade do |t|
    t.string "shopify_domain", null: false
    t.string "shopify_token", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "access_scopes"
    t.index ["shopify_domain"], name: "index_shops_on_shopify_domain", unique: true
  end

  create_table "users", force: :cascade do |t|
    t.bigint "shopify_user_id", null: false
    t.string "shopify_domain", null: false
    t.string "shopify_token", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "access_scopes", default: "", null: false
    t.datetime "expires_at"
    t.index ["shopify_user_id"], name: "index_users_on_shopify_user_id", unique: true
  end

  add_foreign_key "badge_assignments", "badges"
  add_foreign_key "badges", "shops"
end

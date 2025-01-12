module Api
  class BadgesController < AuthenticatedController
   
    #TODO: Remove this after figure out how to use CSRF protection
    skip_before_action :verify_authenticity_token

    def index
      badges = shop.badges.includes(:badge_assignments)
      render json: badges.as_json(include: {
        badge_assignments: {
          only: [:id, :product_id, :active]
        }
      })
    end

    def create
      badge = shop.badges.build(badge_params)
      
      if badge.save
        render json: badge, status: :created
      else
        render json: { errors: badge.errors.messages }, status: :unprocessable_entity
      end
    end

    def update
      badge = shop.badges.find(params[:id])
      
      if badge.update(badge_params)
        render json: badge
      else
        render json: { errors: badge.errors.messages }, status: :unprocessable_entity
      end
    end

    def destroy
      badge = shop.badges.find(params[:id])
      badge.destroy
      
      head :no_content
    end

    def products
      response = ShopifyAPI::Product.all(session: current_shopify_session)
      render json: response
    end

    def show
      badge = shop.badges.includes(:badge_assignments).find(params[:id])
      render json: badge.as_json(include: {
        badge_assignments: {
          only: [:id, :product_id, :active],
        }
      })
    end

    private

    def badge_params
      params.require(:badge).permit(
        :name, 
        :text, 
        :background_color, 
        :text_color, 
        position: [:x, :y]
      )
    end

    def shop
      @shop ||= Shop.find_by(shopify_domain: current_shopify_domain)
    end
  end
end 
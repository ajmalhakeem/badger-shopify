module Api
  class BadgeAssignmentsController < AuthenticatedController
    skip_before_action :verify_authenticity_token

    #TODO: Remove this after figure out how to use CSRF protection
    before_action :set_badge

    def create
      ActiveRecord::Base.transaction do
        assignment = @badge.badge_assignments.build(assignment_params)
        
        if assignment.save
          render json: assignment, status: :created
        else
          render json: { errors: assignment.errors.full_messages }, status: :unprocessable_entity
        end
      end
    rescue ActiveRecord::StatementInvalid => e
      render json: { error: "Database error: #{e.message}" }, status: :service_unavailable
    end

    def destroy
      assignment = @badge.badge_assignments.find_by!(product_id: params[:id])
      assignment.destroy
      
      head :no_content
    end

    private

    def set_badge
      @badge = shop.badges.find(params[:badge_id])
    end

    def assignment_params
      params.require(:badge_assignment).permit(:product_id, :active)
    end

    def shop
      @shop ||= Shop.find_by(shopify_domain: current_shopify_domain)
    end
  end
end 
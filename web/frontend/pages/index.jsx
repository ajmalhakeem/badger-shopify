import {
  Page,
  Layout,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { BadgeModal } from "../components/badges/BadgeModal";
import { BadgeTable } from "../components/badges/BadgeTable";

export default function HomePage() {
  const { t } = useTranslation();
  const [badges, setBadges] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState(null);

  useEffect(() => {
    fetchBadges();
  }, []);

  const handleEdit = (badge) => {
    setSelectedBadge(badge);
    setIsModalOpen(true);
  };

  const handleAssignProducts = async (e, badge) => {
    e.stopPropagation();
    try {
      const result = await shopify.resourcePicker({type: 'product', multiple: true});
      
      for (const product of result) {
        await fetch(`/api/badges/${badge.id}/badge_assignments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            badge_assignment: {
              product_id: product.id.split('/').pop(),
              active: true
            }
          })
        });
      }
      
      fetchBadges();
    } catch (error) {
      console.error('Error assigning products:', error);
    }
  };

  const handleViewProducts = async (e, badge) => {
    e.stopPropagation();
    const productIds = badge.badge_assignments
      .map(assignment => {
        return { id: `gid://shopify/Product/${assignment.product_id}` }
      });

    try {
      await shopify.resourcePicker({
        type: 'product',
        multiple: true,
        selectionIds: productIds
      });
    } catch (error) {
      console.error('Error opening resource picker:', error);
    }
  };

  const fetchBadges = async () => {
    try {
      const response = await fetch("/api/badges", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setBadges(data);
    } catch (error) {
      console.error("Error fetching badges:", error);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      const url = selectedBadge 
        ? `/api/badges/${selectedBadge.id}`
        : "/api/badges";
        
      const method = selectedBadge ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ badge: formData }),
      });
      
      if (response.ok) {
        setIsModalOpen(false);
        setSelectedBadge(null);
        fetchBadges();
      }
    } catch (error) {
      console.error("Error saving badge:", error);
    }
  };

  return (
    <Page
      title="Badges"
      primaryAction={{
        content: "Create Badge",
        onAction: () => setIsModalOpen(true),
      }}
    >
      <TitleBar title="Badger 🦡" />
      <Layout>
        <Layout.Section>
          <BadgeTable
            badges={badges}
            onEdit={handleEdit}
            onAssignProducts={handleAssignProducts}
            onViewProducts={handleViewProducts}
          />
        </Layout.Section>
      </Layout>

      <BadgeModal 
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedBadge(null);
        }}
        onSubmit={handleSubmit}
        badge={selectedBadge}
      />
    </Page>
  );
}

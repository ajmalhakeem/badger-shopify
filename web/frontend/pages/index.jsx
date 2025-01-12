import {
  Card,
  Page,
  Layout,
  DataTable,
  Link,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { BadgeModal } from "../components/badges/BadgeModal";

export default function HomePage() {
  const { t } = useTranslation();
  const [badges, setBadges] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchBadges();
  }, []);

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
      const response = await fetch("/api/badges", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ badge: formData }),
      });
      
      if (response.ok) {
        setIsModalOpen(false);
        fetchBadges();
      }
    } catch (error) {
      console.error("Error creating badge:", error);
    }
  };

  const rows = badges.map((badge) => [
    badge.name,
    badge.text,
    badge.active ? "Active" : "Inactive",
    badge.badge_assignments?.length > 0 ? (
      <Link
        onClick={async () => {
          try {
            // Get product IDs as a comma-separated list for the query
            const productIds = badge.badge_assignments
              .map(assignment => {
                return { id: `gid://shopify/Product/${assignment.product_id}` }
              })
              // .join(" OR ");

              console.log(productIds)

            // Open resource picker with query filter
            const products = await shopify.resourcePicker({
              type: 'product',
              multiple: true,
              // filter: {
              //   query: `id:${productIds}`
              // }
              selectionIds: productIds
            });
          } catch (error) {
            console.error('Error opening resource picker:', error);
          }
        }}
      >
        View Assigned Products ({badge.badge_assignments.length})
      </Link>
    ) : (
      <Link
        onClick={async () => {
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
        }}
      >
        Assign to Products
      </Link>
    )
  ]);

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
          <Card>
            <DataTable
              columnContentTypes={["text", "text", "text", "text"]}
              headings={["Name", "Text", "Status", "Products"]}
              rows={rows}
            />
          </Card>
        </Layout.Section>
      </Layout>

      <BadgeModal 
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </Page>
  );
}

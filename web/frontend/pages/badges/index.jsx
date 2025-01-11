import {
  Page,
  Layout,
  Card,
  DataTable,
  Modal,
  Form,
  FormLayout,
  TextField,
  Select,
  Link
} from "@shopify/polaris";
import { useState, useCallback, useEffect } from "react";
import { TitleBar } from "@shopify/app-bridge-react";
import createApp from '@shopify/app-bridge';
import {Redirect} from '@shopify/app-bridge/actions';

export default function BadgesIndex() {
  const [badges, setBadges] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    text: "",
    background_color: "#000000",
    text_color: "#FFFFFF",
    position: "top-right",
  });

  const app = createApp(config);

  const redirect = Redirect.create(app);

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

  const handleSubmit = async () => {
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
    badge.position,
    badge.active ? "Active" : "Inactive",
    badge.badge_assignments?.length > 0 ? (
      <Link
        onClick={() => redirect.dispatch(
          Redirect.Action.ADMIN_PATH,
          `/admin/products/${badge.badge_assignments[0].product_id}`
        )}
      >
        View Product ({badge.badge_assignments.length} assigned)
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
      <TitleBar title="Badges" />
      <Layout>
        <Layout.Section>
          <Card>
            <DataTable
              columnContentTypes={["text", "text", "text", "text", "text"]}
              headings={["Name", "Text", "Position", "Status", "Products"]}
              rows={rows}
            />
          </Card>
        </Layout.Section>
      </Layout>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Badge"
        primaryAction={{
          content: "Create",
          onAction: handleSubmit,
        }}
        secondaryActions={[
          {
            content: "Cancel",
            onAction: () => setIsModalOpen(false),
          },
        ]}
      >
        <Modal.Section>
          <FormLayout>
            <TextField
              label="Name"
              value={formData.name}
              onChange={(value) => setFormData({ ...formData, name: value })}
            />
            <TextField
              label="Text"
              value={formData.text}
              onChange={(value) => setFormData({ ...formData, text: value })}
            />
            <TextField
              label="Background Color"
              value={formData.background_color}
              onChange={(value) => setFormData({ ...formData, background_color: value })}
              type="color"
            />
            <TextField
              label="Text Color"
              value={formData.text_color}
              onChange={(value) => setFormData({ ...formData, text_color: value })}
              type="color"
            />
            <Select
              label="Position"
              options={[
                {label: "Top Right", value: "top-right"},
                {label: "Top Left", value: "top-left"},
                {label: "Bottom Right", value: "bottom-right"},
                {label: "Bottom Left", value: "bottom-left"},
              ]}
              value={formData.position}
              onChange={(value) => setFormData({ ...formData, position: value })}
            />
          </FormLayout>
        </Modal.Section>
      </Modal>
    </Page>
  );
} 
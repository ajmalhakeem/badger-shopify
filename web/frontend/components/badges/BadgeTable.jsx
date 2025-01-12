import { Card, DataTable, Link, EmptyState } from '@shopify/polaris';

export function BadgeTable({ badges, onEdit, onAssignProducts, onViewProducts }) {
  if (!badges.length) {
    return (
      <Card sectioned>
        <EmptyState
          heading="No badges yet"
          action={{content: 'Create Your First Badge', onAction: () => onEdit(null)}}
          image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
        >
          <p>Create badges to highlight products in your store.</p>
        </EmptyState>
      </Card>
    );
  }

  const rows = badges.map((badge) => [
    badge.name,
    badge.text,
    badge.active ? "Active" : "Inactive",
    badge.badge_assignments?.length > 0 ? (
      <Link onClick={(e) => onViewProducts(e, badge)}>
        View Assigned Products ({badge.badge_assignments.length})
      </Link>
    ) : (
      <Link onClick={(e) => onAssignProducts(e, badge)}>
        Assign to Products
      </Link>
    ),
    <Link onClick={() => onEdit(badge)}>
      Edit
    </Link>
  ]);

  return (
    <Card>
      <DataTable
        columnContentTypes={["text", "text", "text", "text", "text"]}
        headings={["Name", "Text", "Status", "Products", "Actions"]}
        rows={rows}
      />
    </Card>
  );
} 
import { Modal, FormLayout, TextField, Text } from "@shopify/polaris";
import { useState, useEffect } from "react";
import Draggable from 'react-draggable';
import { ColorPickerPopover } from './ColorPickerPopover';

export function BadgeModal({ open, onClose, onSubmit, badge = null }) {
  const [formData, setFormData] = useState({
    name: "",
    text: "Your Custom Text",
    background_color: "#000000",
    text_color: "#FFFFFF",
    position: { x: 290, y: -248 }
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (badge) {
      setFormData(badge);
    } else {
      setFormData({
        name: "",
        text: "Your Custom Text",
        background_color: "#000000",
        text_color: "#FFFFFF",
        position: { x: 290, y: -248 }
      });
    }
    setErrors({}); // Clear errors when modal opens/closes
  }, [badge, open]);

  const handleSubmit = async () => {
    try {
      const result = await onSubmit(formData);
      if (result.errors) {
        setErrors(result.errors);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleDrag = (e, data) => {
    setFormData(prev => ({
      ...prev,
      position: { x: data.x, y: data.y }
    }));
  };

  const previewStyle = {
    backgroundColor: formData.background_color,
    color: formData.text_color,
    padding: '4px 8px',
    borderRadius: '4px',
    display: 'inline-block',
    fontSize: '14px',
    fontWeight: 'bold',
    minWidth: '20px',
    textAlign: 'center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    cursor: 'move',
    position: 'absolute',
    zIndex: 1000,
  };

  const previewContainerStyle = {
    border: '1px dashed #ccc',
    padding: '20px',
    marginBottom: '16px',
    position: 'relative',
    height: '300px',
    backgroundColor: '#f6f6f7',
    overflow: 'hidden',
  };

  const productPreviewStyle = {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const productImageStyle = {
    width: '200px',
    height: '200px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    backgroundImage: 'url(https://burst.shopifycdn.com/photos/black-leather-choker-necklace_373x@2x.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  const productTitleStyle = {
    marginTop: '12px',
    fontSize: '16px',
    color: '#202223',
    fontWeight: '600',
  };

  const productPriceStyle = {
    fontSize: '14px',
    color: '#6d7175',
    marginTop: '4px',
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={badge ? "Edit Badge" : "Create Badge"}
      primaryAction={{
        content: badge ? "Update" : "Create",
        onAction: handleSubmit,
      }}
      secondaryActions={[
        {
          content: "Cancel",
          onAction: onClose,
        },
      ]}
    >
      <Modal.Section>
        <div style={previewContainerStyle}>
          <div style={productPreviewStyle}>
            <div style={productImageStyle} />
            <div style={productTitleStyle}>Sample Product</div>
            <div style={productPriceStyle}>$19.99</div>
          </div>
          
          <Draggable
            bounds="parent"
            position={formData.position}
            onDrag={handleDrag}
          >
            <div style={previewStyle}>
              {formData.text || "Preview"}
            </div>
          </Draggable>
        </div>

        <FormLayout>
          <FormLayout.Group>
            <TextField
              label="Display Text"
              value={formData.text}
              onChange={(value) => setFormData({ ...formData, text: value })}
              error={errors.text}
            />
            <TextField
              label="Label (Internal)"
              value={formData.name}
              onChange={(value) => setFormData({ ...formData, name: value })}
              error={errors.name}
            />
          </FormLayout.Group>

          <FormLayout.Group>
            <ColorPickerPopover
              label="Background Color"
              color={formData.background_color}
              onChange={(value) => setFormData({ ...formData, background_color: value })}
              error={errors.background_color}
            />
            <ColorPickerPopover
              label="Text Color"
              color={formData.text_color}
              onChange={(value) => setFormData({ ...formData, text_color: value })}
              error={errors.text_color}
            />
          </FormLayout.Group>
        </FormLayout>
      </Modal.Section>
    </Modal>
  );
} 
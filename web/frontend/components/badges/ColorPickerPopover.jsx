import { TextField, Popover } from '@shopify/polaris';
import { useState } from 'react';

export function ColorPickerPopover({ color, onChange, label, error }) {
  const [popoverActive, setPopoverActive] = useState(false);

  return (
    <Popover
      active={popoverActive}
      activator={
        <TextField
          label={label}
          value={color}
          onChange={onChange}
          type="color"
          error={error}
          autoComplete="off"
          onFocus={() => setPopoverActive(true)}
        />
      }
      onClose={() => setPopoverActive(false)}
    >
    </Popover>
  );
} 
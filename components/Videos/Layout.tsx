'use client';

import React from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import GridViewIcon from '@mui/icons-material/GridView';
import ListIcon from '@mui/icons-material/List';

import { useVideoContext } from '@/context/video';

const Layout = () => {
  const { layout, setLayout } = useVideoContext();
  const handleLayout = (
    _event: React.MouseEvent<HTMLElement>,
    newLayout: typeof layout
  ) => {
    if (newLayout !== null) {
      setLayout(newLayout);
    }
  };
  return (
    <ToggleButtonGroup
      value={layout}
      exclusive
      onChange={handleLayout}
      aria-label="layout"
      size="small"
    >
      <ToggleButton value="list" aria-label="list">
        <ListIcon />
      </ToggleButton>
      <ToggleButton value="grid" aria-label="grid">
        <GridViewIcon />
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default Layout;

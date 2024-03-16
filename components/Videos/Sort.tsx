'use client';

import React from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';

import { useVideoContext } from '@/context/video';

const Sort = () => {
  const { sort, setSort } = useVideoContext();
  const handleSorting = (
    _event: React.MouseEvent<HTMLElement>,
    newSorting: typeof sort
  ) => {
    if (newSorting !== null) {
      setSort(newSorting);
    }
  };
  return (
    <ToggleButtonGroup
      value={sort}
      exclusive
      onChange={handleSorting}
      aria-label="sorting"
      size="small"
    >
      <ToggleButton value="newest" aria-label="newest">
        Newest
      </ToggleButton>
      <ToggleButton value="oldest" aria-label="oldest">
        Oldest
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default Sort;

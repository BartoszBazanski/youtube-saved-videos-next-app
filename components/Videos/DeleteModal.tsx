'use client';

import React from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material';

type DeleteModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
};

const DeleteModal = ({ open, onClose, onSubmit }: DeleteModalProps) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogActions>
        <Button color="info" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" color="error" onClick={onSubmit}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteModal;

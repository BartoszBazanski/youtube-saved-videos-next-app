'use client';

import React from 'react';
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import parse from 'html-react-parser';

import { useVideoContext } from '@/context/video';

const VideoModal = () => {
  const { selectedVideo, setSelectedVideo } = useVideoContext();
  const handleClose = () => setSelectedVideo(null);
  return (
    <Dialog
      open={!!selectedVideo}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
    >
      <Stack direction="row" alignItems="start">
        <Box flex={1}>
          <DialogTitle>
            {selectedVideo?.title ? parse(selectedVideo?.title) : null}
          </DialogTitle>
        </Box>
        <Box paddingRight="12px">
          <IconButton
            aria-label="exit"
            onClick={handleClose}
            sx={{
              flexBasis: '40px',
              marginTop: '12px'
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </Stack>
      <DialogContent>
        <Box>
          <div className="video-responsive">
            {selectedVideo ? (
              <iframe
                width="853"
                height="480"
                src={`https://www.youtube.com/embed/${selectedVideo?.id}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Embedded youtube"
              />
            ) : null}
          </div>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default VideoModal;

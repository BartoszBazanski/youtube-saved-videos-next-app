'use client';

import React, { SyntheticEvent, useMemo } from 'react';
import {
  Box,
  Button,
  Card,
  Chip,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useIndexedDB } from 'react-indexed-db-hook';
import parse from 'html-react-parser';
import Image from 'next/image';

import { IndexedVideo } from '@/types/video';
import { useVideoContext } from '@/context/video';

type VideoCardProps = {
  data: IndexedVideo;
  isGrid?: boolean;
};

const VideoCard = ({ data, isGrid }: VideoCardProps) => {
  const { getVideos, setSelectedVideo } = useVideoContext();
  const { deleteRecord } = useIndexedDB('videos');
  const handleDelete = async (event: SyntheticEvent) => {
    event.stopPropagation();
    await deleteRecord(data.id);
    getVideos();
  };
  const theme = useTheme();
  const isSmallUp = useMediaQuery(theme.breakpoints.up('sm'));
  const isVertical = useMemo(() => !isSmallUp || isGrid, [isSmallUp, isGrid]);
  const title = useMemo(
    () => (data?.title ? parse(data.title) : ''),
    [data?.title]
  );

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        cursor: 'pointer',
        border: '1px solid transparent',
        borderRadius: '4.5px',
        transition: 'transform cubic-bezier(0.4, 0, 0.2, 1) 150ms',
        ':hover': {
          transform: 'scale(101%)',
          borderColor: 'gray'
        }
      }}
      onClick={() => setSelectedVideo(data)}
    >
      <Card
        sx={{
          width: '100%',
          height: '100%'
        }}
      >
        <Stack
          direction={isVertical ? 'column' : 'row'}
          sx={{
            width: '100%',
            height: '100%'
          }}
        >
          <Box width={isVertical ? '100%' : 200} minWidth={200}>
            <div className="video-responsive">
              <div className="video__wrapper">
                <Image
                  className="video__thumbnail"
                  src={data.thumbnail.url}
                  alt={data.title}
                  width={data.thumbnail.width}
                  height={data.thumbnail.height}
                  loading="lazy"
                />
              </div>
            </div>
          </Box>
          <Grid
            container
            flex={1}
            wrap="nowrap"
            maxWidth={isVertical ? '100%' : 'calc(100% - 200px)'}
          >
            <Grid item width="100%" maxWidth="calc(100% - 75px)">
              <Stack
                direction="column"
                justifyContent="space-between"
                padding="1rem"
                spacing={3}
              >
                <Box overflow="hidden" flexShrink={1}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      textOverflow: 'ellipsis',
                      textWrap: 'nowrap',
                      overflow: 'hidden'
                    }}
                  >
                    {title}
                  </Typography>
                </Box>
                <Stack direction="row" flexWrap={'wrap'} gap={1}>
                  <Chip
                    icon={<VisibilityIcon />}
                    label={new Intl.NumberFormat('en-US').format(
                      Number(data.viewCount)
                    )}
                    color="primary"
                  />
                  <Chip
                    icon={<CalendarMonthIcon />}
                    label={new Intl.DateTimeFormat('en-US', {
                      dateStyle: 'medium'
                    }).format(data.createdAt)}
                    style={{
                      marginLeft: 0
                    }}
                  />
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs="auto" minWidth={75}>
              <Button
                variant="contained"
                color="error"
                onClick={handleDelete}
                fullWidth
                sx={{
                  padding: 0,
                  minWidth: '100%',
                  height: '100%',
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                  ...(isVertical
                    ? {
                        borderTopRightRadius: 0
                      }
                    : {})
                }}
              >
                <DeleteIcon />
              </Button>
            </Grid>
          </Grid>
        </Stack>
      </Card>
    </Box>
  );
};

export default VideoCard;

'use client';

import React, { FormEvent, useEffect, useState } from 'react';
import { useIndexedDB } from 'react-indexed-db-hook';
import { Button, Grid, TextField } from '@mui/material';

import { useVideoContext } from '@/context/video';
import { Video, VideoStats } from '@/types/video';

type YouTubeResponse = {
  data: {
    items: Video[];
  };
};
type YouTubeStatsResponse = {
  data: {
    items: VideoStats[];
  };
};
type YouTubeErrorResponse = {
  error: {
    message: string;
  };
};

const Form = () => {
  const [quota, setQuota] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { add } = useIndexedDB('videos');
  const { videos, getVideos } = useVideoContext();
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (errorMessage) {
      setErrorMessage('');
    }

    try {
      const searchParams = new URLSearchParams({
        q: quota,
        type: 'video',
        part: 'snippet',
        resultsPerPage: '1'
      });
      const response = await fetch(`/api/search?${searchParams.toString()}`);

      if (!response.ok) {
        const { error }: YouTubeErrorResponse = await response.json();

        throw new Error(error.message);
      }

      const { data }: YouTubeResponse = await response.json();

      if (data?.items?.length) {
        const video = data.items[0];

        if (
          videos.length &&
          videos.findIndex(({ id }) => id === video.id.videoId) !== -1
        ) {
          throw new Error('This video is already added to the list!');
        }

        const statsParams = new URLSearchParams({
          id: video.id.videoId,
          part: 'statistics'
        });
        const statsResponse = await fetch(
          `/api/videos?${statsParams.toString()}`
        );

        if (!statsResponse.ok) {
          const { error }: YouTubeErrorResponse = await statsResponse.json();

          throw new Error(error.message);
        }

        const { data: statsData }: YouTubeStatsResponse =
          await statsResponse.json();

        await add({
          id: video?.id?.videoId,
          title: video?.snippet?.title,
          thumbnail: video?.snippet?.thumbnails?.high,
          viewCount: statsData?.items[0]?.statistics?.viewCount ?? '0',
          createdAt: new Date()
        });
        setQuota('');
        getVideos();
        setErrorMessage('');
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!quota) {
      setErrorMessage('');
    }
  }, [quota]);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Grid container>
          <Grid item xs>
            <TextField
              error={!!errorMessage}
              fullWidth
              id="search"
              aria-describedby="my-helper-text"
              value={quota}
              onChange={(e) => setQuota(e.target.value)}
              placeholder="Search YouTube"
              helperText={errorMessage}
              InputProps={{
                componentsProps: {
                  root: {
                    style: {
                      borderTopRightRadius: 0,
                      borderBottomRightRadius: 0
                    }
                  }
                }
              }}
            />
          </Grid>
          <Grid item xs="auto">
            <Button
              type="submit"
              disabled={loading || !quota}
              variant="contained"
              sx={{
                height: '56px',
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0
              }}
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default Form;

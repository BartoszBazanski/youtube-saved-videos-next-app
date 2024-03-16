'use client';

import React, { FormEvent, useEffect, useState } from 'react';
import { useIndexedDB } from 'react-indexed-db-hook';

import { useVideoContext } from '@/context/video';
import { Video, VideoStats } from '@/types/video';
import { Button, Grid, TextField } from '@mui/material';

type YouTubeResponse = {
  items: Video[];
};
type YouTubeStatsResponse = {
  items: VideoStats[];
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
        key: process.env.NEXT_PUBLIC_YOUTUBE_API_KEY ?? '',
        q: quota,
        type: 'video',
        part: 'snippet',
        resultsPerPage: '1'
      });
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?${searchParams.toString()}`
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result: YouTubeResponse = await response.json();

      if (result?.items?.length) {
        const video = result.items[0];

        if (
          videos.length &&
          videos.findIndex(({ id }) => id === video.id.videoId) !== -1
        ) {
          throw new Error('This video is already added to the list!');
        }

        const statsParams = new URLSearchParams({
          key: process.env.NEXT_PUBLIC_YOUTUBE_API_KEY ?? '',
          id: video.id.videoId,
          part: 'statistics'
        });
        const statsResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?${statsParams.toString()}`
        );

        if (!statsResponse.ok) {
          throw new Error('Network response was not ok');
        }

        const statsResults: YouTubeStatsResponse = await statsResponse.json();

        await add({
          id: video?.id?.videoId,
          title: video?.snippet?.title,
          thumbnail: video?.snippet?.thumbnails?.high,
          viewCount: statsResults?.items[0]?.statistics?.viewCount ?? '0',
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

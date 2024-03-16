'use client';

import React, { useMemo, useState } from 'react';
import { Button, Grid, Pagination, Stack } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useIndexedDB } from 'react-indexed-db-hook';

import { useVideoContext } from '@/context/video';
import { IndexedVideo } from '@/types/video';

import Sort from './Sort';
import VideoModal from './VideoModal';
import Layout from './Layout';
import VideoCard from './VideoCard';

const VIDEOS_PER_PAGE = 6;

const Videos = () => {
  const [page, setPage] = useState(1);
  const { videos, getVideos, layout } = useVideoContext();
  const { clear } = useIndexedDB('videos');
  const paginatedVideos = useMemo(
    () =>
      videos.reduce<IndexedVideo[][]>(
        (table, video) => {
          const lastInnerTable = table[table.length - 1];

          if (lastInnerTable.length) {
            return lastInnerTable?.length === VIDEOS_PER_PAGE
              ? [...table, [video]]
              : [
                  ...table.slice(0, table.length - 1),
                  [...lastInnerTable, video]
                ];
          }

          return [[video]];
        },
        [[]]
      ),
    [videos]
  );
  const handleChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };
  const handleClear = async () => {
    await clear();
    getVideos();
  };

  return (
    <>
      <Stack direction="row" justifyContent="space-between" my="20px">
        <Sort />
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleClear}
          >
            Clear
          </Button>
          <Layout />
        </Stack>
      </Stack>
      {layout === 'list' ? (
        <Stack spacing={2}>
          {paginatedVideos[page - 1]?.map((video) => (
            <VideoCard key={video.id} data={video} />
          ))}
        </Stack>
      ) : (
        <Grid container spacing={2}>
          {paginatedVideos[page - 1]?.map((video) => (
            <Grid item key={video.id} xs={12} sm={6} lg={4}>
              <VideoCard data={video} isGrid />
            </Grid>
          ))}
        </Grid>
      )}
      <Stack direction="row" justifyContent="center" my="20px">
        <Pagination
          count={paginatedVideos?.length}
          variant="outlined"
          shape="rounded"
          page={page}
          onChange={handleChange}
        />
      </Stack>
      <VideoModal />
    </>
  );
};

export default Videos;

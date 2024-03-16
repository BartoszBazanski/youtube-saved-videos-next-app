'use client';

import { IndexedVideo } from '@/types/video';
import {
  createContext,
  memo,
  useContext,
  PropsWithChildren,
  useState,
  useEffect,
  useCallback,
  Dispatch,
  SetStateAction
} from 'react';
import { useIndexedDB } from 'react-indexed-db-hook';

type VideoContext = {
  videos: IndexedVideo[];
  getVideos: () => void;
  sort: 'oldest' | 'newest';
  setSort: Dispatch<SetStateAction<VideoContext['sort']>>;
  selectedVideo: IndexedVideo | null;
  setSelectedVideo: Dispatch<SetStateAction<VideoContext['selectedVideo']>>;
  layout: 'grid' | 'list';
  setLayout: Dispatch<SetStateAction<VideoContext['layout']>>;
};

const Context = createContext<VideoContext>({} as VideoContext);

const VideoProvider = memo(({ children }: PropsWithChildren<{}>) => {
  const { getAll } = useIndexedDB('videos');
  const [videos, setVideos] = useState<IndexedVideo[]>([]);
  const [sort, setSort] = useState<VideoContext['sort']>('newest');
  const [selectedVideo, setSelectedVideo] = useState<IndexedVideo | null>(null);
  const [layout, setLayout] = useState<VideoContext['layout']>('list');

  const getVideos = useCallback(async () => {
    const videos: IndexedVideo[] = await getAll();
    const sortedVideo = videos.sort((aVideo, bVideo) => {
      const aDate = new Date(aVideo.createdAt);
      const bDate = new Date(bVideo.createdAt);

      return sort === 'newest'
        ? bDate.getTime() - aDate.getTime()
        : aDate.getTime() - bDate.getTime();
    });

    setVideos(sortedVideo);
  }, [getAll, sort]);

  useEffect(() => {
    getVideos();
  }, [getVideos, sort]);

  const exposed = {
    videos,
    getVideos,
    sort,
    setSort,
    selectedVideo,
    setSelectedVideo,
    layout,
    setLayout
  } as VideoContext;

  return <Context.Provider value={exposed}>{children}</Context.Provider>;
});

VideoProvider.displayName = 'VideoProvider';

export const useVideoContext = () => useContext(Context);

export default VideoProvider;

'use client';

import React, { PropsWithChildren } from 'react';
import { IndexedDB, initDB } from 'react-indexed-db-hook';

import VideoProvider from '@/context/video';

export const CONFIG = {
  name: 'MyVideos',
  version: 1,
  objectStoresMeta: [
    {
      store: 'videos',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'title', keypath: 'title', options: { unique: false } },
        { name: 'thumbnail', keypath: 'thumbnail', options: { unique: false } },
        { name: 'viewCount', keypath: 'viewCount', options: { unique: false } },
        { name: 'createdAt', keypath: 'createdAt', options: { unique: true } }
      ]
    }
  ]
};

initDB(CONFIG);

const Providers = ({ children }: PropsWithChildren<unknown>) => {
  return (
    <IndexedDB {...CONFIG}>
      <VideoProvider>{children}</VideoProvider>
    </IndexedDB>
  );
};

export default Providers;

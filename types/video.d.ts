export type VideoThumbnail = {
  height: number;
  width: number;
  url: string;
};

export type Video = {
  etag: string;
  id: { kind: string; videoId: string };
  kind: string;
  snippet: {
    channelId: string;
    channelTitle: string;
    description: string;
    liveBroadcastContent: string;
    publishTime: Date;
    publishedAt: Date;
    thumbnails: {
      default: VideoThumbnail;
      high: VideoThumbnail;
      medium: VideoThumbnail;
    };
    title: string;
  };
};

export type VideoStats = {
  etag: string;
  id: string;
  kind: string;
  statistics: {
    commentCount : string;
    favoriteCount : string;
    likeCount : string;
    viewCount : string;
  };
};

export type IndexedVideo = {
  id: Video['id']['videoId'];
  title: Video['snippet']['title'];
  thumbnail: VideoThumbnail;
  viewCount: VideoStats['statistics']['viewCount'],
  createdAt: Date;
};

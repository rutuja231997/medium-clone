export interface Post {
  id: string;
  title: string;
  content: string;
  topic: Topic[];
  topicName: string;
  publishedDate: Date;
  published?: boolean;
  author: {
    id: string;
    penName: string;
    postCount: number;
    user: {
      name: string;
      email: string;
      details: string;
    };
  };
  authorPenName: string;
  bookmarkCount: number;
  clapCount: number;
  hasLiked: boolean;

  bookmarks: {
    id: string;
    hasBookmarked: boolean;
    userId: string;
    postId: string;
  };
  claps: {
    id: string;
    hasLiked: boolean;
    userId: string;
    postId: string;
  };
}

export interface Topic {
  id: string;
  topicName: string;
  createdAt: Date;
  user: User[];
  userId: string;
  posts: Post[];
  userTopic: UserTopic[];
}

export interface UserTopic {
  id: string;
  user: User[];
  userId: string;
  topic: {
    id: string;
    topicName: string;
    createdAt: Date;
    user: User[];
    userId: string;
    posts: Post[];
    userTopic: UserTopic[];
  };
  topicId: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  penName: string;
  details: string;
  profilePic: string;
  postCount: number;
  creationDate: Date;
  posts: Post[];
  topic: Topic[];
  topics: UserTopic[];

  bookmarks: {
    id: string;
    bookmarkCount: number;
    hasBookmarked: boolean;
  };
  claps: {
    id: string;
    postCount: number;
    hasLiked: boolean;
  };
}

export interface Author {
  id: string;
  penName: string;
  user: {
    name: string;
    email: string;
    details: string;
    profilePic: string;
  };
  postCount: number;
  posts: Post[];
  createdAt: Date;
}

export interface Bookmark {
  id: string;
  user: User[];
  userId: string;
  post: {
    title: string;
    content: string;
    publishedDate: Date;
    published: boolean;
    author: {
      id: string;
      user: {
        id: string;
        name: string;
      };
    };
  };
  postId: string;
  hasBookmarked: boolean;
  bookmarkCount: number;
}

export interface Clap {
  id: string;
  userId: string;
  postId: string;
  post: {
    title: string;
    content: string;
    publishedDate: Date;
    published: boolean;
    author: {
      id: string;
      name: string;
    };
  };
  hasLiked: boolean;
  clapCount: number;
}

export interface IconProps {
  height?: string;
  width?: string;
  fill?: string;
  className?: string;
}

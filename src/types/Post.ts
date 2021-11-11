export type PostTypes = 'text' | 'poll' | 'image';

export type NewPost = {
  type: PostTypes;
  title: string;
  username: string;
  content?: string;
  tag?: string;
  poll?: {
    pollOptions: {
      option: string;
      id: string;
      votes: number;
    }[];
    totalVotes: number;
  };
  imageUrl?: string;
};

export type Post = NewPost & { date: string };
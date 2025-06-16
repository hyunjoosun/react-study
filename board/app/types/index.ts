export interface BaseUser {
  id: string;
  name: string;
  username: string;
  email: string;
  created_at: string;
}

export interface BasePost {
  id: string;
  title: string;
  content: string;
  created_at: string;
  author_id: string;
  category: string;
  thumbnail?: string;
}

export interface BaseComment {
  id: number;
  post_id: number;
  author_id: string;
  content: string;
  created_at: string;
}

// Profile
export interface Profile {
  username: string;
  name: string;
}

export type UserProfile = BaseUser & {
  post_count: number;
  comment_count: number;
}

export type Post = BasePost & {
  view_count: number;
  comment_count: number;
  like_count: number;
}

export type PostWithProfile = Post & {
  profiles: Profile;
}

export type CommentWithProfile = BaseComment & {
  profiles: Profile;
}

// Form
export type LoginForm = Pick<{
  email: string;
  password: string;
}, 'email' | 'password'>;

export type BoardWriteForm = Pick<{
  category: string;
  title: string;
  content: string;
  thumbnail: FileList | null;
}, 'category' | 'title' | 'content' | 'thumbnail'>;


export type UpdateUserProfile = Partial<Pick<UserProfile, 'username' | 'name'>>;
export type UpdatePost = Partial<Pick<Post, 'title' | 'content' | 'category' | 'thumbnail'>>;
export type UpdateComment = Partial<Pick<BaseComment, 'content'>>; 
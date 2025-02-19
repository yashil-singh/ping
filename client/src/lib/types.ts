export type UserType = {
  id: string;
  name: string;
  username: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  isPrivate: boolean;
};

export type UserSummary = Pick<
  UserType,
  "id" | "name" | "username" | "avatarUrl"
>;

export type MediaType = {
  id: string;
  type: "image" | "video";
  url: string;
};

export type PostType = {
  id: string;
  caption?: string;
  author: UserSummary;
  media: MediaType[];
  createdAt: string;
  updatedAt: string;
};

export type ChatType = {
  id: string;
  name?: string;
  isGroupChat: boolean;
  creator: UserSummary;
  members: UserSummary[];
  messages: MessageType[];
  createdAt: string;
};

export type ChatMemberType = {
  joined: string;
  chat: ChatType;
  user: UserSummary;
  addedBy: UserSummary;
};

export type MessageType = {
  id: string;
  content?: string;
  type: "TEXT" | "MEDIA" | "POST";
  isSeen: boolean;
  chatId: string;
  sender: UserSummary;
  media?: MediaType[];
  post?: PostType[];
  createdAt: string;
  updatedAt: string;
};

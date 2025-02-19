import { ChatType } from "@/lib/types.ts";

export const chats: ChatType[] = [
  {
    id: "chat1",
    isGroupChat: false,
    creator: {
      id: "user1",
      name: "Yashil",
      username: "yaashil.s",
      avatarUrl: "",
    },
    members: [
      {
        id: "user2",
        name: "Sangya",
        username: "sangyavaidya",
        avatarUrl:
          "https://i.pinimg.com/736x/79/33/06/79330661d7335f226f56d1a2f0b80c3e.jpg",
      },
    ],
    messages: [
      {
        id: "msg11",
        content: "Let's catch up later, got a meeting now.",
        type: "TEXT",
        chatId: "chat1",
        isSeen: false,
        sender: {
          id: "user2",
          name: "Sangya",
          username: "sangyavaidya",
          avatarUrl:
            "https://i.pinimg.com/736x/79/33/06/79330661d7335f226f56d1a2f0b80c3e.jpg",
        },
        media: [],
        post: [],
        createdAt: "2025-02-18T12:11:00Z",
        updatedAt: "2025-02-18T12:11:00Z",
      },
    ],
    createdAt: "2025-02-18T12:00:00Z",
  },
  {
    id: "chat2",
    isGroupChat: false,
    creator: {
      id: "user3",
      name: "nostu",
      username: "nostalgiaa",
      avatarUrl:
        "https://i.pinimg.com/736x/e4/a0/b2/e4a0b2ddbcd3026eb1e087d3e9b5e26d.jpg",
    },
    members: [
      {
        id: "user3",
        name: "nostu",
        username: "nostalgiaa",
        avatarUrl:
          "https://i.pinimg.com/736x/e4/a0/b2/e4a0b2ddbcd3026eb1e087d3e9b5e26d.jpg",
      },
    ],
    messages: [
      {
        id: "msg12",
        content: "Hey",
        type: "TEXT",
        chatId: "chat2",
        isSeen: false,
        sender: {
          id: "user3",
          name: "nostu",
          username: "nostalgiaa",
          avatarUrl:
            "https://i.pinimg.com/736x/e4/a0/b2/e4a0b2ddbcd3026eb1e087d3e9b5e26d.jpg",
        },
        media: [],
        post: [],
        createdAt: "2025-02-18T12:30:00Z",
        updatedAt: "2025-02-18T12:30:00Z",
      },
    ],
    createdAt: "2025-02-18T12:00:00Z",
  },
];

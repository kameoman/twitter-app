import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import TweetInput from "./TweetInput";
import styles from "./Feed.module.css";
import Post from "./Post";

const Feed: React.FC = () => {
  const [posts, setPosts] = useState([
    {
      id: "",
      avatar: "",
      image: "",
      text: "",
      timestamp: null,
      username: "",
    },
  ]);
  // useEffectでデータベースからデータを取得する
  useEffect(() => {
    const unSub = db
      .collection("posts")
      .orderBy("timestamp", "desc")
      // これによって投稿があるごとに処理が実装される
      .onSnapshot((snapshot) =>
        // setで各種パラメータを変更しstateを変更する
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            avatar: doc.data().avatar,
            image: doc.data().image,
            text: doc.data().text,
            timestamp: doc.data().timestamp,
            username: doc.data().username,
          }))
        )
      );
    return () => {
      unSub();
    };
    // 第二引数が空の場合は1回のみ実行される
  }, []);
  return (
    <div className={styles.feed}>
      <TweetInput />
      {posts.map((post) => (
        <Post
          key={post.id}
          postId={post.id}
          avatar={post.avatar}
          image={post.image}
          text={post.text}
          timestamp={post.timestamp}
          username={post.username}
        />
      ))}
    </div>
  );
};

export default Feed;

import React, { useState } from "react";
import styles from "./TweetInput.module.css";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { storage, db, auth } from "../firebase";
import { Avatar, Button, IconButton } from "@material-ui/core";
import firebase from "firebase/app";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";

const TweetInput = () => {
  const user = useSelector(selectUser);
  // 投稿内容をstateを使って保持する
  const [tweetImage, setTweetImage] = useState<File | null>(null);
  const [tweetMsg, setTweetMsg] = useState("");
  const onChangeImageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files![0]) {
      setTweetImage(e.target.files![0]);
      e.target.value = "";
    }
  };
  const sendTweet = (e: React.FormEvent<HTMLFormElement>) => {
    // submitボタンでサイトがリロードされないようにする
    e.preventDefault();
    if (tweetImage) {
      const S =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      // 生成したいランダムな文字数
      const N = 16;
      const randomChar = Array.from(crypto.getRandomValues(new Uint32Array(N)))
        .map((n) => S[n % S.length])
        .join("");
      const fileName = randomChar + "_" + tweetImage.name;
      const uploadTweetImg = storage.ref(`images/${fileName}`).put(tweetImage);
      uploadTweetImg.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        // 投稿画像のステイトの状況管理（今回は空）
        () => {},
        // 投稿画像のエラー発生時
        (err) => {
          alert(err.message);
          // 正常終了時
        },
        async () => {
          // 画像投稿時ファイルの名前を取得する
          await storage
            .ref("image")
            .child(fileName)
            .getDownloadURL()
            .then(
              //取得できたらデータベースへ保存する
              async (url) => {
                await db.collection("posts").add({
                  avatar: user.photoUrl,
                  image: url,
                  text: tweetMsg,
                  timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                  username: user.displayName,
                });
              }
            );
        }
      );
    } else {
      db.collection("posts").add({
        avatar: user.photoUrl,
        image: "",
        text: tweetMsg,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        username: user.displayName,
      });
    }
    // 投稿後にリセットする
    setTweetImage(null);
    setTweetMsg("");
  };
  return (
    <>
      <form onSubmit={sendTweet}>
        <div className={styles.tweet_form}>
          <Avatar
            className={styles.tweet_avatar}
            src={user.photoUrl}
            onClick={async () => {
              await auth.signOut();
            }}
          />
          <input
            className={styles.tweet_input}
            placeholder="What's happening?"
            type="text"
            autoFocus
            value={tweetMsg}
            onChange={(e) => setTweetMsg(e.target.value)}
          />
          <IconButton>
            <label>
              <AddAPhotoIcon
                className={
                  tweetImage ? styles.tweet_addIconLoaded : styles.tweet_addIcon
                }
              />
              <input 
                className={styles.tweet_hiddenIcon}
                type="file"
                onChange={onChangeImageHandler}
              />
            </label>
          </IconButton>
        </div>
        {/* ツイートのメッセージが無い場合に投稿できないようにする */}
        <Button
        type="submit"
        disabled={!tweetMsg}
        className={
          tweetMsg ? styles.tweet_sendBtn : styles.tweet_sendDisableBtn
        }>
          tweet
        </Button>
      </form>
    </>
  );
};

export default TweetInput;

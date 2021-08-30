import React, { useState, useEffect } from "react";
import styles from "./Post.module.css";
import { db } from "..//firebase";
import firebase from "firebase/app";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { Avatar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import MessageIcon from "@material-ui/icons/Message";
import SendIcon from "@material-ui/icons/Send";

// Feedから受け取れるようにする
interface PROPS {
  postId: string;
  avatar: string;
  image: string;
  text: string;
  timestamp: any;
  username: string;
}

const Post: React.FC<PROPS>= (props) => {
  return <div className={styles.post}>
    <div className={styles.post_avatar}>
      <Avatar src={props.avatar}/>
    </div>
  </div>;
};

export default Post;

import React from "react";
import { auth } from "../firebase";

const Feed = () => {
  return (
    <div>
      <button onClick={() => auth.signOut()}>logout</button>
    </div>
  );
};

export default Feed;

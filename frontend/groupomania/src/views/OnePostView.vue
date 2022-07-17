<template>
 <NavBar />
 <main>
  <section id="onePost">
   <div class="header">
    <div>
     <h1>
      Posted by: <strong>{{ post.name }}</strong>
     </h1>

     <h2>Title:</h2>
     <p v-if="basicPostStage">
      <strong>"{{ post.title }}"</strong>
     </p>
     <div class="commentUpdate" v-if="modifyPostStage">
      <textarea
       class="updateArea postTitle"
       type="text"
       :value="post.title"
       ref="title"
      />
     </div>
    </div>
    <div class="date" v-if="basicPostStage">
     <p>Created on: {{ post.creation_date }}</p>
     <p v-if="post.modify_date">Modified on: {{ post.modify_date }}</p>
    </div>
   </div>

   <div class="mainPost" v-if="basicPostStage">{{ post.message }}</div>
   <h2 v-if="modifyPostStage">Message:</h2>
   <div class="commentUpdate" v-if="modifyPostStage">
    <textarea
     class="updateArea message"
     type="text"
     :value="post.message"
     ref="message"
    />
   </div>
   <div class="postButtons" v-if="postOwnership()">
    <button class="bodyButton" v-if="basicPostStage" @click="modifyPostState()">
     Modify Post
    </button>
    <button class="bodyButton" v-if="modifyPostStage" @click="updatePost()">
     Submit
    </button>
    <button class="bodyButton" v-if="deletePostStage" @click="deletePost()">
     Confirm Delete
    </button>
    <button class="bodyButton" v-if="basicPostStage" @click="deletePostState()">
     Delete Post
    </button>
    <button
     class="bodyButton"
     v-if="modifyPostStage || deletePostStage"
     @click="resetPostState()"
    >
     Cancel
    </button>
   </div>

   <div class="postButtons mediaButtons" v-if="modifyPostStage">
    <button
     class="bodyButton"
     v-if="(post.media != null) & showImage"
     @click="deleteImage()"
    >
     Delete image
    </button>
    <p v-if="(post.media != null) & showImage">Or change it</p>
    <p v-if="post.media == null || !showImage">Add an image</p>
    <input
     v-if="modifyPostStage"
     id="file"
     type="file"
     accept="image/png, image/jpg, image/gif, image/jpeg"
     @change="getFile()"
     ref="file"
    />
   </div>
   <img
    class="media"
    v-if="(post.media != null) & showImage & !file"
    :src="post.media"
   />
   <img v-if="file" class="media" :src="fileSource" />
  </section>
  <section id="comments">
   <p>Comments</p>
   <textarea cols="40" id="comment" type="text" v-model="comment" />

   <button id="postComment" class="bodyButton" v-on:click="sendComment">
    Post Comment
   </button>
   <ul>
    <li class="oneComment" v-for="comment in comments" :key="comment.commentid">
     <div class="commentContent">
      <div class="commentHeader">
       <p>{{ comment.name }}</p>

       <div class="date">
        <p>Created on: {{ comment.creation_date }}</p>
        <p v-if="comment.modify_date">Modified on: {{ comment.modify_date }}</p>
       </div>
      </div>
      <p
       class="commentText"
       v-if="
        basicCommentStage ||
        deleteCommentStage ||
        modifyCommentStage & (commentFocus != comment.commentid)
       "
      >
       {{ comment.comment }}
      </p>
      <div
       class="commentUpdate"
       v-if="modifyCommentStage & (commentFocus === comment.commentid)"
      >
       <textarea
        class="updateArea"
        type="text"
        :value="comment.comment"
        ref="updatedComment"
       />
      </div>
     </div>
     <div class="commentModifier">
      <button
       class="bodyButton"
       v-if="commentOwnership(comment.userid) & basicCommentStage"
       @click="modifyCommentState(comment.commentid)"
      >
       Modify
      </button>
      <button
       class="bodyButton"
       v-if="modifyCommentStage & (commentFocus === comment.commentid)"
       @click="updateComment(comment.commentid)"
      >
       Confirm Update
      </button>

      <button
       class="bodyButton"
       v-if="deleteCommentStage & (commentFocus === comment.commentid)"
       @click="deleteComment(comment.commentid)"
      >
       Confirm Delete
      </button>

      <button
       class="bodyButton"
       v-if="
        (commentOwnership(comment.userid) || postOwnership()) &
        basicCommentStage
       "
       @click="deleteCommentState(comment.commentid)"
      >
       Delete
      </button>
      <button
       class="bodyButton"
       v-if="
        (modifyCommentStage || deleteCommentStage) &
        (commentFocus === comment.commentid)
       "
       @click="resetCommentState()"
      >
       Cancel
      </button>
     </div>
    </li>
   </ul>
  </section>
 </main>
</template>

<script>
import NavBar from "@/components/NaviBar.vue";

export default {
 data() {
  return {
   post: [],
   comments: [],
   comment: "",
   postOwner: "",
   commentOwner: "",
   editPostMode: false,
   basicPostStage: true,
   modifyPostStage: false,
   deletePostStage: false,
   showImage: true,
   deleteImageState: false,
   file: null,
   fileSource: "",
   editCommentMode: false,
   basicCommentStage: true,
   modifyCommentStage: false,
   deleteCommentStage: false,
   commentFocus: "",
  };
 },
 methods: {
  modifyPostState() {
   this.basicPostStage = false;
   this.modifyPostStage = true;
   this.editPostMode = true;
  },
  deletePostState() {
   this.basicPostStage = false;
   this.modifyPostStage = false;
   this.deletePostStage = true;
  },
  resetPostState() {
   this.editPostMode = false;
   this.basicPostStage = true;
   this.modifyPostStage = false;
   this.deletePostStage = false;
   this.showImage = true;
   this.deleteImageState = false;
   this.file = null;
   this.fileSource = null;
  },
  deleteImage() {
   this.showImage = false;
   this.deleteImageState = true;
  },
  modifyCommentState(commentid) {
   this.basicCommentStage = false;
   this.modifyCommentStage = true;
   this.editCommentMode = true;
   this.commentFocus = commentid;
  },
  deleteCommentState(commentid) {
   this.basicCommentStage = false;
   this.modifyCommentStage = false;
   this.deleteCommentStage = true;
   this.commentFocus = commentid;
  },
  resetCommentState() {
   this.editCommentMode = false;
   this.basicCommentStage = true;
   this.modifyCommentStage = false;
   this.deleteCommentStage = false;
   this.commentFocus = "";
  },
  postOwnership() {
   if (this.post.userid === JSON.parse(localStorage.getItem("user")).userId) {
    return true;
   }
  },
  commentOwnership(userid) {
   if (userid === JSON.parse(localStorage.getItem("user")).userId) {
    return true;
   }
  },
  getPost() {
   const idPost = document.location.href.split("/").pop();
   console.log(idPost);
   const requestOptions = {
    method: "GET",
    headers: {
     "Content-Type": "application/json",
     Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
    },
   };
   fetch("http://localhost:3000/api/posts/" + idPost, requestOptions)
    .then((response) => {
     return response
      .json()

      .then((data) => {
       console.log(data);
       this.post = data.postData[0];
       this.comments = data.commentsData;
       console.log(this.post);
      });
    })

    .catch((error) => {
     console.error("There was an error!", error);
    });
  },
  deletePost() {
   const requestOptions = {
    method: "DELETE",
    headers: {
     "Content-Type": "application/json",
     Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
    },
   };

   fetch("http://localhost:3000/api/posts/" + this.post.postid, requestOptions)
    .then((response) => {
     return response
      .json()

      .then(() => {
       if (response.ok) {
        this.$router.push("/posts");
       }
      });
    })

    .catch((error) => {
     console.error("There was an error!", error);
    });
  },
  getFile() {
   this.file = this.$refs.file.files[0];
   this.fileSource = URL.createObjectURL(this.$refs.file.files[0]);
  },
  updatePost() {
   let postForm = [];
   let requestOptions = {};
   let post = {};

   if (this.file != null) {
    post = JSON.stringify({
     title: this.$refs.title.value,
     message: this.$refs.message.value,
    });
    postForm = new FormData();
    postForm.set("file", this.file);
    postForm.set("post", post);
    console.log(postForm);

    requestOptions = {
     method: "PUT",
     headers: {
      // "Content-Type": "undefined",
      Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
     },
     body: postForm,
    };
   } else {
    if (this.deleteImageState & !this.file) {
     postForm = {
      title: this.$refs.title.value,
      message: this.$refs.message.value,
      media: null,
     };
    } else if (!this.deleteImageState) {
     postForm = {
      title: this.$refs.title.value,
      message: this.$refs.message.value,
      media: true,
     };
    }
    requestOptions = {
     method: "PUT",
     headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
     },
     body: JSON.stringify(postForm),
    };
   }

   fetch("http://localhost:3000/api/posts/" + this.post.postid, requestOptions)
    .then((response) => {
     return response
      .json()

      .then((data) => {
       console.log(data);
       if (response.ok) {
        location.reload();
       }
      });
    })

    .catch((error) => {
     console.error("There was an error!", error);
    });
  },
  sendComment() {
   const postForm = {
    postId: this.post.postid,
    comment: this.comment,
   };
   const requestOptions = {
    method: "POST",
    headers: {
     "Content-Type": "application/json",
     Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
    },
    body: JSON.stringify(postForm),
   };

   fetch("http://localhost:3000/api/comments", requestOptions)
    .then((response) => {
     return response
      .json()

      .then((data) => {
       console.log(data);
       if (response.ok) {
        location.reload();
       }
      });
    })

    .catch((error) => {
     console.error("There was an error!", error);
    });
  },
  deleteComment(commentid) {
   console.log(commentid);

   const requestOptions = {
    method: "DELETE",
    headers: {
     "Content-Type": "application/json",
     Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
    },
   };

   fetch("http://localhost:3000/api/comments/" + commentid, requestOptions)
    .then((response) => {
     return response
      .json()

      .then((data) => {
       console.log(data);
       location.reload();
      });
    })

    .catch((error) => {
     console.error("There was an error!", error);
    });
  },
  updateComment(commentid) {
   const newComment = this.$refs.updatedComment[0].value;
   console.log("here we are");
   console.log(commentid);
   console.log(newComment);
   const postForm = {
    comment: newComment,
   };
   const requestOptions = {
    method: "PUT",
    headers: {
     "Content-Type": "application/json",
     Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
    },
    body: JSON.stringify(postForm),
   };

   fetch("http://localhost:3000/api/comments/" + commentid, requestOptions)
    .then((response) => {
     return response
      .json()

      .then((data) => {
       console.log(data);
       if (response.ok) {
        location.reload();
       }
      });
    })

    .catch((error) => {
     console.error("There was an error!", error);
    });
  },
  scrollToTop() {
   window.scrollTo({
    top: 0,
    behavior: "smooth",
   });
  },
 },

 components: {
  NavBar,
 },
 created() {
  this.getPost();
  this.scrollToTop();
 },
};
</script>

<style lang="scss" scoped>
#onePost {
 padding: 7rem 0.5rem 1rem 0.5rem;
 width: 80%;
 margin: auto;
 & img {
  padding-top: 1rem;
 }
}

h2 {
 margin-bottom: 0;
}
.mainPost {
 white-space: pre-line;
 background-color: white;
 padding: 2rem;
 border-radius: 0.5rem;
 text-align: justify;
 text-justify: inter-character;
 margin-bottom: 1rem;
}
.header {
 margin-bottom: 1rem;
 & h1 {
  margin: 0;
 }
}
.date p {
 font-size: 0.7rem;
}
.media {
 max-width: 100%;
 height: auto;
 padding: 1rem 0;
}
#comments {
 background-color: white;
 padding: 1rem 0.5rem;
 width: 80%;
 margin: auto;
}
#comment {
 width: 90%;
}
#postComment {
 display: block;
 height: 2.5rem;
 padding: 0.5rem;
 margin: auto;
 margin-top: 1rem;
 margin-bottom: 3rem;
}
.oneComment {
 margin: auto;
 padding: 0.5rem;
 & .date p {
  padding: 0;
  padding-right: 0.5rem;
  margin: 0;
 }
}
.commentContent {
 box-shadow: 1px 1px 10px 1px grey;
 border-radius: 0.5rem;
}
.commentHeader {
 display: flex;
 flex-flow: row wrap;
 justify-content: space-between;
 text-align: center;
 padding: 0.5rem;
 border-bottom: 1px solid lightgrey;
}
.commentText {
 white-space: pre-line;
 overflow-wrap: break-word;
 text-align: justify;
 text-justify: inter-character;

 padding: 1rem;
 margin: 0;
}
.commentUpdate {
 height: 100%;
 margin: 0rem 1rem 1.2rem 0;
 padding-bottom: 0;
 & :focus {
  outline: none;
 }
}
.updateArea {
 font-family: inherit;
 white-space: pre-line;
 overflow-wrap: break-word;
 text-align: justify;
 text-justify: inter-character;
 margin: 0;
 margin-bottom: -1.5rem;
 width: 98%;
 border: none;
 border-radius: 0.5rem;
 resize: none;
 display: block;
 padding: 1rem;
}
.postTitle {
 font-family: inherit;
 white-space: pre-line;
 overflow-wrap: break-word;
 text-align: justify;
 text-justify: inter-character;
 margin: 0.5rem 0 0 0;
 background-color: white;
 padding-bottom: 0;
 height: 2rem;
 z-index: 99;
}
.message {
 margin: 0.5rem 0 0.2rem;
 resize: vertical;
}
.commentModifier {
 display: flex;
 flex-direction: row;
 justify-content: flex-start;
 margin-top: -0.5rem;
 & button {
  height: 1.5rem;
  padding: 0 0.5rem;
  font-size: 0.7rem;
 }
}
.postButtons {
 display: flex;
 flex-flow: row wrap;
 justify-content: flex-end;
 margin-bottom: 0;
 & button {
  height: 1.5rem;
  padding: 0 0.5rem;
  margin-top: 0;
  font-size: 0.7rem;
  border-radius: 0.5rem;
  background-color: #0d1f3b;
  color: white;
 }
}
.mediaButtons {
 display: flex;
 flex-direction: column;
 align-items: flex-end;
 margin-top: 1rem;
 & input {
  width: 10.5rem;
 }
}
@media screen and (max-width: 768px) {
 #onePost {
  width: 90%;
  padding: 5rem 0.5rem 1rem 0.5rem;
 }
 .header h2 {
  margin-top: 0;
 }
}
</style>

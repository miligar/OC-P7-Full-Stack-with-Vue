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
     <p>
      <strong>{{ post.title }}</strong>
     </p>
    </div>
    <div class="date">
     <p>Created on:{{ post.creation_date }}</p>
     <p v-if="post.modify_date">Modified on: {{ post.modify_date }}</p>
    </div>
   </div>

   <div class="mainPost">{{ post.message }}</div>
   <div class="modifier">
    <button class="bodyButton" @click="modifyPost">Modify Post</button>
   </div>
   <img id="media" v-if="post.media" :src="post.media" />
  </section>
  <section id="comments">
   <p>Comments</p>
   <textarea cols="40" id="comment" type="text" v-model="comment" />

   <button id="postComment" class="bodyButton" v-on:click="sendComment">
    Post Comment
   </button>
   <ul>
    <li class="oneComment" v-for="comment in comments" :key="comment.commentid">
     <div class="commentHeader">
      <p>{{ comment.name }}</p>
      <div>
       <p>Created on:{{ comment.creation_date }}</p>
       <p v-if="comment.modify_date">Modified on: {{ comment.modify_date }}</p>
      </div>
     </div>
     <p class="commentText">{{ comment.comment }}</p>
    </li>
   </ul>
  </section>
 </main>
</template>

<script>
import NavBar from "@/components/NaviBar.vue";

export default {
 data() {
  return { post: [], comments: [], comment: "" };
 },
 methods: {
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

  sendComment() {
   const postForm = {
    userId: JSON.parse(localStorage.getItem("user")).userId,
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
       location.reload();
      });
    })

    .catch((error) => {
     console.error("There was an error!", error);
    });
  },
 },

 components: {
  NavBar,
 },
 created() {
  this.getPost();
 },
};
</script>

<style lang="scss">
#onePost {
 padding: 10rem 0.5rem 3rem 0.5rem;
 width: 80%;
 margin: auto;
}

// section {
// }
.mainPost {
 background-color: white;
 padding: 2rem;
}
#media {
 max-width: 100%;
 height: auto;
 padding: 3rem 0;
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
 margin-left: 45%;
 position: center;
 margin-top: 1rem;
 margin-bottom: 1rem;
}
.commentHeader {
 display: flex;
 flex-direction: row;
 justify-content: space-between;
}
.commentText {
 text-align: left;
}
.modifier {
 text-align: right;
 margin: 1rem 0;
}
</style>

<template>
 <NavBar />
 <main>
  <section id="allPosts">
   <h1 id="welcome">Welcome {{ name }}!</h1>
   <ul>
    <li
     class="onePost"
     v-for="post in posts"
     :key="post.postid"
     :class="readCheck(post)"
    >
     <router-link class="routerlink" :to="{ path: 'posts/' + post.postid }">
      <div class="postHeader">
       <div class="postedBy">
        <p>Posted by:</p>
        <p>
         <strong>{{ post.name }}</strong>
        </p>
       </div>
       <div class="date">
        <p>Created on:{{ post.creation_date }}</p>
        <p v-if="post.modify_date">Modified on: {{ post.modify_date }}</p>
       </div>
      </div>
      <div class="title">
       <strong>{{ post.title }}</strong>
      </div>
      <div class="msgArea">{{ post.message }}</div>
     </router-link>
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
   posts: [],
   name: JSON.parse(localStorage.getItem("user")).name,
  };
 },
 methods: {
  readCheck(post) {
   const check = post.readby.find(
    (el) => el == JSON.parse(localStorage.getItem("user")).userId
   );
   if (!check) {
    return "unread";
   }
  },
  getPosts() {
   const requestOptions = {
    method: "GET",
    headers: {
     "Content-Type": "application/json",
     Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
    },
   };
   fetch("http://localhost:3000/api/posts", requestOptions)
    .then((response) => {
     return response
      .json()

      .then((data) => {
       console.log(data);
       this.posts = data;
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
  this.getPosts();
 },
};
</script>

<style lang="scss" scoped>
#allPosts {
 width: 80%;
 margin: auto;
 margin-top: 8rem;
 background-color: white;
 display: flex;
 flex-direction: column;
}
#welcome {
 font-size: 2rem;
}
.onePost {
 border: 2px solid #0d1f3b;
 border-radius: 1.1rem;
 margin: 2rem 0;
}
.unread {
 border: 2px solid #00b3ba;
 box-shadow: 1px 1px 10px 1px #00b3ba;

 border-radius: 1.1rem;
 margin-right: -1rem;
 margin-left: -1rem;
}
ul {
 margin: 1rem;
 margin-top: -1rem;
 padding: 0 1rem;
}

.routerlink {
 color: black;
 text-decoration: none;
}

.postHeader {
 display: flex;
 flex-direction: row;
 justify-content: space-between;
 background-color: #fed1d3;
 padding: 0 1rem;
 border-radius: 1rem 1rem 0 0;
}

.date {
 font-size: 0.7rem;
 padding: 0.5rem;
}
.title {
 padding: 1rem 0;
 color: black;
 background-color: #c3d2e5;
 border-top: 1px solid #0d1f3b;
 border-bottom: 1px solid #0d1f3b;
}
.msgArea {
 padding: 0rem 1rem;
 margin: 1rem 0;
 text-align: justify;
 text-justify: inter-character;
 display: -webkit-box;
 -webkit-box-orient: vertical;
 -webkit-line-clamp: 4;
 overflow: hidden;
}
@media screen and (max-width: 768px) {
 #allPosts {
  width: 95%;
  margin-top: 4rem;
 }
 #welcome {
  font-size: 1.5rem;
  padding: 0.5rem;
  margin: 0.5rem;
 }

 .onePost {
  margin: 1.5rem 0;
 }
 .postHeader {
  display: flex;
  flex-direction: column;
 }
 .postedBy {
  margin: auto;
  display: flex;
  flex-flow: row wrap;
 }
 .date {
  padding: 0 0 0.5rem 0;
  & p {
   font-size: 0.5rem;
   padding: 0;
  }
 }
 .title {
  padding: 0.5rem;
  font-size: 0.7rem;
 }
 .msgArea {
  font-size: 0.7rem;
  padding: 0 0.5rem;
  margin: 0.5rem 0;
 }
 ul {
  padding: 0.5rem;
  margin: 0;
  margin-top: -2.5rem;
 }
}
</style>

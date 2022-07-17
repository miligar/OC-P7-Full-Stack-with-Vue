<template>
 <nav id="navbar">
  <div id="content">
   <div class="button-posts">
    <button v-show="postsView.posts">
     <router-link to="/posts">All posts</router-link>
    </button>

    <button v-show="postsView.createPost">
     <router-link to="/createPost">Create a post</router-link>
    </button>
   </div>
   <img class="toplogo" alt="Logo" src="../assets/top-logo.svg" />
   <div class="button-user">
    <button v-if="postsView.profile">
     <router-link to="/profile">Profile</router-link>
    </button>
    <button @click="logOut">Log out</button>
   </div>
  </div>
  <div id="divider"></div>
 </nav>
</template>
<script>
export default {
 name: "NavBar",
 data() {
  return { postsView: { posts: true, createPost: true, profile: true } };
 },
 methods: {
  getLoc() {
   const location = document.location.href.split("/").pop();
   this.postsView[location] = false;
  },
  logOut() {
   localStorage.clear();
   this.$router.push("/");
  },
 },
 created() {
  this.getLoc();
 },
};
</script>

<style lang="scss" scoped>
#navbar {
 width: 100%;
 position: fixed;
 background-color: white;

 top: 0;
}
#content {
 width: 80%;
 height: 1rem;
 margin: auto;

 margin-top: 0;
 margin-bottom: 0;
 display: flex;
 flex-direction: row;
 justify-content: space-between;
 align-items: center;
 padding: 2rem 0.5rem;
}

#content div button {
 border: 2px solid #fa1818;
 background-color: #fed1d3;
 color: #0d1f3b;
 font-weight: bold;
 border-radius: 0.5rem;
 display: flex;
 flex-direction: row;
 justify-content: center;
 align-items: center;

 width: 7rem;
 height: 2rem;

 &:hover {
  border: 2px solid #0d1f3b;
  cursor: pointer;
 }
}
.button-posts {
 display: flex;
 flex-direction: row;
 justify-content: space-between;
 align-items: center;
 text-align: center;
 padding: 2rem;
 & button {
  margin-right: 1rem;
 }
}
.button-user {
 display: flex;
 flex-direction: row;
 justify-content: space-between;
 align-items: center;
 text-align: center;
 padding: 2rem;
 & button {
  margin-left: 1rem;
 }
}
#navbar img {
 position: absolute;
 margin: auto;
 left: 0;
 right: 0;
 height: 3rem;
 z-index: 1;
}
#divider {
 height: 1rem;
 width: 100%;
 background-color: #0d1f3b;
}
@media screen and (min-width: 768px) and (max-width: 992px) {
 #content {
  width: 90%;
  height: 1rem;
 }
}
@media screen and (max-width: 768px) {
 .toplogo {
  display: none;
 }
 #divider {
  height: 0.5rem;
 }
 #content {
  width: 100%;
  height: auto;
  padding: 0;
 }
 #content div button {
  min-width: 5rem;
  height: 1.6rem;
  font-size: 0.6rem;
  margin: 0;
  margin-bottom: 0.2rem;
  padding: 0;
 }
 a {
  width: 40%;
 }
 .button-posts {
  width: 50%;
  justify-content: space-around;
  flex-wrap: wrap;
  padding: 0.1rem 1%;
  & button {
   margin-right: 0;
  }
 }
 .button-user {
  width: 50%;
  justify-content: space-around;
  flex-wrap: wrap;
  padding: 0.1rem 1%;
  & button {
   margin-left: 0;
  }
 }
}
</style>

<template>
 <nav id="navbar">
  <div id="content">
   <div class="button-posts">
    <router-link to="/posts">
     <button v-show="postsView.posts">All posts</button></router-link
    >
    <router-link to="/createPost">
     <button v-show="postsView.createPost">Create a post</button></router-link
    >
   </div>
   <img class="toplogo" alt="Logo" src="../assets/top-logo.svg" />
   <div class="button-user">
    <router-link to="/profile">
     <button v-if="postsView.profile">Profile</button></router-link
    >
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
<style lang="scss">
#navbar {
 width: 100%;
 position: fixed;
 background-color: white;

 top: 0;
}
#content {
 width: 80%;
 height: 3rem;
 margin: auto;

 margin-top: 0;
 margin-bottom: 0;
 display: flex;
 flex-direction: row;
 justify-content: space-between;
 padding: 2rem 0.5rem;
}

#content div button {
 border: 2px solid #fa1818;
 background-color: #fed1d3;
 color: #0d1f3b;
 // padding: 0px;
 border-radius: 0.5rem;
 display: flex;
 flex-direction: row;
 justify-content: center;
 align-items: center;

 width: 7rem;
 height: 3rem;

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
 margin-top: -1rem;
 left: 0;
 right: 0;
 height: 5rem;
 z-index: 1;
}
#divider {
 height: 1rem;
 width: 100%;
 background-color: #0d1f3b;
}
</style>

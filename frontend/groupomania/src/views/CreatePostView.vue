<template>
 <NavBar />
 <main>
  <section id="createPost">
   <h1><strong>CREATE A POST</strong></h1>
   <p>Title</p>
   <input id="title" type="text" v-model="title" />
   <p>Message</p>
   <textarea cols="40" id="message" type="text" v-model="message" />
   <p>Want to include an image? (png, jpg, jpeg, gif)</p>
   <input
    id="file"
    type="file"
    accept="image/png, image/jpg, image/gif, image/jpeg"
    @change="getFile()"
    ref="file"
   />
   <button class="bodyButton" v-on:click="sendPost">Send post</button>
  </section>
 </main>
</template>

<script>
import NavBar from "@/components/NaviBar.vue";
export default {
 data() {
  return {
   title: "",
   message: "",
   media: "",
   file: null,
  };
 },
 methods: {
  getFile() {
   this.file = this.$refs.file.files[0];
  },
  sendPost() {
   let postForm = [];
   let requestOptions = {};
   let post = {};

   if (this.file != null) {
    console.log(
     JSON.stringify(JSON.parse(localStorage.getItem("user")).userId)
    );

    post = JSON.stringify({
     userId: JSON.parse(localStorage.getItem("user")).userId,
     title: this.title,
     message: this.message,
    });
    postForm = new FormData();
    postForm.set("file", this.file);
    postForm.set("post", post);
    console.log(postForm);

    requestOptions = {
     method: "POST",
     headers: {
      // "Content-Type": "undefined",
      Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
     },
     body: postForm,
    };
   } else {
    postForm = {
     userId: JSON.parse(localStorage.getItem("user")).userId,
     title: this.title,
     message: this.message,
    };
    requestOptions = {
     method: "POST",
     headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
     },
     body: JSON.stringify(postForm),
    };
   }

   fetch("http://localhost:3000/api/posts", requestOptions)
    .then((response) => {
     return response
      .json()

      .then((data) => {
       console.log(data);
       if (response.ok) {
        this.$router.push("/posts");
       }
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
};
</script>

<style lang="scss">
#createPost {
 padding: 10rem 0.5rem;

 button {
  display: block;
  margin: auto;
 }

 #title {
  width: 20rem;
 }
 #message {
  width: 30rem;
  height: 20rem;
  border: none;
  display: inline;
  font-family: inherit;
  font-size: inherit;
  padding: none;
  width: auto;
 }

 #file {
  display: block;
  margin-left: 45%;
  margin-bottom: 1rem;

  position: center;
 }
}
</style>

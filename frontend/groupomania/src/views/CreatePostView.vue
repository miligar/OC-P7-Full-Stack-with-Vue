<template>
 <NavBar />
 <main>
  <section id="createPost">
   <h1><strong>CREATE A POST</strong></h1>
   <h2>Title</h2>
   <input id="title" type="text" v-model="title" maxlength="100" />
   <p class="msgLength">{{ calculateLength("title", 100) }}</p>
   <h2>Message</h2>
   <textarea id="message" type="text" v-model="message" maxlength="5000" />
   <p class="msgLength">{{ calculateLength("message", 5000) }}</p>
   <p>Want to include an image? (png, jpg, jpeg, gif)</p>
   <div id="file">
    <input
     type="file"
     accept="image/png, image/jpg, image/gif, image/jpeg"
     @change="getFile()"
     ref="file"
    />
   </div>
   <img v-if="file" class="pict" :src="fileSource" />

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
   fileSource: "",
  };
 },

 methods: {
  calculateLength(para, maxLength) {
   let count = eval(`this.${para}`).length;
   let charLeft = maxLength - count;
   let msgLength = charLeft.toString() + "/" + maxLength + " Characters left";

   return msgLength;
  },
  getFile() {
   this.file = this.$refs.file.files[0];
   this.fileSource = URL.createObjectURL(this.$refs.file.files[0]);
  },
  sendPost() {
   let postForm = [];
   let requestOptions = {};
   let post = {};

   if (this.file != null) {
    post = JSON.stringify({
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

<style lang="scss" scoped>
#createPost {
 width: 50%;
 margin: auto;
 margin-top: 7rem;
 //  padding: 1rem 0 1rem 0;
 //  margin-bottom: 5rem;
 button {
  display: block;
  margin: auto;
 }
 h1 {
  margin-bottom: 0;
 }
 #title {
  width: 90%;
  border-radius: 0.5rem;
  outline: none;
  border: 1px solid black;
 }
 textarea {
  width: 90%;
  height: 10rem;
  border: none;
  font-family: Avenir, Helveti ca, Arial, sans-serif;
  font-size: inherit;
  padding: none;
  border-radius: 0.5rem;
  outline: none;
  border: 1px solid black;
 }
 .msgLength {
  width: 90%;
  margin: auto;
  font-size: 0.7rem;
  text-align: right;
 }
 #file {
  width: 90%;
  // justify-content: center;
  margin: auto;
  margin-top: 1rem;

  margin-bottom: 1rem;
  & input {
   width: auto;
  }
 }
}
.pict {
 display: block;
 max-width: 90%;
 height: auto;
 padding: 1rem 0;
 margin: auto;
}
@media screen and (max-width: 768px) {
 #createPost {
  width: 90%;
  margin: auto;
  margin-top: 5rem;
 }
 input,
 textarea {
  width: 100%;
 }
}
</style>

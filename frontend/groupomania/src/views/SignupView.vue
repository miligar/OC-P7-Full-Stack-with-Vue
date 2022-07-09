<template>
 <main>
  <div id="signup">
   <nav>
    <router-link to="/">
     <img alt="Logo" src="../assets/icon-above-font.svg"
    /></router-link>
   </nav>
   <router-view />
  </div>
  <div id="signUpData">
   <h2>Name</h2>
   <input type="text" v-model="name" />
   <h2>Email</h2>
   <input type="text" v-model="email" />
   <h2>Password</h2>
   <input type="password" v-model="password" />
   <h2>Bio</h2>
   <input type="text" v-model="bio" />
   <div>
    <button class="bodyButton" v-on:click="signUp">Sign Up</button>
   </div>
  </div>
 </main>
</template>

<script>
export default {
 data() {
  return {
   name: "",
   email: "",
   password: "",
   bio: "",
  };
 },
 methods: {
  signUp() {
   const signUpForm = {
    name: this.name,
    email: this.email,
    password: this.password,
    bio: this.bio,
   };
   const requestOptions = {
    method: "POST",
    headers: {
     "Content-Type": "application/json",
    },
    body: JSON.stringify(signUpForm),
   };
   fetch("http://localhost:3000/api/auth/signup", requestOptions)
    .then((response) => {
     return response
      .json()

      .then((data) => {
       console.log(data);
       if (response.ok) {
        this.$router.push("/");
       }
      });
    })
    .catch((error) => {
     console.error("There was an error!", error);
    });
  },
 },
};
</script>

<style>
/* main {
 height: 95vh;
} */
#signUpData {
 margin-bottom: 10rem;
}
.bodyButton {
 margin-top: 1rem;
}
</style>

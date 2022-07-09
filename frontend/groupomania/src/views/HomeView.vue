<template>
 <main>
  <div class="home">
   <img alt="Logo" src="../assets/icon-above-font.svg" />
   <!-- <LoginComp msg="Welcome to Groupomania" /> -->
   <h1>Welcome to Groupomania!</h1>
   <h2>Email</h2>
   <input type="text" v-model="email" />
   <h2>Password</h2>
   <p>
    <input type="password" v-model="password" />
   </p>
   <button class="bodyButton" v-on:click="logIn">Log In</button>

   <nav>
    <p>Or create a new account</p>
    <router-link to="/signup">
     <button class="bodyButton" v-on:click="signUp">
      Sign Up
     </button></router-link
    >
   </nav>
   <router-view />
  </div>
 </main>
</template>

<script>
export default {
 data() {
  return {
   email: "",
   password: "",
  };
 },
 methods: {
  logIn() {
   const logInForm = {
    email: this.email,
    password: this.password,
   };
   const requestOptions = {
    method: "POST",
    headers: {
     "Content-Type": "application/json",
    },
    body: JSON.stringify(logInForm),
   };
   fetch("http://localhost:3000/api/auth/login", requestOptions)
    .then((response) => {
     return response
      .json()

      .then((data) => {
       console.log(data);
       localStorage.setItem("user", JSON.stringify(data));
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
};
</script>

<style>
main {
 height: 100%;
}
img {
 /* max-height: 30vh; */
 max-width: 30rem;
}
.home {
 margin-bottom: 8rem;
}
</style>

<!--
<script>
// @ is an alias to /src
import LoginComp from "@/components/LoginComp.vue";

export default {
 name: "HomeView",
 components: {
  LoginComp,
 },
};
</script>
-->

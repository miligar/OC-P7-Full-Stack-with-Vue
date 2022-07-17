<template>
 <main>
  <div id="home">
   <div id="logo">
    <img alt="Logo" src="../assets/icon-above-font.svg" />
   </div>

   <div id="welcome">
    <!-- <LoginComp msg="Welcome to Groupomania" /> -->
    <h1>Welcome to Groupomania!</h1>
    <h2>Email</h2>
    <input type="text" v-model="email" />
    <h2>Password</h2>

    <input type="password" v-model="password" />
    <p class="serverMessage">{{ serverMessage }}</p>
    <div>
     <button class="bodyButton" v-on:click="logIn">Log In</button>
    </div>
    <nav id="toSignUp">
     <p>Or create a new account</p>
     <router-link to="/signup">
      <button class="bodyButton" v-on:click="signUp">
       Sign Up
      </button></router-link
     >
    </nav>
   </div>
  </div>
 </main>
</template>

<script>
export default {
 data() {
  return {
   email: "",
   password: "",
   serverMessage: " ",
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

       if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data));
        this.$router.push("/posts");
       } else {
        this.serverMessage = data;
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

<style lang="scss" scoped>
#home {
 height: 100%;
 display: flex;
 flex-flow: row wrap;
 justify-content: space-around;
 margin-top: 2rem;
}

#logo {
 width: 30%;
 margin: auto;
 margin-top: 3rem;
 padding: 1rem;
}

#welcome {
 width: 40%;
 margin: auto;
 padding: 1rem;
}
#toSignUp {
 margin-top: 2rem;
}
.serverMessage {
 color: red;
}

@media screen and (max-width: 768px) {
 #home {
  display: flex;
  flex-direction: column;
  margin-top: 0;
 }
 #welcome {
  width: 80%;
  margin: auto;
  padding: 1rem;
  padding-top: 0;
 }
 #logo {
  width: 50%;
  margin: auto;
  padding-top: 0;
 }
 #welcome {
 }
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

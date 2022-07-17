<template>
 <main>
  <div id="signUp">
   <div id="logo">
    <nav>
     <router-link to="/">
      <img alt="Logo" src="../assets/icon-above-font.svg"
     /></router-link>
    </nav>
   </div>
   <div id="signUpData">
    <h2>Name</h2>
    <input type="text" v-model="name" maxlength="100" />
    <h2>Email</h2>
    <input
     type="text"
     v-model="email"
     maxlength="100"
     v-on:blur="validateEmail()"
    />
    <p v-show="passConditions.email">Not a valid email!</p>
    <h2>Password</h2>
    <input class="password" type="password" v-model="password" maxlength="20" />
    <div class="conditions">
     <p :class="passConditions.minLength">Minimum length 8</p>
     <p :class="passConditions.maxLength">Maximum length 20</p>
     <p :class="passConditions.uppercase">Must have uppercase letters</p>
     <p :class="passConditions.lowercase">Must have lowercase letters</p>
     <p :class="passConditions.digits">Must have at least 2 digits</p>
     <p :class="passConditions.noSpaces">Should not have spaces</p>
     <p :class="passConditions.blacklist">
      Shoud not be of the type "Passw0rd", "Password123"...
     </p>
    </div>

    <h2>Bio</h2>
    <textarea type="text" v-model="bio" maxlength="255" />
    <p class="msgLength">{{ calculateLength("bio", 255) }}</p>
    <div>
     <button class="bodyButton" v-on:click="signUp">Sign Up</button>
    </div>
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
   passConditions: {
    minLength: "",
    maxLength: "",
    uppercase: "",
    lowercase: "",
    digits: "",
    noSpaces: "",
    blacklist: "",
    email: false,
   },
  };
 },
 watch: {
  password() {
   this.validation();
  },
 },
 methods: {
  validation() {
   this.passConditions.minLength =
    this.password.length >= 8 ? "valid" : "invalid";

   this.passConditions.maxLength =
    this.password.length <= 20 ? "valid" : "invalid";

   this.passConditions.uppercase = /[A-Z]/.test(this.password)
    ? "valid"
    : "invalid";

   this.passConditions.lowercase = /[a-z]/.test(this.password)
    ? "valid"
    : "invalid";

   this.passConditions.digits =
    this.password.replace(/[^0-9]/g, "").length >= 2 ? "valid" : "invalid";

   this.passConditions.noSpaces =
    this.password.indexOf(" ") >= 0 ? "invalid" : "valid";

   let blacklist = ["Passw0rd", "Password123", "passw0rd", "password123"];
   for (let i = 0; i < blacklist.length; i++) {
    if (this.password.includes(blacklist[i])) {
     this.passConditions.blacklist = "invalid";
     return true;
    } else {
     this.passConditions.blacklist = "valid";
    }
   }
  },
  validateEmail() {
   if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
    this.passConditions.email = true;
   } else {
    this.passConditions.email = false;
   }
  },
  calculateLength(para, maxLength) {
   let count = eval(`this.${para}`).length;
   let charLeft = maxLength - count;
   let msgLength = charLeft.toString() + "/" + maxLength + " Characters left";

   return msgLength;
  },
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

<style lang="scss" scoped>
#signUp {
 height: 100%;
 display: flex;
 flex-flow: row wrap;
 justify-content: space-around;
 margin-top: 2rem;
}

.logo {
 width: 30%;
 margin: auto;
 margin-top: 3rem;
 padding: 1rem;
}

#signUpData {
 width: 40%;
 margin: auto;
 padding: 1rem;
}
.msgLength {
 width: 70%;
 margin: auto;
 margin-bottom: -0.65rem;
 font-size: 0.7rem;
 text-align: right;
}
.conditions {
 display: none;

 & p {
  width: 70%;
  font-size: 0.7rem;
  margin: auto;
  padding: 0;
  text-align: left;
 }
}
.password:focus + .conditions {
 display: block;
}

.valid {
 color: green;
}

@media screen and (max-width: 768px) {
 #signUp {
  display: flex;
  flex-direction: column;
  margin-top: 0;
 }
 #logo {
  width: 50%;
  margin: auto;
  padding-top: 0;
 }
 #signUpData {
  width: 80%;
  margin: auto;
  padding: 1rem;
  padding-top: 0;
 }
 .bodyButton {
  margin-top: 2rem;
 }
 textarea {
  width: 80%;
  height: 5rem;
 }
}
</style>

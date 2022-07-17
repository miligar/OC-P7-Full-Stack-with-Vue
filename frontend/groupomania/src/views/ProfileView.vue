<template>
 <NavBar />
 <main>
  <section id="profile">
   <div class="profileFields">
    <h2>Name</h2>
    <div class="profileData" v-if="!editMode">
     <p>{{ user.name }}</p>
    </div>
    <input
     class="inputField"
     v-if="editMode"
     type="text"
     :value="user.name"
     maxlength="100"
     ref="name"
    />
   </div>
   <div class="profileFields">
    <h2>Email</h2>
    <div class="profileData" v-if="!editMode">
     <p>{{ user.email }}</p>
    </div>
    <input
     class="inputField"
     v-if="editMode"
     type="text"
     :value="user.email"
     maxlength="100"
     ref="email"
    />
    <p>{{ serverMsg }}</p>
   </div>

   <div class="profileFields">
    <h2>Bio</h2>
    <div class="profileData" v-if="!editMode">
     <p>{{ user.bio }}</p>
    </div>
    <textarea
     class="inputField"
     v-if="editMode"
     type="text"
     :value="user.bio"
     maxlength="255"
     ref="bio"
    />
   </div>

   <div id="profileButtons">
    <button class="bodyButton" v-if="basicStage" @click="modifyState()">
     Modify your data
    </button>
    <button class="bodyButton" v-if="modifyStage" @click="updateProfile()">
     Confirm Update
    </button>
    <button class="bodyButton" v-if="deleteStage" @click="deleteProfile()">
     Confirm Delete
    </button>
    <button class="bodyButton" v-if="basicStage" @click="deleteState()">
     Delete account
    </button>
    <button
     class="bodyButton"
     v-if="modifyStage || deleteStage"
     @click="resetState()"
    >
     Cancel
    </button>
   </div>
  </section>
 </main>
</template>
<script>
import NavBar from "@/components/NaviBar.vue";

export default {
 data() {
  return {
   user: [],
   editMode: false,
   basicStage: true,
   modifyStage: false,
   deleteStage: false,
   serverMsg: "",
  };
 },
 methods: {
  modifyState() {
   this.basicStage = false;
   this.modifyStage = true;
   this.editMode = true;
  },
  deleteState() {
   this.basicStage = false;
   this.modifyStage = false;
   this.deleteStage = true;
  },
  resetState() {
   this.editMode = false;
   this.basicStage = true;
   this.modifyStage = false;
   this.deleteStage = false;
  },
  getMyProfile() {
   const requestOptions = {
    method: "GET",
    headers: {
     "Content-Type": "application/json",
     Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
    },
   };

   fetch(
    "http://localhost:3000/api/auth/" +
     JSON.parse(localStorage.getItem("user")).userId,
    requestOptions
   ).then((response) => {
    return response
     .json()

     .then((data) => {
      console.log(data);
      this.user = data;
     });
   });
  },
  updateProfile() {
   this.user.name = this.$refs.name.value;
   this.user.email = this.$refs.email.value;
   this.user.bio = this.$refs.bio.value;
   this.resetState();
   let postForm = {
    name: this.user.name,
    email: this.user.email,
    bio: this.user.bio,
   };
   let requestOptions = {
    method: "PUT",
    headers: {
     "Content-Type": "application/json",
     Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
    },
    body: JSON.stringify(postForm),
   };
   fetch(
    "http://localhost:3000/api/auth/" +
     JSON.parse(localStorage.getItem("user")).userId,
    requestOptions
   )
    .then((response) => {
     return response
      .json()

      .then((data) => {
       console.log(data);
       if (response.ok) {
        let user = {
         userId: JSON.parse(localStorage.getItem("user")).userId,
         name: this.user.name,
         token: JSON.parse(localStorage.getItem("user")).token,
        };
        localStorage.setItem("user", JSON.stringify(user));
       }
       this.serverMsg = data;
      });
    })

    .catch((error) => {
     console.error("There was an error!", error);
    });
  },
  deleteProfile() {
   const requestOptions = {
    method: "DELETE",
    headers: {
     "Content-Type": "application/json",
     Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
    },
   };

   fetch(
    "http://localhost:3000/api/auth/" +
     JSON.parse(localStorage.getItem("user")).userId,
    requestOptions
   )
    .then((response) => {
     return response
      .json()

      .then((data) => {
       console.log(data);
       if (response.ok) {
        this.$router.push("/");
        alert("Your account has been deleted");
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
 created() {
  this.getMyProfile();
 },
};
</script>

<style lang="scss" scoped>
#profile {
 width: 60%;
 margin: auto;
 margin-top: 8rem;
}
.profileFields {
 width: 100%;
}
.profileData {
 border: 1px solid #0d1f3b;
 width: 100%;
 margin: auto;
 margin-top: 1rem;
 padding: 0;
 border-radius: 0.5rem;
 text-align: left;
 background-color: white;
 & p {
  min-height: 1rem;
 }
}
.inputField {
 font-family: Avenir, Helvetica, Arial, sans-serif;
 font-size: 1rem;
 width: 98.7%;
 border: 1px solid #0d1f3b;
 //  margin: 0;
 margin-top: 1rem;
 padding: 0.5rem 0 0.5rem 0.5rem;
 margin-right: 5rem;
 text-align: left;
 background-color: white;
 border-radius: 0.5rem;
 outline: none;
}
#profileButtons {
 margin: auto;
 display: flex;
 flex-direction: row;
 justify-content: space-between;
 margin-top: 2rem;
}
.msgLength {
 width: 70%;
 margin: auto;
 margin-bottom: -0.65rem;
 font-size: 0.7rem;
 text-align: right;
}
@media screen and (max-width: 768px) {
 #profile {
  width: 85%;
  margin-top: 6rem;
 }
 .bodyButton {
  margin: 0 0.2rem;
 }
 p {
  font-size: 0.8rem;
 }
 .inputField {
  font-size: 0.8rem;
  margin: 0;
  margin-top: 0.2rem;

  padding: 0.3rem 0 0.4rem 0.3rem;
 }
}
</style>

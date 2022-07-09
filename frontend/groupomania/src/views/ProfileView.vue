<template>
 <NavBar />
 <main>
  <section id="profile">
   <div class="profileFields">
    <h2>Name</h2>
    <p class="profileData" v-if="!modifyState">{{ user.name }}</p>
    <input
     class="inputField"
     v-if="modifyState"
     type="text"
     :value="user.name"
    />
   </div>
   <div class="profileFields">
    <h2>Email</h2>
    <p class="profileData" v-if="!modifyState">{{ user.email }}</p>
    <input
     class="inputField"
     v-if="modifyState"
     type="text"
     :value="user.email"
    />
   </div>

   <div class="profileFields">
    <h2>Bio</h2>
    <p class="profileData" v-if="!modifyState">{{ user.bio }}</p>
    <textarea
     class="inputField"
     v-if="modifyState"
     type="text"
     :value="user.bio"
    />
   </div>
   <div id="profileButtons">
    <button v-if="!modifyState" @click="modifyData">Modify your data</button>
    <button v-if="modifyState">Submit</button>
    <button v-if="!modifyState">Delete account</button>
    <button v-if="modifyState" @click="modifyData">Cancel</button>
   </div>
  </section>
 </main>
</template>
<script>
import NavBar from "@/components/NaviBar.vue";

export default {
 data() {
  return { user: [], modifyState: false };
 },
 methods: {
  modifyData() {
   this.modifyState = !this.modifyState;
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
 },
 components: {
  NavBar,
 },
 created() {
  this.getMyProfile();
 },
};
</script>

<style lang="scss">
#profile {
 padding: 10rem 0.5rem;
 width: 75%;
 margin: auto;
 border: 1px black solid;
}
.profileFields {
 margin-top: 2rem;
 width: 100%;
}
.profileData {
 border: 1px solid #0d1f3b;
 margin: auto;
 margin-top: 1rem;
 padding: 0.5rem 0.5rem;
 text-align: left;
 background-color: white;
}
#profileButtons {
 display: flex;
 flex-direction: row;
 justify-content: space-between;
 margin-top: 2rem;
 & button {
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: #0d1f3b;
  color: white;
 }
}
.inputField {
 font-family: Avenir, Helvetica, Arial, sans-serif;
 font-size: 1rem;
 border: 1px solid #0d1f3b;
 width: 99.7%;
 max-width: 99.7%;
 margin: auto;
 padding: 0.59rem 0;
 text-align: left;
 background-color: white;
}
</style>

<template>
 <router-view />

 <footer>
  <img
   id="footerlogo"
   alt="Logo"
   src="../src/assets/icon-left-font-monochrome-white.svg"
  />
 </footer>
</template>

<style lang="scss">
#app {
 font-family: Avenir, Helvetica, Arial, sans-serif;
 -webkit-font-smoothing: antialiased;
 -moz-osx-font-smoothing: grayscale;
 text-align: center;
 color: #2c3e50;
}

body {
 display: flex;
 flex-direction: column;
 justify-content: space-around;
 background-color: #c3d2e5;
 margin: 0;
}
h1 {
 padding: 2rem 0;
}
nav {
 // padding: 30px;

 a {
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
  text-align: center;

  &.router-link-exact-active {
   color: #42b983;
   text-align: center;
  }
 }
}
// lu {
//  // padding: 0;
//  margin-left: -50px;
// }
li {
 list-style-type: none;
 // margin-left: -50px;
 padding: 0;
}

.bodyButton {
 padding: 1rem;
 border-radius: 0.5rem;
 background-color: #0d1f3b;
 color: white;
}

footer {
 height: 80px;
 // position: fixed;
 // bottom: 0;
 padding: 10px 0px;
 width: 100%;
 background-color: #0d1f3b;
 display: flex;
 flex-direction: column;
 justify-content: center;
 align-items: center;
}

#footerlogo {
 height: 80%;
 max-width: 80%;
}
</style>

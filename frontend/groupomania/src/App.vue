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
html {
 // height: 100%;
 min-height: 100%;
}
body {
 min-height: 100vh;
 // position: relative;
 background-color: #c3d2e5;
 margin: 0;
}
#app {
 font-family: Avenir, Helvetica, Arial, sans-serif;
 -webkit-font-smoothing: antialiased;
 -moz-osx-font-smoothing: grayscale;
 text-align: center;
 color: #2c3e50;
 min-height: inherit;
 display: flex;
 flex-direction: column;
 justify-content: space-between;
}
main {
 height: inherit;
}
h1 {
 font-size: 2rem;
 padding: 1rem 0;
}
h2 {
 font-size: 1rem;
 padding: 0.2rem 0;
}
p {
 font-size: 1rem;
 padding: 0.5rem;
 margin: 0;
}
input {
 width: 70%;
}
textarea {
 width: 70%;
 height: 5rem;
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
ul {
 padding: 0.5rem;
}
li {
 list-style-type: none;
 padding: 0;
}

.bodyButton {
 padding: 1rem;
 margin-top: 1rem;
 border-radius: 0.5rem;
 background-color: #0d1f3b;
 color: white;
}

footer {
 height: 2rem;
 margin-top: 2rem;
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

@media screen and (max-width: 768px) {
 h1 {
  font-size: 1.5rem;
  padding: 0.5rem 0;
 }
 h2 {
  font-size: 1rem;
  padding: 0.1rem 0;
 }
 p {
  font-size: 1rem;
  padding: 0.3rem;
  margin: 0;
 }
 input {
  width: 80%;
 }
 textarea {
  width: 70%;
  height: 3rem;
 }
 footer {
  height: 1.5rem;
 }
 .bodyButton {
  padding: 0.5rem;
  margin-top: 0.8rem;
  border-radius: 0.5rem;
  background-color: #0d1f3b;
  color: white;
 }
}
</style>

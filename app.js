const signup = Vue.createApp({
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
          return response.json();
        })

        .then((data) => {
          console.log(data);
        })

        .catch((error) => {
          console.error("There was an error!", error);
        });
    },
  },
});
signup.mount("#signup");

const login = Vue.createApp({
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
          return response.json();
        })

        .then((data) => {
          console.log(data);
        })

        .catch((error) => {
          console.error("There was an error!", error);
        });
    },
  },
});
login.mount("#login");

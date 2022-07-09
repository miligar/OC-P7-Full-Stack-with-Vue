import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const routes = [
 {
  path: "/",
  name: "home",
  component: HomeView,
 },
 {
  path: "/signup",
  name: "signup",
  component: () => import("../views/SignupView.vue"),
 },
 {
  path: "/profile",
  name: "profile",
  component: () => import("../views/ProfileView.vue"),
 },
 {
  path: "/posts",
  name: "posts",
  component: () => import("../views/AllPostsView.vue"),
 },
 {
  path: "/createPost",
  name: "createPost",
  component: () => import("../views/CreatePostView.vue"),
 },
 {
  path: "/posts/:id",
  name: "onePost",
  component: () => import("../views/OnePostView.vue"),
 },
];

const router = createRouter({
 history: createWebHashHistory(),
 routes,
});

export default router;

const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ name: 'main',path: "", component: () => import("pages/IndexPage.vue") }],
  },
  {
    path: "/test",
    component: () => import("layouts/PuzzleLayout.vue"),
    children: [
      {
        path: "maze",
        component: () => import("pages/maze/IndexPage.vue"),
      },
      {
        path: "TimeSpaceHunting",
        component: () => import("pages/time-space-hunting/IndexPage.vue"),
      },
      {
        path: 'page3',
        component: () => import('pages/puzzle-three/IndexPage.vue'),
      },
    ],
  },
  {
    name: 'games',
    path: "/games",
    component: () => import("layouts/PuzzleLayout.vue"),
    children: [
      {
        name:'maze',
        path: "maze",
        component: () => import("pages/maze/IndexPage.vue"),
      },
      {
        path: "TimeSpaceHunting",
        component: () => import("pages/time-space-hunting/IndexPage.vue"),
      },
      {
        path: 'page3',
        component: () => import('pages/puzzle-three/IndexPage.vue'),
      },
    ],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;

import authRoute from "../module/auth.template/auth.routes";

const router = [
  {
    prefix: "/auth",
    router: authRoute,
  },
];

export default router;

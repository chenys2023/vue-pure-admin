import { $t } from "@/plugins/i18n";
import { system } from "@/router/enums";
const Layout = () => import("@/layout/index.vue");

export default {
  path: "/system",
  name: "System",
  redirect: "/system/user/index",
  component: Layout,
  meta: {
    icon: "setting",
    title: $t("menus.hssysManagement"),
    rank: system
  },
  children: [
    {
      path: "/system/user/index",
      name: "User",
      component: () => import("@/views/system/user/index.vue"),
      meta: {
        icon: "flUser",
        title: $t("menus.hsUser"),
        roles: ["admin"]
      }
    },
    {
      path: "/system/role/index",
      name: "Role",
      component: () => import("@/views/system/role/index.vue"),
      meta: {
        icon: "role",
        title: $t("menus.hsRole"),
        roles: ["admin"]
      }
    },
    {
      path: "/system/dept/index",
      name: "Dept",
      component: () => import("@/views/system/dept/index.vue"),
      meta: {
        icon: "dept",
        title: $t("menus.hsDept"),
        roles: ["admin"]
      }
    }
  ]
} as RouteConfigsTable;

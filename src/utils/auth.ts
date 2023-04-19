import Cookies from "js-cookie";
import { storageSession } from "@pureadmin/utils";
import { useUserStoreHook } from "@/store/modules/user";

export interface AuthToken {
  accessToken: string;
  // token的剩余有效时间
  expiredIn: number;
  refreshToken: string;
  username?: string;
  roles?: Array<string>;
}
export interface UserInfo {
  /**  租户id */
  lastTenantId: number;
  /** 租户名称 */
  tenantName: string;
  /** 租户代码  */
  tenantCode: string;
  /** 用户id */
  userId: number;
  /** 组织id */
  organizationId: number;
  /** 组织名称 */
  organizationName: string;
  /** 用户名 */
  userName: string;
  /** 手机号 */
  phone: string;
  /** 头像 */
  avatar: string;
  /** 职务 */
  job: string;
  /** 登录帐号 */
  account: string;
  /** 角色集合 */
  roles: Array<string>;
  /** 权限集合 */
  permissions: Array<string>;
}

export interface DataInfo {
  // /** token */
  // accessToken: string;
  // /** `accessToken`的过期时间（时间戳） */
  // expires: T;
  // /** 用于调用刷新accessToken的接口时所需的token */
  // refreshToken: string;
  // /** 用户名 */
  // username?: string;
  // /** 当前登陆用户的角色 */
  // roles?: Array<string>;

  /** 租户编码 */
  tenantCode: string;
  /** 用户信息 */
  userInfo: UserInfo;
  /** token */
  authToken: AuthToken;
  /** 多租户列表 */
  tenantList: Array<string>;
}

export const sessionKey = "user-info";
export const TokenKey = "authorized-token";

/** 获取`token` */
export function getToken(): AuthToken {
  // 此处与`TokenKey`相同，此写法解决初始化时`Cookies`中不存在`TokenKey`报错
  return Cookies.get(TokenKey)
    ? JSON.parse(Cookies.get(TokenKey))
    : storageSession().getItem<DataInfo>(sessionKey)?.authToken?.accessToken ??
        "";
}

/**
 * @description 设置`token`以及一些必要信息并采用无感刷新`token`方案
 * 无感刷新：后端返回`accessToken`（访问接口使用的`token`）、`refreshToken`（用于调用刷新`accessToken`的接口时所需的`token`，`refreshToken`的过期时间（比如30天）应大于`accessToken`的过期时间（比如2小时））、`expires`（`accessToken`的过期时间）
 * 将`accessToken`、`expires`这两条信息放在key值为authorized-token的cookie里（过期自动销毁）
 * 将`username`、`roles`、`refreshToken`、`expires`这四条信息放在key值为`user-info`的sessionStorage里（浏览器关闭自动销毁）
 */
export function setToken(data: DataInfo) {
  const { accessToken, refreshToken, expiredIn } = data.authToken;
  const expires = new Date().getTime() + expiredIn;

  // expires = new Date(expiredIn).getTime(); // 如果后端直接设置时间戳，将此处代码改为expires = data.expires，然后把上面的DataInfo<Date>改成DataInfo<number>即可

  const cookieString = JSON.stringify({ accessToken, refreshToken, expires });
  Cookies.set(TokenKey, cookieString, { expires: expires });

  // expires > 0
  //   ? Cookies.set(TokenKey, cookieString, {
  //       expires: (expires - Date.now()) / 86400000
  //     })
  //   : Cookies.set(TokenKey, cookieString);

  function setSessionKey(username: string, roles: Array<string>) {
    useUserStoreHook().SET_USERNAME(username);
    useUserStoreHook().SET_ROLES(roles);
    storageSession().setItem(sessionKey, {
      refreshToken,
      expires,
      username,
      roles
    });
  }
  const userInfo: UserInfo = data?.userInfo;
  if (userInfo?.userName && userInfo?.roles.length > 0) {
    const { userName, roles } = userInfo;
    setSessionKey(userName, roles);
  } else {
    const username =
      storageSession().getItem<DataInfo>(sessionKey)?.userInfo?.userName ?? "";
    const roles =
      storageSession().getItem<DataInfo>(sessionKey)?.userInfo?.roles ?? [];
    setSessionKey(username, roles);
  }
}

/** 删除`token`以及key值为`user-info`的session信息 */
export function removeToken() {
  Cookies.remove(TokenKey);
  sessionStorage.clear();
}

/** 格式化token（jwt格式） */
export const formatToken = (token: string): string => {
  return "Bearer " + token;
};

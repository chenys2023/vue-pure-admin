import { http } from "@/utils/http";
import { type UserInfo, type AuthToken } from "@/utils/auth";

export type UserResult = {
  code: string;
  data: {
    // // todo: 登录返回值
    // /** 用户名 */
    // username: string;
    // /** 当前登陆用户的角色 */
    // roles: Array<string>;
    // /** `token` */
    // accessToken: string;
    // /** 用于调用刷新`accessToken`的接口时所需的`token` */
    // refreshToken: string;
    // /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
    // expires: Date;

    // /**
    //  * 租户编码
    //  */
    // tenantCode: string;

    // /**
    //  * 用户信息
    //  */
    // userInfo: Array<string>;

    // /**
    //  * token
    //  */
    // authToken: string;

    // /**
    //  * 多租户信息
    //  */
    // tenantList: Array<string>;

    /** 租户编码 */
    tenantCode: string;
    /** 用户信息 */
    userInfo: UserInfo;
    /** token */
    authToken: AuthToken;
    /** 多租户列表 */
    tenantList: Array<string>;
  };
  msg: string;
};

export type RefreshTokenResult = {
  code: string;
  data: {
    /** `token` */
    accessToken: string;
    /** 用于调用刷新`accessToken`的接口时所需的`token` */
    refreshToken: string;
    /** `accessToken`的过期时间 */
    expiredIn: number;
  };
  msg: string;
};

/** 登录 */
export const getLogin = (data?: object) => {
  return http.request<UserResult>("post", "/login/pc", { data });
};

/** 刷新token */
export const refreshTokenApi = (data?: object) => {
  // return http.request<RefreshTokenResult>("post", "/refreshToken", { data });
  return http.request<UserResult>("post", "/refreshToken", { data });
};

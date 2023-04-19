import { http } from "@/utils/http";

export type UserResult = {
  code: string;
  msg: string;
  data: {
    // todo: 用户登录返回值
    /** 用户名 */
    username: string;
    /** 当前登陆用户的角色 */
    roles: Array<string>;
    /** `token` */
    accessToken: string;
    /** 用于调用刷新`accessToken`的接口时所需的`token` */
    refreshToken: string;
    /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
    expires: string;
    /** 租户编码 */
    tenantCode: string;
    /**多租户列表*/
    tenantList: Array<string>;
    /**  用户信息  */
    // userInfo: Array<string>;
    /** token */
    // authToken: string;
  };
};

export type RefreshTokenResult = {
  code: string;
  msg: string;
  data: {
    /** `token` */
    accessToken: string;
    /** 用于调用刷新`accessToken`的接口时所需的`token` */
    refreshToken: string;
    /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
    expires: string;
  };
};

/** 登录 */
export const getLogin = (data?: object) => {
  return http.request<UserResult>("post", "/login/pc", { data });
};

/** 刷新token */
export const refreshTokenApi = (data?: object) => {
  return http.request<RefreshTokenResult>("post", "/login/refreshToken", {
    data
  });
};

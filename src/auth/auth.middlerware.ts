import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import * as userService from '../user/user.service';
import { possess } from './auth.service';
import { PUBLIC_KEY } from '../app/app.config';
import { TokenPayload } from './auth.interface';

/**
 * 验证用户登录数据
 */
export const validateLoginData = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  console.log('👮‍♀️ 验证用户登录数据');

  const { name, password } = request.body;
  if (!name) return next(new Error('NAME_IS_REQUIRED'));
  if (!password) return next(new Error('PASSWORD_IS_REQUIRED'));

  // 验证用户名
  const user = await userService.getUserByName(name, { password: true });
  if (!user) return next(new Error('USER_DOSE_NOT_EXIST'));

  // 验证用户密码
  const matched = await bcrypt.compare(password, user.password);
  if (!matched) return next(new Error('PASSWORD_DOES_NOT_MATCH'));

  // 在请求主体里添加用户
  request.body.user = user;

  next();
};

/**
 * 验证用户身份
 */
export const authGuard = (request: Request, response: Response, next: NextFunction) => {
  console.log('👮‍♀️ 验证用户身份');

  if (request.user.id) {
    next();
  } else {
    next(new Error('UNAUTHORIZED'));
  }
};

/**
 * 识别当前用户
 */
export const currentUser = (request: Request, response: Response, next: NextFunction) => {
  console.log('👓 识别当前用户');

  let user: TokenPayload = {
    id: null,
    name: 'anonymous',
  };

  try {
    const authorization = request.header('Authorization');

    // 提取JWT令牌
    const token = authorization.replace('Bearer ', '');

    if (token) {
      const decoded = jwt.verify(token, PUBLIC_KEY, {
        algorithms: ['RS256'],
      });

      user = decoded as TokenPayload;
    }
  } catch (e) {}

  console.log('user is: ', user);

  // 在请求添加user
  request.user = user;

  next();
};

/**
 * 访问控制
 */
interface AccessControlOptions {
  possessions?: boolean;
}
export const accessControl = (options: AccessControlOptions) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    console.log('👮‍♀️ 访问控制');

    const { id: userId } = request.user;
    const { possessions } = options;

    // 超级管理员放行
    if (userId === 1) return next();

    const resourceIdParam = Object.keys(request.params)[0];
    const resourceType = resourceIdParam.replace('Id', '');
    const resourceId = parseInt(request.params[resourceIdParam], 10);

    // 检查资源拥有权
    if (possessions) {
      try {
        const ownResource = await possess({ resourceId, resourceType, userId });
        if (!ownResource) {
          return next(new Error('USER_DOES_NOT_OWN_RESOURCE'));
        }
      } catch (error) {
        return next(error);
      }
    }

    next();
  };
};

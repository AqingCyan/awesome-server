import express from 'express';
import { defaultErrorHandler } from './app.middleware';
import postRouter from '../post/post.router';
import userRouter from '../user/user.router';
import authRouter from '../auth/auth.router';
import fileRouter from '../file/file.router';

/**
 * 创建应用
 */
const app = express();

/**
 * 全局处理 JSON
 */
app.use(express.json());

/**
 * 路由
 */
app.use(postRouter, userRouter, authRouter, fileRouter);

/**
 * 默认异常处理器
 */
app.use(defaultErrorHandler);

/**
 * 导出应用
 */
export default app;

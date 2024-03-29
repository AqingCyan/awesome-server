import express from 'express';
import * as searchController from './search.controller';
import { accessLog } from '../access-log/access-log.middleware';

const router = express.Router();

/**
 * 搜索标签
 */
router.get(
  '/search/tags',
  accessLog({ action: 'searchTags', resourceType: 'search', resourceParamName: 'query.name' }),
  searchController.tags,
);

/**
 * 搜索用户
 */
router.get(
  '/search/users',
  accessLog({ action: 'searchUsers', resourceType: 'search', resourceParamName: 'query.name' }),
  searchController.users,
);

/**
 * 搜索相机
 */
router.get(
  '/search/cameras',
  accessLog({ action: 'searchCameras', resourceType: 'search', resourceParamName: 'query.model' }),
  searchController.cameras,
);

/**
 * 搜索镜头
 */
router.get(
  '/search/lens',
  accessLog({ action: 'searchLens', resourceType: 'search', resourceParamName: 'query.model' }),
  searchController.lens,
);

export default router;

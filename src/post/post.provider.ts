/**
 * 查询片段
 */
export const sqlFragment = {
  user: `
  JSON_OBJECT(
    'id', user.id,
    'name', user.name,
    'avatar', IF(COUNT(avatar.id), 1, NULL)
  ) as user`,
  leftJoinUser: `
    LEFT JOIN user
      ON user.id = post.userId
    LEFT JOIN avatar
      ON user.id = avatar.userId  
  `,
  totalComments: `(SELECT COUNT(comment.id) FROM comment WHERE comment.postId = post.id) as totalComments`,
  leftJoinOneFile: `
    LEFT JOIN LATERAL (
      SELECT *
      FROM file
      WHERE file.postId = post.id 
      ORDER BY file.id DESC
      LIMIT 1
      ) AS file ON file.postId = post.id
  `,
  innerJoinFile: `
    INNER JOIN file
      ON file.postId = post.id
  `,
  innerJoinOneFile: `
    INNER JOIN LATERAL (
      SELECT *
      FROM file
      WHERE file.postId = post.id 
      ORDER BY file.id DESC
      LIMIT 1
      ) AS file ON file.postId = post.id
  `,
  file: `
    CAST(
      IF(
        COUNT(file.id),
        GROUP_CONCAT(
          DISTINCT JSON_OBJECT(
            'id', file.id,
            'width', file.width,
            'height', file.height
          )
        ), 
        NULL
      ) AS JSON
    ) AS file
  `,
  leftJoinTag: `
    LEFT JOIN
      post_tag ON post_tag.postId = post.id
    LEFT JOIN
      tag ON post_tag.tagId = tag.id
  `,
  tags: `
    CAST(
      IF(
        COUNT(tag.id),
        CONCAT(
          '[',
            GROUP_CONCAT(
              DISTINCT JSON_OBJECT(
                'id', tag.id,
                'name', tag.name
              )
            ),
          ']'
        ),
        NULL
      ) AS JSON
    ) AS tags
  `,
  totalLikes: `
    (
      SELECT COUNT(user_like_post.postId)
      FROM user_like_post
      WHERE user_like_post.postId = post.id
    ) AS totalLikes
  `,
  innerJoinUserLikePost: `
    INNER JOIN user_like_post
      ON user_like_post.postId = post.id
  `,
  leftJoinOneAuditLog: `
    LEFT JOIN LATERAL (
      SELECT *
      FROM audit_log
      WHERE audit_log.resourceId = post.id
      ORDER BY audit_log.id DESC
      LIMIT 1
    ) AS audit ON post.id = audit.resourceId
  `,
  audit: `
    CAST(
      IF(
        COUNT(audit.id),
        GROUP_CONCAT(
          DISTINCT JSON_OBJECT(
            'id', audit.id,
            'status', audit.status
          )
        ),
        NULL
      ) AS JSON
    ) AS audit
  `,
};

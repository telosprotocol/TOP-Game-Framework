const FULL_JSON = {
  openapi: '3.0.1',
  info: {
    title: 'top-vidnow-base',
    description: 'Token通过Vidnow登录服务获取，所有接口均需要提供Token才能访问',
    contact: {
      name: 'start',
      url: '/static/doc/index.html',
      email: 'start.wei@upblocks.io',
    },
    version: '1.0.0.T',
  },
  servers: [
    {
      url: 'http://184.169.228.72:8080',
      description: 'Generated server url',
    },
  ],
  security: [
    {
      Authorization: [],
    },
  ],
  paths: {
    '/v1/userTask/income/': {
      put: {
        tags: ['游戏任务相关接口'],
        summary: '领取游戏任务收益',
        operationId: 'income_UserTaskController',
        parameters: [
          {
            name: 'taskId',
            in: 'path',
            description: '任务id,Long 范围(0~9223372036854775807)',
            required: true,
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          200: {
            description: 'OK',
            content: {
              '*/*': {
                schema: {
                  $ref: '#/components/schemas/ObjectVOInteger',
                },
              },
            },
          },
        },
      },
    },
    '/v1/userTask/myTasks': {
      post: {
        tags: ['游戏任务相关接口'],
        summary: '查询用户的游戏任务列表',
        operationId: 'myTasks_UserTaskController',
        responses: {
          200: {
            description: 'OK',
            content: {
              '*/*': {
                schema: {
                  $ref: '#/components/schemas/ObjectVOUserTaskVO',
                },
              },
            },
          },
        },
      },
    },
    '/v1/user/transaction/page': {
      post: {
        tags: ['用户-基础服务相关接口'],
        summary: '交易流水查询',
        operationId: 'page_UserController',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/TransactionPageAO',
              },
            },
          },
          required: true,
        },
        responses: {
          200: {
            description: 'OK',
            content: {
              '*/*': {
                schema: {
                  $ref: '#/components/schemas/PageVOTransactionVO',
                },
              },
            },
          },
        },
      },
    },
    '/v1/user/task/report/schedule': {
      post: {
        tags: ['权益-用户任务信息接口文档'],
        summary: '上报任务进度',
        operationId: 'reportSchedule_UserTaskLogsController',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UserTaskLogsReportAO',
              },
            },
          },
          required: true,
        },
        responses: {
          200: {
            description: 'OK',
            content: {
              '*/*': {
                schema: {
                  $ref: '#/components/schemas/BaseVO',
                },
              },
            },
          },
        },
      },
    },
    '/v1/user/task/generate': {
      post: {
        tags: ['权益-用户任务信息接口文档'],
        summary: '给用户生成每日任务（登陆初始化每日任务）',
        operationId: 'generate_UserTaskLogsController',
        responses: {
          200: {
            description: 'OK',
            content: {
              '*/*': {
                schema: {
                  $ref: '#/components/schemas/BaseVO',
                },
              },
            },
          },
        },
      },
    },
    '/v1/user/passCard/list': {
      post: {
        tags: ['权益-用户PASS卡信息接口文档'],
        summary: '用户权益卡列表',
        operationId: 'userPassCardList_UserPassCardOrderController',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UserPassCardListAO',
              },
            },
          },
          required: true,
        },
        responses: {
          200: {
            description: 'OK',
            content: {
              '*/*': {
                schema: {
                  $ref: '#/components/schemas/ListVOUserPassCardOrderListVO',
                },
              },
            },
          },
        },
      },
    },
    '/v1/user/passCard/exchange': {
      post: {
        tags: ['权益-用户PASS卡信息接口文档'],
        summary: '用户领取Pass卡',
        operationId: 'exchange_UserPassCardOrderController',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UserExchangePassCardOrderAO',
              },
            },
          },
          required: true,
        },
        responses: {
          200: {
            description: 'OK',
            content: {
              '*/*': {
                schema: {
                  $ref: '#/components/schemas/BaseVO',
                },
              },
            },
          },
        },
      },
    },
    '/v1/passCard/list': {
      post: {
        tags: ['权益-PASS卡信息接口文档'],
        summary: '权益卡市场列表',
        operationId: 'list_PassCardController',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/PassCardListAO',
              },
            },
          },
          required: true,
        },
        responses: {
          200: {
            description: 'OK',
            content: {
              '*/*': {
                schema: {
                  $ref: '#/components/schemas/ListVOPassCardListVO',
                },
              },
            },
          },
        },
      },
    },
    '/v1/game/createGame': {
      post: {
        tags: ['游戏-大厅接口文档'],
        summary: '创建游戏',
        operationId: 'createGame_GameHallController',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/GameInfoAO',
              },
            },
          },
          required: true,
        },
        responses: {
          200: {
            description: 'OK',
            content: {
              '*/*': {
                schema: {
                  $ref: '#/components/schemas/ObjectVOGameCreateVO',
                },
              },
            },
          },
        },
      },
    },
    '/v1/user/wallet/info': {
      get: {
        tags: ['权益-用户钱包接口文档'],
        summary: '用户钱包基础信息接口',
        operationId: 'info_UserWalletController',
        responses: {
          200: {
            description: 'OK',
            content: {
              '*/*': {
                schema: {
                  $ref: '#/components/schemas/ObjectVOUserWalletInfoVO',
                },
              },
            },
          },
        },
      },
    },
    '/v1/user/task/my': {
      get: {
        tags: ['权益-用户任务信息接口文档'],
        summary: '获取我的任务信息',
        operationId: 'myTaskInfo_UserTaskLogsController',
        responses: {
          200: {
            description: 'OK',
            content: {
              '*/*': {
                schema: {
                  $ref: '#/components/schemas/ObjectVOUserTaskInfoVO',
                },
              },
            },
          },
        },
      },
    },
    '/v1/user/task/history/page': {
      get: {
        tags: ['权益-用户任务信息接口文档'],
        summary: '获取我的任务信息',
        operationId: 'history_UserTaskLogsController',
        responses: {
          200: {
            description: 'OK',
            content: {
              '*/*': {
                schema: {
                  $ref: '#/components/schemas/PageVOUserTaskLogsHistoryPageVO',
                },
              },
            },
          },
        },
      },
    },
    '/v1/user/assets': {
      get: {
        tags: ['用户-基础服务相关接口'],
        summary: '用户资产',
        operationId: 'assets_UserController',
        responses: {
          200: {
            description: 'OK',
            content: {
              '*/*': {
                schema: {
                  $ref: '#/components/schemas/ListVOUserCoinAssetsVO',
                },
              },
            },
          },
        },
      },
    },
    '/v1/user/account': {
      get: {
        tags: ['用户-基础服务相关接口'],
        summary: '用户账户',
        operationId: 'userAccount_UserController',
        responses: {
          200: {
            description: 'OK',
            content: {
              '*/*': {
                schema: {
                  $ref: '#/components/schemas/ObjectVOUserAccountVO',
                },
              },
            },
          },
        },
      },
    },
    '/v1/passCard/{id}': {
      get: {
        tags: ['权益-PASS卡信息接口文档'],
        summary: '权益卡详情',
        operationId: 'detail_PassCardController',
        parameters: [
          {
            name: 'id',
            in: 'query',
            description: '权益卡唯一ID',
            required: true,
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          200: {
            description: 'OK',
            content: {
              '*/*': {
                schema: {
                  $ref: '#/components/schemas/ObjectVOPassCardDetailVO',
                },
              },
            },
          },
        },
      },
    },
    '/v1/passCard/novice': {
      get: {
        tags: ['权益-PASS卡信息接口文档'],
        summary: '引导业新手权益卡',
        operationId: 'novice_PassCardController',
        responses: {
          200: {
            description: 'OK',
            content: {
              '*/*': {
                schema: {
                  $ref: '#/components/schemas/ObjectVOPassCardDetailVO',
                },
              },
            },
          },
        },
      },
    },
    '/v1/game/accessToken/{gameId}': {
      get: {
        tags: ['用户-基础服务相关接口'],
        summary: '获取某游戏的授权凭证',
        description:
          '获取后通过url?accessToken={accessToken}打开链接的方式传递给第三方服务端调用',
        operationId: 'accessToken_UserController',
        parameters: [
          {
            name: 'gameId',
            in: 'path',
            description: '游戏Id,Long 范围(0~9223372036854775807)',
            required: true,
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          200: {
            description: 'OK',
            content: {
              '*/*': {
                schema: {
                  $ref: '#/components/schemas/ObjectVOString',
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      ObjectVOInteger: {
        required: ['code', 'data', 'message', 'name', 'servertime', 'success'],
        type: 'object',
        properties: {
          success: {
            title: '是否成功',
            type: 'boolean',
            description: '状态码(200-299)都为成功',
          },
          code: {
            title: '状态码',
            type: 'integer',
            description:
              "程序执行中的一种状态'200:表示执行完毕,204:未获取到数据等[详情](/static/doc/response_code.html)",
            format: 'int32',
            example: 200,
          },
          message: {
            title: '状态消息',
            type: 'string',
            description: '',
            example: 'OK',
          },
          logno: {
            title: '日志编号',
            type: 'string',
            description: '本次请求的唯一标识,当无法解决问题时可把它发给工程师',
          },
          name: {
            title: '应用名称',
            type: 'string',
            description: '',
          },
          servertime: {
            title: '服务器时间',
            pattern: '13位时间戳',
            type: 'integer',
            description: '',
            format: 'int64',
            default: 1683871809738,
          },
          data: {
            title: '响应数据',
            type: 'integer',
            description: '状态码为200时返回',
            format: 'int32',
          },
        },
      },
      ObjectVOUserTaskVO: {
        required: ['code', 'data', 'message', 'name', 'servertime', 'success'],
        type: 'object',
        properties: {
          success: {
            title: '是否成功',
            type: 'boolean',
            description: '状态码(200-299)都为成功',
          },
          code: {
            title: '状态码',
            type: 'integer',
            description:
              "程序执行中的一种状态'200:表示执行完毕,204:未获取到数据等[详情](/static/doc/response_code.html)",
            format: 'int32',
            example: 200,
          },
          message: {
            title: '状态消息',
            type: 'string',
            description: '',
            example: 'OK',
          },
          logno: {
            title: '日志编号',
            type: 'string',
            description: '本次请求的唯一标识,当无法解决问题时可把它发给工程师',
          },
          name: {
            title: '应用名称',
            type: 'string',
            description: '',
          },
          servertime: {
            title: '服务器时间',
            pattern: '13位时间戳',
            type: 'integer',
            description: '',
            format: 'int64',
            default: 1683871809758,
          },
          data: {
            $ref: '#/components/schemas/UserTaskVO',
          },
        },
      },
      UserTaskDailyVO: {
        title: '今日任务列表',
        type: 'object',
        properties: {
          id: {
            title: '主键Id',
            type: 'string',
            description: '',
            default: '9223372036854775807',
          },
          createdDate: {
            title: '创建时间',
            pattern: '13位时间戳',
            type: 'integer',
            description: '',
            format: 'int64',
            default: 1683871809767,
          },
          modifiedDate: {
            title: '修改时间',
            pattern: '13位时间戳',
            type: 'integer',
            description: '',
            format: 'int64',
            default: 1683871809770,
          },
          taskType: {
            title: '任务类型',
            type: 'string',
            description: '',
          },
          name: {
            title: '今日任务',
            type: 'string',
            description: '',
          },
          tasks: {
            title: '任务列表',
            type: 'array',
            description: '',
            items: {
              $ref: '#/components/schemas/UserTaskEntryVO',
            },
          },
          nextRefreshTime: {
            title: '截至时间',
            type: 'string',
            description: '',
            default: '9223372036854775807',
          },
        },
      },
      UserTaskEntryVO: {
        title: '任务列表',
        type: 'object',
        properties: {
          id: {
            title: '主键Id',
            type: 'string',
            description: '',
            default: '9223372036854775807',
          },
          createdDate: {
            title: '创建时间',
            pattern: '13位时间戳',
            type: 'integer',
            description: '',
            format: 'int64',
            default: 1683871809767,
          },
          modifiedDate: {
            title: '修改时间',
            pattern: '13位时间戳',
            type: 'integer',
            description: '',
            format: 'int64',
            default: 1683871809770,
          },
          taskId: {
            title: '任务id',
            type: 'string',
            description: '',
            default: '9223372036854775807',
          },
          icon: {
            title: '图片',
            type: 'string',
            description: '',
          },
          name: {
            title: '任务名称',
            type: 'string',
            description: '',
          },
          target: {
            title: '任务目标',
            type: 'string',
            description: '',
          },
          status: {
            title: '任务状态',
            type: 'string',
            description:
              'Enum (已领取:RECEIVED,可领取:AVAILABLE,进行中:UNDERWAY,已过期:TIMEOUT)',
            enum: ['RECEIVED', 'AVAILABLE', 'UNDERWAY', 'TIMEOUT'],
          },
          progress: {
            title: '任务进度文字描述',
            type: 'string',
            description: '',
          },
          progressValue: {
            title: '进度分子',
            type: 'string',
            description: '',
            default: '9223372036854775807',
          },
          finishValue: {
            title: '进度分母',
            type: 'string',
            description: '',
            default: '9223372036854775807',
          },
          coin: {
            title: '币类型',
            type: 'string',
            description: 'Enum (金币:GOLD,VToken:VTOKEN)',
            enum: ['GOLD', 'VTOKEN'],
          },
          amount: {
            title: '完成任务奖励币数量',
            type: 'number',
            description: '',
          },
        },
      },
      UserTaskNewHandVO: {
        title: '新手任务列表',
        type: 'object',
        properties: {
          id: {
            title: '主键Id',
            type: 'string',
            description: '',
            default: '9223372036854775807',
          },
          createdDate: {
            title: '创建时间',
            pattern: '13位时间戳',
            type: 'integer',
            description: '',
            format: 'int64',
            default: 1683871809767,
          },
          modifiedDate: {
            title: '修改时间',
            pattern: '13位时间戳',
            type: 'integer',
            description: '',
            format: 'int64',
            default: 1683871809770,
          },
          taskType: {
            title: '任务类型',
            type: 'string',
            description: '',
          },
          name: {
            title: '新手任务',
            type: 'string',
            description: '',
          },
          tasks: {
            title: '任务列表',
            type: 'array',
            description: '',
            items: {
              $ref: '#/components/schemas/UserTaskEntryVO',
            },
          },
        },
      },
      UserTaskVO: {
        title: '响应数据',
        type: 'object',
        properties: {
          id: {
            title: '主键Id',
            type: 'string',
            description: '',
            default: '9223372036854775807',
          },
          createdDate: {
            title: '创建时间',
            pattern: '13位时间戳',
            type: 'integer',
            description: '',
            format: 'int64',
            default: 1683871809767,
          },
          modifiedDate: {
            title: '修改时间',
            pattern: '13位时间戳',
            type: 'integer',
            description: '',
            format: 'int64',
            default: 1683871809770,
          },
          dailyTasks: {
            $ref: '#/components/schemas/UserTaskDailyVO',
          },
          newHandTasks: {
            $ref: '#/components/schemas/UserTaskNewHandVO',
          },
        },
        description: '状态码为200时返回',
      },
      TransactionPageAO: {
        type: 'object',
        properties: {
          pageIndex: {
            title: '当前页数(默认:1)',
            maximum: 2147483647,
            minimum: 1,
            type: 'integer',
            description: '',
            format: 'int32',
            example: 1,
          },
          pageSize: {
            title: '分页大小(默认:8)',
            maximum: 2147483647,
            minimum: 1,
            type: 'integer',
            description: '',
            format: 'int32',
            example: 8,
          },
          id: {
            title: 'transactionId',
            maximum: 9223372036854776000,
            minimum: 0,
            type: 'string',
            description: '',
            default: '9223372036854775807',
          },
          userId: {
            title: '用户Id',
            maximum: 9223372036854776000,
            minimum: 0,
            type: 'string',
            description: '',
            default: '9223372036854775807',
          },
          direct: {
            title: '方向',
            type: 'string',
            description: 'Enum (加:ADD,减:SUB)',
            enum: ['ADD', 'SUB'],
          },
          transactionStatus: {
            title: '状态',
            type: 'string',
            description: 'Enum (等待:PENDING,成功:SUCCESS,失败:FAIL)',
            enum: ['PENDING', 'SUCCESS', 'FAIL'],
          },
          transactionType: {
            title: '交易类型',
            type: 'string',
            description:
              "[数据字典](/static/doc/data_dictionary.html) 格式:{'k':'编号','v':'值'}",
          },
        },
      },
      PageVOTransactionVO: {
        required: [
          'code',
          'data',
          'message',
          'name',
          'servertime',
          'success',
          'total',
        ],
        type: 'object',
        properties: {
          success: {
            title: '是否成功',
            type: 'boolean',
            description: '状态码(200-299)都为成功',
          },
          code: {
            title: '状态码',
            type: 'integer',
            description:
              "程序执行中的一种状态'200:表示执行完毕,204:未获取到数据等[详情](/static/doc/response_code.html)",
            format: 'int32',
            example: 200,
          },
          message: {
            title: '状态消息',
            type: 'string',
            description: '',
            example: 'OK',
          },
          logno: {
            title: '日志编号',
            type: 'string',
            description: '本次请求的唯一标识,当无法解决问题时可把它发给工程师',
          },
          name: {
            title: '应用名称',
            type: 'string',
            description: '',
          },
          servertime: {
            title: '服务器时间',
            pattern: '13位时间戳',
            type: 'integer',
            description: '',
            format: 'int64',
            default: 1683871809938,
          },
          data: {
            title: '响应数据',
            type: 'array',
            description: '状态码为200时返回',
            items: {
              $ref: '#/components/schemas/TransactionVO',
            },
          },
          total: {
            title: '总记录数',
            type: 'integer',
            description: '',
            format: 'int32',
          },
        },
      },
      TransactionVO: {
        title: '响应数据',
        type: 'object',
        properties: {
          id: {
            title: '主键Id',
            type: 'string',
            description: '',
            default: '9223372036854775807',
          },
          createdDate: {
            title: '创建时间',
            pattern: '13位时间戳',
            type: 'integer',
            description: '',
            format: 'int64',
            default: 1683871809945,
          },
          modifiedDate: {
            title: '修改时间',
            pattern: '13位时间戳',
            type: 'integer',
            description: '',
            format: 'int64',
            default: 1683871809947,
          },
          userId: {
            title: '用户ID',
            type: 'string',
            description: '',
            default: '9223372036854775807',
          },
          coin: {
            title: '币类型',
            type: 'string',
            description: 'Enum (金币:GOLD,VToken:VTOKEN)',
            enum: ['GOLD', 'VTOKEN'],
          },
          amount: {
            title: '金额',
            type: 'number',
            description: '',
          },
          direct: {
            title: '方向',
            type: 'string',
            description: 'Enum (加:ADD,减:SUB)',
            enum: ['ADD', 'SUB'],
          },
          transactionStatus: {
            title: '状态',
            type: 'string',
            description: 'Enum (等待:PENDING,成功:SUCCESS,失败:FAIL)',
            enum: ['PENDING', 'SUCCESS', 'FAIL'],
          },
          transactionType: {
            title: '交易类型',
            type: 'string',
            description:
              "[数据字典](/static/doc/data_dictionary.html) 格式:{'k':'编号','v':'值'}",
          },
          remark: {
            title: '描述',
            type: 'string',
            description: '',
          },
          selfAmount: {
            title: '交易前账户余额',
            type: 'number',
            description: '',
          },
          selfFreezeAmount: {
            title: '交易前账户冻结金额',
            type: 'number',
            description: '',
          },
        },
        description: '状态码为200时返回',
      },
      UserTaskLogsReportAO: {
        required: ['completedScheduleValue', 'scheduleValue'],
        type: 'object',
        properties: {
          id: {
            title: '用户任务记录ID',
            maximum: 9223372036854776000,
            minimum: 0,
            type: 'string',
            description: '',
            default: '9223372036854775807',
          },
          completedScheduleValue: {
            title: '任务已完成值（时间，数额）',
            maximum: 9223372036854776000,
            minimum: 0,
            type: 'string',
            description: '',
            default: '9223372036854775807',
          },
          scheduleValue: {
            title: '任务完成进度条件值（时间，数额）',
            maximum: 9223372036854776000,
            minimum: 0,
            type: 'string',
            description: '',
            default: '9223372036854775807',
          },
        },
      },
      BaseVO: {
        required: ['code', 'message', 'name', 'servertime', 'success'],
        type: 'object',
        properties: {
          success: {
            title: '是否成功',
            type: 'boolean',
            description: '状态码(200-299)都为成功',
          },
          code: {
            title: '状态码',
            type: 'integer',
            description:
              "程序执行中的一种状态'200:表示执行完毕,204:未获取到数据等[详情](/static/doc/response_code.html)",
            format: 'int32',
            example: 200,
          },
          message: {
            title: '状态消息',
            type: 'string',
            description: '',
            example: 'OK',
          },
          logno: {
            title: '日志编号',
            type: 'string',
            description: '本次请求的唯一标识,当无法解决问题时可把它发给工程师',
          },
          name: {
            title: '应用名称',
            type: 'string',
            description: '',
          },
          servertime: {
            title: '服务器时间',
            pattern: '13位时间戳',
            type: 'integer',
            description: '',
            format: 'int64',
            default: 1683871809972,
          },
        },
      },
      UserPassCardListAO: {
        type: 'object',
        properties: {
          effectiveStatus: {
            title: '有效中或已过期状态',
            type: 'string',
            description: 'Enum (有效中:effective,已过期:expired)',
            enum: ['effective', 'expired'],
          },
        },
      },
      ListVOUserPassCardOrderListVO: {
        required: ['code', 'data', 'message', 'name', 'servertime', 'success'],
        type: 'object',
        properties: {
          success: {
            title: '是否成功',
            type: 'boolean',
            description: '状态码(200-299)都为成功',
          },
          code: {
            title: '状态码',
            type: 'integer',
            description:
              "程序执行中的一种状态'200:表示执行完毕,204:未获取到数据等[详情](/static/doc/response_code.html)",
            format: 'int32',
            example: 200,
          },
          message: {
            title: '状态消息',
            type: 'string',
            description: '',
            example: 'OK',
          },
          logno: {
            title: '日志编号',
            type: 'string',
            description: '本次请求的唯一标识,当无法解决问题时可把它发给工程师',
          },
          name: {
            title: '应用名称',
            type: 'string',
            description: '',
          },
          servertime: {
            title: '服务器时间',
            pattern: '13位时间戳',
            type: 'integer',
            description: '',
            format: 'int64',
            default: 1683871810048,
          },
          data: {
            title: '响应数据',
            type: 'array',
            description: '状态码为200时返回',
            items: {
              $ref: '#/components/schemas/UserPassCardOrderListVO',
            },
          },
        },
      },
      UserPassCardOrderListVO: {
        title: '响应数据',
        type: 'object',
        properties: {
          orderId: {
            title: '订单ID',
            type: 'string',
            description: '',
          },
          orderTime: {
            title: '订单时间',
            type: 'string',
            description: '',
            default: '9223372036854775807',
          },
          name: {
            title: 'PASS卡名称',
            type: 'string',
            description: '',
          },
          level: {
            title: 'PASS卡级别类型',
            type: 'string',
            description:
              'Enum (体验PASS卡:zero,1级PASS卡:one,2级PASS卡:two,3级PASS卡:three,4级PASS卡:four,5级PASS卡:five)',
            enum: ['zero', 'one', 'two', 'three', 'four', 'five'],
          },
          collectNum: {
            title: '用户已兑换数额',
            type: 'integer',
            description: '',
            format: 'int32',
          },
          maxLimit: {
            title: '未到期PASS卡同时存在的数额最大限制',
            type: 'integer',
            description: '',
            format: 'int32',
          },
          costTokenAmount: {
            title: '兑换PASS卡花费的token数额(number)',
            type: 'number',
            description: '',
          },
          basePeriodEarningRate: {
            title: 'PASS卡基础周期收益率(number)',
            type: 'number',
            description: '',
          },
          currentPeriodEarningRate: {
            title: 'PASS卡当前周期收益率(number)',
            type: 'number',
            description: '',
          },
          periodDecrEarningRate: {
            title: 'PASS卡每期递减收益率(默认0.5%)(number)',
            type: 'number',
            description: '',
          },
          periodIncrDays: {
            title: 'PASS卡每周期递增天数(默认2)',
            type: 'integer',
            description: '',
            format: 'int32',
          },
          userTotalProduction: {
            title: '用户已领取PASS卡总产量(number)',
            type: 'number',
            description: '',
          },
          totalProduction: {
            title: 'PASS卡总产量(number)',
            type: 'number',
            description: '',
          },
          periodDays: {
            title: 'PASS卡基础周期天数',
            type: 'integer',
            description: '',
            format: 'int32',
          },
          currentPeriodDays: {
            title: 'PASS卡当期周期天数',
            type: 'integer',
            description: '',
            format: 'int32',
          },
          week: {
            title: '第几周数',
            type: 'integer',
            description: '',
            format: 'int32',
          },
          activation: {
            title: '股份数',
            type: 'number',
            description: '',
          },
          effectiveDays: {
            title: 'PASS卡基础有效天数',
            type: 'integer',
            description: '',
            format: 'int32',
          },
          periodExporeTime: {
            title: '卡的周期到期时间(number 时间戳s)',
            type: 'string',
            description: '',
            default: '9223372036854775807',
          },
          exporeTime: {
            title: '卡到期时间(number 时间戳s)',
            type: 'string',
            description: '',
            default: '9223372036854775807',
          },
        },
        description: '状态码为200时返回',
      },
      UserExchangePassCardOrderAO: {
        type: 'object',
        properties: {
          passCardId: {
            title: 'Pass卡唯一ID',
            maximum: 9223372036854776000,
            minimum: 0,
            type: 'string',
            description: '',
            default: '9223372036854775807',
          },
        },
      },
      PassCardListAO: {
        type: 'object',
      },
      ListVOPassCardListVO: {
        required: ['code', 'data', 'message', 'name', 'servertime', 'success'],
        type: 'object',
        properties: {
          success: {
            title: '是否成功',
            type: 'boolean',
            description: '状态码(200-299)都为成功',
          },
          code: {
            title: '状态码',
            type: 'integer',
            description:
              "程序执行中的一种状态'200:表示执行完毕,204:未获取到数据等[详情](/static/doc/response_code.html)",
            format: 'int32',
            example: 200,
          },
          message: {
            title: '状态消息',
            type: 'string',
            description: '',
            example: 'OK',
          },
          logno: {
            title: '日志编号',
            type: 'string',
            description: '本次请求的唯一标识,当无法解决问题时可把它发给工程师',
          },
          name: {
            title: '应用名称',
            type: 'string',
            description: '',
          },
          servertime: {
            title: '服务器时间',
            pattern: '13位时间戳',
            type: 'integer',
            description: '',
            format: 'int64',
            default: 1683871810184,
          },
          data: {
            title: '响应数据',
            type: 'array',
            description: '状态码为200时返回',
            items: {
              $ref: '#/components/schemas/PassCardListVO',
            },
          },
        },
      },
      PassCardListVO: {
        title: '响应数据',
        type: 'object',
        properties: {
          id: {
            title: 'PASS卡唯一ID',
            type: 'string',
            description: '',
            default: '9223372036854775807',
          },
          name: {
            title: 'PASS卡名称',
            type: 'string',
            description: '',
          },
          level: {
            title: 'PASS卡级别类型',
            type: 'string',
            description:
              'Enum (体验PASS卡:zero,1级PASS卡:one,2级PASS卡:two,3级PASS卡:three,4级PASS卡:four,5级PASS卡:five)',
            enum: ['zero', 'one', 'two', 'three', 'four', 'five'],
          },
          maxLimit: {
            title: '未到期PASS卡同时存在的数额最大限制',
            type: 'integer',
            description: '',
            format: 'int32',
          },
          costTokenAmount: {
            title: '兑换PASS卡所需要的token数额(number)',
            type: 'number',
            description: '',
          },
          basePeriodEarningRate: {
            title: 'PASS卡基础周期收益率(number)',
            type: 'number',
            description: '',
          },
          currentPeriodEarningRate: {
            title: 'PASS卡当前周期收益率(界面展示收益率)(number)',
            type: 'number',
            description: '',
          },
          periodDecrEarningRate: {
            title: 'PASS卡每期递减收益率(默认0.5%)(number)',
            type: 'number',
            description: '',
          },
          periodIncrDays: {
            title: 'PASS卡每周期递增天数(默认2)',
            type: 'integer',
            description: '',
            format: 'int32',
          },
          totalProduction: {
            title: 'PASS卡总产量(number)',
            type: 'number',
            description: '',
          },
          periodDays: {
            title: 'PASS卡基础周期天数',
            type: 'integer',
            description: '',
            format: 'int32',
          },
          currentPeriodDays: {
            title: 'PASS卡当期周期天数',
            type: 'integer',
            description: '',
            format: 'int32',
          },
          week: {
            title: '第几周数',
            type: 'integer',
            description: '',
            format: 'int32',
          },
          activation: {
            title: '股份数(number)',
            type: 'number',
            description: '',
          },
          effectiveDays: {
            title: 'PASS卡基础有效天数',
            type: 'integer',
            description: '',
            format: 'int32',
          },
          status: {
            title: 'PASS卡状态',
            type: 'string',
            description: 'Enum (启用:enable,停用:disabled)',
            enum: ['enable', 'disabled'],
          },
        },
        description: '状态码为200时返回',
      },
      GameInfoAO: {
        type: 'object',
        properties: {
          id: {
            title: 'gameInfoId',
            maximum: 9223372036854776000,
            minimum: 0,
            type: 'string',
            description: '',
            default: '9223372036854775807',
          },
          name: {
            title: '名称',
            type: 'string',
            description: '',
          },
          icon: {
            title: '图标',
            type: 'string',
            description: '',
          },
          type: {
            title: '类型',
            type: 'string',
            description: 'Enum (H5:H5)',
            enum: ['H5'],
          },
          content: {
            title: '内容',
            type: 'string',
            description: '',
          },
          proportion: {
            title: '金币与游戏币兑换比例',
            type: 'number',
            description: '',
          },
        },
      },
      GameCreateVO: {
        title: '响应数据',
        type: 'object',
        properties: {
          gameId: {
            title: '游戏ID',
            type: 'string',
            description: '',
            default: '9223372036854775807',
          },
          accessId: {
            title: '访问ID',
            type: 'string',
            description: '',
          },
          accessKey: {
            title: '访问Key',
            type: 'string',
            description: '',
          },
        },
        description: '状态码为200时返回',
      },
      ObjectVOGameCreateVO: {
        required: ['code', 'data', 'message', 'name', 'servertime', 'success'],
        type: 'object',
        properties: {
          success: {
            title: '是否成功',
            type: 'boolean',
            description: '状态码(200-299)都为成功',
          },
          code: {
            title: '状态码',
            type: 'integer',
            description:
              "程序执行中的一种状态'200:表示执行完毕,204:未获取到数据等[详情](/static/doc/response_code.html)",
            format: 'int32',
            example: 200,
          },
          message: {
            title: '状态消息',
            type: 'string',
            description: '',
            example: 'OK',
          },
          logno: {
            title: '日志编号',
            type: 'string',
            description: '本次请求的唯一标识,当无法解决问题时可把它发给工程师',
          },
          name: {
            title: '应用名称',
            type: 'string',
            description: '',
          },
          servertime: {
            title: '服务器时间',
            pattern: '13位时间戳',
            type: 'integer',
            description: '',
            format: 'int64',
            default: 1683871810225,
          },
          data: {
            $ref: '#/components/schemas/GameCreateVO',
          },
        },
      },
      ObjectVOUserWalletInfoVO: {
        required: ['code', 'data', 'message', 'name', 'servertime', 'success'],
        type: 'object',
        properties: {
          success: {
            title: '是否成功',
            type: 'boolean',
            description: '状态码(200-299)都为成功',
          },
          code: {
            title: '状态码',
            type: 'integer',
            description:
              "程序执行中的一种状态'200:表示执行完毕,204:未获取到数据等[详情](/static/doc/response_code.html)",
            format: 'int32',
            example: 200,
          },
          message: {
            title: '状态消息',
            type: 'string',
            description: '',
            example: 'OK',
          },
          logno: {
            title: '日志编号',
            type: 'string',
            description: '本次请求的唯一标识,当无法解决问题时可把它发给工程师',
          },
          name: {
            title: '应用名称',
            type: 'string',
            description: '',
          },
          servertime: {
            title: '服务器时间',
            pattern: '13位时间戳',
            type: 'integer',
            description: '',
            format: 'int64',
            default: 1683871810256,
          },
          data: {
            $ref: '#/components/schemas/UserWalletInfoVO',
          },
        },
      },
      UserWalletInfoVO: {
        title: '响应数据',
        type: 'object',
        properties: {
          level: {
            title: '用户个人等级',
            type: 'integer',
            description: '',
            format: 'int32',
          },
          temLevel: {
            title: '用户团队等级',
            type: 'integer',
            description: '',
            format: 'int32',
          },
          collectNum: {
            title: '用户已拥有pass卡数量',
            type: 'integer',
            description: '',
            format: 'int32',
          },
          coin: {
            title: '币类型',
            type: 'string',
            description: 'Enum (金币:GOLD,VToken:VTOKEN)',
            enum: ['GOLD', 'VTOKEN'],
          },
          tokenAmount: {
            title: '余额(number)',
            type: 'number',
            description: '',
          },
          tokenPriceRp: {
            title: '余额价值Rp(number)',
            type: 'number',
            description: '',
          },
          tokenPrice: {
            title: 'vtoken 币价(number)',
            type: 'number',
            description: '',
          },
          tokenPriceIncrease: {
            title: 'token 币价涨幅[-0.025 , 0.025]',
            type: 'number',
            description: '',
          },
        },
        description: '状态码为200时返回',
      },
      ObjectVOUserTaskInfoVO: {
        required: ['code', 'data', 'message', 'name', 'servertime', 'success'],
        type: 'object',
        properties: {
          success: {
            title: '是否成功',
            type: 'boolean',
            description: '状态码(200-299)都为成功',
          },
          code: {
            title: '状态码',
            type: 'integer',
            description:
              "程序执行中的一种状态'200:表示执行完毕,204:未获取到数据等[详情](/static/doc/response_code.html)",
            format: 'int32',
            example: 200,
          },
          message: {
            title: '状态消息',
            type: 'string',
            description: '',
            example: 'OK',
          },
          logno: {
            title: '日志编号',
            type: 'string',
            description: '本次请求的唯一标识,当无法解决问题时可把它发给工程师',
          },
          name: {
            title: '应用名称',
            type: 'string',
            description: '',
          },
          servertime: {
            title: '服务器时间',
            pattern: '13位时间戳',
            type: 'integer',
            description: '',
            format: 'int64',
            default: 1683871810276,
          },
          data: {
            $ref: '#/components/schemas/UserTaskInfoVO',
          },
        },
      },
      UserTaskInfoVO: {
        title: '响应数据',
        type: 'object',
        properties: {
          tasks: {
            title: '我的今日任务列表',
            type: 'array',
            description: '',
            items: {
              $ref: '#/components/schemas/UserTaskItemVO',
            },
          },
          completedRate: {
            title: '完成比例[0-1]（=1任务全部完成）',
            type: 'number',
            description: '',
          },
          estimateTokenAmount: {
            title: '预计完成任务可获得的vToken数(number)',
            type: 'number',
            description: '',
          },
          tokenAmount: {
            title: '今日完成任务已获得token数(number)',
            type: 'number',
            description: '',
          },
          tokenToRp: {
            title: '今日完成任务已获得token价值Rp(number)',
            type: 'number',
            description: '',
          },
          goldAmount: {
            title: '今日完成任务已获得金币数(number)',
            type: 'number',
            description: '',
          },
        },
        description: '状态码为200时返回',
      },
      UserTaskItemVO: {
        title: '我的今日任务列表',
        type: 'object',
        properties: {
          id: {
            title: '用户任务记录ID',
            type: 'string',
            description: '',
            default: '9223372036854775807',
          },
          userId: {
            title: '用户唯一ID',
            type: 'string',
            description: '',
            default: '9223372036854775807',
          },
          name: {
            title: '任务名称',
            type: 'string',
            description: '',
          },
          completedScheduleValue: {
            title: '任务已完成值（时间，数额）',
            type: 'string',
            description: '',
            default: '9223372036854775807',
          },
          scheduleValue: {
            title: '任务完成进度条件值（时间，数额）',
            type: 'string',
            description: '',
            default: '9223372036854775807',
          },
          completeStatus: {
            title: '是否完成状态',
            type: 'string',
            description:
              'Enum (完成:complete,进行中:inProgress,未完成:unComplete)',
            enum: ['complete', 'inProgress', 'unComplete'],
          },
        },
      },
      PageVOUserTaskLogsHistoryPageVO: {
        required: [
          'code',
          'data',
          'message',
          'name',
          'servertime',
          'success',
          'total',
        ],
        type: 'object',
        properties: {
          success: {
            title: '是否成功',
            type: 'boolean',
            description: '状态码(200-299)都为成功',
          },
          code: {
            title: '状态码',
            type: 'integer',
            description:
              "程序执行中的一种状态'200:表示执行完毕,204:未获取到数据等[详情](/static/doc/response_code.html)",
            format: 'int32',
            example: 200,
          },
          message: {
            title: '状态消息',
            type: 'string',
            description: '',
            example: 'OK',
          },
          logno: {
            title: '日志编号',
            type: 'string',
            description: '本次请求的唯一标识,当无法解决问题时可把它发给工程师',
          },
          name: {
            title: '应用名称',
            type: 'string',
            description: '',
          },
          servertime: {
            title: '服务器时间',
            pattern: '13位时间戳',
            type: 'integer',
            description: '',
            format: 'int64',
            default: 1683871810302,
          },
          data: {
            title: '响应数据',
            type: 'array',
            description: '状态码为200时返回',
            items: {
              $ref: '#/components/schemas/UserTaskLogsHistoryPageVO',
            },
          },
          total: {
            title: '总记录数',
            type: 'integer',
            description: '',
            format: 'int32',
          },
        },
      },
      UserTaskLogsHistoryPageVO: {
        title: '响应数据',
        type: 'object',
        properties: {
          makeTimestamp: {
            title: '做任务日期(保存时间戳)',
            type: 'string',
            description: '',
            default: '9223372036854775807',
          },
          items: {
            title: '每日任务列表',
            type: 'array',
            description: '',
            items: {
              $ref: '#/components/schemas/UserTaskItemVO',
            },
          },
          havingReward: {
            title: '是否有奖励（true-是）',
            type: 'boolean',
            description: '',
          },
        },
        description: '状态码为200时返回',
      },
      ListVOUserCoinAssetsVO: {
        required: ['code', 'data', 'message', 'name', 'servertime', 'success'],
        type: 'object',
        properties: {
          success: {
            title: '是否成功',
            type: 'boolean',
            description: '状态码(200-299)都为成功',
          },
          code: {
            title: '状态码',
            type: 'integer',
            description:
              "程序执行中的一种状态'200:表示执行完毕,204:未获取到数据等[详情](/static/doc/response_code.html)",
            format: 'int32',
            example: 200,
          },
          message: {
            title: '状态消息',
            type: 'string',
            description: '',
            example: 'OK',
          },
          logno: {
            title: '日志编号',
            type: 'string',
            description: '本次请求的唯一标识,当无法解决问题时可把它发给工程师',
          },
          name: {
            title: '应用名称',
            type: 'string',
            description: '',
          },
          servertime: {
            title: '服务器时间',
            pattern: '13位时间戳',
            type: 'integer',
            description: '',
            format: 'int64',
            default: 1683871810354,
          },
          data: {
            title: '响应数据',
            type: 'array',
            description: '状态码为200时返回',
            items: {
              $ref: '#/components/schemas/UserCoinAssetsVO',
            },
          },
        },
      },
      UserCoinAssetsVO: {
        title: '响应数据',
        type: 'object',
        properties: {
          id: {
            title: '主键Id',
            type: 'string',
            description: '',
            default: '9223372036854775807',
          },
          createdDate: {
            title: '创建时间',
            pattern: '13位时间戳',
            type: 'integer',
            description: '',
            format: 'int64',
            default: 1683871810360,
          },
          modifiedDate: {
            title: '修改时间',
            pattern: '13位时间戳',
            type: 'integer',
            description: '',
            format: 'int64',
            default: 1683871810363,
          },
          coin: {
            title: '币类型',
            type: 'string',
            description: 'Enum (金币:GOLD,VToken:VTOKEN)',
            enum: ['GOLD', 'VTOKEN'],
          },
          amount: {
            title: '金额',
            type: 'number',
            description: '',
          },
          freezeAmount: {
            title: '冻结金额',
            type: 'number',
            description: '',
          },
        },
        description: '状态码为200时返回',
      },
      ObjectVOUserAccountVO: {
        required: ['code', 'data', 'message', 'name', 'servertime', 'success'],
        type: 'object',
        properties: {
          success: {
            title: '是否成功',
            type: 'boolean',
            description: '状态码(200-299)都为成功',
          },
          code: {
            title: '状态码',
            type: 'integer',
            description:
              "程序执行中的一种状态'200:表示执行完毕,204:未获取到数据等[详情](/static/doc/response_code.html)",
            format: 'int32',
            example: 200,
          },
          message: {
            title: '状态消息',
            type: 'string',
            description: '',
            example: 'OK',
          },
          logno: {
            title: '日志编号',
            type: 'string',
            description: '本次请求的唯一标识,当无法解决问题时可把它发给工程师',
          },
          name: {
            title: '应用名称',
            type: 'string',
            description: '',
          },
          servertime: {
            title: '服务器时间',
            pattern: '13位时间戳',
            type: 'integer',
            description: '',
            format: 'int64',
            default: 1683871810384,
          },
          data: {
            $ref: '#/components/schemas/UserAccountVO',
          },
        },
      },
      UserAccountVO: {
        title: '响应数据',
        type: 'object',
        properties: {
          id: {
            title: '主键Id',
            type: 'string',
            description: '',
            default: '9223372036854775807',
          },
          createdDate: {
            title: '创建时间',
            pattern: '13位时间戳',
            type: 'integer',
            description: '',
            format: 'int64',
            default: 1683871810397,
          },
          modifiedDate: {
            title: '修改时间',
            pattern: '13位时间戳',
            type: 'integer',
            description: '',
            format: 'int64',
            default: 1683871810400,
          },
          userInfo: {
            $ref: '#/components/schemas/VnUserInfoVO',
          },
        },
        description: '状态码为200时返回',
      },
      VnUserInfoVO: {
        title: 'Vn用户信息',
        type: 'object',
        properties: {
          userId: {
            title: '用户Id',
            type: 'string',
            description: '',
            default: '9223372036854775807',
          },
          nickName: {
            title: '昵称',
            type: 'string',
            description: '',
          },
          timeZone: {
            title: '时区',
            type: 'string',
            description: '',
          },
          avatar: {
            title: '头像',
            type: 'string',
            description: '',
          },
          createTime: {
            title: '创建时间',
            pattern: '13位时间戳',
            type: 'integer',
            description: '',
            format: 'int64',
            default: 1683871810397,
          },
        },
      },
      ObjectVOPassCardDetailVO: {
        required: ['code', 'data', 'message', 'name', 'servertime', 'success'],
        type: 'object',
        properties: {
          success: {
            title: '是否成功',
            type: 'boolean',
            description: '状态码(200-299)都为成功',
          },
          code: {
            title: '状态码',
            type: 'integer',
            description:
              "程序执行中的一种状态'200:表示执行完毕,204:未获取到数据等[详情](/static/doc/response_code.html)",
            format: 'int32',
            example: 200,
          },
          message: {
            title: '状态消息',
            type: 'string',
            description: '',
            example: 'OK',
          },
          logno: {
            title: '日志编号',
            type: 'string',
            description: '本次请求的唯一标识,当无法解决问题时可把它发给工程师',
          },
          name: {
            title: '应用名称',
            type: 'string',
            description: '',
          },
          servertime: {
            title: '服务器时间',
            pattern: '13位时间戳',
            type: 'integer',
            description: '',
            format: 'int64',
            default: 1683871810459,
          },
          data: {
            $ref: '#/components/schemas/PassCardDetailVO',
          },
        },
      },
      PassCardDetailVO: {
        title: '响应数据',
        type: 'object',
        properties: {
          id: {
            title: 'PASS卡唯一ID',
            type: 'string',
            description: '',
            default: '9223372036854775807',
          },
          name: {
            title: 'PASS卡名称',
            type: 'string',
            description: '',
          },
          level: {
            title: 'PASS卡级别类型',
            type: 'string',
            description:
              'Enum (体验PASS卡:zero,1级PASS卡:one,2级PASS卡:two,3级PASS卡:three,4级PASS卡:four,5级PASS卡:five)',
            enum: ['zero', 'one', 'two', 'three', 'four', 'five'],
          },
          maxLimit: {
            title: '未到期PASS卡同时存在的数额最大限制',
            type: 'integer',
            description: '',
            format: 'int32',
          },
          costTokenAmount: {
            title: '兑换PASS卡所需要的token数额(number)',
            type: 'number',
            description: '',
          },
          basePeriodEarningRate: {
            title: 'PASS卡基础周期收益率(number)',
            type: 'number',
            description: '',
          },
          currentPeriodEarningRate: {
            title: 'PASS卡当前周期收益率(界面展示收益率)(number)',
            type: 'number',
            description: '',
          },
          periodDecrEarningRate: {
            title: 'PASS卡每期递减收益率(默认0.5%)(number)',
            type: 'number',
            description: '',
          },
          periodIncrDays: {
            title: 'PASS卡每周期递增天数(默认2)',
            type: 'integer',
            description: '',
            format: 'int32',
          },
          totalProduction: {
            title: 'PASS卡总产量(number)',
            type: 'number',
            description: '',
          },
          periodDays: {
            title: 'PASS卡基础周期天数',
            type: 'integer',
            description: '',
            format: 'int32',
          },
          currentPeriodDays: {
            title: 'PASS卡当期周期天数',
            type: 'integer',
            description: '',
            format: 'int32',
          },
          week: {
            title: '第几周数',
            type: 'integer',
            description: '',
            format: 'int32',
          },
          activation: {
            title: '股份数(number)',
            type: 'number',
            description: '',
          },
          effectiveDays: {
            title: 'PASS卡基础有效天数',
            type: 'integer',
            description: '',
            format: 'int32',
          },
          status: {
            title: 'PASS卡状态',
            type: 'string',
            description: 'Enum (启用:enable,停用:disabled)',
            enum: ['enable', 'disabled'],
          },
          collectNum: {
            title: '用户已收集卡数额',
            type: 'integer',
            description: '',
            format: 'int32',
          },
          exporeTime: {
            title: '卡到期时间(时间戳s)',
            type: 'string',
            description: '',
            default: '9223372036854775807',
          },
        },
        description: '状态码为200时返回',
      },
      ObjectVOString: {
        required: ['code', 'data', 'message', 'name', 'servertime', 'success'],
        type: 'object',
        properties: {
          success: {
            title: '是否成功',
            type: 'boolean',
            description: '状态码(200-299)都为成功',
          },
          code: {
            title: '状态码',
            type: 'integer',
            description:
              "程序执行中的一种状态'200:表示执行完毕,204:未获取到数据等[详情](/static/doc/response_code.html)",
            format: 'int32',
            example: 200,
          },
          message: {
            title: '状态消息',
            type: 'string',
            description: '',
            example: 'OK',
          },
          logno: {
            title: '日志编号',
            type: 'string',
            description: '本次请求的唯一标识,当无法解决问题时可把它发给工程师',
          },
          name: {
            title: '应用名称',
            type: 'string',
            description: '',
          },
          servertime: {
            title: '服务器时间',
            pattern: '13位时间戳',
            type: 'integer',
            description: '',
            format: 'int64',
            default: 1683871810572,
          },
          data: {
            title: '响应数据',
            type: 'string',
            description: '状态码为200时返回',
          },
        },
      },
    },
    securitySchemes: {
      Authorization: {
        type: 'apiKey',
        description: '登录后返回的Token',
        name: 'Authorization',
        in: 'header',
      },
    },
  },
};

class SwaggerHelper {
  /**
   * @type typeof FULL_JSON
   */
  fullJson;

  /**
   * @type any[]
   */
  modelList;

  /**
   * @type any[]
   */
  apiList;
  /**
   * @param {*} fullJson
   */
  constructor(fullJson) {
    this.fullJson = fullJson;
    this.normalize();
  }
  normalize() {
    const fullJson = this.fullJson;
    const modelMaps = fullJson.components.schemas;
    this.modelList = Object.keys(modelMaps).map((modelName) => {
      return {
        modelName,
        ...modelMaps[modelName],
      };
    });
  }

  genModelFilePromptAll() {
    const groupList = this._groupList(this.modelList, 5);

    const str = groupList
      .map((item) => {
        return this._genModelFilePrompt(item);
      })
      .join('\r\n\n\n==============\n\n\n\n');
    console.log(str);
    return str;
  }

  genModelFilePrompt(modelName) {
    const modelItem = this.modelList.find(
      (item) => item.modelName === modelName
    );
    if (!modelItem) {
      console.log('未找到modelName', modelName);
      console.log(
        '当前实体:',
        this.modelList.map((item) => item.modelName).join(',')
      );
      return;
    }
    const str = [modelItem]
      .map((item) => {
        return this._genModelFilePrompt(item);
      })
      .join('\r\n\n\n==============\n\n\n\n');
    console.log(str);
  }

  /**
   * 分组
   * @param {any[]} list
   * @param {Number} groupCount
   */
  _groupList(list, groupCount) {
    const groupList = [];
    let curGroup = [];
    list.forEach((item, idx) => {
      if (idx % groupCount === 0) {
        curGroup = [];
        groupList.push(curGroup);
      }
      curGroup.push(item);
    });
    return groupList;
  }
  /**
   * 生成提示词
   * @param {any[]} modelList
   */
  _genModelFilePrompt(modelList) {
    return `
下面这个swagger实体对象生成一系列实体，要求语言使用ts语言，要有实体接口注释和实体字段注释，注释信息详细点，注释要求注释在字段或实体上面，用/**
* xxx
*/这个注释，要求输出代码就可以。注意：ListVO、ObjectAO开头的实体忽略。swagger对象如下
${JSON.stringify(modelList)}

`;
  }
}

const swaggerHelper = new SwaggerHelper(FULL_JSON);

swaggerHelper.genModelFilePromptAll();

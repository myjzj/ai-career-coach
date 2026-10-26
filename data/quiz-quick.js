/* 随堂小测：每节知识卡 1 道判断题（与每日测验的 2 道选择题组成 3 题） */
window.QUICK_QUIZ = [
  // W1
  { id: "qq-w01d1", week: 1, day: 1, dayId: "w01d1", topic: "Python", q: "dict 的 key 可以是 list。", options: ["正确", "错误"], answer: 1, explain: "list 不可哈希，不能作为 dict 的 key；可用 tuple/字符串/数字等不可变对象。" },
  { id: "qq-w01d2", week: 1, day: 2, dayId: "w01d2", topic: "Python", q: "Python 的 Protocol 要求实现类显式继承它。", options: ["正确", "错误"], answer: 1, explain: "Protocol 是结构化子类型，只要方法签名匹配即可，不需要显式继承。" },
  { id: "qq-w01d3", week: 1, day: 3, dayId: "w01d3", topic: "测试", q: "pytest 的 session fixture 在整个测试会话中只创建一次。", options: ["正确", "错误"], answer: 0, explain: "session 作用域最大，适合数据库连接等全局资源；function 才是每个用例一次。" },
  { id: "qq-w01d4", week: 1, day: 4, dayId: "w01d4", topic: "SSE", q: "SSE 是双向协议，客户端可以持续向服务端推送消息。", options: ["正确", "错误"], answer: 1, explain: "SSE 是单向 server→client；双向通信用 WebSocket。" },
  { id: "qq-w01d5", week: 1, day: 5, dayId: "w01d5", topic: "配置", q: "环境变量的优先级通常高于配置文件。", options: ["正确", "错误"], answer: 0, explain: "部署时用环境变量覆盖配置，默认值兜底。" },
  { id: "qq-w01d6", week: 1, day: 6, dayId: "w01d6", topic: "上下文", q: "对话历史超过上下文窗口时，直接删除最早的消息一定不会丢信息。", options: ["正确", "错误"], answer: 1, explain: "可能丢用户偏好、硬约束和未完成事项；应结合摘要和结构化保留。" },
  { id: "qq-w01d7", week: 1, day: 7, dayId: "w01d7", topic: "复盘", q: "复盘时只要收藏错题，不需要重做，也能真正掌握。", options: ["正确", "错误"], answer: 1, explain: "错题要在 24 小时内重做并写原因，否则只是收藏。" },

  // W2
  { id: "qq-w02d1", week: 2, day: 1, dayId: "w02d1", topic: "FastAPI", q: "FastAPI 的 Depends 默认在整个进程生命周期只缓存一次。", options: ["正确", "错误"], answer: 1, explain: "默认是请求级缓存（use_cache=True），不是全局单例。" },
  { id: "qq-w02d2", week: 2, day: 2, dayId: "w02d2", topic: "Pydantic", q: "model_validator 适合做跨字段校验，例如结束时间必须晚于开始时间。", options: ["正确", "错误"], answer: 0, explain: "field validator 管单字段，model_validator 管跨字段/整模型。" },
  { id: "qq-w02d3", week: 2, day: 3, dayId: "w02d3", topic: "SQLAlchemy", q: "AsyncSession 可以在多个并发协程之间安全共享。", options: ["正确", "错误"], answer: 1, explain: "Session 不是并发安全的，应按请求/任务创建。" },
  { id: "qq-w02d4", week: 2, day: 4, dayId: "w02d4", topic: "SSE", q: "客户端断开流式连接后，服务端应继续生成并照常计费。", options: ["正确", "错误"], answer: 1, explain: "应取消上游、释放连接、记录部分用量，避免浪费成本。" },
  { id: "qq-w02d5", week: 2, day: 5, dayId: "w02d5", topic: "Docker", q: "Docker 多阶段构建可以把编译依赖留在构建阶段，减小运行时镜像。", options: ["正确", "错误"], answer: 0, explain: "最终镜像只拷运行时产物，体积和攻击面更小。" },
  { id: "qq-w02d6", week: 2, day: 6, dayId: "w02d6", topic: "压测", q: "流式接口压测只需要看 QPS，不需要看首 token 和 P95。", options: ["正确", "错误"], answer: 1, explain: "流式体验由首 token、长尾延迟、错误率共同决定。" },
  { id: "qq-w02d7", week: 2, day: 7, dayId: "w02d7", topic: "测试", q: "服务化后只要接口能返回，就不需要测试错误和断连路径。", options: ["正确", "错误"], answer: 1, explain: "错误、超时、断连才是线上高频问题，必须覆盖。" },

  // W3
  { id: "qq-w03d1", week: 3, day: 1, dayId: "w03d1", topic: "Token", q: "同一句中文在不同模型上的 token 数可能不同。", options: ["正确", "错误"], answer: 0, explain: "词表、切分算法和训练语料不同，token 数会不同。" },
  { id: "qq-w03d2", week: 3, day: 2, dayId: "w03d2", topic: "Embedding", q: "向量归一化后，余弦相似度和点积的排序等价。", options: ["正确", "错误"], answer: 0, explain: "归一化后模长为 1，点积等于余弦相似度。" },
  { id: "qq-w03d3", week: 3, day: 3, dayId: "w03d3", topic: "Attention", q: "self-attention 的复杂度随序列长度线性增长。", options: ["正确", "错误"], answer: 1, explain: "标准 self-attention 是 O(n²)，长上下文需要额外优化。" },
  { id: "qq-w03d4", week: 3, day: 4, dayId: "w03d4", topic: "训练", q: "SFT 主要使用人类偏好对来训练模型。", options: ["正确", "错误"], answer: 1, explain: "SFT 用指令-回答对；偏好对用于 RLHF/DPO。" },
  { id: "qq-w03d5", week: 3, day: 5, dayId: "w03d5", topic: "采样", q: "temperature 越低，输出通常越稳定。", options: ["正确", "错误"], answer: 0, explain: "低温让概率分布更尖锐，随机性更低。" },
  { id: "qq-w03d6", week: 3, day: 6, dayId: "w03d6", topic: "模型选择", q: "选模型时应先看排行榜，不需要业务评测集。", options: ["正确", "错误"], answer: 1, explain: "排行榜不等于业务效果，必须用自己的评测集和约束。" },
  { id: "qq-w03d7", week: 3, day: 7, dayId: "w03d7", topic: "采样", q: "temperature=0 就能保证跨平台完全可复现。", options: ["正确", "错误"], answer: 1, explain: "浮点、批处理、硬件和模型版本都会带来差异。" },

  // W4
  { id: "qq-w04d1", week: 4, day: 1, dayId: "w04d1", topic: "Prompt", q: "few-shot 示例越多，效果一定越好。", options: ["正确", "错误"], answer: 1, explain: "示例过多占上下文、可能过拟合示例风格；3–5 个覆盖边界常够。" },
  { id: "qq-w04d2", week: 4, day: 2, dayId: "w04d2", topic: "结构化输出", q: "开启 JSON mode 就能保证字段和语义都正确。", options: ["正确", "错误"], answer: 1, explain: "JSON mode 只保证语法像 JSON，仍要 schema/Pydantic 校验。" },
  { id: "qq-w04d3", week: 4, day: 3, dayId: "w04d3", topic: "工具调用", q: "function calling 由应用执行工具，而不是模型直接执行。", options: ["正确", "错误"], answer: 0, explain: "模型只输出调用意图和参数，应用校验后执行并回传结果。" },
  { id: "qq-w04d4", week: 4, day: 4, dayId: "w04d4", topic: "安全", q: "把检索到的文档当成可信系统指令是安全的。", options: ["正确", "错误"], answer: 1, explain: "文档是不可信输入，可能包含间接注入。" },
  { id: "qq-w04d5", week: 4, day: 5, dayId: "w04d5", topic: "评测", q: "LLM-as-judge 没有偏差，可以完全替代人工评测。", options: ["正确", "错误"], answer: 1, explain: "judge 有位置/长度/自我偏好等偏差，需要人工校准。" },
  { id: "qq-w04d6", week: 4, day: 6, dayId: "w04d6", topic: "结构化抽取", q: "让模型输出证据字段有助于降低胡编、方便复核。", options: ["正确", "错误"], answer: 0, explain: "证据把结论和原文绑定，便于校验。" },
  { id: "qq-w04d7", week: 4, day: 7, dayId: "w04d7", topic: "Prompt 工程", q: "Prompt 优化只要自己觉得好就行，不需要评测。", options: ["正确", "错误"], answer: 1, explain: "没有评测集就无法判断改动是否真的有效。" },

  // W5
  { id: "qq-w05d1", week: 5, day: 1, dayId: "w05d1", topic: "pgvector", q: "HNSW 的 ef_search 越大，查询通常越慢但召回更高。", options: ["正确", "错误"], answer: 0, explain: "查询候选集更大，召回上升、延迟增加。" },
  { id: "qq-w05d2", week: 5, day: 2, dayId: "w05d2", topic: "切分", q: "chunk 越大，检索越精确且成本越低。", options: ["正确", "错误"], answer: 1, explain: "大 chunk 会稀释 embedding、引入噪声、增加 token 成本。" },
  { id: "qq-w05d3", week: 5, day: 3, dayId: "w05d3", topic: "检索", q: "metadata filter 应该下推到检索层，而不是召回后再过滤。", options: ["正确", "错误"], answer: 0, explain: "先过滤再召回才能保证权限和召回数量。" },
  { id: "qq-w05d4", week: 5, day: 4, dayId: "w05d4", topic: "引用", q: "引用只需要写文档名，不需要定位到具体 chunk。", options: ["正确", "错误"], answer: 1, explain: "引用要能定位到 chunk/原文，才能验证。" },
  { id: "qq-w05d5", week: 5, day: 5, dayId: "w05d5", topic: "评测", q: "Recall@K 衡量的是生成答案是否忠于证据。", options: ["正确", "错误"], answer: 1, explain: "Recall@K 是检索指标；忠实度是生成指标。" },
  { id: "qq-w05d6", week: 5, day: 6, dayId: "w05d6", topic: "RAG", q: "RAG 优化前应先建立评测集和 baseline。", options: ["正确", "错误"], answer: 0, explain: "没有 baseline 无法判断优化是否有效。" },
  { id: "qq-w05d7", week: 5, day: 7, dayId: "w05d7", topic: "评测", q: "评测集只需要简单事实题，不需要无答案和边界题。", options: ["正确", "错误"], answer: 1, explain: "无答案、边界、跨文档、权限边界都需要覆盖。" },

  // W6
  { id: "qq-w06d1", week: 6, day: 1, dayId: "w06d1", topic: "BM25", q: "BM25 擅长精确关键词匹配，可以补向量检索的短板。", options: ["正确", "错误"], answer: 0, explain: "BM25 对专名、编号、错误码很有效，与 dense 互补。" },
  { id: "qq-w06d2", week: 6, day: 2, dayId: "w06d2", topic: "Rerank", q: "cross-encoder 适合对少量候选做精排。", options: ["正确", "错误"], answer: 0, explain: "联合编码精度高但慢，适合 top 50→top 10。" },
  { id: "qq-w06d3", week: 6, day: 3, dayId: "w06d3", topic: "Query 改写", q: "HyDE 没有幻觉风险，可以无脑开启。", options: ["正确", "错误"], answer: 1, explain: "假设答案可能编造错误事实，导致检索偏移。" },
  { id: "qq-w06d4", week: 6, day: 4, dayId: "w06d4", topic: "Parent-child", q: "parent-child 是“小块检索、大块生成”。", options: ["正确", "错误"], answer: 0, explain: "小块保证检索精度，父块提供完整上下文。" },
  { id: "qq-w06d5", week: 6, day: 5, dayId: "w06d5", topic: "RAGAS", q: "RAGAS 分数可以完全替代人工评测。", options: ["正确", "错误"], answer: 1, explain: "自动指标有偏差，适合回归和筛坏例。" },
  { id: "qq-w06d6", week: 6, day: 6, dayId: "w06d6", topic: "消融", q: "消融实验应一次只改一个变量。", options: ["正确", "错误"], answer: 0, explain: "否则无法归因提升来自哪个改动。" },
  { id: "qq-w06d7", week: 6, day: 7, dayId: "w06d7", topic: "取舍", q: "RAG 优化组件越多，效果一定越好。", options: ["正确", "错误"], answer: 1, explain: "组件增加延迟、成本和维护复杂度，要在 SLO 下取舍。" },

  // W7
  { id: "qq-w07d1", week: 7, day: 1, dayId: "w07d1", topic: "项目设计", q: "项目一开始就应确定 SLO 和评测集。", options: ["正确", "错误"], answer: 0, explain: "它们决定选型、验收和取舍。" },
  { id: "qq-w07d2", week: 7, day: 2, dayId: "w07d2", topic: "Ingestion", q: "ingestion 适合同步处理所有大文件，用户体验更好。", options: ["正确", "错误"], answer: 1, explain: "解析/embedding 慢且易失败，应异步、可重试。" },
  { id: "qq-w07d3", week: 7, day: 3, dayId: "w07d3", topic: "增量索引", q: "文档更新时应保留旧 chunk，避免丢数据。", options: ["正确", "错误"], answer: 1, explain: "旧 chunk 会导致召回过期内容，应删除或标记失效。" },
  { id: "qq-w07d4", week: 7, day: 4, dayId: "w07d4", topic: "拒答", q: "拒答阈值设得越高，误拒通常越多。", options: ["正确", "错误"], answer: 0, explain: "更保守会拒绝更多可回答问题，需要评测调参。" },
  { id: "qq-w07d5", week: 7, day: 5, dayId: "w07d5", topic: "多租户", q: "多租户检索可以先全库召回，再在应用层过滤。", options: ["正确", "错误"], answer: 1, explain: "会越权且召回数量不足，必须检索前过滤。" },
  { id: "qq-w07d6", week: 7, day: 6, dayId: "w07d6", topic: "演示", q: "demo 应先讲问题和约束，再讲技术栈。", options: ["正确", "错误"], answer: 0, explain: "先让观众理解价值，再讲实现。" },
  { id: "qq-w07d7", week: 7, day: 7, dayId: "w07d7", topic: "项目复盘", q: "主链路还没稳定时，应优先加新功能。", options: ["正确", "错误"], answer: 1, explain: "先保主链路、指标和权限，再扩展。" },

  // W8
  { id: "qq-w08d1", week: 8, day: 1, dayId: "w08d1", topic: "Docker", q: "Compose 的健康检查可以避免依赖未就绪就启动。", options: ["正确", "错误"], answer: 0, explain: "healthcheck + depends_on condition 解决启动竞态。" },
  { id: "qq-w08d2", week: 8, day: 2, dayId: "w08d2", topic: "缓存", q: "语义缓存没有串答案风险。", options: ["正确", "错误"], answer: 1, explain: "相似问题可能意图不同，必须设阈值、租户和版本。" },
  { id: "qq-w08d3", week: 8, day: 3, dayId: "w08d3", topic: "可观测性", q: "trace 只记录最终答案就够了。", options: ["正确", "错误"], answer: 1, explain: "需要记录检索、prompt、模型、工具、token、延迟和错误。" },
  { id: "qq-w08d4", week: 8, day: 4, dayId: "w08d4", topic: "评测 CI", q: "RAG 评测应接入 CI 做回归。", options: ["正确", "错误"], answer: 0, explain: "固定评测集 + 阈值能阻止回归。" },
  { id: "qq-w08d5", week: 8, day: 5, dayId: "w08d5", topic: "压测", q: "压测发现 P95 高，应先分段计时定位瓶颈。", options: ["正确", "错误"], answer: 0, explain: "先定位检索、rerank、模型还是 DB，再优化。" },
  { id: "qq-w08d6", week: 8, day: 6, dayId: "w08d6", topic: "交付", q: "README 只需要安装命令，不需要指标和取舍。", options: ["正确", "错误"], answer: 1, explain: "README 是面试官第一入口，要有架构、指标、取舍和限制。" },
  { id: "qq-w08d7", week: 8, day: 7, dayId: "w08d7", topic: "面试", q: "项目指标只要自己记住，不需要写进 README。", options: ["正确", "错误"], answer: 1, explain: "指标要可验证、可复现，写进 README 才能建立信任。" },

  // W9
  { id: "qq-w09d1", week: 9, day: 1, dayId: "w09d1", topic: "Agent", q: "步骤固定、合规要求高的流程优先用 workflow。", options: ["正确", "错误"], answer: 0, explain: "workflow 可控、可审计，Agent 增加不确定性。" },
  { id: "qq-w09d2", week: 9, day: 2, dayId: "w09d2", topic: "ReAct", q: "ReAct 循环不需要最大步数。", options: ["正确", "错误"], answer: 1, explain: "没有停止条件会死循环、烧钱。" },
  { id: "qq-w09d3", week: 9, day: 3, dayId: "w09d3", topic: "工具", q: "工具参数只需要模型保证，服务端不用再校验。", options: ["正确", "错误"], answer: 1, explain: "模型输出不可信，服务端必须校验。" },
  { id: "qq-w09d4", week: 9, day: 4, dayId: "w09d4", topic: "Memory", q: "长期记忆应只写稳定、可验证的信息。", options: ["正确", "错误"], answer: 0, explain: "记忆污染比没有记忆更糟。" },
  { id: "qq-w09d5", week: 9, day: 5, dayId: "w09d5", topic: "预算", q: "Agent 预算只限制步数就够了。", options: ["正确", "错误"], answer: 1, explain: "还要限制 token/金额、时间和工具权限。" },
  { id: "qq-w09d6", week: 9, day: 6, dayId: "w09d6", topic: "框架", q: "先手写 Agent 有助于理解框架底层。", options: ["正确", "错误"], answer: 0, explain: "理解循环、状态、错误处理后，排障更靠谱。" },
  { id: "qq-w09d7", week: 9, day: 7, dayId: "w09d7", topic: "Agent", q: "Agent 只要能完成任务，就不需要 trace。", options: ["正确", "错误"], answer: 1, explain: "没有 trace 无法定位工具误用、死循环和成本。" },

  // W10
  { id: "qq-w10d1", week: 10, day: 1, dayId: "w10d1", topic: "LangGraph", q: "LangGraph 的条件边可以根据运行时状态分支。", options: ["正确", "错误"], answer: 0, explain: "条件边让分支/重试/循环显式化。" },
  { id: "qq-w10d2", week: 10, day: 2, dayId: "w10d2", topic: "Checkpoint", q: "checkpoint 可以让工作流暂停后恢复。", options: ["正确", "错误"], answer: 0, explain: "持久化状态支持恢复、审批和时间旅行。" },
  { id: "qq-w10d3", week: 10, day: 3, dayId: "w10d3", topic: "审批", q: "人工审批只需要“通过”，不需要拒绝分支。", options: ["正确", "错误"], answer: 1, explain: "没有拒绝/修改，审批形同虚设。" },
  { id: "qq-w10d4", week: 10, day: 4, dayId: "w10d4", topic: "多智能体", q: "多智能体一定比单 Agent 更好。", options: ["正确", "错误"], answer: 1, explain: "增加通信成本、状态不一致和调试难度；先单后多。" },
  { id: "qq-w10d5", week: 10, day: 5, dayId: "w10d5", topic: "评测", q: "Agent 评测应多次运行看分布。", options: ["正确", "错误"], answer: 0, explain: "非确定性系统不能凭一次成功下结论。" },
  { id: "qq-w10d6", week: 10, day: 6, dayId: "w10d6", topic: "审批", q: "审批恢复前不需要重新校验参数和权限。", options: ["正确", "错误"], answer: 1, explain: "审批期间参数/权限可能变化，必须重新校验。" },
  { id: "qq-w10d7", week: 10, day: 7, dayId: "w10d7", topic: "多智能体", q: "多智能体一定比单 Agent 更容易调试。", options: ["正确", "错误"], answer: 1, explain: "多 Agent 的通信和状态更复杂，调试更难。" },

  // W11
  { id: "qq-w11d1", week: 11, day: 1, dayId: "w11d1", topic: "项目设计", q: "Agent 项目应先定义任务集和成功标准。", options: ["正确", "错误"], answer: 0, explain: "任务集定义成功标准和覆盖面，指导工具/评测。" },
  { id: "qq-w11d2", week: 11, day: 2, dayId: "w11d2", topic: "SQL 工具", q: "SQL 工具应给 Agent 管理员读写权限，方便排查。", options: ["正确", "错误"], answer: 1, explain: "应最小权限、只读、白名单、参数化和超时。" },
  { id: "qq-w11d3", week: 11, day: 3, dayId: "w11d3", topic: "错误处理", q: "工具失败时返回结构化错误，便于 Agent 决策。", options: ["正确", "错误"], answer: 0, explain: "类型/原因/可重试让 Agent 能重试、换工具或终止。" },
  { id: "qq-w11d4", week: 11, day: 4, dayId: "w11d4", topic: "Memory", q: "模型推断可以直接写入长期记忆。", options: ["正确", "错误"], answer: 1, explain: "推断不等于事实，会污染后续行为。" },
  { id: "qq-w11d5", week: 11, day: 5, dayId: "w11d5", topic: "评测", q: "Agent 成功率是唯一需要看的指标。", options: ["正确", "错误"], answer: 1, explain: "还要看步数、成本、工具错误率和人工干预率。" },
  { id: "qq-w11d6", week: 11, day: 6, dayId: "w11d6", topic: "项目二", q: "项目二的差异化是可控、可审批、可追踪。", options: ["正确", "错误"], answer: 0, explain: "企业更关心可控和可审计，而不是多智能体数量。" },
  { id: "qq-w11d7", week: 11, day: 7, dayId: "w11d7", topic: "项目二", q: "项目二应该重复项目一，重点还是 RAG。", options: ["正确", "错误"], answer: 1, explain: "项目二重点是工具编排、审批、状态和可观测性。" },

  // W12
  { id: "qq-w12d1", week: 12, day: 1, dayId: "w12d1", topic: "微调", q: "知识频繁变化时，优先考虑 RAG 而不是微调。", options: ["正确", "错误"], answer: 0, explain: "RAG 更适合动态知识、引用和权限。" },
  { id: "qq-w12d2", week: 12, day: 2, dayId: "w12d2", topic: "数据", q: "训练和推理使用不同的 chat template 没关系。", options: ["正确", "错误"], answer: 1, explain: "模板不一致会让模型学到错误的格式分布。" },
  { id: "qq-w12d3", week: 12, day: 3, dayId: "w12d3", topic: "LoRA", q: "LoRA 冻结基座，只训练低秩适配器。", options: ["正确", "错误"], answer: 0, explain: "可训练参数和优化器状态大幅减少。" },
  { id: "qq-w12d4", week: 12, day: 4, dayId: "w12d4", topic: "训练", q: "训练 loss 下降就说明模型效果一定变好。", options: ["正确", "错误"], answer: 1, explain: "可能过拟合、模板错或灾难性遗忘，要看验证集和人工样例。" },
  { id: "qq-w12d5", week: 12, day: 5, dayId: "w12d5", topic: "评测", q: "微调后应在通用能力集上检查灾难性遗忘。", options: ["正确", "错误"], answer: 0, explain: "窄领域微调可能损害通用能力。" },
  { id: "qq-w12d6", week: 12, day: 6, dayId: "w12d6", topic: "决策", q: "数据不足且 Prompt/RAG 已达标时，仍应强行微调。", options: ["正确", "错误"], answer: 1, explain: "微调有维护成本，不达标的数据不值得做。" },
  { id: "qq-w12d7", week: 12, day: 7, dayId: "w12d7", topic: "决策", q: "微调是解决知识频繁更新的首选方案。", options: ["正确", "错误"], answer: 1, explain: "频繁变化的事实应放检索，微调会过时。" },

  // W13
  { id: "qq-w13d1", week: 13, day: 1, dayId: "w13d1", topic: "vLLM", q: "vLLM 的 PagedAttention 可以减少 KV cache 碎片。", options: ["正确", "错误"], answer: 0, explain: "分页管理提高显存利用率和并发。" },
  { id: "qq-w13d2", week: 13, day: 2, dayId: "w13d2", topic: "量化", q: "量化一定不会损失质量。", options: ["正确", "错误"], answer: 1, explain: "量化有质量损失，需用业务样本验证。" },
  { id: "qq-w13d3", week: 13, day: 3, dayId: "w13d3", topic: "Spring AI", q: "Spring AI 可以复用 Java 生态的鉴权、租户和监控。", options: ["正确", "错误"], answer: 0, explain: "这是 Java 做企业 AI 落地的优势。" },
  { id: "qq-w13d4", week: 13, day: 4, dayId: "w13d4", topic: "路由", q: "模型路由不需要记录原因，线上也能排障。", options: ["正确", "错误"], answer: 1, explain: "路由必须有可解释原因，否则无法排障。" },
  { id: "qq-w13d5", week: 13, day: 5, dayId: "w13d5", topic: "WebFlux", q: "WebFlux 流式返回应限制缓冲并处理取消。", options: ["正确", "错误"], answer: 0, explain: "无界缓冲会 OOM，断开要取消上游。" },
  { id: "qq-w13d6", week: 13, day: 6, dayId: "w13d6", topic: "差异化", q: "Java 候选人的差异化是把 AI 接进企业系统。", options: ["正确", "错误"], answer: 0, explain: "工程化、权限、稳定性和成本控制是优势。" },
  { id: "qq-w13d7", week: 13, day: 7, dayId: "w13d7", topic: "架构", q: "Java 做 AI 只是过渡，最终一定要全部换成 Python。", options: ["正确", "错误"], answer: 1, explain: "按场景和团队划分边界，Java 是企业集成的重要能力。" },

  // W14
  { id: "qq-w14d1", week: 14, day: 1, dayId: "w14d1", topic: "系统设计", q: "设计 RAG 平台应先确认数据规模、权限和 SLO。", options: ["正确", "错误"], answer: 0, explain: "约束决定切分、向量库、模型和缓存策略。" },
  { id: "qq-w14d2", week: 14, day: 2, dayId: "w14d2", topic: "Agent 平台", q: "Agent 平台的核心难点包括状态、工具权限和审批。", options: ["正确", "错误"], answer: 0, explain: "这些决定可控性和可落地性。" },
  { id: "qq-w14d3", week: 14, day: 3, dayId: "w14d3", topic: "LayerNorm", q: "LayerNorm 依赖 batch 大小，适合变长序列。", options: ["正确", "错误"], answer: 1, explain: "依赖 batch 的是 BatchNorm；LayerNorm 逐样本在特征维归一化。" },
  { id: "qq-w14d4", week: 14, day: 4, dayId: "w14d4", topic: "算法", q: "看到连续子数组/子串优先考虑滑动窗口。", options: ["正确", "错误"], answer: 0, explain: "连续 + 窗口收缩条件，通常滑窗/前缀和/DP。" },
  { id: "qq-w14d5", week: 14, day: 5, dayId: "w14d5", topic: "扩展性", q: "流量涨 10 倍时，只需加机器，不需要看模型配额。", options: ["正确", "错误"], answer: 1, explain: "配额、连接池、DB、缓存和成本都可能先成为瓶颈。" },
  { id: "qq-w14d6", week: 14, day: 6, dayId: "w14d6", topic: "模拟面试", q: "模拟面试只看知识对错，不需要复盘表达。", options: ["正确", "错误"], answer: 1, explain: "结构、语速、超时和被追问的反应同样重要。" },
  { id: "qq-w14d7", week: 14, day: 7, dayId: "w14d7", topic: "复盘", q: "最后两周应该从第一章系统补基础，而不是按面试反馈补洞。", options: ["正确", "错误"], answer: 1, explain: "时间有限，按影响×频率补最痛的弱项。" },

  // W15
  { id: "qq-w15d1", week: 15, day: 1, dayId: "w15d1", topic: "简历", q: "简历 bullet 应有动作、技术、难点和结果。", options: ["正确", "错误"], answer: 0, explain: "具体、有难点、有数字，才能扛追问。" },
  { id: "qq-w15d2", week: 15, day: 2, dayId: "w15d2", topic: "项目介绍", q: "3 分钟项目介绍应报完所有技术栈细节。", options: ["正确", "错误"], answer: 1, explain: "先讲问题、约束、取舍和结果，细节留给追问。" },
  { id: "qq-w15d3", week: 15, day: 3, dayId: "w15d3", topic: "作品集", q: "GitHub README 应写清问题、架构、启动和指标。", options: ["正确", "错误"], answer: 0, explain: "README 是面试官的第一入口。" },
  { id: "qq-w15d4", week: 15, day: 4, dayId: "w15d4", topic: "系统设计", q: "被问为什么不用 X 时，应比较维度并说明约束。", options: ["正确", "错误"], answer: 0, explain: "展示权衡过程，而不是防御。" },
  { id: "qq-w15d5", week: 15, day: 5, dayId: "w15d5", topic: "转型故事", q: "转型故事应贬低 Java 来突出 AI。", options: ["正确", "错误"], answer: 1, explain: "Java 是差异化优势，不要贬低。" },
  { id: "qq-w15d6", week: 15, day: 6, dayId: "w15d6", topic: "节奏", q: "春节期间只完成最低线也有助于保持连续性。", options: ["正确", "错误"], answer: 0, explain: "最低线防断签，连续性比单日强度重要。" },
  { id: "qq-w15d7", week: 15, day: 7, dayId: "w15d7", topic: "投递", q: "投了 10 家没回音，就应该停止投递，继续学习。", options: ["正确", "错误"], answer: 1, explain: "应检查匹配/渠道/内推，并继续投递迭代。" },

  // W16
  { id: "qq-w16d1", week: 16, day: 1, dayId: "w16d1", topic: "求职", q: "目标公司应分冲刺、匹配、保底三档。", options: ["正确", "错误"], answer: 0, explain: "分档控制风险，定向提高命中率。" },
  { id: "qq-w16d2", week: 16, day: 2, dayId: "w16d2", topic: "复盘", q: "面试复盘应在 24 小时内完成。", options: ["正确", "错误"], answer: 0, explain: "记忆新鲜时记录问题、回答和卡点。" },
  { id: "qq-w16d3", week: 16, day: 3, dayId: "w16d3", topic: "压力面试", q: "遇到不会的问题应编一个数据。", options: ["正确", "错误"], answer: 1, explain: "承认不会、拆解问题、给假设和验证方式。" },
  { id: "qq-w16d4", week: 16, day: 4, dayId: "w16d4", topic: "补洞", q: "两周补弱项应只补高频且影响大的。", options: ["正确", "错误"], answer: 0, explain: "面试期要功利，按反馈补。" },
  { id: "qq-w16d5", week: 16, day: 5, dayId: "w16d5", topic: "Offer", q: "比较 offer 只需要看 base。", options: ["正确", "错误"], answer: 1, explain: "还要看总包确定性、成长、稳定性、通勤和试用期。" },
  { id: "qq-w16d6", week: 16, day: 6, dayId: "w16d6", topic: "复盘", q: "计划结束后应建立每周维护节奏。", options: ["正确", "错误"], answer: 0, explain: "算法、项目复述、投递、复盘每周固定。" },
  { id: "qq-w16d7", week: 16, day: 7, dayId: "w16d7", topic: "长期", q: "拿到 offer 后就可以停止学习和输出。", options: ["正确", "错误"], answer: 1, explain: "入职后仍需持续成长，offer 是起点。" }
];

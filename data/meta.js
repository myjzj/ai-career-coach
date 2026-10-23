/* 全局元数据：阶段、项目规格、Java 迁移地图、术语表、面试题库 */
window.APP_META = {
  version: "1.0",
  title: "AI 跃迁",
  subtitle: "Java 后端 → AI 开发工程师",
  startDate: "2026-10-26",
  totalDays: 112,
  targetRole: "AI 应用开发工程师",

  phases: [
    { id: 0, name: "地基重建", en: "FOUNDATION", weeks: [1, 2], color: "#34618f", desc: "Python、FastAPI、Docker：把后端工程习惯迁移到 AI 服务。" },
    { id: 1, name: "LLM 与 RAG 核心", en: "LLM CORE", weeks: [3, 6], color: "#1c6b61", desc: "Transformer 直觉、Prompt、结构化输出、Embedding 与检索。" },
    { id: 2, name: "项目一 · RAG 平台", en: "PROJECT RAG", weeks: [7, 8], color: "#d64b2a", desc: "企业知识库：上传、检索、引用、评测、部署与监控。" },
    { id: 3, name: "Agent 工程", en: "AGENT", weeks: [9, 11], color: "#6b5b95", desc: "ReAct、工具调用、LangGraph、人工审批与可观测性。" },
    { id: 4, name: "模型与平台", en: "MODEL OPS", weeks: [12, 13], color: "#a97712", desc: "LoRA 微调、vLLM 推理、Spring AI 与模型网关。" },
    { id: 5, name: "求职冲刺", en: "CAREER", weeks: [14, 16], color: "#2f7d5c", desc: "系统设计、八股、简历、模拟面试、投递与 Offer。" }
  ],

  checklist: [
    { id: "resume", text: "简历 v3 完成", hint: "一页、3 个项目、每条 bullet 有数字" },
    { id: "github", text: "GitHub 3 个项目可运行", hint: "README 含架构图、启动方式、评测指标、取舍" },
    { id: "video", text: "每个项目有 3 分钟演示视频", hint: "录屏 + 口述，不要只放静图" },
    { id: "deepdive", text: "每个项目准备 10 个追问", hint: "为什么这样选？替代方案？失败过什么？" },
    { id: "story", text: "30 秒转型故事背熟", hint: "动机 → 补齐 → 项目 → 差异化 → 目标岗位" },
    { id: "system", text: "10 道 AI 系统设计提纲", hint: "RAG、Agent、模型网关、评测平台各 2–3 道" },
    { id: "algo", text: "算法 8 类模板熟练", hint: "哈希、双指针、滑窗、二分、堆、图、DP、回溯" },
    { id: "mock", text: "完成 3 次模拟面试并录像", hint: "每次 45 分钟，24 小时内复盘" },
    { id: "apply", text: "累计投递 60+", hint: "定向投递，记录渠道与反馈" },
    { id: "targets", text: "目标公司清单 30 家", hint: "分冲刺/匹配/保底三档，找内推" }
  ],

  projectSpecs: [
    {
      id: "p1",
      name: "企业知识库 RAG 平台",
      tagline: "把“能回答”做成“答得准、有引用、可评测、能上线”。",
      weeks: "W5–W8",
      stack: ["FastAPI", "PostgreSQL + pgvector", "Redis", "bge-m3", "bge-reranker", "Docker Compose", "Langfuse", "RAGAS"],
      features: [
        "PDF / Word / Markdown 解析、清洗、按标题与语义切分",
        "增量索引、失败重试、文档版本与去重",
        "BM25 + dense 混合检索、RRF 融合、rerank",
        "流式回答、chunk 级引用、无答案拒答",
        "多租户与权限过滤（SQL 层强制隔离）",
        "30–50 条评测集、RAGAS 指标、成本与延迟面板"
      ],
      metrics: [
        "Recall@5 ≥ 0.85（自建评测集）",
        "答案忠实度 ≥ 0.85，引用命中率 ≥ 0.8",
        "P95 首 token < 2.5s，单次成本可计算",
        "新机器 10 分钟内 Docker 一键启动"
      ],
      resume: "设计并实现多租户企业知识库 RAG 平台，覆盖文档解析、混合检索、rerank、引用与拒答；在 42 条自建评测集上把 Recall@5 从 0.71 提升到 0.89，答案忠实度从 0.76 提升到 0.88；通过 Redis 缓存与批处理把 P95 首 token 控制在 1.8s，单次问答成本下降 37%。"
    },
    {
      id: "p2",
      name: "Agent 工作流平台",
      tagline: "Agent 不是“让模型随便调工具”，而是可控状态机 + 工具协议 + 观测 + 评测。",
      weeks: "W9–W11",
      stack: ["Python", "LangGraph", "FastAPI", "PostgreSQL", "Redis", "Langfuse", "OpenTelemetry"],
      features: [
        "6 类工具：搜索、SQL、知识库、文件、计算、通知",
        "工具 schema 校验、超时、重试、幂等",
        "ReAct 循环、最大步数、死循环检测、成本上限",
        "短期会话记忆 + 长期偏好记忆与删除策略",
        "人工审批节点、中断恢复、参数修改",
        "supervisor + 专家 agent 的任务分派与汇总"
      ],
      metrics: [
        "20 条任务集成功率 ≥ 80%",
        "平均执行步数 ≤ 6",
        "工具失败可恢复，重复执行无副作用",
        "所有 tool call 可在 tracing 中回放"
      ],
      resume: "构建带人工审批的 Agent 工作流平台，基于 LangGraph 实现可恢复状态机与 6 类工具调用；通过工具幂等、步数上限与失败重试，把 20 个任务集的成功率从 62% 提升到 85%，平均执行步数从 9.1 降到 5.4；接入全链路 tracing，定位并修复 3 类高频工具参数错误。"
    },
    {
      id: "p3",
      name: "Java + AI 生产级服务",
      tagline: "不是转行丢掉 Java，而是用 Java 把 AI 接进企业现有系统。",
      weeks: "W13–W15",
      stack: ["Spring Boot 3", "Spring AI / LangChain4j", "WebFlux + SSE", "pgvector", "Redis", "Micrometer", "Docker"],
      features: [
        "多供应商模型路由、超时、重试、熔断、降级",
        "RAG 问答、引用、租户与权限过滤",
        "SSE 流式输出、背压与超时处理",
        "精确缓存 + 语义缓存、限流、成本核算",
        "token / 延迟 / 错误率 / 缓存命中率可观测",
        "与现有鉴权、租户、审计体系集成"
      ],
      metrics: [
        "供应商故障自动降级，压测可用性 ≥ 99.5%",
        "缓存命中率 ≥ 30%，P95 延迟有基线对比",
        "有架构图、压测报告、成本测算表",
        "能说清 Python 服务与 Java 服务的边界"
      ],
      resume: "基于 Spring Boot 3 + Spring AI 构建企业 AI 模型网关，统一接入 3 家模型供应商，实现路由、熔断、降级与 SSE 流式输出；在 200 并发压测下保持 99.6% 可用性，语义缓存命中率 34%，P95 延迟下降 28%；为 Java 团队提供可复用的 AI 接入层与成本看板。"
    }
  ],

  javaMap: [
    { java: "Spring Boot / 依赖注入", ai: "FastAPI 依赖注入、Spring AI Advisor", talk: "把 Controller–Service–Repository 的分层迁移到 AI 服务，强调可测试与可替换。" },
    { java: "微服务治理 / 网关", ai: "模型网关、多供应商路由、熔断降级", talk: "模型 API 就是新的下游依赖，治理手段完全复用。" },
    { java: "MySQL / 事务", ai: "pgvector、元数据、多租户、权限过滤", talk: "向量检索不是数据库替代品，元数据与权限仍要 SQL 兜底。" },
    { java: "Redis", ai: "会话、语义缓存、限流、任务状态", talk: "缓存 LLM 结果要区分精确缓存与语义缓存，后者有串答案风险。" },
    { java: "消息队列", ai: "异步文档索引、Agent 长任务、失败重试", talk: " ingestion 是典型异步流水线，要幂等和死信。" },
    { java: "JVM 调优 / 高并发", ai: "推理吞吐、显存、KV cache、流式背压", talk: "把延迟/吞吐/成本的三角讲清楚，比背概念加分。" },
    { java: "可观测性 / 日志", ai: "LLM tracing、token 成本、工具调用链", talk: "AI 系统最大的黑盒是“为什么这么答”，trace 是刚需。" },
    { java: "权限 / 审计", ai: "RAG 租户隔离、Agent 工具权限、审批", talk: "企业落地 AI 的第一道门槛不是模型，是权限与合规。" }
  ],

  glossary: [
    ["Token", "模型处理文本的最小单位。中文通常 1 字 ≈ 1–2 token，成本、上下文长度和延迟都按 token 计。"],
    ["Embedding", "把文本映射成高维向量，语义相近的文本向量距离更近；RAG 检索的基础。"],
    ["Transformer", "当前大语言模型的主流架构，核心是 self-attention + FFN + 残差 + LayerNorm。"],
    ["Attention", "让每个 token 根据相关性聚合其他 token 信息的机制；复杂度随序列长度平方增长。"],
    ["Context Window", "模型一次能看到的 token 上限；超长会截断、遗忘或成本飙升。"],
    ["Temperature", "采样随机性参数。越低越稳定，越高越发散；为 0 也不保证完全确定性。"],
    ["Top-p", "核采样：只从累计概率达到 p 的最小候选集合中采样，常与 temperature 二选一调。"],
    ["Hallucination", "模型生成看似合理但事实错误的内容；RAG、引用、拒答和评测都是缓解手段。"],
    ["Prompt Injection", "用户输入试图覆盖系统指令或套取敏感信息；要靠分层指令、权限隔离和输出校验。"],
    ["RAG", "Retrieval-Augmented Generation：先检索外部知识，再让模型基于证据回答。"],
    ["Chunking", "把长文档切成可检索片段；chunk size、重叠和切分边界直接决定召回质量。"],
    ["Vector DB", "存储和检索向量的数据库，如 pgvector、Qdrant、Milvus；常与 metadata filter 一起用。"],
    ["HNSW", "近似最近邻图索引，查询快、内存占用高；参数 M / efConstruction 影响召回与延迟。"],
    ["BM25", "经典稀疏检索算法，擅长关键词精确匹配；与向量检索互补。"],
    ["Hybrid Search", "混合稀疏与稠密检索，通常用 RRF 或加权分数融合。"],
    ["RRF", "Reciprocal Rank Fusion：按排名而非原始分数融合多路召回，简单稳健。"],
    ["Rerank", "对召回候选做精排，常用 cross-encoder；质量高但延迟和成本更高。"],
    ["Recall@K", "前 K 个结果中命中相关文档的比例，衡量“有没有召回到”。"],
    ["Faithfulness", "答案是否忠于检索到的证据，RAGAS 的核心指标之一。"],
    ["RAGAS", "RAG 评测框架，常用指标包括 faithfulness、answer relevancy、context precision/recall。"],
    ["Agent", "能感知环境、调用工具、规划步骤并迭代直到完成目标的 LLM 系统。"],
    ["ReAct", "Reason + Act 循环：模型交替输出思考与动作，观察工具结果后继续。"],
    ["Function Calling", "模型按 schema 输出结构化工具调用参数，由应用执行并回传结果。"],
    ["Tool Schema", "工具的 JSON Schema 描述；描述质量直接影响模型选对工具和参数。"],
    ["Memory", "Agent 的短期会话记忆与长期事实/偏好；写入、检索、遗忘都必须设计。"],
    ["LangGraph", "用状态图编排 Agent 的框架，支持节点、条件边、checkpoint 和人工中断。"],
    ["Checkpoint", "保存工作流每一步状态，支持失败恢复、人工审批和时间旅行调试。"],
    ["Human-in-the-loop", "在关键动作前暂停，等待人工审批或修改参数，再恢复执行。"],
    ["LoRA", "低秩适配微调：冻结原模型，只训练少量低秩矩阵，显著降低显存和存储。"],
    ["QLoRA", "在 4-bit 量化基座上做 LoRA，进一步降低显存，但速度和质量需权衡。"],
    ["PEFT", "Parameter-Efficient Fine-Tuning，参数高效微调的总称，LoRA 是其中一种。"],
    ["Quantization", "把权重/激活从 FP16 压到 INT8/INT4，降低显存、提升吞吐，可能损失质量。"],
    ["KV Cache", "推理时缓存历史 token 的 Key/Value，避免重复计算；显存占用随上下文增长。"],
    ["PagedAttention", "vLLM 的分页注意力机制，减少 KV cache 碎片，提高吞吐。"],
    ["vLLM", "高吞吐 LLM 推理引擎，支持连续批处理、PagedAttention 和 OpenAI 兼容 API。"],
    ["MCP", "Model Context Protocol，标准化模型与工具/数据源连接的协议。"],
    ["Semantic Cache", "按语义相似度复用历史答案；命中率高但有答非所问的风险，要设阈值和失效策略。"],
    ["Guardrail", "输入输出护栏：敏感词、权限、格式、事实性和工具调用范围的控制。"],
    ["Eval Set", "固定评测集，用来比较 prompt、模型、检索策略和微调效果，避免拍脑袋。"],
    ["Trace", "一次请求的完整调用链：检索、prompt、模型、工具、耗时、token、成本。"]
  ]
};

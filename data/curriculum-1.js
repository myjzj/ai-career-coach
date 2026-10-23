/* W1–W4：地基、LLM 核心、Prompt 工程 */
window.CURRICULUM = (window.CURRICULUM || []).concat([
  {
    week: 1,
    phase: 0,
    theme: "Python 迁移与 AI 开发环境",
    goal: "用 Python 写出可测试的 CLI 应用，跑通第一个流式 LLM 调用，建立工程习惯。",
    outcomes: ["用 Python 风格完成 20 道小练习", "uv + pytest + ruff 工作流跑通", "llm-cli 可多轮、流式、统计成本"],
    resources: [
      { title: "Python 官方 Tutorial", url: "https://docs.python.org/3/tutorial/", note: "第 3–5 章优先" },
      { title: "uv 文档", url: "https://docs.astral.sh/uv/", note: "项目管理与运行" },
      { title: "httpx", url: "https://www.python-httpx.org/", note: "异步 HTTP 与流式响应" },
      { title: "DeepSeek API 文档", url: "https://api-docs.deepseek.com/", note: "OpenAI 兼容接口，价格低，适合练手" }
    ],
    days: [
      {
        day: 1, type: "learn", title: "从 Java 到 Python：语法、容器与推导式", minutes: 150,
        focus: "用 Python 风格重写 Java 循环；掌握 list/dict/set、切片、解包、推导式，理解可变与不可变。",
        tasks: [
          { type: "学", text: "读 Python Tutorial 第 3–5 章，在 REPL 里逐条验证 list/dict/set、切片、comprehension、*args/**kwargs。", minutes: 45 },
          { type: "练", text: "写 10 个小函数：去重保序、词频 TopK、矩阵转置、按字段分组、合并字典、展平嵌套列表、切片反转、enumerate/zip、sorted key、异常安全类型转换。", minutes: 60 },
          { type: "输出", text: "写 python-notes.md：Java vs Python 的 8 个差异，每条配一段可运行代码；git commit。", minutes: 30 },
          { type: "复盘", text: "填 3-2-1 笔记，完成当日测验。", minutes: 15 }
        ],
        deliverable: "python-notes.md + 10 个可运行函数 + 第一个 commit",
        oral: { q: "Python 的 list 和 dict 底层分别是什么？为什么 dict 查找平均 O(1)？", a: "list 是动态数组，按下标 O(1)，中间插入删除 O(n)；dict 是哈希表，通过 key 的哈希定位桶，平均 O(1)，最坏 O(n)。key 必须可哈希（不可变），扩容时 rehash。", keywords: ["动态数组", "哈希表", "平均 O(1)", "可哈希"] },
        tip: "不要写 for i in range(len(x))；先想推导式、zip、enumerate 和内置函数。"
      },
      {
        day: 2, type: "learn", title: "函数、类、类型与异常：把 Service 重写成模块", minutes: 150,
        focus: "掌握 dataclass、typing、Protocol、异常层次、上下文管理器；理解 Python 的鸭子类型。",
        tasks: [
          { type: "学", text: "学函数参数/作用域/闭包、dataclass、ABC 与 Protocol、typing（Optional/Union/Generic）、with 上下文管理器。", minutes: 45 },
          { type: "练", text: "把 D1 的函数整理成 textkit/ 包：Document dataclass、Tokenizer Protocol + 两个实现、ConfigError、load_config 上下文管理器。", minutes: 60 },
          { type: "输出", text: "写 ADR-001：为什么用 dataclass/Protocol 而不是继承；画一张模块依赖图。", minutes: 30 },
          { type: "复盘", text: "3-2-1 笔记 + 当日测验。", minutes: 15 }
        ],
        deliverable: "textkit 包 + ADR-001 + 模块依赖图",
        oral: { q: "Python 的 Protocol 和 Java interface 有什么区别？", a: "Protocol 是结构化子类型（duck typing），只要方法签名匹配就满足，不需要显式 implements；Java interface 是名义子类型，必须声明实现。Protocol 适合解耦第三方实现，但运行时校验有限。", keywords: ["结构化子类型", "duck typing", "无需 implements", "解耦"] },
        tip: "类型注解不是运行时强制，但能让 IDE 和 pytest 提前发现问题。"
      },
      {
        day: 3, type: "learn", title: "让 Python 项目像 Java 项目一样可维护", minutes: 150,
        focus: "掌握 pyproject.toml、uv、pytest fixture、ruff、pre-commit、logging 与配置分层。",
        tasks: [
          { type: "学", text: "学 uv init/add/sync/run、pyproject 依赖分组、pytest fixture/parametrize、ruff format/lint、logging 配置。", minutes: 45 },
          { type: "练", text: "给 textkit 加 pyproject 与 dev 依赖；写 10 个 pytest（参数化、异常、临时文件）；配置 ruff；加本地任务脚本。", minutes: 75 },
          { type: "输出", text: "README 快速开始 + 目录说明；贴出 uv run pytest 全绿输出。", minutes: 20 },
          { type: "复盘", text: "3-2-1 笔记 + 当日测验。", minutes: 10 }
        ],
        deliverable: "clone 即跑的项目骨架 + 全绿测试",
        oral: { q: "pytest fixture 的作用域有哪些？怎么避免测试互相污染？", a: "function、class、module、package、session。避免污染靠：临时目录、每个用例独立数据库/事务回滚、工厂 fixture、避免全局可变状态、必要时 monkeypatch 并在 teardown 恢复。", keywords: ["function/session", "临时目录", "事务回滚", "monkeypatch"] },
        tip: "先写一个失败的测试，再写实现；这是你熟悉的 TDD，不要丢。"
      },
      {
        day: 4, type: "learn", title: "用 httpx 调通流式 LLM API", minutes: 150,
        focus: "掌握 async/await、httpx.AsyncClient、SSE、超时/重试、环境变量密钥管理。",
        tasks: [
          { type: "学", text: "学协程/await/asyncio.gather、超时与异常、SSE 的 data: 格式、API 鉴权与错误码。", minutes: 45 },
          { type: "练", text: "写 llm_client.py：读环境变量、httpx 流式请求、逐块解析、统计 usage；处理 401/429/5xx、超时和取消。", minutes: 75 },
          { type: "输出", text: "用真实 API 跑 3 个 prompt，把延迟、输入/输出 token、成本记录到 api-baseline.md。", minutes: 20 },
          { type: "复盘", text: "3-2-1 笔记 + 当日测验。", minutes: 10 }
        ],
        deliverable: "可复用流式客户端 + API 基线数据",
        oral: { q: "SSE 和 WebSocket 的区别？为什么 LLM 流式常用 SSE？", a: "SSE 是单向 server→client、基于 HTTP、文本协议、支持自动重连；WebSocket 是双向长连接、协议更复杂。LLM 只需要把生成结果单向推给客户端，SSE 更简单、易穿代理，所以更常用。", keywords: ["单向", "HTTP", "自动重连", "简单"] },
        tip: "不要把 API key 写进代码；先跑通非流式，再加流式，排查更简单。"
      },
      {
        day: 5, type: "learn", title: "组装 llm-cli：多轮、配置、成本与错误处理", minutes: 150,
        focus: "把本周能力整合成可演示的 CLI，设计配置优先级、会话历史和优雅降级。",
        tasks: [
          { type: "学", text: "学 CLI 设计、配置优先级（env > config > default）、指数退避重试、结构化日志。", minutes: 30 },
          { type: "练", text: "完成 llm-cli：多轮历史、/reset、模型切换、流式、token/成本统计、超时重试、日志文件。", minutes: 90 },
          { type: "输出", text: "写 8 个 pytest（mock HTTP），录 30 秒 demo，补 README。", minutes: 30 }
        ],
        deliverable: "llm-cli v1 + 测试 + 30 秒 demo",
        oral: { q: "怎么设计一个可测试的 LLM 客户端？", a: "把 HTTP/SDK 层抽象成可注入的 transport 或 provider 接口，业务逻辑不直接依赖 SDK；用 mock 构造普通响应、流式 chunk、超时和错误；真实 API 只做 smoke test。", keywords: ["依赖注入", "mock transport", "流式 chunk", "smoke test"] },
        tip: "mock 掉网络，测试才能稳定；不要让 CI 依赖真实 API。"
      },
      {
        day: 6, type: "lab", title: "Lab 01：把 CLI 变成可演示作品", minutes: 240,
        focus: "整合本周能力，补边界与文档，体验“可运行 > 完美”。",
        tasks: [
          { type: "项目", text: "加配置文件 ~/.llm-cli.toml、多模型 profile、可配置系统提示词。", minutes: 60 },
          { type: "项目", text: "加对话摘要（超过 N 轮自动压缩）、成本上限、导出 Markdown。", minutes: 90 },
          { type: "输出", text: "README（架构、用法、限制）、3 分钟演示脚本、打 tag v0.1。", minutes: 60 },
          { type: "复盘", text: "按自测清单走一遍，列下周 3 个问题。", minutes: 30 }
        ],
        deliverable: "tag v0.1 + demo + 完整 README",
        oral: { q: "如果对话历史超过上下文窗口，你怎么处理？", a: "滑动窗口保留最近消息；对早期内容做摘要并保留结构化事实；按当前问题检索相关历史；分层记忆。摘要会丢细节，要保留用户偏好、约束和未完成事项。", keywords: ["滑动窗口", "摘要", "检索相关历史", "保留约束"] },
        tip: "今天不追新功能，只把已有功能做稳；录屏时先讲问题再演示。"
      },
      {
        day: 7, type: "review", title: "W1 周测：Python 与 LLM 调用", minutes: 120,
        focus: "用测验暴露盲点，整理错题，为 W2 的 FastAPI 做准备。",
        tasks: [
          { type: "复盘", text: "做 W1 周测（10 题），每道错题写一句原因。", minutes: 30 },
          { type: "复盘", text: "回看 3-2-1 笔记，补 5 张口述卡；把仍不懂的 2 个问题写成 issue。", minutes: 40 },
          { type: "输出", text: "写周报：完成/未完成/下周调整；更新简历技能栏（Python）。", minutes: 30 },
          { type: "复盘", text: "预习 HTTP/FastAPI，列出 3 个问题。", minutes: 20 }
        ],
        deliverable: "周报 + 错题清单 + W2 计划",
        oral: { q: "用 2 分钟介绍 llm-cli 的架构和取舍。", a: "CLI → 配置 → provider adapter → 流式解析 → 会话存储。取舍：单文件起步、mock 测试保证稳定、成本上限防止跑飞、摘要换上下文但会丢细节。", keywords: ["分层", "adapter", "mock", "成本上限", "取舍"] },
        tip: "周测低于 60% 不丢人，把错题变成下周的第一件事。"
      }
    ]
  },
  {
    week: 2,
    phase: 0,
    theme: "FastAPI 与 AI 服务基础",
    goal: "把 CLI 升级为可部署 API：会话、流式、持久化、Docker、测试。",
    outcomes: ["FastAPI 分层与 Pydantic 校验", "SSE 流式与客户端断开处理", "Docker Compose 一键启动"],
    resources: [
      { title: "FastAPI Tutorial", url: "https://fastapi.tiangolo.com/tutorial/", note: "依赖注入、流式响应" },
      { title: "Pydantic v2", url: "https://docs.pydantic.dev/latest/", note: "模型、validator、settings" },
      { title: "Docker Compose", url: "https://docs.docker.com/compose/", note: "api + postgres 本地编排" },
      { title: "SSE 规范", url: "https://html.spec.whatwg.org/multipage/server-sent-events.html", note: "事件格式与重连" }
    ],
    days: [
      {
        day: 1, type: "learn", title: "FastAPI 基础与分层", minutes: 150,
        focus: "掌握路由、依赖注入、异常处理、lifespan，把业务从 router 里拆出来。",
        tasks: [
          { type: "学", text: "学路由、路径/查询/body 参数、Depends、异常处理、lifespan。", minutes: 45 },
          { type: "练", text: "搭 chat-api：/health、/v1/chat/completions（先非流式）、service 层、依赖注入、统一错误响应。", minutes: 75 },
          { type: "输出", text: "贴出 OpenAPI 说明和 3 个 curl 示例。", minutes: 20 },
          { type: "复盘", text: "3-2-1 笔记 + 当日测验。", minutes: 10 }
        ],
        deliverable: "可跑的 API 骨架 + curl 示例",
        oral: { q: "FastAPI 的依赖注入和 Spring 的 DI 有什么异同？", a: "都支持声明式注入。FastAPI 用函数参数 + Depends，轻量、请求级缓存，适合小服务；Spring 容器管理 bean 生命周期、AOP、事务等企业能力。复杂企业能力在 FastAPI 里要自己补或借助库。", keywords: ["Depends", "请求级缓存", "生命周期", "轻量"] },
        tip: "路由只做参数与协议，业务放 service；别把 SDK 调用写进 router。"
      },
      {
        day: 2, type: "learn", title: "Pydantic v2 与错误处理", minutes: 150,
        focus: "用模型定义请求/响应契约，把“不可信输入”挡在业务层之外。",
        tasks: [
          { type: "学", text: "学 BaseModel、Field、field/model validator、discriminated union、pydantic-settings。", minutes: 45 },
          { type: "练", text: "定义 ChatRequest/Message/Usage/Error；校验 role 枚举、max_tokens 范围；自定义异常处理器；env 配置。", minutes: 75 },
          { type: "输出", text: "写 15 个校验测试（合法/非法/边界），整理错误码表。", minutes: 20 },
          { type: "复盘", text: "3-2-1 笔记 + 当日测验。", minutes: 10 }
        ],
        deliverable: "完整 schema + 错误码表 + 15 个测试",
        oral: { q: "Pydantic 的 field validator 和 model validator 有什么区别？", a: "field validator 处理单个字段，model validator 处理跨字段或整个模型；都分 before/after 模式。校验失败抛 ValueError，FastAPI 会转成 422。", keywords: ["单字段", "跨字段", "before/after", "422"] },
        tip: "错误响应要稳定、可机读；不要把内部堆栈返回给客户端。"
      },
      {
        day: 3, type: "learn", title: "持久化：会话与消息表", minutes: 150,
        focus: "用 SQLAlchemy 2.0 建会话/消息模型，理解 repository、事务、索引与上下文裁剪。",
        tasks: [
          { type: "学", text: "学 AsyncSession、repository pattern、事务、索引、SQLite→Postgres 差异。", minutes: 45 },
          { type: "练", text: "建 conversations/messages 表；实现创建会话、追加消息、查询历史、软删除；给常用查询加索引。", minutes: 90 },
          { type: "输出", text: "画 ER 图，写 5 条典型查询与执行计划说明。", minutes: 15 }
        ],
        deliverable: "会话持久化 + ER 图",
        oral: { q: "为什么消息表要存 token、模型和耗时？", a: "用于成本核算、审计、评测和故障排查；也方便做上下文裁剪与请求重放。这些是可观测性数据，不要只存消息文本。", keywords: ["成本", "审计", "评测", "重放"] },
        tip: "历史消息不要全量塞回模型；存全量，取最近 + 摘要。"
      },
      {
        day: 4, type: "learn", title: "SSE 流式与韧性", minutes: 150,
        focus: "实现真正的流式接口，处理心跳、断连、上游 429、超时和请求 ID。",
        tasks: [
          { type: "学", text: "学 StreamingResponse、SSE 格式、心跳、客户端断开、超时、重试、限流。", minutes: 45 },
          { type: "练", text: "实现 /v1/chat/stream：逐 token 推送、[DONE]、断连清理、429 退避、请求 ID。", minutes: 80 },
          { type: "输出", text: "用 curl -N 和浏览器 EventSource 验证；记录首 token 延迟。", minutes: 25 }
        ],
        deliverable: "流式接口 + 首 token 延迟记录",
        oral: { q: "流式接口怎么处理客户端断开？", a: "捕获 CancelledError/GeneratorExit，取消上游请求、释放连接、记录部分 usage；不要继续计费。用 request id 关联日志，避免后台任务泄漏。", keywords: ["CancelledError", "取消上游", "释放连接", "request id"] },
        tip: "SSE 每个事件以空行结束；代理要关缓冲，否则“流式”会变成一次性。"
      },
      {
        day: 5, type: "learn", title: "测试、Docker 与交付", minutes: 150,
        focus: "让服务可测试、可容器化、可一键启动。",
        tasks: [
          { type: "学", text: "学 pytest + httpx AsyncClient、依赖覆盖、Dockerfile 多阶段构建、非 root、健康检查。", minutes: 40 },
          { type: "练", text: "写 API 测试（正常/校验/上游错误/流式）；Dockerfile + compose（api+postgres）；.env.example。", minutes: 80 },
          { type: "输出", text: "README + 一键启动验证；记录镜像大小和启动时间。", minutes: 30 }
        ],
        deliverable: "Docker 化 chat-api + 测试",
        oral: { q: "Docker 镜像怎么减小？", a: "多阶段构建，只把运行时产物拷进最终镜像；用 slim 基础镜像；只装运行时依赖；合并 RUN 减少层；.dockerignore 排除缓存；非 root 运行。", keywords: ["多阶段", "slim", "运行时依赖", ".dockerignore", "非 root"] },
        tip: "先保证 docker compose up 能跑，再谈优化。"
      },
      {
        day: 6, type: "lab", title: "Lab 02：流式对话 API 完整版", minutes: 240,
        focus: "补齐会话管理、限流、日志、压测，把服务做到可演示。",
        tasks: [
          { type: "项目", text: "加会话列表/删除、历史分页、系统提示词配置。", minutes: 60 },
          { type: "项目", text: "加限流（内存/Redis）、请求日志、token 统计、健康检查、优雅关闭。", minutes: 90 },
          { type: "输出", text: "压测 20 并发流式；记录 P95 首 token/错误率；README 加架构图。", minutes: 60 },
          { type: "复盘", text: "自测清单 + 下周预习。", minutes: 30 }
        ],
        deliverable: "chat-api v0.2 + 压测报告",
        oral: { q: "20 路并发流式请求，怎么保证不串消息？", a: "每个请求独立上下文与生成器，不共享可变 buffer；用 request id 和会话 id 隔离；数据库写入按会话隔离；依赖异步安全的数据结构；用并发压测验证。", keywords: ["独立生成器", "无共享 buffer", "request id", "并发压测"] },
        tip: "压测不是比数字，是找瓶颈；先看连接池和上游限流。"
      },
      {
        day: 7, type: "review", title: "W2 周测：FastAPI 与 AI 服务", minutes: 120,
        focus: "复盘服务化能力，准备进入 LLM 原理。",
        tasks: [
          { type: "复盘", text: "做 W2 周测（10 题），错题写原因。", minutes: 30 },
          { type: "复盘", text: "回看 API 代码，列 3 个可以重构的点；补 5 张口述卡。", minutes: 40 },
          { type: "输出", text: "写周报；给 chat-api 打 tag v0.2。", minutes: 30 },
          { type: "复盘", text: "预习 tokenizer/Transformer，列出 3 个问题。", minutes: 20 }
        ],
        deliverable: "周报 + tag v0.2 + W3 计划",
        oral: { q: "用 2 分钟讲 chat-api 的架构、并发模型和故障处理。", a: "FastAPI 路由 → service → provider；SSE 流式；AsyncSession 持久化；超时/重试/限流/断连处理；Docker Compose 一键启动。取舍是先把单服务做稳，再拆队列和缓存。", keywords: ["分层", "SSE", "AsyncSession", "韧性", "取舍"] },
        tip: "把压测数据和架构图保存好，项目一和面试都会用到。"
      }
    ]
  },
  {
    week: 3,
    phase: 1,
    theme: "Transformer 与 LLM 推理直觉",
    goal: "能解释一句话如何变成 token、向量和下一个词，会调采样参数并估算成本。",
    outcomes: ["token 统计与成本测算", "attention 最小实现", "采样参数实验报告"],
    resources: [
      { title: "Illustrated Transformer", url: "https://jalammar.github.io/illustrated-transformer/", note: "先看图，再看公式" },
      { title: "3Blue1Brown 神经网络", url: "https://www.3blue1brown.com/topics/neural-networks", note: "attention 可视化" },
      { title: "Hugging Face NLP Course", url: "https://huggingface.co/learn/nlp-course", note: "tokenizer 与模型" },
      { title: "tiktoken", url: "https://github.com/openai/tiktoken", note: "token 统计工具" }
    ],
    days: [
      {
        day: 1, type: "learn", title: "Tokenization：模型眼中的文字", minutes: 150,
        focus: "理解 BPE/WordPiece/SentencePiece，能统计中英代码的 token 效率与成本。",
        tasks: [
          { type: "学", text: "学 BPE/WordPiece/SentencePiece、词表、特殊 token、中文 token 效率。", minutes: 45 },
          { type: "练", text: "用 tiktoken/HF tokenizer 对中英代码文本做 token 统计，比较 3 个模型，做颜色或表格可视化。", minutes: 75 },
          { type: "输出", text: "写 token-report.md：中文/英文/代码的 token/字符比，估算 100 万 token 成本。", minutes: 20 },
          { type: "复盘", text: "3-2-1 笔记 + 当日测验。", minutes: 10 }
        ],
        deliverable: "token 统计脚本 + 成本报告",
        oral: { q: "为什么同一个中文句子在不同模型上 token 数不同？", a: "词表和切分算法不同（BPE/WordPiece/SentencePiece），训练语料与合并规则不同，是否把常见中文词合并也不同。token 数影响成本、上下文长度和延迟。", keywords: ["词表", "切分算法", "语料", "成本"] },
        tip: "成本估算先用真实文本跑，不要用“1 汉字=1 token”拍脑袋。"
      },
      {
        day: 2, type: "learn", title: "Embedding 与相似度：语义如何变成距离", minutes: 150,
        focus: "理解 embedding 空间、余弦/点积、归一化、模型选择与检索失败模式。",
        tasks: [
          { type: "学", text: "学 embedding 空间、余弦/点积、归一化、维度、MTEB、模型选择。", minutes: 45 },
          { type: "练", text: "用 sentence-transformers 或 API 生成 20 句向量；实现 cosine/top-k；观察同义、反义、领域词。", minutes: 75 },
          { type: "输出", text: "写 5 个“检索失败”案例及原因假设（切分/模型/距离/多义/领域）。", minutes: 20 },
          { type: "复盘", text: "3-2-1 笔记 + 当日测验。", minutes: 10 }
        ],
        deliverable: "相似度实验脚本 + 失败案例分析",
        oral: { q: "余弦相似度和点积什么时候等价？", a: "向量归一化后，余弦相似度与点积排序等价；未归一化时点积受向量模长影响。很多 embedding 模型建议先归一化再算余弦。", keywords: ["归一化", "排序等价", "模长", "余弦"] },
        tip: "先做小数据可视化，再上向量库；理解距离比会调 API 重要。"
      },
      {
        day: 3, type: "learn", title: "Attention 与 Transformer Block", minutes: 150,
        focus: "从 QKV 到多头、位置编码、残差/LayerNorm，能白板讲清一个 block。",
        tasks: [
          { type: "学", text: "学 QKV、scaled dot-product、多头、位置编码、残差/LayerNorm、FFN、encoder/decoder。", minutes: 60 },
          { type: "练", text: "用 numpy 实现单头 attention（约 10 行），验证输出形状；画 4x4 注意力热力图。", minutes: 60 },
          { type: "输出", text: "写 3 分钟白板复述稿：每个词如何看其他词，为什么多头。", minutes: 20 },
          { type: "复盘", text: "3-2-1 笔记 + 当日测验。", minutes: 10 }
        ],
        deliverable: "attention 实现 + 热力图 + 口述稿",
        oral: { q: "self-attention 为什么要除以 sqrt(d_k)？", a: "QK 点积的方差随维度 d_k 增大而增大，softmax 容易饱和、梯度变小；除以 sqrt(d_k) 把方差拉回稳定范围，训练更稳。", keywords: ["方差", "softmax 饱和", "梯度", "缩放"] },
        tip: "不要陷进公式；能解释“每个词如何看其他词”就够了。"
      },
      {
        day: 4, type: "learn", title: "预训练、SFT 与 RLHF", minutes: 150,
        focus: "理解基座模型如何变成助手，以及三个阶段的数据与目标。",
        tasks: [
          { type: "学", text: "学预训练 / SFT / RLHF / DPO、基座 vs instruct、灾难性遗忘、数据质量。", minutes: 50 },
          { type: "练", text: "用同一问题对比 base/instruct 模型（或不同 API 模型），记录差异；画训练阶段图。", minutes: 60 },
          { type: "输出", text: "写 llm-training-stages.md：每阶段回答目标/数据/损失/产物。", minutes: 30 },
          { type: "复盘", text: "3-2-1 笔记 + 当日测验。", minutes: 10 }
        ],
        deliverable: "训练阶段图 + 模型对比记录",
        oral: { q: "SFT 和 RLHF 分别解决什么问题？", a: "SFT 用指令-回答数据教模型跟随指令、输出格式；RLHF/DPO 用人类偏好优化有用性、安全性和风格。SFT 决定基本能力与格式，偏好优化进一步对齐。", keywords: ["指令跟随", "格式", "偏好", "对齐"] },
        tip: "面试常问“为什么不直接微调”；先记住 RAG / prompt / fine-tune 的决策树。"
      },
      {
        day: 5, type: "learn", title: "解码、采样与成本", minutes: 150,
        focus: "理解 greedy/beam/sampling、temperature/top_p、stop、seed，能做参数实验。",
        tasks: [
          { type: "学", text: "学 greedy/beam/sampling、temperature/top_k/top_p、stop、seed、logprobs、上下文窗口。", minutes: 45 },
          { type: "练", text: "同一 prompt 跑 temperature 0/0.7/1.2 各 5 次；统计多样性/事实性；测 max_tokens 对成本影响。", minutes: 75 },
          { type: "输出", text: "做参数实验表，给出抽取/问答/创意三类任务的推荐配置。", minutes: 20 },
          { type: "复盘", text: "3-2-1 笔记 + 当日测验。", minutes: 10 }
        ],
        deliverable: "sampling-lab.md + 实验数据",
        oral: { q: "temperature=0 为什么还可能不稳定？", a: "浮点运算与并行归约存在非确定性，硬件/批处理/模型版本变化也会影响；如果接了检索或工具，输入本身也会变。temperature=0 只是降低随机性，不保证完全可复现。", keywords: ["浮点非确定性", "批处理", "模型版本", "检索输入"] },
        tip: "生产环境固定模型版本和参数，记录 seed（如果支持）。"
      },
      {
        day: 6, type: "lab", title: "Lab 03：模型对比与评测表", minutes: 240,
        focus: "用一个小任务练习“选模型”：质量、延迟、成本三维对比。",
        tasks: [
          { type: "项目", text: "用 transformers pipeline 跑本地小模型（或 API），做文本分类/摘要。", minutes: 60 },
          { type: "项目", text: "比较 2 个模型在 10 条样本上的质量/延迟/成本，写评测表。", minutes: 90 },
          { type: "输出", text: "报告：任务、指标、结果、失败案例；不要只放截图。", minutes: 60 },
          { type: "复盘", text: "自测 + 下周预习。", minutes: 30 }
        ],
        deliverable: "模型对比报告 + 评测表",
        oral: { q: "怎么为一个业务任务选模型？", a: "先定质量门槛和延迟/成本约束；小模型做基线，大模型看上限；用固定评测集比较；再考虑私有化、合规、供应商锁定和运维成本。", keywords: ["质量门槛", "基线", "评测集", "合规", "成本"] },
        tip: "本地跑不动就用 API；重点是评测方法，不是模型大小。"
      },
      {
        day: 7, type: "review", title: "W3 周测：LLM 原理与推理", minutes: 120,
        focus: "把 token→embedding→attention→生成串成一条线。",
        tasks: [
          { type: "复盘", text: "做 W3 周测（10 题），错题写原因。", minutes: 30 },
          { type: "复盘", text: "白板画 Transformer block，录 3 分钟口述；补 5 张卡。", minutes: 40 },
          { type: "输出", text: "写周报；整理一页 LLM 速查表。", minutes: 30 },
          { type: "复盘", text: "预习 Prompt/结构化输出，列出 3 个问题。", minutes: 20 }
        ],
        deliverable: "周报 + 一页 LLM 速查 + 口述录像",
        oral: { q: "用 3 分钟从 token 讲到生成。", a: "文本切 token → embedding → 多层 attention/FFN 得到上下文表示 → 预测下一个 token 的概率 → 按 temperature/top_p 采样 → 追加 token 自回归重复。", keywords: ["token", "embedding", "attention", "概率", "自回归"] },
        tip: "能讲清楚比背公式重要；面试官更在意你是否理解取舍。"
      }
    ]
  },
  {
    week: 4,
    phase: 1,
    theme: "Prompt、结构化输出与工具调用",
    goal: "把 prompt 变成可测试的工程，掌握 JSON Schema、function calling 与注入防御。",
    outcomes: ["3 版 prompt 对比", "结构化匹配器 v1", "注入测试集与防御清单"],
    resources: [
      { title: "OpenAI Prompt Engineering", url: "https://platform.openai.com/docs/guides/prompt-engineering", note: "结构化与评测" },
      { title: "Anthropic Prompt Engineering", url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview", note: "清晰指令与示例" },
      { title: "JSON Schema", url: "https://json-schema.org/learn/getting-started-step-by-step", note: "约束模型输出" },
      { title: "OWASP LLM Top 10", url: "https://owasp.org/www-project-top-10-for-large-language-model-applications/", note: "注入与数据泄露" }
    ],
    days: [
      {
        day: 1, type: "learn", title: "Prompt 基础与模式：从玄学到契约", minutes: 150,
        focus: "掌握角色/任务/约束/格式/示例、few-shot、CoT，避免指令冲突。",
        tasks: [
          { type: "学", text: "学角色/任务/约束/格式/示例、zero/few-shot、CoT、自洽、指令冲突。", minutes: 45 },
          { type: "练", text: "为“JD-简历匹配”写 3 版 prompt（naive/结构化/带评分 rubric），在 5 条样本上对比。", minutes: 60 },
          { type: "输出", text: "建 prompt 版本表：版本/改动/效果/问题。", minutes: 35 },
          { type: "复盘", text: "3-2-1 笔记 + 当日测验。", minutes: 10 }
        ],
        deliverable: "3 版 prompt + 对比记录",
        oral: { q: "few-shot 的示例怎么选？", a: "覆盖边界和难例、与真实分布一致、格式稳定、不要泄漏答案；示例数量 3–5 个常够，太多占上下文且可能过拟合示例风格。", keywords: ["边界", "分布一致", "格式稳定", "3–5 个"] },
        tip: "先写清楚输出契约，再写“请一步步思考”；CoT 不是万灵药。"
      },
      {
        day: 2, type: "learn", title: "结构化输出与 JSON Schema", minutes: 150,
        focus: "让模型输出可校验的数据，并设计失败重试。",
        tasks: [
          { type: "学", text: "学 JSON Schema、response_format/json mode、Pydantic 解析、失败重试/修复、流式 JSON。", minutes: 45 },
          { type: "练", text: "定义 MatchReport schema（score/strengths/gaps/evidence/next_actions）；让模型输出；Pydantic 校验；失败重试 2 次。", minutes: 75 },
          { type: "输出", text: "统计 20 条样本字段合法率、平均重试次数。", minutes: 20 },
          { type: "复盘", text: "3-2-1 笔记 + 当日测验。", minutes: 10 }
        ],
        deliverable: "结构化匹配器 v1 + 合法率统计",
        oral: { q: "模型输出 JSON 解析失败怎么处理？", a: "用 schema/json mode 约束、低温、给 few-shot；解析失败时把错误信息带回重试；仍失败则降级为文本 + 人工处理，并记录失败样本。不要用 eval 或正则硬修 JSON。", keywords: ["schema", "低温", "带错误重试", "降级", "记录样本"] },
        tip: "让模型输出“证据引用”，否则评分不可信。"
      },
      {
        day: 3, type: "learn", title: "Function Calling 与工具调用", minutes: 150,
        focus: "理解模型只输出调用意图，应用负责校验、执行和回传。",
        tasks: [
          { type: "学", text: "学 tool schema、tool_choice、并行调用、参数校验、结果回传、错误协议。", minutes: 45 },
          { type: "练", text: "定义 3 个工具（查职位库、算匹配分、生成面试题）；实现调用循环；参数非法时返回结构化错误。", minutes: 75 },
          { type: "输出", text: "记录 10 次调用的工具选择/参数正确率。", minutes: 20 },
          { type: "复盘", text: "3-2-1 笔记 + 当日测验。", minutes: 10 }
        ],
        deliverable: "小型工具调用 demo + 正确率记录",
        oral: { q: "function calling 是模型执行函数吗？", a: "不是。模型只输出工具名和参数，应用侧校验后执行，再把结果回传给模型。权限、幂等、超时和副作用都在应用侧控制。", keywords: ["只输出意图", "应用执行", "校验", "幂等"] },
        tip: "工具描述是 prompt 的一部分；名称和参数要像 API 文档一样清楚。"
      },
      {
        day: 4, type: "learn", title: "Prompt Injection 与安全边界", minutes: 150,
        focus: "理解直接/间接注入、越权与数据外泄，建立纵深防御。",
        tasks: [
          { type: "学", text: "学直接/间接注入、越权、数据外泄、系统提示泄露；读 OWASP LLM Top 10 摘要。", minutes: 45 },
          { type: "练", text: "构造 10 个攻击样本（忽略以上/输出 system prompt/文档内指令）；测试匹配器；加分层指令、输入标记、输出过滤、权限控制。", minutes: 60 },
          { type: "输出", text: "写安全测试报告：攻击/结果/修复/残余风险。", minutes: 35 },
          { type: "复盘", text: "3-2-1 笔记 + 当日测验。", minutes: 10 }
        ],
        deliverable: "注入测试集 + 防御清单",
        oral: { q: "为什么“在 prompt 里写不要听用户的”不够？", a: "模型无法可靠区分指令与不可信数据；攻击者可以通过文档、网页、工具结果间接注入。需要权限最小化、工具白名单、输出校验、隔离不可信内容、人工审批，prompt 只是其中一层。", keywords: ["不可信数据", "间接注入", "最小权限", "白名单", "纵深防御"] },
        tip: "把检索到的文档当“不可信输入”，不是系统指令。"
      },
      {
        day: 5, type: "learn", title: "评测与回归：让 prompt 优化有依据", minutes: 150,
        focus: "建立小评测集、rubric、LLM-as-judge 校准与回归测试。",
        tasks: [
          { type: "学", text: "学评测集、rubric、LLM-as-judge 偏差、人工抽检、回归测试。", minutes: 45 },
          { type: "练", text: "为匹配器建 20 条标注样本；写 3 个指标（字段合法率、评分相关性、证据命中）；跑 baseline/新版。", minutes: 75 },
          { type: "输出", text: "写评测报告 + 失败案例聚类。", minutes: 20 },
          { type: "复盘", text: "3-2-1 笔记 + 当日测验。", minutes: 10 }
        ],
        deliverable: "评测脚本 + 报告",
        oral: { q: "LLM-as-judge 有什么风险？", a: "位置/长度/风格偏差、自我偏好、对 prompt 敏感、不可复现。要人工校准、固定 rubric、交换顺序/双盲、抽检，并保留人类标注作为金标准。", keywords: ["位置偏差", "自我偏好", "rubric", "人工校准"] },
        tip: "没有评测集的 prompt 优化都是玄学。"
      },
      {
        day: 6, type: "lab", title: "Lab 04：JD–简历结构化匹配器", minutes: 240,
        focus: "把 prompt、schema、工具调用、评测串成一个小产品。",
        tasks: [
          { type: "项目", text: "接入真实 JD/简历样本；批量处理；输出 Markdown 报告。", minutes: 60 },
          { type: "项目", text: "加缓存、并发、失败重试、成本统计；做 CLI 或简单 Web。", minutes: 90 },
          { type: "输出", text: "README + 20 条评测结果 + 3 个失败案例。", minutes: 60 },
          { type: "复盘", text: "自测 + 下周预习。", minutes: 30 }
        ],
        deliverable: "可演示的匹配器 v1",
        oral: { q: "这个项目怎么防止“看起来很准”？", a: "固定评测集与人工标注；要求证据引用；做基线与消融；主动展示失败案例；用字段合法率、评分相关性、证据命中多指标，而不是只看几个顺眼的例子。", keywords: ["固定评测集", "人工标注", "证据", "基线", "失败案例"] },
        tip: "这个项目可以成为简历里的“结构化抽取”故事。"
      },
      {
        day: 7, type: "review", title: "W4 周测：Prompt 与工具调用", minutes: 120,
        focus: "整理 prompt 模板库，准备进入 RAG。",
        tasks: [
          { type: "复盘", text: "做 W4 周测（10 题），错题写原因。", minutes: 30 },
          { type: "复盘", text: "把本周 prompt 整理成模板库（角色/约束/示例/输出 schema）。", minutes: 40 },
          { type: "输出", text: "写周报；更新简历里的“结构化抽取/评测” bullet。", minutes: 30 },
          { type: "复盘", text: "预习 embedding/向量检索，列出 3 个问题。", minutes: 20 }
        ],
        deliverable: "prompt 模板库 v1 + 周报",
        oral: { q: "用 2 分钟讲你怎么把 prompt 工程化。", a: "先定输出契约和评测集；用版本化管理 prompt；结构化输出 + schema 校验；失败重试与降级；用固定样本回归；把安全测试纳入 CI。", keywords: ["输出契约", "评测集", "版本化", "schema", "回归"] },
        tip: "prompt 模板库以后会反复用，命名要清晰。"
      }
    ]
  }
]);

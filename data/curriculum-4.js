/* W13–W16：推理部署、Java AI、系统设计、求职冲刺 */
window.CURRICULUM = (window.CURRICULUM || []).concat([
  {
    week: 13,
    phase: 4,
    theme: "推理部署与 Java AI 工程",
    goal: "打通模型上线与 Java 接入，完成第三个差异化项目。",
    outcomes: ["vLLM/量化实验", "Spring AI RAG 服务", "压测与成本表"],
    resources: [
      { title: "vLLM", url: "https://docs.vllm.ai/", note: "部署与参数" },
      { title: "Spring AI", url: "https://docs.spring.io/spring-ai/reference/", note: "ChatClient、RAG、Advisor" },
      { title: "LangChain4j", url: "https://docs.langchain4j.dev/", note: "Java 替代方案" },
      { title: "Resilience4j", url: "https://resilience4j.readme.io/", note: "熔断/重试/限流" }
    ],
    days: [
      {
        day: 1, type: "learn", title: "vLLM 与推理服务：吞吐从哪里来", minutes: 150,
        focus: "理解 PagedAttention、连续批处理、KV cache 与关键启动参数。",
        tasks: [
          { type: "学", text: "学 PagedAttention、continuous batching、KV cache、max-model-len、gpu-memory-utilization。", minutes: 45 },
          { type: "练", text: "用 vLLM 或 Ollama 起 OpenAI 兼容服务；跑 20 个请求；记录吞吐/首 token/显存。", minutes: 75 },
          { type: "输出", text: "记录启动参数与指标；画一张请求生命周期图。", minutes: 20 },
          { type: "复盘", text: "3-2-1 笔记 + 当日测验。", minutes: 10 }
        ],
        deliverable: "本地推理服务 + 指标记录",
        oral: { q: "vLLM 为什么吞吐高？", a: "PagedAttention 减少 KV cache 碎片，连续批处理动态合并请求，GPU 利用率更高；支持量化、张量并行和 OpenAI 兼容 API。代价是显存管理复杂，长上下文仍吃显存。", keywords: ["PagedAttention", "连续批处理", "KV cache", "GPU 利用率"] },
        tip: "没有 GPU 就用小模型/CPU/Ollama；重点是理解参数和指标。"
      },
      {
        day: 2, type: "learn", title: "量化与性能三角：质量、显存、吞吐", minutes: 150,
        focus: "理解 FP16/INT8/INT4、AWQ/GPTQ，能做量化对比实验。",
        tasks: [
          { type: "学", text: "学 FP16/INT8/INT4、AWQ/GPTQ、KV cache 量化、质量损失与适用场景。", minutes: 45 },
          { type: "练", text: "对比量化/非量化（或不同 max-model-len）的延迟、吞吐、显存、3 个样例质量。", minutes: 75 },
          { type: "输出", text: "做三角权衡表；写推荐配置与风险。", minutes: 20 },
          { type: "复盘", text: "3-2-1 笔记 + 当日测验。", minutes: 10 }
        ],
        deliverable: "量化对比表 + 推荐配置",
        oral: { q: "量化的收益和风险是什么？", a: "收益是显存下降、吞吐提升、单位成本降低；风险是质量损失、长尾任务退化、硬件/算子兼容、校准数据偏差。要按业务评测集验证，不只看 perplexity。", keywords: ["显存", "吞吐", "质量损失", "兼容", "评测集"] },
        tip: "量化不是免费加速，必须用业务样本验证。"
      },
      {
        day: 3, type: "learn", title: "Spring AI 基础：Java 接 LLM", minutes: 150,
        focus: "掌握 ChatClient、PromptTemplate、结构化输出、流式与 Advisor。",
        tasks: [
          { type: "学", text: "学 Spring AI ChatClient、prompt template、structured output、streaming、Advisor。", minutes: 45 },
          { type: "练", text: "Spring Boot + Spring AI 接 OpenAI 兼容服务；实现流式 SSE 和结构化输出。", minutes: 75 },
          { type: "输出", text: "对比 Python/FastAPI 与 Spring AI 的实现差异。", minutes: 20 },
          { type: "复盘", text: "3-2-1 笔记 + 当日测验。", minutes: 10 }
        ],
        deliverable: "Spring AI 流式服务",
        oral: { q: "为什么用 Spring AI 而不是再写一个 Python 服务？", a: "复用现有 Java 微服务、鉴权、租户、监控和团队能力；减少跨语言运维；适合企业内嵌 AI 能力。Python 生态更适合快速实验和 Agent 框架，边界可按场景划分。", keywords: ["复用", "鉴权/租户", "运维", "团队", "边界"] },
        tip: "项目三的卖点不是“会 Spring AI”，是“能把 AI 接进企业系统”。"
      },
      {
        day: 4, type: "learn", title: "Spring AI RAG 与模型网关", minutes: 150,
        focus: "把向量检索、引用、多供应商路由和降级接进 Java 服务。",
        tasks: [
          { type: "学", text: "学 Spring AI VectorStore、Retriever、Advisor；模型路由与降级策略。", minutes: 45 },
          { type: "练", text: "实现 RAG 问答 + 两家供应商路由 + 失败降级。", minutes: 75 },
          { type: "输出", text: "画架构图：请求→路由→RAG→模型→引用→监控。", minutes: 20 },
          { type: "复盘", text: "3-2-1 笔记 + 当日测验。", minutes: 10 }
        ],
        deliverable: "Spring AI RAG + 路由降级",
        oral: { q: "多模型路由策略怎么设计？", a: "按任务类型/质量门槛/成本/延迟/可用性路由；灰度比例；失败熔断降级到备用模型；记录每次路由原因和结果；用评测集校准。", keywords: ["任务类型", "成本/延迟", "灰度", "熔断降级", "路由原因"] },
        tip: "路由要有可解释的原因，否则线上无法排障。"
      },
      {
        day: 5, type: "learn", title: "Java 生产化：SSE、背压、熔断、指标", minutes: 150,
        focus: "用 WebFlux/Resilience4j/Micrometer 把服务做到可上线。",
        tasks: [
          { type: "学", text: "学 WebFlux SSE、背压、超时、Resilience4j、Micrometer、缓存。", minutes: 45 },
          { type: "练", text: "加超时/重试/熔断/限流/缓存/指标；写 10 个测试。", minutes: 75 },
          { type: "输出", text: "压测 100/200 并发；做成本测算表。", minutes: 20 },
          { type: "复盘", text: "3-2-1 笔记 + 当日测验。", minutes: 10 }
        ],
        deliverable: "生产化 Java AI 服务 + 压测",
        oral: { q: "WebFlux 下流式返回怎么处理背压和超时？", a: "用 Flux/Mono 和 SSE 编解码；限制缓冲、按下游请求消费；设置整体/单事件超时；客户端断开时取消上游；用 Micrometer 记录延迟和错误。", keywords: ["Flux/Mono", "SSE", "限制缓冲", "超时", "取消上游"] },
        tip: "Java 候选人的杀手锏是工程化，不是会调 API。"
      },
      {
        day: 6, type: "lab", title: "Lab 13：项目三完整版", minutes: 240,
        focus: "完成 Spring AI 模型网关 + RAG + 监控 + 压测。",
        tasks: [
          { type: "项目", text: "补鉴权/租户、缓存、成本统计、降级；整理配置。", minutes: 90 },
          { type: "项目", text: "压测并优化；补架构图和指标表。", minutes: 60 },
          { type: "输出", text: "README + 3 分钟 demo + 成本测算。", minutes: 60 },
          { type: "复盘", text: "自测 + 下周系统设计预习。", minutes: 30 }
        ],
        deliverable: "项目三 v1.0 + 压测/成本报告",
        oral: { q: "用 10 分钟讲项目三。", a: "企业痛点→为什么 Java 接入→架构（路由/RAG/降级/监控）→压测数据→成本→与 Python 服务的边界→失败复盘。", keywords: ["企业痛点", "Java 接入", "架构", "压测", "成本", "边界"] },
        tip: "项目三要和项目一区分：重点是集成、治理和 Java 生态。"
      },
      {
        day: 7, type: "review", title: "W13 周测 + 项目三模拟面试", minutes: 120,
        focus: "复盘部署与 Java 集成，准备系统设计。",
        tasks: [
          { type: "复盘", text: "做 W13 周测（10 题），错题写原因。", minutes: 30 },
          { type: "复盘", text: "模拟 20 分钟项目三深挖；记录 5 个被问住的点。", minutes: 50 },
          { type: "输出", text: "写项目复盘；更新简历 bullet v3。", minutes: 40 }
        ],
        deliverable: "模拟面试记录 + 简历 bullet v3",
        oral: { q: "项目三最容易被追问什么？", a: "为什么不用 Python、路由/降级怎么做、SSE 背压、缓存一致性、成本怎么算、和现有权限体系怎么集成。每个都要有机制和数据。", keywords: ["为什么 Java", "路由/降级", "背压", "缓存", "成本", "权限"] },
        tip: "把“Java 不是包袱，是落地能力”讲成故事。"
      }
    ]
  },
  {
    week: 14,
    phase: 5,
    theme: "AI 系统设计、ML 八股与算法",
    goal: "把项目经验抽象成可复用的系统设计答案，补齐八股与算法模板。",
    outcomes: ["10 道系统设计提纲", "50 张八股速答卡", "8 类算法模板"],
    resources: [
      { title: "Hello Interview", url: "https://www.hellointerview.com/", note: "系统设计框架" },
      { title: "ByteByteGo", url: "https://bytebytego.com/", note: "架构与容量估算" },
      { title: "NeetCode 150", url: "https://neetcode.io/practice", note: "按模式刷题" },
      { title: "李宏毅 NLP", url: "https://speech.ee.ntu.edu.tw/~hylee/ml/2023-spring.php", note: "中文复习 Transformer" }
    ],
    days: [
      {
        day: 1, type: "career", title: "AI 系统设计框架与 RAG 设计", minutes: 150,
        focus: "掌握需求→规模→SLO→架构→取舍的回答结构，完成 2 道 RAG 设计。",
        tasks: [
          { type: "学", text: "学系统设计回答框架：功能/非功能、规模估算、数据模型、核心链路、瓶颈、取舍。", minutes: 45 },
          { type: "练", text: "写 2 道 RAG 设计提纲：企业知识库、多租户客服；每道 1 页。", minutes: 75 },
          { type: "输出", text: "计时 35 分钟口述一道，录音；对照提纲补漏。", minutes: 20 },
          { type: "复盘", text: "3-2-1 笔记 + 当日测验。", minutes: 10 }
        ],
        deliverable: "2 道 RAG 设计提纲 + 录音",
        oral: { q: "设计企业 RAG 平台，先问哪三个问题？", a: "数据规模与类型、用户/租户与权限、质量与延迟/成本 SLO。它们决定切分、向量库、模型和缓存策略。", keywords: ["数据规模", "权限", "SLO", "选型"] },
        tip: "系统设计先对齐需求，不要一上来画组件。"
      },
      {
        day: 2, type: "career", title: "Agent 平台与模型网关设计", minutes: 150,
        focus: "完成 2 道设计：Agent 工作流平台、企业模型网关。",
        tasks: [
          { type: "学", text: "复习 Agent 状态机、工具运行时、审批、trace；网关路由/熔断/配额。", minutes: 45 },
          { type: "练", text: "写 2 道设计提纲；标出 3 个瓶颈和 3 个失败模式。", minutes: 75 },
          { type: "输出", text: "计时 35 分钟口述一道，录音复盘。", minutes: 20 },
          { type: "复盘", text: "3-2-1 笔记 + 当日测验。", minutes: 10 }
        ],
        deliverable: "2 道 Agent/网关设计提纲",
        oral: { q: "设计 Agent 平台的核心难点是什么？", a: "工具协议与权限、状态持久化、长任务调度、人工审批、可观测性、评测、成本与死循环。先做单 Agent 闭环，再扩展多 Agent。", keywords: ["工具协议", "状态", "审批", "观测", "评测", "成本"] },
        tip: "把项目二/三直接抽象成设计题，面试时最自然。"
      },
      {
        day: 3, type: "career", title: "Transformer 与 ML 八股速答", minutes: 150,
        focus: "补齐 attention、归一化、偏差方差、正则、评估指标。",
        tasks: [
          { type: "学", text: "复习 attention/多头/位置编码/LayerNorm、bias-variance、过拟合、正则、分类/排序指标。", minutes: 45 },
          { type: "练", text: "做 50 道速答（口述或写关键词）；错题标红。", minutes: 75 },
          { type: "输出", text: "整理一页速查：公式 + 一句话解释 + 常见追问。", minutes: 20 },
          { type: "复盘", text: "3-2-1 笔记 + 当日测验。", minutes: 10 }
        ],
        deliverable: "50 道八股速答 + 一页速查",
        oral: { q: "LayerNorm 和 BatchNorm 的区别？为什么 Transformer 常用 LayerNorm？", a: "BatchNorm 在 batch 维归一化，依赖 batch 大小，序列长度可变时不稳定；LayerNorm 在特征维归一化，逐样本独立，适合变长序列和自回归。", keywords: ["batch 维", "特征维", "变长", "逐样本"] },
        tip: "八股要能一句话说清，再展开一层；不要背长段落。"
      },
      {
        day: 4, type: "career", title: "算法模板：8 类高频模式", minutes: 150,
        focus: "用模板刷 medium，稳定 25 分钟内写出可运行代码。",
        tasks: [
          { type: "学", text: "复习哈希、双指针、滑窗、二分、堆、图遍历、DP、回溯的模板与适用信号。", minutes: 45 },
          { type: "练", text: "做 6 道 medium（每类至少 1 道），计时；不会的看题解后重写。", minutes: 75 },
          { type: "输出", text: "写 8 张模板卡：触发条件/步骤/边界/复杂度。", minutes: 20 },
          { type: "复盘", text: "3-2-1 笔记 + 当日测验。", minutes: 10 }
        ],
        deliverable: "8 张算法模板卡 + 6 题记录",
        oral: { q: "看到“连续子数组/子串”优先想什么？", a: "滑动窗口（和/频率/最长最短）、前缀和（区间和）、DP（最大子数组）。先看是否有单调性/负数/窗口收缩条件。", keywords: ["滑窗", "前缀和", "DP", "单调性"] },
        tip: "刷题不是比数量，是看到题能反射出模式。"
      },
      {
        day: 5, type: "career", title: "项目三系统设计 + 压测复盘", minutes: 150,
        focus: "把项目三讲成系统设计答案，补容量/成本/容灾。",
        tasks: [
          { type: "学", text: "复习容量估算、缓存、队列、熔断、灰度、成本。", minutes: 30 },
          { type: "练", text: "为项目三写容量估算和 3 个故障演练（供应商挂/超时/限流）。", minutes: 90 },
          { type: "输出", text: "补一页“如果流量 10 倍”的扩展方案。", minutes: 30 }
        ],
        deliverable: "项目三容量/容灾一页纸",
        oral: { q: "流量涨 10 倍，项目三哪里先崩？", a: "通常是模型配额/上游限流、连接池、数据库、缓存和成本。先做容量估算，再加缓存/队列/降级/分片；用压测验证瓶颈，不要平均优化。", keywords: ["配额", "连接池", "数据库", "缓存", "降级", "压测"] },
        tip: "面试官爱问“10 倍”，答案要有数字和顺序。"
      },
      {
        day: 6, type: "career", title: "全真模拟面试 1", minutes: 240,
        focus: "45 分钟项目 + 45 分钟系统设计 + 15 分钟行为，全程录像。",
        tasks: [
          { type: "练", text: "找朋友/用 AI 模拟面试；严格计时；录音录像。", minutes: 105 },
          { type: "复盘", text: "回看录像，记录卡顿/跑题/没答上的点；写改进清单。", minutes: 75 },
          { type: "输出", text: "整理 10 个高频追问的答案卡。", minutes: 60 }
        ],
        deliverable: "模拟面试录像 + 10 张追问卡",
        oral: { q: "模拟面试最大的问题通常是什么？", a: "不是不会，而是结构乱、超时、只讲技术不讲取舍、被追问就慌。用“背景→方案→取舍→指标→失败”结构，先给结论再展开。", keywords: ["结构", "超时", "取舍", "指标", "先结论"] },
        tip: "录像回看很痛苦，但进步最快。"
      },
      {
        day: 7, type: "review", title: "W14 周测 + 弱项补洞", minutes: 120,
        focus: "用测验和模拟面试结果，列最后两周的补洞清单。",
        tasks: [
          { type: "复盘", text: "做 W14 周测（10 题），错题写原因。", minutes: 30 },
          { type: "复盘", text: "整理模拟面试的 5 个弱项，按影响排序。", minutes: 40 },
          { type: "输出", text: "写周报；定 W15 的简历/故事/模拟面试计划。", minutes: 30 },
          { type: "复盘", text: "预习简历与 STAR。", minutes: 20 }
        ],
        deliverable: "弱项清单 + W15 计划",
        oral: { q: "你目前最需要补的三个面试弱项？", a: "示例：系统设计容量估算、项目指标记忆、行为面试故事。要具体到可练习的动作，不要写“加强学习”。", keywords: ["具体", "可练习", "影响排序", "动作"] },
        tip: "最后两周不要开新坑，只补最影响面试的。"
      }
    ]
  },
  {
    week: 15,
    phase: 5,
    theme: "简历、项目包装与模拟面试",
    goal: "把“做过”变成“讲得出、经得起追问”，完成简历 v3 和 3 个项目故事。",
    outcomes: ["简历 v3", "3 个项目故事卡", "3 次模拟面试"],
    resources: [
      { title: "STAR 方法", url: "https://www.themuse.com/advice/star-interview-method", note: "行为面试结构" },
      { title: "Tech Resume Guide", url: "https://www.techinterviewhandbook.org/resume/", note: "一页简历" },
      { title: " interviewing.io", url: "https://interviewing.io/", note: "模拟面试参考" },
      { title: "你的三个项目 README", url: "#/library", note: "所有 bullet 从项目里来" }
    ],
    days: [
      {
        day: 1, type: "career", title: "简历 v3：一页、三条故事线、数字", minutes: 150,
        focus: "重写简历，突出 AI 应用 + Java 工程化 + 业务结果。",
        tasks: [
          { type: "学", text: "学一页简历结构、bullet 写法（动作+技术+难点+结果）、关键词匹配。", minutes: 30 },
          { type: "项目", text: "重写简历：3 个项目各 3–4 条 bullet；保留 Java 高并发/微服务亮点。", minutes: 90 },
          { type: "输出", text: "找 2 个人 review；按 JD 改 2 版关键词。", minutes: 30 }
        ],
        deliverable: "简历 v3（一页）+ 2 个 JD 定制版",
        oral: { q: "你的简历最容易被质疑哪一条？", a: "通常是“指标是不是真的”“项目是不是跟着教程做的”。准备数据来源、评测方法、你负责的部分和失败复盘；能现场打开 GitHub/README。", keywords: ["指标来源", "评测方法", "负责部分", "失败复盘", "可验证"] },
        tip: "每条 bullet 都要能扛住“怎么做的、为什么、数据呢”。"
      },
      {
        day: 2, type: "career", title: "三个项目故事卡：3/10/30 分钟版本", minutes: 150,
        focus: "为每个项目准备短、中、长三个版本，以及 10 个追问。",
        tasks: [
          { type: "学", text: "学项目介绍结构：问题→约束→方案→取舍→指标→失败→如果重做。", minutes: 30 },
          { type: "项目", text: "写 3 个项目故事卡；每个准备 10 个追问和答案要点。", minutes: 90 },
          { type: "输出", text: "录 3 分钟版；对照检查是否超时/跑题。", minutes: 30 }
        ],
        deliverable: "3 个项目故事卡 + 30 个追问",
        oral: { q: "3 分钟讲项目，结构是什么？", a: "一句话问题→约束→架构→2 个关键取舍→1 个指标→1 个失败与修复。不要报菜名，留钩子给面试官追问。", keywords: ["问题", "约束", "架构", "取舍", "指标", "失败"] },
        tip: "故事卡不是背稿，是确保关键点不漏。"
      },
      {
        day: 3, type: "career", title: "作品集与 demo：让面试官 3 分钟看懂", minutes: 150,
        focus: "整理 GitHub、README、演示视频和在线 demo。",
        tasks: [
          { type: "项目", text: "统一 3 个仓库的 README 结构；加架构图、指标、启动方式、限制。", minutes: 90 },
          { type: "项目", text: "补 demo 视频/在线演示；检查链接可访问、无密钥泄露。", minutes: 30 },
          { type: "输出", text: "做一个作品集首页（Notion/GitHub Profile 均可）。", minutes: 30 }
        ],
        deliverable: "作品集首页 + 3 个可访问仓库",
        oral: { q: "面试官点开你的 GitHub，最想看到什么？", a: "README 的问题/架构/指标/启动方式；能跑的 demo；清晰的 commit；没有密钥；项目有取舍和失败复盘。代码量不是第一位的。", keywords: ["README", "demo", "指标", "可运行", "无密钥"] },
        tip: "先让外行 3 分钟看懂，再让内行 30 分钟追问。"
      },
      {
        day: 4, type: "career", title: "模拟面试 2：系统设计 + 项目深挖", minutes: 150,
        focus: "用 60 分钟全真模拟，练结构和取舍。",
        tasks: [
          { type: "学", text: "复习系统设计框架和项目三容量/容灾。", minutes: 30 },
          { type: "练", text: "60 分钟模拟：35 分钟系统设计 + 25 分钟项目深挖；录像。", minutes: 90 },
          { type: "输出", text: "复盘 3 个问题；改故事卡/提纲。", minutes: 30 }
        ],
        deliverable: "模拟面试 2 录像 + 复盘",
        oral: { q: "系统设计被追问“为什么不用 X”怎么答？", a: "先承认替代方案，比较 2–3 个维度（复杂度/成本/延迟/团队能力），说明当前约束下为什么选 Y，以及什么条件下会换。不要防御。", keywords: ["替代方案", "维度", "约束", "换的条件"] },
        tip: "面试不是辩论，是展示权衡过程。"
      },
      {
        day: 5, type: "career", title: "除夕前：行为面试、转型故事与首批投递", minutes: 120,
        focus: "准备 30 秒转型故事、3 个行为故事；除夕前轻量投出首批 5 家。",
        tasks: [
          { type: "学", text: "学 STAR、冲突/失败/主动性故事、离职动机、薪资回答。", minutes: 30 },
          { type: "练", text: "写 3 个 STAR 故事；背熟 30 秒转型故事；模拟 3 个行为问题。", minutes: 60 },
          { type: "输出", text: "投递 5 家（优先练手），记录渠道/岗位/反馈。", minutes: 20 },
          { type: "复盘", text: "检查简历附件命名、链接、邮件模板。", minutes: 10 }
        ],
        deliverable: "3 个 STAR 故事 + 首批 5 家投递",
        oral: { q: "为什么从 Java 转 AI？30 秒版。", a: "动机（看到 AI 落地瓶颈在工程化）→行动（补 Python/LLM/RAG/Agent，做三个项目）→差异化（高并发/微服务/Spring 生态 + AI 应用）→目标（企业级 AI 平台/应用）。", keywords: ["动机", "行动", "差异化", "目标", "30 秒"] },
        tip: "首批投递是练手，不要等“准备好”才投。"
      },
      {
        day: 6, type: "review", title: "春节：最低完成线 + 休息", minutes: 60,
        focus: "2027-02-06 春节。只做轻复盘，不安排硬任务，陪家人。",
        tasks: [
          { type: "复盘", text: "花 20 分钟看一遍三个项目故事卡，口述 1 分钟。", minutes: 20 },
          { type: "输出", text: "写 3 行春节后的投递计划。", minutes: 20 },
          { type: "复盘", text: "离开屏幕，休息。", minutes: 20 }
        ],
        deliverable: "3 行节后计划 + 好好休息",
        oral: { q: "休息一天会影响进度吗？", a: "不会。长期计划里，恢复和连续性比单日强度重要；春节断一天，第二天按最低线接上即可。", keywords: ["连续性", "最低线", "恢复", "长期"] },
        tip: "今天不学习也可以，计划本来就留了弹性。"
      },
      {
        day: 7, type: "career", title: "恢复 + 模拟面试 3 + 投递复盘", minutes: 120,
        focus: "节后重启，完成第三次模拟面试，检查投递反馈。",
        tasks: [
          { type: "复盘", text: "做 W15 周测（10 题），错题写原因。", minutes: 30 },
          { type: "练", text: "30 分钟模拟行为面试 + 项目 3 分钟版；录像。", minutes: 60 },
          { type: "输出", text: "复盘投递反馈；调整目标公司/关键词。", minutes: 30 }
        ],
        deliverable: "模拟面试 3 录像 + 投递复盘",
        oral: { q: "投了 10 家没回音，先改什么？", a: "先看岗位匹配和简历关键词，再看渠道/内推，最后看投递时间；不要只改简历措辞。必要时降一级投或换细分方向。", keywords: ["匹配", "关键词", "渠道", "内推", "降级"] },
        tip: "没有回音是数据，不是否定；用数据改下一步。"
      }
    ]
  },
  {
    week: 16,
    phase: 5,
    theme: "投递、面试迭代与 Offer",
    goal: "用真实面试反馈迭代，拿到并比较 offer。",
    outcomes: ["累计投递 60+", "10 次面试复盘", "Offer 决策表"],
    resources: [
      { title: "Boss 直聘", url: "https://www.zhipin.com/", note: "主投渠道" },
      { title: "脉脉", url: "https://maimai.cn/", note: "内推与公司信息" },
      { title: "OfferShow", url: "https://www.offershow.cn/", note: "薪资参考，注意样本偏差" },
      { title: "你的错题本", url: "#/quiz", note: "每次面试后更新" }
    ],
    days: [
      {
        day: 1, type: "career", title: "定向投递 20 家 + 内推", minutes: 150,
        focus: "按冲刺/匹配/保底三档投递，优先内推。",
        tasks: [
          { type: "项目", text: "整理 30 家目标公司清单；分三档；找 5 个内推。", minutes: 60 },
          { type: "项目", text: "投递 20 家；每个岗位记录 JD 关键词/渠道/日期。", minutes: 60 },
          { type: "输出", text: "更新求职追踪表；设置 3 天跟进提醒。", minutes: 30 }
        ],
        deliverable: "30 家清单 + 20 家投递",
        oral: { q: "怎么选目标公司？", a: "看 AI 落地场景、团队阶段、技术栈匹配、工程文化、稳定性和成长；分冲刺/匹配/保底，别只投大厂。", keywords: ["落地场景", "阶段", "匹配", "分档", "成长"] },
        tip: "投递量是概率游戏，但定向比海投有效。"
      },
      {
        day: 2, type: "career", title: "面试复盘与弱项补洞", minutes: 150,
        focus: "把最近 3 次面试的失败点变成可练习的清单。",
        tasks: [
          { type: "复盘", text: "整理最近 3 次面试问题；按“不会/不熟/表达差”分类。", minutes: 60 },
          { type: "项目", text: "补 2 个最影响通过率的知识点；更新速答卡。", minutes: 60 },
          { type: "输出", text: "写面试复盘模板，之后每次 24 小时内填。", minutes: 30 }
        ],
        deliverable: "面试复盘模板 + 2 个补洞",
        oral: { q: "面试复盘要记什么？", a: "问题、你的回答、卡点、正确答案/更好结构、面试官追问、下一次怎么改。按知识点和表达分开，24 小时内完成。", keywords: ["问题", "回答", "卡点", "追问", "24 小时"] },
        tip: "复盘不是记流水账，是找可复用的模式。"
      },
      {
        day: 3, type: "career", title: "模拟面试 3 + 压力测试", minutes: 150,
        focus: "在疲劳/追问下保持结构，练“不会时怎么答”。",
        tasks: [
          { type: "练", text: "60 分钟压力模拟：连续追问、打断、质疑数据；录像。", minutes: 90 },
          { type: "复盘", text: "复盘情绪/结构/事实；写 3 条改进。", minutes: 30 },
          { type: "输出", text: "准备“不会的问题”回答模板：承认→拆解→给假设→说验证方式。", minutes: 30 }
        ],
        deliverable: "压力模拟录像 + 不会题模板",
        oral: { q: "遇到完全不会的问题怎么答？", a: "先承认没做过，再拆解问题、给出假设和可验证方案，最后说会怎么查/怎么试。不要编数据，也不要沉默。", keywords: ["承认", "拆解", "假设", "验证", "不编造"] },
        tip: "面试官更看重思路，不是你什么都会。"
      },
      {
        day: 4, type: "career", title: "系统设计与八股补洞", minutes: 150,
        focus: "针对面试反馈补 3 个高频盲点，保持算法手感。",
        tasks: [
          { type: "学", text: "复习 3 个高频盲点（如缓存一致性/队列/评测指标）。", minutes: 45 },
          { type: "练", text: "2 道系统设计提纲 + 4 道算法 medium；计时。", minutes: 75 },
          { type: "输出", text: "更新速查卡；错题加入复习队列。", minutes: 30 }
        ],
        deliverable: "3 个盲点补洞 + 4 题记录",
        oral: { q: "怎么在两周内补一个弱项？", a: "只补高频且影响大的；看 1 份好材料→写 1 页提纲→口述/做题→找反馈→再讲一遍。不要从第一章开始系统学。", keywords: ["高频", "影响大", "一页提纲", "口述", "反馈"] },
        tip: "面试期学习要“功利”，按反馈补，不按教材顺序。"
      },
      {
        day: 5, type: "career", title: "Offer 评估与谈判", minutes: 150,
        focus: "建立决策表，准备薪资谈判与入职前问题清单。",
        tasks: [
          { type: "学", text: "学总包结构、谈判话术、offer 对比维度、试用期风险。", minutes: 45 },
          { type: "项目", text: "做 offer 决策表：base/奖金/股票/成长/通勤/稳定性/汇报线。", minutes: 60 },
          { type: "输出", text: "写谈判脚本和 10 个入职前问题。", minutes: 45 }
        ],
        deliverable: "Offer 决策表 + 谈判脚本",
        oral: { q: "怎么比较两个 offer？", a: "看总包确定性和增长、岗位成长/汇报线、业务稳定性、团队 AI 落地阶段、通勤/加班、试用期条款。不要只比 base。", keywords: ["总包", "确定性", "成长", "稳定性", "试用期"] },
        tip: "谈判聚焦岗位匹配和市场区间，不要情绪化。"
      },
      {
        day: 6, type: "career", title: "16 周复盘与 90 天成长计划", minutes: 150,
        focus: "复盘转型过程，制定入职后的 90 天计划。",
        tasks: [
          { type: "复盘", text: "做 W16 周测（10 题）；整理全部错题。", minutes: 40 },
          { type: "输出", text: "写 16 周复盘：做成了什么/没做到/最大变化/下一步。", minutes: 60 },
          { type: "输出", text: "写 90 天计划：技术/项目/英语/输出/人脉。", minutes: 50 }
        ],
        deliverable: "16 周复盘 + 90 天计划",
        oral: { q: "16 周最大的变化是什么？", a: "从“会调 API”变成“能设计、评测、部署、讲清一个 AI 系统”；更重要的是建立了每天学习-输出-复盘的系统。", keywords: ["系统能力", "评测", "部署", "表达", "习惯"] },
        tip: "把复盘写下来，面试“你最近的学习”时直接能用。"
      },
      {
        day: 7, type: "review", title: "毕业：保持手感，持续投递", minutes: 120,
        focus: "计划结束，但求职继续；建立每周维护节奏。",
        tasks: [
          { type: "复盘", text: "检查投递漏斗：投递/沟通/一面/二面/终面/offer。", minutes: 40 },
          { type: "输出", text: "定每周节奏：2 次算法、1 次项目复述、5 家投递、1 次复盘。", minutes: 40 },
          { type: "复盘", text: "给自己一个奖励，休息半天。", minutes: 40 }
        ],
        deliverable: "每周维护节奏 + 下一步计划",
        oral: { q: "计划结束后怎么保持竞争力？", a: "每周固定算法/项目复述/投递/复盘；跟踪一个技术方向；持续输出；面试反馈驱动补洞。不要再从零学一门新课。", keywords: ["每周节奏", "项目复述", "投递", "输出", "反馈"] },
        tip: "拿到 offer 不是终点，是下一段成长的起点。"
      }
    ]
  }
]);

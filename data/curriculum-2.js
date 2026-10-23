/* W5–W8：RAG 基础、高级检索、项目一 */
window.CURRICULUM = (window.CURRICULUM || []).concat([
  {
    week: 5,
    phase: 1,
    theme: "Embedding 与 RAG 基础",
    goal: "搭出最小 RAG 闭环，理解切分、检索、引用与评测，能诊断召回失败。",
    outcomes: ["pgvector 最小检索", "20 条评测集", "mini-rag 原型 v0.1"],
    resources: [
      { title: "pgvector", url: "https://github.com/pgvector/pgvector", note: "HNSW、距离函数、过滤" },
      { title: "Qdrant 文档", url: "https://qdrant.tech/documentation/", note: "对比专用向量库的设计" },
      { title: "BAAI/bge-m3", url: "https://huggingface.co/BAAI/bge-m3", note: "多语言 embedding" },
      { title: "RAG 原论文", url: "https://arxiv.org/abs/2005.11401", note: "读摘要与架构图" }
    ],
    days: [
      {
        day: 1, type: "learn", title: "Embedding 模型与向量库选型", minutes: 150,
        focus: "理解维度、多语言、成本与向量库差异；用 pgvector 建第一张向量表。",
        tasks: [
          { type: "学", text: "对比 bge-m3 / text-embedding-3-small / jina 的维度、多语言、成本；对比 pgvector / Qdrant / Chroma / Milvus。", minutes: 45 },
          { type: "练", text: "Docker 起 pgvector；建 documents/chunks 表；写入 20 条向量；跑 top5 相似度查询。", minutes: 75 },
          { type: "输出", text: "写选型 ADR：项目一为什么用 pgvector，什么情况下会换。", minutes: 20 },
          { type: "复盘", text: "3-2-1 笔记 + 当日测验。", minutes: 10 }
        ],
        deliverable: "pgvector 最小检索 + 选型 ADR",
        oral: { q: "pgvector 的 HNSW 索引参数 m、ef_construction、ef_search 分别影响什么？", a: "m 控制每个节点的连接数，越大召回越高、内存越大；ef_construction 控制建索引时的候选集，越大索引质量越高、构建越慢；ef_search 控制查询候选集，越大召回越高、延迟越大。", keywords: ["m 连接数", "ef_construction 建索引", "ef_search 查询", "召回/延迟/内存"] },
        tip: "先用 Postgres 一站式，不要一开始上专用向量库。"
      },
      {
        day: 2, type: "learn", title: "文档解析与切分：RAG 最容易被低估的环节", minutes: 150,
        focus: "掌握 fixed/recursive/semantic/parent-child 切分，理解 overlap 与 metadata。",
        tasks: [
          { type: "学", text: "学 PDF/Word/Markdown 解析、fixed/recursive/semantic/parent-child、overlap、metadata 设计。", minutes: 45 },
          { type: "练", text: "用 pypdf/python-docx 解析 3 个文档；写递归切分器；统计 chunk 长度分布；加标题/页码/租户 metadata。", minutes: 75 },
          { type: "输出", text: "做切分实验：2 种 size/overlap 在 5 个问题上的召回对比。", minutes: 20 },
          { type: "复盘", text: "3-2-1 笔记 + 当日测验。", minutes: 10 }
        ],
        deliverable: "解析器 + 切分实验记录",
        oral: { q: "为什么按标题/段落切分通常比固定窗口好？", a: "它保留语义边界，减少一句话被截断；但标题层级和段落长度不均，需要再按 token 上限二次切分。固定窗口简单但容易切断语义，适合没有结构的文本。", keywords: ["语义边界", "二次切分", "结构", "token 上限"] },
        tip: "切分是 RAG 收益最大的环节之一，值得多做两组实验。"
      },
      {
        day: 3, type: "learn", title: "向量检索、过滤与 MMR", minutes: 150,
        focus: "实现 top-k、metadata filter、MMR，理解召回数量与多样性的权衡。",
        tasks: [
          { type: "学", text: "学 cosine/inner product、top-k、MMR、metadata filter、多租户隔离。", minutes: 45 },
          { type: "练", text: "实现 retrieve(query, k, filters)；加 MMR；测试 filter 前后结果；观察重复 chunk。", minutes: 75 },
          { type: "输出", text: "记录 10 个 query 的 top5 相关性评分（人工 0–2 分）。", minutes: 20 },
          { type: "复盘", text: "3-2-1 笔记 + 当日测验。", minutes: 10 }
        ],
        deliverable: "检索函数 + 10 个 query 相关性记录",
        oral: { q: "MMR 解决什么问题？lambda 怎么权衡？", a: "MMR 在相关性和多样性之间做权衡，避免 top-k 全是重复片段。lambda 越接近 1 越重相关性，越接近 0 越重多样性；要看任务，问答通常偏相关，探索型任务可以更分散。", keywords: ["多样性", "重复片段", "lambda", "相关性"] },
        tip: "先做 baseline，再调 k；k 不是越大越好，噪声和成本都会上升。"
      },
      {
        day: 4, type: "learn", title: "上下文拼装、引用与拒答", minutes: 150,
        focus: "把检索结果变成模型可用的上下文，并让引用可验证。",
        tasks: [
          { type: "学", text: "学 context assembly、token budget、排序、citation、拒答策略、prompt 模板。", minutes: 45 },
          { type: "练", text: "实现 answer(query)：检索→拼上下文→LLM→引用 [1][2]；无证据时拒答。", minutes: 75 },
          { type: "输出", text: "跑 10 个问答，检查引用是否真的支持答案。", minutes: 20 },
          { type: "复盘", text: "3-2-1 笔记 + 当日测验。", minutes: 10 }
        ],
        deliverable: "带引用与拒答的问答函数",
        oral: { q: "怎么让引用可信，而不是装饰？", a: "给每个 chunk 稳定 id；要求模型引用原文片段；生成后校验引用 id 存在、片段确实包含在上下文、答案能被片段支持；不允许编造 id；引用命中率纳入评测。", keywords: ["稳定 id", "校验存在", "蕴含", "引用命中率"] },
        tip: "引用不是装饰，是评测和信任的基础。"
      },
      {
        day: 5, type: "learn", title: "最小 RAG 评测：先量出来", minutes: 150,
        focus: "构造 20 条评测集，算 Recall@5、引用命中，建立失败分类。",
        tasks: [
          { type: "学", text: "学评测集结构（question/answer/relevant chunk ids）、Recall@K、MRR、faithfulness、人工抽检。", minutes: 45 },
          { type: "练", text: "建 20 条评测；跑 baseline；算 Recall@5、引用命中；记录失败类型。", minutes: 75 },
          { type: "输出", text: "写评测报告 v1 + 失败聚类（切分/召回/排序/生成/引用）。", minutes: 20 },
          { type: "复盘", text: "3-2-1 笔记 + 当日测验。", minutes: 10 }
        ],
        deliverable: "20 条评测集 + 评测报告 v1",
        oral: { q: "Recall@K 和 faithfulness 有什么区别？", a: "Recall@K 衡量检索有没有把相关文档召回到前 K 个，属于检索指标；faithfulness 衡量答案是否忠于检索到的证据，属于生成指标。召回高但忠实度低，说明模型没用证据或证据有冲突。", keywords: ["检索", "生成", "召回", "忠于证据"] },
        tip: "评测集从真实文档和真实问题来，不要自己编。"
      },
      {
        day: 6, type: "lab", title: "Lab 05：mini-rag 原型", minutes: 240,
        focus: "把 ingest/retrieve/answer 串成可复用骨架，作为项目一起点。",
        tasks: [
          { type: "项目", text: "把 ingest/retrieve/answer 串成 CLI 或 FastAPI；支持重新索引。", minutes: 60 },
          { type: "项目", text: "加增量索引、重复检测、简单缓存；跑通 20 条评测。", minutes: 90 },
          { type: "输出", text: "README + 架构图 + 评测结果 + 已知问题。", minutes: 60 },
          { type: "复盘", text: "自测 + 下周预习。", minutes: 30 }
        ],
        deliverable: "mini-rag v0.1（项目一骨架）",
        oral: { q: "你的 RAG baseline 架构是什么？三个瓶颈在哪？", a: "解析→切分→embedding→pgvector→top-k→拼上下文→LLM→引用。瓶颈通常在切分、召回和生成忠实度；先用评测定位，不要同时改三处。", keywords: ["全链路", "切分", "召回", "忠实度", "评测定位"] },
        tip: "这是项目一的骨架，代码要能直接复用。"
      },
      {
        day: 7, type: "review", title: "W5 周测：RAG 基础", minutes: 120,
        focus: "画清 RAG 链路，整理失败模式，准备高级检索。",
        tasks: [
          { type: "复盘", text: "做 W5 周测（10 题），错题写原因。", minutes: 30 },
          { type: "复盘", text: "画 RAG 全链路图，标注 5 个失败点；补 5 张口述卡。", minutes: 40 },
          { type: "输出", text: "写周报；把 mini-rag 推到 GitHub。", minutes: 30 },
          { type: "复盘", text: "预习 BM25/rerank，列出 3 个问题。", minutes: 20 }
        ],
        deliverable: "周报 + RAG 链路图 + GitHub 仓库",
        oral: { q: "用 3 分钟讲 RAG 全链路和失败模式。", a: "解析/切分丢信息、embedding 不适配、召回漏、排序差、上下文噪声、模型不用证据、引用错位、权限漏洞。每个环节都要有指标和 trace。", keywords: ["全链路", "失败点", "指标", "trace"] },
        tip: "从今天开始，所有 RAG 改动都要有 baseline 对比。"
      }
    ]
  },
  {
    week: 6,
    phase: 1,
    theme: "高级检索与 RAG 评测",
    goal: "从“能答”到“答得准、可证明”，掌握混合检索、rerank、query 改写和 RAGAS。",
    outcomes: ["hybrid + rerank 消融报告", "RAGAS 评测 v2", "优化版 RAG v0.5"],
    resources: [
      { title: "RAGAS", url: "https://docs.ragas.io/", note: "faithfulness 等指标" },
      { title: "bge-reranker-v2-m3", url: "https://huggingface.co/BAAI/bge-reranker-v2-m3", note: "中文精排" },
      { title: "rank_bm25", url: "https://github.com/dorianbrown/rank_bm25", note: "BM25 最小实现" },
      { title: "Self-RAG", url: "https://arxiv.org/abs/2310.11511", note: "读摘要，理解自反思检索" }
    ],
    days: [
      {
        day: 1, type: "learn", title: "BM25 与混合检索", minutes: 150,
        focus: "理解稀疏检索的互补价值，实现 RRF 融合。",
        tasks: [
          { type: "学", text: "学 BM25 原理、倒排、中文分词、hybrid search、RRF。", minutes: 45 },
          { type: "练", text: "用 rank_bm25 + jieba 建索引；与向量结果对比；实现 RRF 融合。", minutes: 75 },
          { type: "输出", text: "10 个 query 的召回对比表（dense/BM25/hybrid）。", minutes: 20 },
          { type: "复盘", text: "3-2-1 笔记 + 当日测验。", minutes: 10 }
        ],
        deliverable: "hybrid 检索 + 对比表",
        oral: { q: "BM25 为什么能补向量检索？", a: "BM25 依赖词项精确匹配和 IDF，擅长专有名词、编号、错误码、精确关键词；向量检索擅长语义泛化但对稀有词和精确匹配可能弱。两者互补，用 RRF 融合更稳健。", keywords: ["精确匹配", "IDF", "专有名词", "互补", "RRF"] },
        tip: "中文先分词；BM25 的 k1/b 可以调，但先看失败 query 类型。"
      },
      {
        day: 2, type: "learn", title: "Rerank：用精度换延迟", minutes: 150,
        focus: "理解 bi-encoder 与 cross-encoder 的差异，接一个 reranker 并量化收益。",
        tasks: [
          { type: "学", text: "学 bi-encoder vs cross-encoder、bge-reranker、延迟与成本、候选集大小。", minutes: 45 },
          { type: "练", text: "接 bge-reranker（本地或 API）；对 top20 精排；测 Recall@5 与延迟。", minutes: 75 },
          { type: "输出", text: "做消融表：baseline / +BM25 / +rerank。", minutes: 20 },
          { type: "复盘", text: "3-2-1 笔记 + 当日测验。", minutes: 10 }
        ],
        deliverable: "rerank 接入 + 消融表",
        oral: { q: "bi-encoder 和 cross-encoder 的区别？", a: "bi-encoder 分别编码 query 和文档，可预计算，检索快但交互弱；cross-encoder 把 query+文档一起编码，精度高但每个候选都要跑一次，适合对少量候选精排。", keywords: ["分别编码", "联合编码", "预计算", "精排"] },
        tip: "rerank 只对候选集做，不要全库；先测延迟再决定候选数。"
      },
      {
        day: 3, type: "learn", title: "Query 改写：多查询、HyDE 与分解", minutes: 150,
        focus: "用改写补召回，但控制延迟、成本和语义漂移。",
        tasks: [
          { type: "学", text: "学 query rewrite、multi-query、HyDE、问题分解、指代消解。", minutes: 45 },
          { type: "练", text: "实现 3 种改写；在 10 个 query 上对比；记录额外延迟和成本。", minutes: 75 },
          { type: "输出", text: "改写前后 Recall@5 对比表 + 失败案例。", minutes: 20 },
          { type: "复盘", text: "3-2-1 笔记 + 当日测验。", minutes: 10 }
        ],
        deliverable: "3 种 query 改写 + 对比表",
        oral: { q: "HyDE 的原理和风险？", a: "先让模型生成一个假设答案，再用假设答案的向量去检索；适合短 query、语义稀疏的问题。风险是假设答案本身可能幻觉或偏移，导致召回错误；要与原 query 融合并评测。", keywords: ["假设答案", "向量检索", "幻觉", "融合", "评测"] },
        tip: "改写不是越多越好，先看失败 query 的类型。"
      },
      {
        day: 4, type: "learn", title: "Parent-child、上下文压缩与引用对齐", minutes: 150,
        focus: "用小 chunk 检索、大 chunk 生成，减少噪声与 token 成本。",
        tasks: [
          { type: "学", text: "学 parent-child、sentence window、context compression、citation alignment。", minutes: 45 },
          { type: "练", text: "实现 parent-child：小块检索大块返回；引用定位到句子；测 token 成本。", minutes: 75 },
          { type: "输出", text: "对比表：答案质量/成本/引用命中。", minutes: 20 },
          { type: "复盘", text: "3-2-1 笔记 + 当日测验。", minutes: 10 }
        ],
        deliverable: "parent-child 检索 + 对比表",
        oral: { q: "parent-child 切分解决什么问题？", a: "用小块做检索，命中更精确；返回时映射到父块，给模型更完整的上下文。代价是存储映射、父块可能超 token、引用粒度要额外处理。", keywords: ["小块检索", "父块返回", "精度", "上下文", "映射成本"] },
        tip: "引用粒度越细，校验越容易。"
      },
      {
        day: 5, type: "learn", title: "RAGAS 与评测体系", minutes: 150,
        focus: "用 RAGAS 做回归，理解指标与人工评分的不一致。",
        tasks: [
          { type: "学", text: "学 faithfulness、answer relevancy、context precision/recall；理解 judge 偏差。", minutes: 45 },
          { type: "练", text: "用 RAGAS 跑 20 条；与人工评分对比；分析不一致样本。", minutes: 75 },
          { type: "输出", text: "评测报告 v2 + 指标解释 + 不一致案例。", minutes: 20 },
          { type: "复盘", text: "3-2-1 笔记 + 当日测验。", minutes: 10 }
        ],
        deliverable: "RAGAS 评测报告 v2",
        oral: { q: "RAGAS 指标能替代人工评测吗？", a: "不能。它适合回归和筛坏例，但 judge 有偏差、对 prompt 敏感、可能误判。要用人工标注校准，关键决策仍看人工和业务指标。", keywords: ["回归", "筛坏例", "judge 偏差", "人工校准"] },
        tip: "指标要跟业务目标绑定，别唯分数。"
      },
      {
        day: 6, type: "lab", title: "Lab 06：优化版 RAG 与消融", minutes: 240,
        focus: "把 hybrid、rerank、rewrite 组合起来，跑完整消融，选最优配置。",
        tasks: [
          { type: "项目", text: "集成 hybrid + rerank + query rewrite，做成配置开关。", minutes: 60 },
          { type: "项目", text: "跑消融组合；记录 Recall@5、忠实度、P95、成本；选默认配置。", minutes: 90 },
          { type: "输出", text: "对比报告 + 架构图 + 失败案例。", minutes: 60 },
          { type: "复盘", text: "自测 + 下周项目一需求。", minutes: 30 }
        ],
        deliverable: "RAG v0.5 + 消融报告",
        oral: { q: "你怎么证明一次 RAG 优化真的有效？", a: "固定评测集、保留 baseline、一次只改一个变量、同时看质量/延迟/成本；对失败样本做聚类；线上再用 trace 和业务指标验证。", keywords: ["固定评测集", "baseline", "单变量", "质量/延迟/成本", "trace"] },
        tip: "保留 baseline，面试时讲“提升了多少”才有依据。"
      },
      {
        day: 7, type: "review", title: "W6 周测：高级检索与评测", minutes: 120,
        focus: "复盘消融结果，准备项目一。",
        tasks: [
          { type: "复盘", text: "做 W6 周测（10 题），错题写原因。", minutes: 30 },
          { type: "复盘", text: "整理 3 组消融结论；补 5 张口述卡。", minutes: 40 },
          { type: "输出", text: "写周报；列项目一的需求/风险清单。", minutes: 30 },
          { type: "复盘", text: "预习多租户/异步 ingestion，列出 3 个问题。", minutes: 20 }
        ],
        deliverable: "周报 + 项目一需求清单",
        oral: { q: "用 3 分钟讲 RAG 优化的取舍。", a: "hybrid 提升召回但增加索引；rerank 提升精度但增加延迟；rewrite 提升短 query 召回但增加成本；parent-child 提升上下文但增加存储。用评测集和 SLO 选组合。", keywords: ["hybrid", "rerank", "rewrite", "parent-child", "SLO"] },
        tip: "项目一不要堆所有技术，选 2–3 个能讲清楚的。"
      }
    ]
  },
  {
    week: 7,
    phase: 2,
    theme: "项目一（上）：企业知识库 RAG",
    goal: "完成上传→解析→索引→问答→引用主链路，支持多租户。",
    outcomes: ["可演示的 RAG 服务", "多租户越权测试", "3 分钟 demo 脚本"],
    resources: [
      { title: "FastAPI 流式响应", url: "https://fastapi.tiangolo.com/advanced/custom-response/", note: "StreamingResponse" },
      { title: "pgvector 过滤", url: "https://github.com/pgvector/pgvector#filtering", note: "metadata filter 与索引" },
      { title: "Postgres RLS", url: "https://www.postgresql.org/docs/current/ddl-rowsecurity.html", note: "行级安全" },
      { title: "Unstructured", url: "https://docs.unstructured.io/", note: "复杂文档解析" }
    ],
    days: [
      {
        day: 1, type: "project", title: "需求、架构与验收指标", minutes: 150,
        focus: "先定边界、数据模型、SLO 和威胁模型，再写代码。",
        tasks: [
          { type: "学", text: "学需求分析、SLO、多租户数据模型、威胁模型；看 1–2 个 RAG 平台架构。", minutes: 30 },
          { type: "项目", text: "写 PRD/架构图/ER 图/API 契约；定 4 条验收指标（召回、忠实度、P95、成本）。", minutes: 90 },
          { type: "输出", text: "用 self-review checklist 评审方案；列出 5 个风险。", minutes: 30 }
        ],
        deliverable: "PRD + 架构图 + ER 图 + API 契约",
        oral: { q: "为什么项目一开始就要定评测集和 SLO？", a: "它们决定切分、模型、向量库和成本取舍；没有基线和目标，做完才发现不达标。SLO 还能指导压测和降级策略。", keywords: ["基线", "目标", "选型", "压测", "降级"] },
        tip: "今天不写业务代码，先把边界定清楚。"
      },
      {
        day: 2, type: "project", title: "Ingestion：上传、解析、切分、入库", minutes: 150,
        focus: "把文档处理做成可重试、可观测的异步流水线。",
        tasks: [
          { type: "项目", text: "上传接口；PDF/Word/Markdown 解析；清洗；递归切分；metadata；内容 hash 去重；任务状态表。", minutes: 120 },
          { type: "输出", text: "用 3 个真实文档跑通；记录 chunk 数、失败原因、耗时。", minutes: 30 }
        ],
        deliverable: "ingestion 流水线 + 3 个文档样本",
        oral: { q: "ingestion 为什么要异步？怎么保证可重试？", a: "解析和 embedding 慢且易失败，同步会阻塞请求。用任务表记录 status/error/retry_count，步骤幂等（内容 hash/唯一约束），失败可重入，死信可人工处理。", keywords: ["耗时", "任务表", "幂等", "重试", "死信"] },
        tip: "任务表要有 status/error/retry_count，否则排障很痛苦。"
      },
      {
        day: 3, type: "project", title: "索引与检索：pgvector + hybrid + filter", minutes: 150,
        focus: "批量 embedding、HNSW、增量索引、混合检索与租户过滤。",
        tasks: [
          { type: "项目", text: "embedding 批处理与限流；写 pgvector；建 HNSW；实现 hybrid + filter；增量索引。", minutes: 120 },
          { type: "输出", text: "10 个 query 的检索测试；记录 Recall@5 与延迟。", minutes: 30 }
        ],
        deliverable: "索引与检索模块",
        oral: { q: "增量索引怎么避免重复和漏索引？", a: "用文档 id + 内容 hash + 唯一约束；先删旧 chunk 再写新 chunk，或 upsert；记录索引版本；失败任务重试；定期做一致性校验。", keywords: ["内容 hash", "唯一约束", "upsert", "版本", "一致性"] },
        tip: "批量 embedding 注意限流和失败重试，别一次打爆 API。"
      },
      {
        day: 4, type: "project", title: "问答、引用与拒答", minutes: 150,
        focus: "实现流式问答、上下文拼装、chunk 级引用和无答案拒答。",
        tasks: [
          { type: "项目", text: "/chat 流式；context assembly；citation；拒答；会话历史。", minutes: 120 },
          { type: "输出", text: "20 条问答测试；统计引用命中率与拒答准确率。", minutes: 30 }
        ],
        deliverable: "问答接口 + 引用 + 拒答",
        oral: { q: "拒答策略怎么设计？", a: "检索分数阈值 + 模型判断 + 无有效引用三条组合；阈值要在评测集上调，权衡误拒和漏拒；拒答时给出下一步建议，而不是冷冰冰一句“不知道”。", keywords: ["分数阈值", "模型判断", "无引用", "误拒/漏拒"] },
        tip: "先保证引用正确，再追求回答漂亮。"
      },
      {
        day: 5, type: "project", title: "多租户与权限：最危险的是“先召回再过滤”", minutes: 150,
        focus: "把 tenant_id 贯穿数据、检索、缓存和审计。",
        tasks: [
          { type: "项目", text: "tenant_id 数据模型；检索前强制 filter；API key/JWT；审计日志；缓存 key 带租户。", minutes: 120 },
          { type: "输出", text: "写 10 个越权测试用例并全部通过。", minutes: 30 }
        ],
        deliverable: "多租户隔离 + 越权测试",
        oral: { q: "多租户向量检索怎么防止越权？", a: "tenant_id 进入 metadata，检索 SQL 强制 where；数据库行级安全；写入时校验；缓存 key 带租户；返回前再次校验；用越权用例回归。不能先全局召回再在应用层过滤。", keywords: ["强制 filter", "RLS", "缓存 key", "返回校验", "越权回归"] },
        tip: "不要“先全局召回再过滤”，这是典型越权漏洞。"
      },
      {
        day: 6, type: "project", title: "集成、端到端测试与 demo", minutes: 240,
        focus: "把链路串起来，做最小界面/CLI，准备 3 分钟演示。",
        tasks: [
          { type: "项目", text: "最小前端或 CLI：上传/问答/引用展示；错误与加载状态。", minutes: 90 },
          { type: "项目", text: "端到端测试；修 3 个高频问题；补日志。", minutes: 60 },
          { type: "输出", text: "3 分钟 demo 脚本；README v1（架构/启动/限制）。", minutes: 60 },
          { type: "复盘", text: "自测 + 列 W8 生产化清单。", minutes: 30 }
        ],
        deliverable: "RAG v0.9 可演示 + demo 脚本",
        oral: { q: "演示项目时怎么讲架构？", a: "先讲业务问题和约束，再画链路（上传→解析→索引→检索→生成→引用），然后给指标和取舍，最后讲一个失败案例与修复。不要上来就报技术栈。", keywords: ["问题", "约束", "链路", "指标", "取舍", "失败案例"] },
        tip: "demo 先讲问题再演示，观众才知道你在解决什么。"
      },
      {
        day: 7, type: "review", title: "W7 周测 + 项目复盘", minutes: 120,
        focus: "检查主链路是否真的可用，列生产化清单。",
        tasks: [
          { type: "复盘", text: "做 W7 周测（10 题），错题写原因。", minutes: 30 },
          { type: "复盘", text: "按验收指标自测；列 5 个最大风险（权限/性能/评测/成本/体验）。", minutes: 40 },
          { type: "输出", text: "写项目复盘：完成/未完成/下周优先级。", minutes: 30 },
          { type: "复盘", text: "预习 Docker/缓存/可观测性。", minutes: 20 }
        ],
        deliverable: "项目复盘 + W8 生产化清单",
        oral: { q: "项目一当前最大的风险是什么？", a: "通常是评测不足、权限隔离、长文档性能、成本不可控。要按影响 × 概率排序，先修会导致数据泄露或无法上线的。", keywords: ["评测", "权限", "性能", "成本", "优先级"] },
        tip: "项目一不追求功能多，追求主链路稳、指标真。"
      }
    ]
  },
  {
    week: 8,
    phase: 2,
    theme: "项目一（下）：生产化与交付",
    goal: "把项目变成能写进简历的作品：容器化、缓存、监控、压测、文档与视频。",
    outcomes: ["Docker 一键启动", "监控与压测报告", "README + 3 分钟视频 + 文章"],
    resources: [
      { title: "Langfuse", url: "https://langfuse.com/docs", note: "trace 与成本" },
      { title: "k6", url: "https://k6.io/docs/", note: "压测脚本" },
      { title: "Docker Compose", url: "https://docs.docker.com/compose/", note: "多服务编排" },
      { title: "C4 model", url: "https://c4model.com/", note: "架构图规范" }
    ],
    days: [
      {
        day: 1, type: "project", title: "Docker Compose 与配置管理", minutes: 150,
        focus: "让新机器 10 分钟内跑起来，配置不写死。",
        tasks: [
          { type: "项目", text: "compose 起 api+postgres+redis（可选 langfuse）；健康检查；migrations；.env.example。", minutes: 120 },
          { type: "输出", text: "一键启动验证；记录启动时间与镜像大小。", minutes: 30 }
        ],
        deliverable: "Docker Compose 一键启动",
        oral: { q: "Compose 的网络、卷和健康检查怎么设计？", a: "服务名即 DNS；数据卷持久化 Postgres/Redis；healthcheck 判断依赖就绪；depends_on 配 condition；敏感配置走 env；只暴露必要端口。", keywords: ["服务名 DNS", "数据卷", "healthcheck", "depends_on", "env"] },
        tip: "先保证一键启动，再谈镜像优化。"
      },
      {
        day: 2, type: "project", title: "缓存、限流与成本控制", minutes: 150,
        focus: "用缓存降延迟和成本，同时避免串答案和越权。",
        tasks: [
          { type: "项目", text: "精确缓存（query+tenant+doc version）；可选语义缓存；限流；token 成本统计。", minutes: 120 },
          { type: "输出", text: "对比缓存前后命中率、P95、成本。", minutes: 30 }
        ],
        deliverable: "缓存/限流/成本统计",
        oral: { q: "语义缓存的风险是什么？", a: "相似问题可能意图不同，导致串答案；文档更新后缓存过期；租户/权限不同不能共用。要设相似度阈值、带租户和版本书 key、TTL、可关闭，并监控误命中。", keywords: ["串答案", "意图不同", "版本", "租户", "阈值"] },
        tip: "缓存 key 必须带租户和文档版本，否则越权/过期。"
      },
      {
        day: 3, type: "project", title: "可观测性：trace、token、延迟、错误", minutes: 150,
        focus: "让每个请求都能回答“为什么这么答、花了多少、慢在哪”。",
        tasks: [
          { type: "项目", text: "接 Langfuse 或 OpenTelemetry；记录检索/prompt/模型/引用/token/成本；request id。", minutes: 120 },
          { type: "输出", text: "做一张指标表：P50/P95、错误率、token、成本、缓存命中。", minutes: 30 }
        ],
        deliverable: "trace + 指标表",
        oral: { q: "一次 RAG 请求要记录哪些字段？", a: "request id、租户、query、改写、召回 chunk id/score、rerank 分数、prompt 版本、模型/参数、输入输出 token、首 token/总延迟、引用、拒答原因、错误。", keywords: ["request id", "chunk/score", "prompt 版本", "token", "延迟", "拒答"] },
        tip: "没有 trace，线上问题只能靠猜。"
      },
      {
        day: 4, type: "project", title: "评测回归与 CI", minutes: 150,
        focus: "把评测变成可重复的门禁，而不是一次性报告。",
        tasks: [
          { type: "项目", text: "扩到 50 条评测；写 CI 脚本；设指标阈值；失败聚类。", minutes: 120 },
          { type: "输出", text: "评测报告 v2 + 回归结果；把命令写进 README。", minutes: 30 }
        ],
        deliverable: "评测 CI + 报告 v2",
        oral: { q: "怎么把 RAG 评测接入 CI？", a: "固定评测集和版本；每次 PR 跑检索指标与生成指标；设阈值和允许波动；LLM judge 成本高时抽样；失败样本人工复核；结果存档可对比。", keywords: ["固定集", "阈值", "抽样", "人工复核", "存档"] },
        tip: "评测集要版本化，否则数字不可比。"
      },
      {
        day: 5, type: "project", title: "压测与性能优化", minutes: 150,
        focus: "找到真正的瓶颈，而不是凭感觉优化。",
        tasks: [
          { type: "项目", text: "k6/locust 压 20/50 并发；分段计时；优化连接池/批处理/缓存。", minutes: 120 },
          { type: "输出", text: "压测报告：吞吐、P95、错误率、瓶颈、优化前后对比。", minutes: 30 }
        ],
        deliverable: "压测报告 + 优化记录",
        oral: { q: "压测发现 P95 很高，你怎么定位？", a: "先看分段耗时（检索/rerank/模型/DB），再看连接池、队列、GC、上游限流；用 trace 找长尾请求；对比并发曲线；一次只改一个变量。", keywords: ["分段计时", "trace", "连接池", "长尾", "单变量"] },
        tip: "压测不是比数字，是找瓶颈和容量边界。"
      },
      {
        day: 6, type: "project", title: "交付：README、架构图、视频、文章", minutes: 240,
        focus: "把技术工作翻译成别人能看懂、能验证的成果。",
        tasks: [
          { type: "项目", text: "README：问题/架构/指标/取舍/失败复盘/启动方式；架构图。", minutes: 90 },
          { type: "项目", text: "补 3 个边界测试；打 tag v1.0；清理仓库。", minutes: 30 },
          { type: "输出", text: "录 3 分钟视频；写一篇技术文章（问题→方案→数据→复盘）。", minutes: 90 },
          { type: "复盘", text: "自测 + 下周 Agent 预习。", minutes: 30 }
        ],
        deliverable: "项目一 v1.0 + 视频 + 文章",
        oral: { q: "用 10 分钟讲项目一。", a: "背景与约束→架构→关键取舍（切分/混合检索/rerank/多租户）→指标→失败与修复→如果重做会怎么改。每个选择都给替代方案和代价。", keywords: ["背景", "架构", "取舍", "指标", "失败", "重做"] },
        tip: "README 是面试官的第一入口，比代码更能决定他是否点开 demo。"
      },
      {
        day: 7, type: "review", title: "W8 周测 + 项目一模拟面试", minutes: 120,
        focus: "用面试标准检验项目一，找出讲不清的地方。",
        tasks: [
          { type: "复盘", text: "做 W8 周测（10 题），错题写原因。", minutes: 30 },
          { type: "复盘", text: "找朋友/录音模拟 20 分钟项目深挖；列出被问住的 5 个点。", minutes: 50 },
          { type: "输出", text: "写项目一复盘 + 下一版改进清单；更新简历 bullet。", minutes: 40 }
        ],
        deliverable: "模拟面试记录 + 简历 bullet v1",
        oral: { q: "项目一最难的三个决策是什么？", a: "切分粒度、混合检索/rerank 的取舍、多租户隔离与成本控制。每个都要给出替代方案、数据依据和残余风险。", keywords: ["切分", "检索", "多租户", "替代方案", "数据依据"] },
        tip: "讲不清的地方就是没真懂；回去补 trace 和数据。"
      }
    ]
  }
]);

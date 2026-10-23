/* W9–W12：Agent 基础、LangGraph、项目二、微调 */
window.CURRICULUM = (window.CURRICULUM || []).concat([
  {
    week: 9,
    phase: 3,
    theme: "Agent 基础与工具调用",
    goal: "不用框架手写一个 Agent，理解 ReAct、工具协议、记忆、护栏与成本。",
    outcomes: ["mini-agent 内核", "5 个工具与错误协议", "10 条红队测试"],
    resources: [
      { title: "ReAct 论文", url: "https://arxiv.org/abs/2210.03629", note: "读摘要和例子" },
      { title: "OpenAI Function Calling", url: "https://platform.openai.com/docs/guides/function-calling", note: "工具 schema" },
      { title: "Anthropic Tool Use", url: "https://docs.anthropic.com/en/docs/build-with-claude/tool-use/overview", note: "工具调用协议" },
      { title: "Building effective agents", url: "https://www.anthropic.com/engineering/building-effective-agents", note: "workflow vs agent" }
    ],
    days: [
      {
        day: 1, type: "learn", title: "Agent 的适用边界：不是所有事都该用 Agent", minutes: 150,
        focus: "区分 workflow 与 agent，理解组件、成本与失败模式。",
        tasks: [
          { type: "学", text: "学 workflow vs agent、规划/工具/记忆/反思组件；读 Building effective agents。", minutes: 45 },
          { type: "练", text: "拆 3 个业务场景（客服、报表、研究），判断该用 workflow 还是 agent，画架构。", minutes: 60 },
          { type: "输出", text: "写 ADR：一个场景为什么用/不用 Agent，替代方案是什么。", minutes: 35 },
          { type: "复盘", text: "3-2-1 笔记 + 当日测验。", minutes: 10 }
        ],
        deliverable: "场景判断 + Agent ADR",
        oral: { q: "什么时候不该用 Agent？", a: "步骤固定、合规风险高、要求强可解释、成本/延迟敏感、工具副作用大且难回滚时，优先用 workflow 或规则。Agent 适合路径不确定、需要探索和工具组合的任务。", keywords: ["步骤固定", "合规", "可解释", "成本", "workflow"] },
        tip: "先问“不用 Agent 能不能做”，能，就别上 Agent。"
      },
      {
        day: 2, type: "learn", title: "手写 ReAct 循环", minutes: 150,
        focus: "理解 thought→action→observation 循环、停止条件与 trace。",
        tasks: [
          { type: "学", text: "学 ReAct prompt、动作解析、观察回填、停止条件、最大步数。", minutes: 45 },
          { type: "练", text: "手写 mini-agent 循环，接 3 个 mock 工具；打印完整 trace。", minutes: 75 },
          { type: "输出", text: "跑 10 个任务，记录步数/失败原因。", minutes: 20 },
          { type: "复盘", text: "3-2-1 笔记 + 当日测验。", minutes: 10 }
        ],
        deliverable: "手写 Agent 循环 + 10 条 trace",
        oral: { q: "ReAct 循环的核心风险有哪些？", a: "死循环、工具误用、观察结果被注入、成本失控、错误累积。要用最大步数、重复动作检测、工具校验、预算和 trace 控制。", keywords: ["死循环", "工具误用", "注入", "成本", "trace"] },
        tip: "先手写一遍，再用框架；否则你不知道框架帮你做了什么。"
      },
      {
        day: 3, type: "learn", title: "工具设计、参数校验与幂等", minutes: 150,
        focus: "把工具当 API 设计：清晰描述、严格 schema、可恢复错误、无副作用。",
        tasks: [
          { type: "学", text: "学工具命名/描述、JSON Schema、参数校验、错误协议、幂等、沙箱。", minutes: 45 },
          { type: "练", text: "设计 5 个工具；Pydantic 校验；超时/重试/幂等；结构化错误返回。", minutes: 75 },
          { type: "输出", text: "测 20 次工具选择，记录名称/参数正确率。", minutes: 20 },
          { type: "复盘", text: "3-2-1 笔记 + 当日测验。", minutes: 10 }
        ],
        deliverable: "5 个工具 + 正确率记录",
        oral: { q: "怎么防止工具参数注入？", a: "服务端用 schema/枚举/范围校验；工具白名单与最小权限；不把用户输入直接拼进 SQL/shell；高风险工具加审批；输出编码与审计。", keywords: ["schema", "白名单", "最小权限", "审批", "审计"] },
        tip: "工具描述是 prompt 的一部分；名称和参数要像 API 文档一样清楚。"
      },
      {
        day: 4, type: "learn", title: "Memory：短期、长期与遗忘", minutes: 150,
        focus: "设计记忆写入、检索、更新与删除，避免“什么都记”。",
        tasks: [
          { type: "学", text: "学短期会话、摘要记忆、向量长期记忆、写入策略、隐私与删除。", minutes: 45 },
          { type: "练", text: "实现会话摘要 + 用户偏好存储 + 检索；加删除/过期。", minutes: 75 },
          { type: "输出", text: "写记忆测试：写入/读取/冲突/删除；列 5 个隐私风险。", minutes: 20 },
          { type: "复盘", text: "3-2-1 笔记 + 当日测验。", minutes: 10 }
        ],
        deliverable: "Memory 模块 + 隐私风险清单",
        oral: { q: "记忆什么时候写？写错了怎么办？", a: "只写稳定偏好、明确事实和任务结果，不要每轮都写；要有来源、置信度、有效期；提供查看/删除/纠错入口；敏感信息不写或加密。", keywords: ["稳定偏好", "来源", "置信度", "删除", "敏感信息"] },
        tip: "记忆不是越多越好，错误记忆比没有记忆更糟。"
      },
      {
        day: 5, type: "learn", title: "Guardrails、预算与红队", minutes: 150,
        focus: "给 Agent 加刹车：最大步数、预算、审批、超时、取消。",
        tasks: [
          { type: "学", text: "学输入/输出护栏、工具权限、人工审批、token/金额预算、kill switch。", minutes: 45 },
          { type: "练", text: "加最大步数、token 预算、重复动作检测、敏感工具审批、超时取消。", minutes: 75 },
          { type: "输出", text: "写 10 条红队测试（越权/注入/死循环/超预算）。", minutes: 20 },
          { type: "复盘", text: "3-2-1 笔记 + 当日测验。", minutes: 10 }
        ],
        deliverable: "预算/护栏 + 红队测试",
        oral: { q: "Agent 的预算怎么设？", a: "按任务价值设最大步数、token/金额、时间；超限降级为“给出当前结论 + 待办”；高风险动作单独审批；用 trace 监控实际消耗并动态调整。", keywords: ["最大步数", "token/金额", "时间", "降级", "审批"] },
        tip: "Agent 一定要有 kill switch，尤其是能花钱、能写数据的工具。"
      },
      {
        day: 6, type: "lab", title: "Lab 09：mini-agent 完整版", minutes: 240,
        focus: "整合循环、工具、记忆、护栏、trace，形成可复用内核。",
        tasks: [
          { type: "项目", text: "5 个工具 + 循环 + 记忆 + 预算 + trace。", minutes: 90 },
          { type: "项目", text: "10 条任务评测；失败聚类；加 2 个修复。", minutes: 60 },
          { type: "输出", text: "README + 架构图 + demo 脚本。", minutes: 60 },
          { type: "复盘", text: "自测 + 下周 LangGraph 预习。", minutes: 30 }
        ],
        deliverable: "mini-agent v0.1",
        oral: { q: "手写 Agent 和 LangGraph 的区别？", a: "手写让你理解循环、状态和错误处理；LangGraph 提供状态图、checkpoint、中断恢复、流式和生态。生产复杂工作流用框架，简单任务手写更可控。", keywords: ["理解原理", "状态图", "checkpoint", "生态", "可控"] },
        tip: "手写版保留，面试时讲“我知道框架底层在做什么”。"
      },
      {
        day: 7, type: "review", title: "W9 周测：Agent 基础", minutes: 120,
        focus: "复盘工具/记忆/护栏，准备 LangGraph。",
        tasks: [
          { type: "复盘", text: "做 W9 周测（10 题），错题写原因。", minutes: 30 },
          { type: "复盘", text: "画 Agent 循环图，标 5 个失败点；补 5 张卡。", minutes: 40 },
          { type: "输出", text: "写周报；把 mini-agent 推到 GitHub。", minutes: 30 },
          { type: "复盘", text: "预习 LangGraph StateGraph。", minutes: 20 }
        ],
        deliverable: "周报 + Agent 循环图",
        oral: { q: "用 3 分钟讲 Agent 的组成和失败模式。", a: "模型+工具+记忆+规划+护栏；失败模式包括选错工具、参数错、死循环、观察注入、记忆污染、预算失控。每层都要有校验和 trace。", keywords: ["组成", "工具", "记忆", "护栏", "失败模式"] },
        tip: "Agent 的难点不在“让它动”，在“让它停”和“让它可控”。"
      }
    ]
  },
  {
    week: 10,
    phase: 3,
    theme: "LangGraph 与工作流",
    goal: "用状态机管理复杂 Agent，掌握 checkpoint、人工审批、多智能体与流式。",
    outcomes: ["带审批的 LangGraph 工作流", "checkpoint 恢复演示", "supervisor 多智能体 demo"],
    resources: [
      { title: "LangGraph 教程", url: "https://langchain-ai.github.io/langgraph/tutorials/", note: "从 StateGraph 开始" },
      { title: "LangGraph Persistence", url: "https://langchain-ai.github.io/langgraph/concepts/persistence/", note: "checkpoint 与 thread" },
      { title: "Human-in-the-loop", url: "https://langchain-ai.github.io/langgraph/concepts/human_in_the_loop/", note: "interrupt/resume" },
      { title: "Multi-agent", url: "https://langchain-ai.github.io/langgraph/concepts/multi_agent/", note: "supervisor 模式" }
    ],
    days: [
      {
        day: 1, type: "learn", title: "StateGraph：把 Agent 画成状态机", minutes: 150,
        focus: "掌握节点、边、条件边、状态合并，理解“代码编排”优于“prompt 编排”。",
        tasks: [
          { type: "学", text: "学 StateGraph、节点、普通边/条件边、状态 schema、reducer。", minutes: 45 },
          { type: "练", text: "搭一个 4 节点工作流（理解→检索→生成→校验），跑通 5 个输入。", minutes: 75 },
          { type: "输出", text: "画状态图；写每个节点的输入/输出契约。", minutes: 20 },
          { type: "复盘", text: "3-2-1 笔记 + 当日测验。", minutes: 10 }
        ],
        deliverable: "4 节点 StateGraph + 状态图",
        oral: { q: "LangGraph 的条件边解决什么问题？", a: "根据运行时状态选择下一步，而不是固定顺序；适合分支、重试、循环、审批。条件边让控制流显式化，便于测试和观测。", keywords: ["运行时状态", "分支", "重试", "循环", "显式控制流"] },
        tip: "能用代码表达的控制流，不要塞进 prompt。"
      },
      {
        day: 2, type: "learn", title: "Checkpoint 与中断恢复", minutes: 150,
        focus: "理解 thread、checkpoint、状态持久化，做失败恢复和时间旅行。",
        tasks: [
          { type: "学", text: "学 checkpointer、thread_id、状态快照、恢复、时间旅行。", minutes: 45 },
          { type: "练", text: "给工作流接 SQLite/Postgres checkpointer；模拟节点失败后从 checkpoint 恢复。", minutes: 75 },
          { type: "输出", text: "记录恢复前后状态；写 3 个恢复测试。", minutes: 20 },
          { type: "复盘", text: "3-2-1 笔记 + 当日测验。", minutes: 10 }
        ],
        deliverable: "checkpoint 恢复 demo",
        oral: { q: "checkpoint 解决什么问题？", a: "持久化每步状态，支持失败恢复、人工审批中断、长任务续跑和时间旅行调试。没有它，审批只能阻塞进程，失败只能从头再来。", keywords: ["持久化", "失败恢复", "中断", "续跑", "时间旅行"] },
        tip: "thread_id 是会话隔离的关键，别用错。"
      },
      {
        day: 3, type: "learn", title: "Human-in-the-loop：审批、修改、恢复", minutes: 150,
        focus: "在关键动作前暂停，让人改参数或拒绝，再从 checkpoint 继续。",
        tasks: [
          { type: "学", text: "学 interrupt、resume、审批节点、状态修改、超时。", minutes: 45 },
          { type: "练", text: "实现“发送通知/执行 SQL”前审批；支持修改参数、拒绝、超时。", minutes: 75 },
          { type: "输出", text: "录 1 分钟演示：暂停→改参→恢复。", minutes: 20 },
          { type: "复盘", text: "3-2-1 笔记 + 当日测验。", minutes: 10 }
        ],
        deliverable: "审批工作流 + 演示",
        oral: { q: "人工审批节点怎么设计状态？", a: "状态里存待审批动作、参数、风险说明、发起人、过期时间；暂停时持久化；审批后写决策和修改；恢复时重新校验参数与权限；拒绝要走终止分支。", keywords: ["待审批动作", "参数", "过期", "重新校验", "终止分支"] },
        tip: "审批不是弹窗，是状态机里的一个可恢复节点。"
      },
      {
        day: 4, type: "learn", title: "多智能体：supervisor 与专家", minutes: 150,
        focus: "理解任务分派、汇总、通信成本，避免“为多而多”。",
        tasks: [
          { type: "学", text: "学 supervisor、handoff、subgraph、共享状态、通信成本。", minutes: 45 },
          { type: "练", text: "实现 supervisor + 2 个专家（检索/计算），跑 5 个任务。", minutes: 75 },
          { type: "输出", text: "对比单 Agent 与多 Agent 的成功率/步数/成本。", minutes: 20 },
          { type: "复盘", text: "3-2-1 笔记 + 当日测验。", minutes: 10 }
        ],
        deliverable: "supervisor demo + 对比",
        oral: { q: "多智能体什么时候是反模式？", a: "任务简单、强顺序、共享状态复杂、通信成本高于收益时。多 Agent 会增加不一致、调试难度和延迟；先用单 Agent + 好工具，能量化收益再拆。", keywords: ["任务简单", "通信成本", "状态不一致", "调试", "先单后多"] },
        tip: "多智能体不是高级版，是另一种权衡。"
      },
      {
        day: 5, type: "learn", title: "流式、可观测与任务评测", minutes: 150,
        focus: "让工作流可看、可测：stream events、trace、任务成功率。",
        tasks: [
          { type: "学", text: "学 stream events、节点级 trace、任务评测指标（成功率/步数/成本/干预率）。", minutes: 45 },
          { type: "练", text: "给工作流加节点级 trace；建 10 条任务评测；统计成功率/步数。", minutes: 75 },
          { type: "输出", text: "做一张评测表 + 1 个失败案例。", minutes: 20 },
          { type: "复盘", text: "3-2-1 笔记 + 当日测验。", minutes: 10 }
        ],
        deliverable: "trace + 任务评测表",
        oral: { q: "怎么评测一个非确定性的 Agent？", a: "固定任务集和成功标准；多次运行取分布；看成功率、平均步数、成本、人工干预率、工具错误率；失败样本人工分析；不要用单次结果下结论。", keywords: ["任务集", "多次运行", "成功率", "步数", "干预率"] },
        tip: "Agent 评测要允许波动，报告分布而不是单点。"
      },
      {
        day: 6, type: "lab", title: "Lab 10：带审批的运营工作流", minutes: 240,
        focus: "把 StateGraph、checkpoint、审批、trace 串成一个完整 demo。",
        tasks: [
          { type: "项目", text: "实现“查数据→生成报告→审批→发送”工作流；支持拒绝/改参/恢复。", minutes: 120 },
          { type: "项目", text: "加 trace 和 10 条任务评测；修 2 个高频失败。", minutes: 60 },
          { type: "输出", text: "README + 状态图 + 2 分钟 demo。", minutes: 30 },
          { type: "复盘", text: "自测 + 项目二预习。", minutes: 30 }
        ],
        deliverable: "审批工作流 demo + 评测",
        oral: { q: "用 2 分钟讲你的工作流状态机。", a: "入口→解析→检索/查数→生成→审批（可改参/拒绝）→执行→汇总；每步持久化，失败可恢复；高风险动作必须审批；节点级 trace。", keywords: ["入口", "检索", "审批", "执行", "持久化", "trace"] },
        tip: "审批节点要能拒绝，不能只有“通过”。"
      },
      {
        day: 7, type: "review", title: "W10 周测：LangGraph", minutes: 120,
        focus: "复盘状态机与审批，准备项目二。",
        tasks: [
          { type: "复盘", text: "做 W10 周测（10 题），错题写原因。", minutes: 30 },
          { type: "复盘", text: "画项目二的状态图草稿；列 5 个工具和 3 个风险。", minutes: 40 },
          { type: "输出", text: "写周报；更新项目二需求。", minutes: 30 },
          { type: "复盘", text: "预习 Agent 评测与 tracing。", minutes: 20 }
        ],
        deliverable: "项目二状态图草稿 + 周报",
        oral: { q: "LangGraph 相比 while 循环的优势？", a: "显式状态、条件边、checkpoint、中断恢复、流式事件、可视化；复杂工作流可测试、可恢复、可观测。简单任务 while 循环更轻。", keywords: ["显式状态", "条件边", "checkpoint", "恢复", "可观测"] },
        tip: "项目二不要重复项目一，重点放在工具编排和审批。"
      }
    ]
  },
  {
    week: 11,
    phase: 3,
    theme: "项目二：Agent 工作流平台",
    goal: "完成可追踪、可评测、可审批的 Agent 服务，形成第二个面试项目。",
    outcomes: ["Agent 服务 v1", "20 条任务评测集", "成功率/步数/成本报告"],
    resources: [
      { title: "LangGraph 示例", url: "https://github.com/langchain-ai/langgraph/tree/main/examples", note: "参考结构，不要照抄" },
      { title: "Langfuse", url: "https://langfuse.com/docs", note: "tool call trace" },
      { title: "OpenTelemetry", url: "https://opentelemetry.io/docs/", note: "标准化观测" },
      { title: "OWASP LLM Top 10", url: "https://owasp.org/www-project-top-10-for-large-language-model-applications/", note: "Agent 安全" }
    ],
    days: [
      {
        day: 1, type: "project", title: "需求、任务集与架构", minutes: 150,
        focus: "先定义“什么算成功”，再设计 Agent。",
        tasks: [
          { type: "学", text: "看 2 个 Agent 平台架构；复习 workflow/agent 边界。", minutes: 30 },
          { type: "项目", text: "写 PRD、状态图、工具清单、权限矩阵；定义 20 条任务与成功标准。", minutes: 90 },
          { type: "输出", text: "列 5 个风险：越权/死循环/成本/记忆污染/工具失败。", minutes: 30 }
        ],
        deliverable: "PRD + 状态图 + 20 条任务集",
        oral: { q: "为什么先写任务集再写 Agent？", a: "任务集定义成功标准和覆盖面，指导工具、状态和评测设计；否则做完不知道好不好，也无法比较版本。", keywords: ["成功标准", "覆盖面", "工具设计", "评测", "版本对比"] },
        tip: "任务集要包含简单、复杂、无解、越权四类。"
      },
      {
        day: 2, type: "project", title: "工具集：搜索、SQL、知识库、文件", minutes: 150,
        focus: "实现 5–6 个工具，统一 schema、错误、超时和权限。",
        tasks: [
          { type: "项目", text: "实现搜索/SQL/知识库/文件/计算/通知工具；统一错误协议；参数校验。", minutes: 120 },
          { type: "输出", text: "每个工具 3 个正常 + 3 个异常测试。", minutes: 30 }
        ],
        deliverable: "工具集 + 测试",
        oral: { q: "SQL 工具怎么做权限和防注入？", a: "只读账号、白名单表/列、参数化查询、禁止多语句、行级权限、查询超时/行数限制、AST 校验；高风险查询走审批。", keywords: ["只读", "白名单", "参数化", "行级权限", "超时"] },
        tip: "SQL 工具是事故高发区，权限和超时先做好。"
      },
      {
        day: 3, type: "project", title: "状态机、审批与恢复", minutes: 150,
        focus: "把项目一 RAG 作为工具接进来，加入审批和失败恢复。",
        tasks: [
          { type: "项目", text: "StateGraph：理解→规划→工具→观察→生成→校验；高风险动作审批。", minutes: 120 },
          { type: "输出", text: "测 5 条中断恢复；记录状态快照。", minutes: 30 }
        ],
        deliverable: "Agent 状态机 + 审批",
        oral: { q: "工具失败时 Agent 应该怎么处理？", a: "返回结构化错误（类型/原因/可重试）；Agent 决定重试/换工具/降级；重试要幂等、限次数；连续失败终止并给出待办，不要无限循环。", keywords: ["结构化错误", "重试/换工具", "幂等", "限次", "终止"] },
        tip: "错误信息要可行动，别把堆栈直接喂给模型。"
      },
      {
        day: 4, type: "project", title: "记忆、权限与审计", minutes: 150,
        focus: "让 Agent 记住该记的，同时能删、能审计、不越权。",
        tasks: [
          { type: "项目", text: "会话摘要 + 用户偏好；记忆查看/删除；工具权限矩阵；审计日志。", minutes: 120 },
          { type: "输出", text: "10 条越权/注入/记忆污染测试。", minutes: 30 }
        ],
        deliverable: "记忆/权限/审计",
        oral: { q: "Agent 的记忆如何避免污染？", a: "只写有来源和置信度的稳定信息；区分用户陈述与模型推断；提供查看/删除/纠错；敏感信息不写；定期清理；冲突时以最新明确指令为准。", keywords: ["来源", "置信度", "用户陈述", "删除", "冲突"] },
        tip: "把“模型推断”写进记忆是常见污染源。"
      },
      {
        day: 5, type: "project", title: "Trace、评测与成本", minutes: 150,
        focus: "让每次运行可回放，能量化成功率、步数、成本和干预率。",
        tasks: [
          { type: "项目", text: "接 trace；记录每次 tool call 输入/输出/耗时/token；跑 20 条任务。", minutes: 120 },
          { type: "输出", text: "评测报告：成功率、平均步数、工具错误率、人工干预率。", minutes: 30 }
        ],
        deliverable: "trace + 评测报告",
        oral: { q: "Agent 的成功率怎么定义？", a: "按任务的成功标准（答案正确/动作完成/格式合法）判定；可自动判定 + 人工抽检；多次运行取分布；同时看步数、成本、干预率，避免“成功率高质量差”。", keywords: ["成功标准", "自动+人工", "分布", "步数", "成本"] },
        tip: "成功率不是唯一指标，步数和成本决定可落地性。"
      },
      {
        day: 6, type: "project", title: "集成、demo 与文档", minutes: 240,
        focus: "把项目二做成能演示、能讲清的作品。",
        tasks: [
          { type: "项目", text: "最小 UI/CLI；审批交互；运行历史；错误提示。", minutes: 90 },
          { type: "项目", text: "修 3 个高频失败；补 README/架构图。", minutes: 60 },
          { type: "输出", text: "3 分钟 demo 视频；写项目复盘。", minutes: 60 },
          { type: "复盘", text: "自测 + 下周微调预习。", minutes: 30 }
        ],
        deliverable: "Agent 平台 v1.0 + 视频",
        oral: { q: "用 10 分钟讲项目二。", a: "业务问题→为什么用 Agent→状态机/工具/审批→评测数据→失败与修复→与项目一的区别。重点讲可控性和可观测性。", keywords: ["业务问题", "状态机", "工具", "审批", "评测", "可控"] },
        tip: "项目二的关键词是“可控”，不是“多智能体”。"
      },
      {
        day: 7, type: "review", title: "W11 周测 + 项目二模拟面试", minutes: 120,
        focus: "用面试标准检验项目二，准备微调/部署。",
        tasks: [
          { type: "复盘", text: "做 W11 周测（10 题），错题写原因。", minutes: 30 },
          { type: "复盘", text: "模拟 20 分钟项目深挖；记录 5 个被问住的点。", minutes: 50 },
          { type: "输出", text: "写项目复盘；更新简历 bullet v2。", minutes: 40 }
        ],
        deliverable: "模拟面试记录 + 简历 bullet v2",
        oral: { q: "项目二最容易被问倒的三个点？", a: "为什么用 Agent 而不是 workflow、如何防止死循环/越权、怎么评测非确定性。每个都要有数据、机制和失败案例。", keywords: ["为什么 Agent", "死循环/越权", "评测", "数据", "失败案例"] },
        tip: "被问住不可怕，记下来就是下一周的复习卡。"
      }
    ]
  },
  {
    week: 12,
    phase: 4,
    theme: "微调与数据工程",
    goal: "知道什么时候该微调、什么时候不该，并跑通一次 LoRA/QLoRA。",
    outcomes: ["微调决策树", "LoRA 训练记录", "微调 vs Prompt 对比"],
    resources: [
      { title: "Hugging Face PEFT", url: "https://huggingface.co/docs/peft", note: "LoRA 配置与训练" },
      { title: "Unsloth", url: "https://docs.unsloth.ai/", note: "Colab 单卡微调" },
      { title: "LoRA 论文", url: "https://arxiv.org/abs/2106.09685", note: "低秩适配原理" },
      { title: "QLoRA 论文", url: "https://arxiv.org/abs/2305.14314", note: "4-bit 量化 + LoRA" }
    ],
    days: [
      {
        day: 1, type: "learn", title: "微调决策树：Prompt、RAG、Fine-tune 怎么选", minutes: 150,
        focus: "建立决策框架，理解微调的适用边界、成本与风险。",
        tasks: [
          { type: "学", text: "学 prompt/RAG/fine-tune 的适用场景、数据要求、成本、维护风险。", minutes: 45 },
          { type: "练", text: "拿 5 个业务需求做决策，写出理由和替代方案。", minutes: 60 },
          { type: "输出", text: "画一张决策树；写 3 个“不该微调”的案例。", minutes: 35 },
          { type: "复盘", text: "3-2-1 笔记 + 当日测验。", minutes: 10 }
        ],
        deliverable: "微调决策树 + 5 个案例",
        oral: { q: "什么时候用 RAG，什么时候用微调？", a: "知识频繁变化、需要引用和权限 → RAG；固定风格/格式/领域语言、有高质量标注 → 微调；两者可叠加。微调不适合注入频繁变化的事实。", keywords: ["知识变化", "引用/权限", "风格/格式", "标注", "可叠加"] },
        tip: "先 Prompt，再 RAG，最后才微调；顺序别反。"
      },
      {
        day: 2, type: "learn", title: "数据工程：把业务数据变成训练样本", minutes: 150,
        focus: "掌握指令数据格式、chat template、去重、质量过滤与隐私。",
        tasks: [
          { type: "学", text: "学 instruction/input/output、chat template、loss mask、去重、质量过滤、隐私。", minutes: 45 },
          { type: "练", text: "把 50 条业务问答转成训练格式；套 chat template；做去重和长度统计。", minutes: 75 },
          { type: "输出", text: "写数据卡：来源/规模/字段/清洗/隐私/许可。", minutes: 20 },
          { type: "复盘", text: "3-2-1 笔记 + 当日测验。", minutes: 10 }
        ],
        deliverable: "50 条训练样本 + 数据卡",
        oral: { q: "训练数据的质量怎么保证？", a: "来源可追溯、去重、格式统一、答案审核、难例覆盖、隐私脱敏、训练/验证/测试隔离；小规模先人工过一遍，别直接灌全量。", keywords: ["可追溯", "去重", "格式", "审核", "隔离"] },
        tip: "数据质量决定上限，训练技巧只能逼近上限。"
      },
      {
        day: 3, type: "learn", title: "LoRA/QLoRA 原理与超参", minutes: 150,
        focus: "理解低秩适配、rank/alpha、量化、显存与过拟合。",
        tasks: [
          { type: "学", text: "学 LoRA 低秩分解、rank/alpha/dropout、QLoRA 4-bit、目标模块、显存估算。", minutes: 50 },
          { type: "练", text: "用 PEFT 配置一个 LoRA；打印可训练参数占比；改 rank 对比参数量。", minutes: 70 },
          { type: "输出", text: "写一页原理笔记：为什么省显存、rank 怎么选。", minutes: 20 },
          { type: "复盘", text: "3-2-1 笔记 + 当日测验。", minutes: 10 }
        ],
        deliverable: "LoRA 配置 + 原理笔记",
        oral: { q: "LoRA 为什么省显存？rank 怎么选？", a: "冻结基座，只训练低秩矩阵 A/B，可训练参数和优化器状态大幅减少。rank 越大容量越强但更易过拟合、显存更高；常用 8–64，从 16 起，用验证集选。", keywords: ["冻结基座", "低秩", "可训练参数", "过拟合", "验证集"] },
        tip: "rank 不是越大越好；先看任务复杂度和数据量。"
      },
      {
        day: 4, type: "learn", title: "训练实战：在 Colab/Kaggle 跑一次 LoRA", minutes: 150,
        focus: "跑通数据加载、训练、保存、推理的完整流程。",
        tasks: [
          { type: "学", text: "学 Trainer/Unsloth 训练参数：lr、epoch、batch、grad accumulation、eval。", minutes: 40 },
          { type: "练", text: "Colab/Kaggle 用小模型（0.5B–1.5B）跑 1–2 epoch；保存 adapter；加载推理。", minutes: 90 },
          { type: "输出", text: "记录 loss 曲线、显存、训练时长、3 个生成样例。", minutes: 20 }
        ],
        deliverable: "LoRA adapter + 训练记录",
        oral: { q: "训练 loss 下降但效果变差，为什么？", a: "可能过拟合、数据格式/模板错、验证集与真实分布不一致、灾难性遗忘、解码参数不一致。要看验证集和人工样例，不只看 loss。", keywords: ["过拟合", "模板错", "分布不一致", "遗忘", "验证集"] },
        tip: "没有 GPU 就用 Colab；重点是跑通流程和理解参数。"
      },
      {
        day: 5, type: "learn", title: "微调评测：对比 Prompt 基线", minutes: 150,
        focus: "用同一评测集比较微调与 Prompt/RAG，判断是否值得。",
        tasks: [
          { type: "学", text: "学微调评测：任务指标、生成质量、灾难性遗忘、成本、延迟。", minutes: 45 },
          { type: "练", text: "在 20 条测试集上比较 base / prompt / LoRA；记录质量、延迟、显存。", minutes: 75 },
          { type: "输出", text: "写对比报告：是否值得上线，为什么。", minutes: 20 },
          { type: "复盘", text: "3-2-1 笔记 + 当日测验。", minutes: 10 }
        ],
        deliverable: "微调 vs Prompt 对比报告",
        oral: { q: "微调后怎么判断有没有灾难性遗忘？", a: "在通用能力集（问答/指令/安全）上回归；对比基座；看是否只会训练格式；人工抽检多样输入；必要时混入通用数据或降低学习率/轮次。", keywords: ["通用能力", "回归", "基座对比", "多样输入", "混数据"] },
        tip: "微调不是免费午餐，维护成本要算进去。"
      },
      {
        day: 6, type: "lab", title: "Lab 12：小模型微调与对比", minutes: 240,
        focus: "完成一次可复现的微调实验，写成可讲的故事。",
        tasks: [
          { type: "项目", text: "整理数据/脚本/配置；固定 seed；保存 adapter 和日志。", minutes: 90 },
          { type: "项目", text: "跑 3 组配置（rank/lr/epoch）对比；选最优。", minutes: 60 },
          { type: "输出", text: "README + 实验报告 + 失败案例。", minutes: 60 },
          { type: "复盘", text: "自测 + 下周部署预习。", minutes: 30 }
        ],
        deliverable: "可复现微调实验 + 报告",
        oral: { q: "用 3 分钟讲你的微调实验。", a: "任务/数据→基线与 Prompt→LoRA 配置→训练→评测→结论（是否值得）→失败与限制。要有数字和可复现脚本。", keywords: ["任务/数据", "基线", "配置", "评测", "结论", "可复现"] },
        tip: "把实验脚本整理干净，面试时能现场讲。"
      },
      {
        day: 7, type: "review", title: "W12 周测：微调与数据", minutes: 120,
        focus: "复盘微调决策与实验，准备推理部署。",
        tasks: [
          { type: "复盘", text: "做 W12 周测（10 题），错题写原因。", minutes: 30 },
          { type: "复盘", text: "整理微调决策树和 3 个失败案例；补 5 张卡。", minutes: 40 },
          { type: "输出", text: "写周报；更新简历技能（LoRA/PEFT）。", minutes: 30 },
          { type: "复盘", text: "预习 vLLM/量化/Spring AI。", minutes: 20 }
        ],
        deliverable: "周报 + 微调决策树",
        oral: { q: "什么情况下你会建议不做微调？", a: "知识频繁变化、数据不足/质量差、需要引用和权限、团队没有维护能力、Prompt/RAG 已达标时。微调会带来版本、评测、回滚和成本负担。", keywords: ["数据不足", "知识变化", "引用/权限", "维护成本", "已达标"] },
        tip: "能说“不该做”比会做更加分。"
      }
    ]
  }
]);

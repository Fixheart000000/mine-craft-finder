// 模组八维分类体系详细标签

export interface ModTag {
  id: string;
  label: string;
  description?: string;
}

export interface ModDimension {
  id: string;
  label: string;
  description: string;
  tags: ModTag[];
}

export const modDimensions: Record<string, ModDimension> = {
  gameplay: {
    id: "gameplay",
    label: "玩法",
    description: "模组的核心内容体验主题",
    tags: [
      { id: "tech_industry", label: "科技工业", description: "涉及机器、电力、自动化、工厂建设" },
      { id: "magic_mystery", label: "魔法神秘", description: "涉及魔力、咒术、仪式、神秘学" },
      { id: "adventure_explore", label: "冒险探索", description: "涉及新维度、地牢、Boss战、探索" },
      { id: "survival_farming", label: "生存农业", description: "涉及种植、养殖、烹饪、生存难度" },
      { id: "building_deco", label: "建筑装饰", description: "涉及新方块、家具、装修、美化" },
      { id: "weapon_combat", label: "武器战斗", description: "涉及新武器、盔甲、战斗方式" },
      { id: "creature_ecology", label: "生物生态", description: "主要添加新生物、动物、怪物" },
      { id: "storage_logistics", label: "存储物流", description: "涉及背包、仓库、物品传输" },
      { id: "other_content", label: "其他内容", description: "无法归类到上述的内容型模组" },
    ],
  },
  audiovisual: {
    id: "audiovisual",
    label: "视听",
    description: "感官表现层，包含视觉、听觉及UI美化内容",
    tags: [
      { id: "shader_effect", label: "光影效果", description: "改变光照渲染、阴影、水面反射" },
      { id: "texture", label: "材质纹理", description: "改变方块、物品、实体的贴图" },
      { id: "model_animation", label: "模型动画", description: "改变实体或物品的3D模型/动作" },
      { id: "sound_music", label: "音效音乐", description: "改变环境音、背景音乐、脚步声" },
      { id: "ui_beautify", label: "UI美化", description: "仅改变界面外观/皮肤，不改变功能" },
      { id: "particle_effect", label: "粒子特效", description: "改变或增加视觉粒子效果" },
      { id: "pure_av", label: "纯视听", description: "不包含任何玩法逻辑，纯表现类" },
    ],
  },
  narrative: {
    id: "narrative",
    label: "叙事",
    description: "模组是否包含故事线、世界观Lore、任务引导或背景设定",
    tags: [
      { id: "no_narrative", label: "无叙事", description: "纯机制或内容添加，无叙事内容" },
      { id: "lore_setting", label: "背景设定", description: "物品描述、手册中有世界观Lore" },
      { id: "quest_guided", label: "任务引导", description: "包含任务书、成就链、阶段性目标" },
      { id: "story_event", label: "剧情事件", description: "包含过场、对话、特定剧情触发" },
      { id: "book_document", label: "书籍文档", description: "通过游戏内书籍传达大量信息" },
    ],
  },
  interaction: {
    id: "interaction",
    label: "交互",
    description: "行为逻辑层，改变元素交互规则、物理规律、AI行为或数据判定",
    tags: [
      { id: "physics", label: "物理引擎", description: "引入重力、惯性、碰撞、破坏物理" },
      { id: "vehicle", label: "载具操作", description: "引入飞船、车辆、飞机的操控逻辑" },
      { id: "ai_behavior", label: "AI行为", description: "改变生物/怪物的智能、寻路、攻击" },
      { id: "combat_mechanic", label: "战斗机制", description: "改变攻击判定、连招、受击反馈" },
      { id: "harvest_rule", label: "采集规则", description: "改变挖矿、收割的逻辑" },
      { id: "fluid_gas", label: "流体/气体", description: "改变液体/气体的流动、扩散逻辑" },
      { id: "craft_interaction", label: "合成交互", description: "改变合成台的操作方式" },
      { id: "worldgen", label: "世界生成逻辑", description: "改变地形、地貌、结构的生成算法" },
    ],
  },
  system: {
    id: "system",
    label: "系统",
    description: "结构闭环层，是否具备独立、合理、循环的内部机制体系",
    tags: [
      { id: "no_system", label: "无系统", description: "无复杂闭环，单纯添加物品/功能" },
      { id: "economy", label: "经济交易体系", description: "包含货币、交易、市场平衡闭环" },
      { id: "automation", label: "自动化产线体系", description: "多步骤加工、输入输出闭环" },
      { id: "energy_network", label: "能源网络体系", description: "电力的产生、传输、消耗网络" },
      { id: "logistics_storage", label: "物流存储体系", description: "物品的自动请求、传输、存储网络" },
      { id: "crafting_forging", label: "合成锻造体系", description: "独特的工具/装备构建、改装逻辑" },
      { id: "class_evolution", label: "职业进化体系", description: "玩家种族进化、职业转职、形态转变" },
      { id: "companion_taming", label: "伙伴驯养体系", description: "生物捕捉、驯服、繁育、NPC雇佣与养成" },
      { id: "attribute_skill", label: "属性技能体系", description: "等级、经验、属性加点、技能树" },
      { id: "magic_research", label: "魔法研究体系", description: "知识解锁、魔力循环、研究闭环" },
      { id: "cooking_diet", label: "烹饪饮食体系", description: "食材→加工→食用→效果闭环" },
      { id: "team_coop", label: "团队协作体系", description: "职业分工、技能配合、团队定位" },
    ],
  },
  experience: {
    id: "experience",
    label: "体验",
    description: "用户感受与定位，包含体量、受众、难度、情感等维度",
    tags: [
      { id: "lightweight", label: "轻量级", description: "内容少、资源占用低" },
      { id: "medium", label: "中型", description: "标准大小" },
      { id: "heavy", label: "重型/大体量", description: "内容极多" },
      { id: "low_load", label: "低负载", description: "低配可玩" },
      { id: "mid_load", label: "中负载", description: "标准配置流畅" },
      { id: "high_load", label: "高负载", description: "需高端配置" },
      { id: "all_ages", label: "全年龄" },
      { id: "teen", label: "青少年/一般" },
      { id: "adult_hardcore", label: "成人/硬核" },
      { id: "casual", label: "休闲/简单" },
      { id: "standard_diff", label: "标准" },
      { id: "hardcore", label: "硬核/挑战" },
      { id: "extreme", label: "变态/极限" },
      { id: "happy_creative", label: "快乐/创造" },
      { id: "thrill_combat", label: "刺激/战斗" },
      { id: "horror", label: "恐怖/惊悚" },
      { id: "education", label: "教育/学习" },
      { id: "relax_healing", label: "放松/治愈" },
      { id: "singleplayer", label: "单机体验" },
      { id: "multiplayer", label: "社交/联机" },
      { id: "no_warning", label: "无警示" },
      { id: "flash_warning", label: "闪光警告" },
      { id: "jumpscare", label: "恐怖惊吓" },
      { id: "mature_theme", label: "成人主题" },
    ],
  },
  technical: {
    id: "technical",
    label: "技术/辅助",
    description: "基础设施与工具，优化性能、提供信息或简化操作",
    tags: [
      { id: "performance", label: "性能优化", description: "提升帧数、减少延迟、内存优化" },
      { id: "library", label: "前置库/依赖", description: "其他模组运行所需的基础库" },
      { id: "info_query", label: "信息查询", description: "提供配方、物品、生物数据查询" },
      { id: "inventory_mgmt", label: "背包管理", description: "整理、搜索、扩容背包" },
      { id: "map_nav", label: "地图/导航", description: "提供小地图、路径点、坐标" },
      { id: "operation_assist", label: "操作辅助", description: "鼠标手势、放置辅助、快捷键" },
      { id: "server_mgmt", label: "服务器管理", description: "服主专用工具、权限、日志" },
      { id: "compat_fix", label: "兼容/修复", description: "修复Bug、解决模组冲突" },
      { id: "plugin_extension", label: "插件/扩展", description: "依赖主模组的附属功能扩展" },
      { id: "client_side", label: "客户端专用" },
      { id: "server_side", label: "服务端专用" },
      { id: "both_side", label: "双向必需" },
    ],
  },
  positioning: {
    id: "positioning",
    label: "模组定位",
    description: "模组在生态中的独立性、依赖关系、影响力权重及生命周期",
    tags: [
      { id: "core", label: "核心主体", description: "独立运行的核心模组" },
      { id: "addon", label: "附属扩展", description: "依赖核心模组的扩展" },
      { id: "lib", label: "前置依赖", description: "技术底层库" },
      { id: "standalone", label: "独立工具", description: "功能辅助型独立模组" },
      { id: "patch", label: "兼容补丁", description: "解决冲突的补丁" },
      { id: "s_tier", label: "S级：颠覆玩法" },
      { id: "a_tier", label: "A级：核心体系" },
      { id: "b_tier", label: "B级：内容补充" },
      { id: "c_tier", label: "C级：体验优化" },
      { id: "d_tier", label: "D级：底层支撑" },
      { id: "active", label: "活跃维护" },
      { id: "stable", label: "稳定版" },
      { id: "beta", label: "测试版" },
      { id: "abandoned", label: "已停止维护" },
    ],
  },
};

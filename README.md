# fuck-rumor

## 项目简介

fuck-rumor 是一个聚合权威辟谣信息的平台，旨在帮助用户快速获取最新、最权威的辟谣内容，减少网络谣言的传播。项目聚焦于简洁高效的用户体验，支持多主题切换，适合不同用户群体（如普通模式、暗黑模式、老年模式）。

## 项目初衷

随着网络谣言泛滥，普通用户难以辨别信息真伪。该项目希望通过聚合权威渠道的辟谣数据，降低谣言传播风险，提升大众的信息辨识能力。

## 技术架构

- 前端框架：Vue 3 + TypeScript
- 构建工具：Vite
- 状态管理：Pinia
- 路由管理：vue-router
- 样式框架：Tailwind CSS
- 工具库：@vueuse/core、dayjs
- 数据获取：axios

主要结构：

- `src/components/`：核心UI组件（如谣言卡片、分类列表、主题切换等）
- `src/stores/`：Pinia 状态管理（如谣言数据、主题模式）
- `src/services/`：API请求与服务层（如辟谣数据获取）
- `src/assets/`：静态资源

## 安装方法

1. 克隆仓库：
   ```bash
   git clone https://github.com/yourname/fuck-rumor.git
   cd fuck-rumor
   ```
2. 安装依赖：
   ```bash
   npm install
   ```

## 运行方法

开发环境启动：

```bash
npm run dev
```

构建生产包：

```bash
npm run build
```

预览生产包：

```bash
npm run preview
```

## 许可证

本项目采用 [GNU 通用公共许可证 v3.0 (GPL v3)](LICENSE)。

- 你可以自由使用、修改和分发本项目。
- 但如果你发布了基于本项目的衍生作品，必须同样以 GPL v3 协议开源。
- 你必须在衍生作品中包含本协议内容。

如需了解详细条款，请参阅 LICENSE 文件或访问 [https://www.gnu.org/licenses/gpl-3.0.html](https://www.gnu.org/licenses/gpl-3.0.html)。

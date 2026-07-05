# YZS® — Yet Zero Sense · 杨子硕作品集

> 感知归零,一切重新开始。
> 我们设计物,也设计「无物」。

杨子硕 (Cali-Yang) 的个人作品集网站——深色编辑杂志风,全站高密度动效。

**在线访问:** https://calibg.github.io/yzs-portfolio/

## ✦ 动效清单

- 百分比预加载器(品牌词轮播 + clip-path 幕布退场)
- Three.js WebGL 粒子星尘场(波浪流动 / 鼠标斥力 / 滚动衰减,自定义 GLSL)
- Lenis 平滑滚动 + GSAP ScrollTrigger 全站编排
- Hero 大标题字符级 SplitText 入场 + 滚动视差淡出
- 自定义双层光标(磁吸 / 悬停放大 / VIEW 标签)
- 导航链接 ScrambleText 中英乱码切换
- 宣言正文字符渐显扫过(scrub)
- 图片 clip-path 揭示 + 内部视差缩放
- 周边系列横向滚动画廊(pin + scrub)
- 滚动速度联动的无限跑马灯 × 2
- 数字滚动统计、3D 倾斜卡片、磁吸按钮
- 项目详情侧滑模态框(图集交错入场)
- 页脚大字滚动填充 + 全屏菜单幕布展开
- SVG feTurbulence 噪点颗粒层

## ✦ 内容板块

宣言 / 精选作品(7 个装置、交互、系统设计项目)/ YZS® 周边 / 赛事 / **实验室**(4 个可玩的 creative coding demo:沙痕装置模拟、动态排版时钟、GREEN SUN 温泉页、Calendar UI)/ 同框 iOS App / 合作者的话 / 联络

## ✦ 技术

纯静态,零构建。GSAP 3.13 (ScrollTrigger / SplitText / ScrambleText) · Lenis · Three.js r160,均走 CDN。

```
index.html      # 单页主站
css/style.css
js/main.js      # 动效编排
js/webgl.js     # 粒子着色器
lab/            # 4 个独立可玩 demo
assets/img/     # 作品图 / 视频
```

素材整合自 [CaliBG](https://github.com/CaliBG) 名下各仓库 (cc / cali-YANG / sand-trace-installation / yzs / caliyang / web)。

Copyright © 2026 YZS — Yet Zero Sense · 杨子硕

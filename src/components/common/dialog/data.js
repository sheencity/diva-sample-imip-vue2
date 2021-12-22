/** 组件数据 */
export const metadata = new Map([
  // 项目介绍部分-1
  ["introduction-1", { text: "项目介绍", icon: "route1/1.svg" }],
  ["introduction-2", { text: "基本信息", icon: "route1/2.svg" }],
  ["introduction-3", { text: "建筑分区", icon: "route1/3.svg" }],
  ["introduction-4", { text: "产业布局", icon: "route1/4.svg" }],

  // 碳中和部分-1
  ["carbon-1", { text: "能耗类型", icon: "route2/1.svg" }],
  ["carbon-2", { text: "分析透视", icon: "route2/2.svg" }],
  ["carbon-3-ele", { text: "耗电量（kW·h）", icon: "route2/3.svg" }],
  ["carbon-3-water", { text: "耗水量（m³）", icon: "route2/3-water.svg" }],
  ["carbon-4-ele", { text: "能耗占比", icon: "route2/3.svg" }],
  ["carbon-4-water", { text: "能耗占比", icon: "route2/3-water.svg" }],

  // 智慧运营部分-1(办公)
  ["operation-1", { text: "楼宇控制", icon: "route3/1.svg" }],
  ["operation-2", { text: "楼层分析模式", icon: "route3/2.svg" }],
  ["operation-3", { text: "楼层配套", icon: "route3/3.svg" }],
  ["operation-4", { text: "入驻企业", icon: "route3/4.svg" }],
  ["operation-5", { text: "入楼人员统计", icon: "route3/5.svg" }],
  ["operation-6", { text: "入楼人员分析", icon: "route3/5-4.svg" }],
  ["operation-7", { text: "入楼分时统计", icon: "route3/6-2.svg" }],
  // 智慧运营部分-2(环境)
  ["environment-1", { text: "设备清单", icon: "route3/2-1.svg" }],
  ["environment-2", { text: "甲醛（mg/m³）", icon: "route3/2-2.svg" }],
  ["environment-3", { text: "二氧化碳（PPM）", icon: "route3/2-3.svg" }],
  ["environment-4", { text: "温湿度", icon: "route3/2-4.svg" }],
  ["environment-5", { text: "PM2.5（μg/m³）", icon: "route3/2-5.svg" }],
  ["environment-6", { text: "VOC（mg/m³）", icon: "route3/2-6.svg" }],
  // 智慧运营部分-3(消防)
  ["fire-control-1", { text: "烟雾报警", icon: "route3/3-1.svg" }],
  ["fire-control-2", { text: "灭火设施", icon: "route3/3-2.svg" }],
  ["fire-control-3", { text: "安全通道", icon: "route3/3-3.svg" }],
  ["fire-control-4", { text: "消防警报", icon: "route3/3-4.svg" }],
  ["fire-control-5", { text: "报警趋势分析", icon: "route3/3-4.svg" }],
  ["fire-control-6", { text: "区域报警分析", icon: "route3/3-4.svg" }],
  // 智慧运营部分-4(生产)
  ["production-1", { text: "生产概况", icon: "route3/3-1.svg" }],
  ["production-2", { text: "产能占比", icon: "route3/3-2.svg" }],
  ["production-3", { text: "成本控制", icon: "route3/3-3.svg" }],
  // 智慧运营部分-5(安保)
  ["security-1", { text: "信息类型", icon: "route3/5-1.svg" }],
  ["security-2-1", { text: "实时监控", icon: "route3/5-2-1.svg" }],
  ["security-2-2", { text: "巡逻路线", icon: "route3/5-2-2.svg" }],
  ["security-2-3", { text: "交通路线", icon: "route3/5-2-3.svg" }],
  ["security-3", { text: "异常事件分析", icon: "route3/5-3.svg" }],
  ["security-4", { text: "异常区域分析", icon: "route3/5-3.svg" }],
  // 智慧运营部分-6(停车)
  ["park-1", { text: "车位概况", icon: "route3/6-1.svg" }],
  ["park-2", { text: "停车时长", icon: "route3/6-2.svg" }],
  ["park-3", { text: "车位使用饱和率", icon: "route3/6-1.svg" }],
  ["park-4", { text: "车辆出入记录", icon: "route3/6-4.svg" }],

  // 产品招商部分-1(招商成果)
  ["investment-1", { text: "园区企业", icon: "route4/1.svg" }],
  ["investment-2", { text: "扶持政策", icon: "route4/2.svg" }],
  ["investment-3", { text: "知名企业", icon: "route4/3.svg" }],
  ["investment-4", { text: "企业规模", icon: "route4/4.svg" }],
  ["investment-5", { text: "入驻企业行业类别", icon: "route4/5.svg" }],
  ["investment-6", { text: "人才引进", icon: "route4/6.svg" }],

  // 产品招商部分-2(空间布局)
  ["space-1", { text: "空间布局", icon: "route4/2-1.svg" }],
  ["space-2", { text: "一轴", icon: "route4/2-2.svg" }],
  ["space-3", { text: "三点", icon: "route4/2-3.svg" }],
  ["space-4", { text: "两环", icon: "route4/2-4.svg" }],

  // 产品招商部分-3(产业规划)
  ["plan-1", { text: "产业配置", icon: "route4/3-1.svg" }],
  ["plan-2", { text: "建筑红线", icon: "route4/3-2.svg" }],
  ["plan-3", { text: "产业链条", icon: "route4/3-3.svg" }],
  ["plan-4", { text: "建筑用途", icon: "route4/3-4.svg" }],
  ["plan-5", { text: "分期规划", icon: "route4/3-5.svg" }],

  ["拼装/加工/检测调试", { text: "拼装/加工/检测调试", icon: "" }],
  ["中试/检测调试", { text: "中试/检测调试", icon: "" }],
  ["其他配套", { text: "其他配套", icon: "" }],
  ["餐厅", { text: "餐厅", icon: "" }],
  ["宿舍", { text: "宿舍", icon: "" }],
  ["孵化楼", { text: "孵化楼", icon: "" }],
  ["展厅信息会议中心", { text: "展厅信息会议中心", icon: "" }],
  ["科研楼", { text: "科研楼", icon: "" }],
  ["标准化车间", { text: "标准化车间", icon: "" }],
  ["动力中心", { text: "动力中心", icon: "" }],
  ["一期规划", { text: "一期规划", icon: "" }],
  ["二期规划", { text: "二期规划", icon: "" }],
  ["三期规划", { text: "三期规划", icon: "" }],
]);

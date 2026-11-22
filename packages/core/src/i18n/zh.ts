import type { UiStrings } from "./types.js";

export const zh: UiStrings = {
  cancel: "取消",
  clear: "清除",
  close: "关闭",
  required: "必填",

  copy: "复制",
  copied: "已复制！",
  copyFailed: "复制失败",

  saveChanges: "保存更改",
  discardChanges: "放弃更改",

  showPassword: "显示密码",
  hidePassword: "隐藏密码",

  previous: "上一页",
  next: "下一页",
  pageOf: (page, total) => `${page} / ${total}`,
  totalItems: (count) => `共 ${count} 项`,
  pageNumber: "页数",
  goToPage: "跳转到页",
  go: "跳转",

  pickColor: "选择颜色",
  hexColor: "十六进制颜色",
  optionalHexColor: "可选的十六进制颜色",
  invalidHexColor: "请输入三位或六位十六进制色值。",
  colorArea: "颜色饱和度和亮度",
  saturation: "饱和度",
  brightness: "亮度",
  hue: "色相",

  theme: "主题",
  themeSystem: "跟随系统",
  themeLight: "浅色",
  themeDark: "深色",

  search: "搜索",
  commandMove: "移动",
  commandOpen: "打开",
  commandClose: "关闭",

  onThisPage: "目录",
  openNavigation: "打开导航",
  primaryNavigation: "主导航",
  duration: (value, unit) => (unit === "minutes" ? `${value} 分钟` : `${value} 天`),
  durationUnits: {
    s: ["秒", "秒钟"],
    m: ["分", "分钟"],
    h: ["时", "小时", "个小时"],
    d: ["天", "日"],
    w: ["周", "星期", "个星期"],
    mo: ["月", "个月"],
    y: ["年"],
  },
  durationInvalid: "格式无效，试试“60”或“1 小时”",
  durationNotPositive: "时长必须大于零",
  durationUnknownUnit: "无法识别的时间单位",
};

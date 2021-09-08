export enum TemplateItem {
  // 箱默认宽高
  BOX_WIDTH = 300,
  BOX_HEIGHT = 300,
  // 框默认宽高
  FRAME_WIDTH = 50,
  FRAME_HEIGHT = 50,
  // 盘默认宽高
  BOARD_WIDTH = 20,
  BOARD_HEIGHT = 30,
}

export class DrawInfo {
  startX: number;
  startY: number;
  row: number;
  col: number;
  width: number;
  height: number;
  position: number;
  direction: number;
}

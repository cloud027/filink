export class BasicTemplate {
  // 获取queen实例
  Q = window['Q'];
  graph;

  // 起始坐标
  coordinate = {
    x: 20,
    y: 20
  };

  // AB 面间距
  spaceBetween = 100;

  // 保存按钮防止多点
  loading = false;

  /**
   * 模板保存
   */
  handleSave() {

  }

  /**
   * 模板预览
   */
  preview() {
  }

  /**
   * 绘制AB面
   */
  drawReversible(width, col, graph) {
    const reversibleA = graph.createNode('A 面', width * col / 2, this.coordinate.y / -2);
    reversibleA.image = null;
    reversibleA.setStyle(this.Q.Styles.LABEL_FONT_SIZE, 12);
    const reversibleB = graph.createNode('B 面', width * col * 1.5 + this.spaceBetween, this.coordinate.y / -2);
    reversibleB.image = null;
    reversibleB.setStyle(this.Q.Styles.LABEL_FONT_SIZE, 12);
  }

  /**
   * 判断是否可以预览
   */
  canPreview(type) {
  }

  /**
   * 模板选择
   * param item
   */
  selectTemplate(event) {
  }

  /**
   * 初始化graph
   */
  initGraph(id) {
    if (this.graph) {
      // this.graph.clear();
    } else {
      this.graph = new this.Q.Graph(id);
      this.graph.enableTooltip = true;
      this.graph.tooltipDelay = 0;
      this.graph.tooltipDuration = 10000;
      // 线条禁止拖动
      // this.graph.isSelectable = (item) => {
      //   return item.get('type') === 'cabinet';
      // };
      this.graph.onclick = (event) => {
        console.log(event.getData());
      };
      // 设置坐标原点
      this.graph.originAtCenter = false;
      this.graph.translate(this.coordinate.x, this.coordinate.y);
    }
  }

  clearGraph() {
    this.graph.clear();
  }
}

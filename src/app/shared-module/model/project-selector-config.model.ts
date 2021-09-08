export class ProjectSelectorConfigModel {
  /**
   * 选中的告警名称(多选时，告警名称为多个告警名称的拼接)
   */
  projectName: string;
  /**
   * 选中的告警id
   */
  ids: string[];


  constructor(projectName?, ids?) {
    this.projectName = projectName || '';
    this.ids = ids || [];
  }
}

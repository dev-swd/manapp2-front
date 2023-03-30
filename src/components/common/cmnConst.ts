export class cmnProps {
  static readonly topFontSize: number = 16;
  static readonly fontSize: number = 14;
  static readonly fontFamily: string = "sans-serif";
}

export class projectStatus {
  static readonly planNotSubmitted: string = "計画書未提出";
  static readonly planAuditing: string = "計画書監査中";
  static readonly planSendBack: string = "計画書差戻";
  static readonly projectInProgress: string = "PJ推進中";
  static readonly reportNotSubmitted: string = "完了報告書未提出"
  static readonly reportAuditing: string = "完了報告書監査中";
  static readonly reportSendBack: string = "完了報告書差戻";
  static readonly projectCompleted: string = "完了";
  static readonly array: string[] = ["計画未提出", "計画書監査中", "計画書差戻", "PJ推進中", "完了報告書監査中", "完了報告書差戻", "完了"];
}
declare class LogObject {
  public readonly module: string;
  public readonly path: string;
  public readonly method: string;
  public readonly status: string;
  readonly [key: string]: string;
}

import { fileURLToPath } from "url";
import { ts, Node,ObjectLiteralExpression } from "ts-morph";
export const projectRoot = fileURLToPath(new URL("..", import.meta.url));
export const isExportDefault = (node: ts.Node): boolean => {
  // `export default 123`, `export default "str"`
  return ts.isExportAssignment(node) && !node.isExportEquals;
};

type VisitingFunc<T, N extends ts.Node = ts.Node> = (
  node: N,
  midState: T
) => { node: N; behavior?: "stop" | "replace"; state: T } | undefined | void;
type KindVisitingKey = keyof typeof ts.SyntaxKind | "each";
type KindVisitingRecord<T> = {
  [P in KindVisitingKey]?: VisitingFunc<T>;
};

type TransformWidthStateOption<T> = {
  init: () => T;
  visiting?: VisitingFunc<T> | KindVisitingRecord<T>;
  visited?: VisitingFunc<T>;
};
const isKindVisiting = <T extends any = any>(
  target: any
): target is KindVisitingRecord<T> => {
  if (typeof target === "object") {
    return true;
  }
  target = target as KindVisitingRecord<T>;
  return !Object.values(target).some((item) => typeof item !== "function");
};

export const transformWidthState = <T extends unknown = undefined>(
  sourceFile: Node | undefined,
  options: TransformWidthStateOption<T>
) => {
  if (!sourceFile) {
    return;
  }
  const execVisiting = (
    node: ts.Node,
    state: T,
    visitingOps: KindVisitingRecord<T> | VisitingFunc<T>
  ): ReturnType<VisitingFunc<T>> => {
    let visitingFunc: VisitingFunc<T> | undefined;
    let eachVisitingFunc: VisitingFunc<T> | undefined;
    if (isKindVisiting<T>(visitingOps)) {
      eachVisitingFunc = visitingOps["each"];
      const kindName = ts.SyntaxKind[node.kind] as KindVisitingKey;
      visitingFunc = visitingOps[kindName];
    } else {
      visitingFunc = visitingOps;
    }
    let result: ReturnType<VisitingFunc<T>>;
    if (eachVisitingFunc) {
      result = eachVisitingFunc(node, state);
    }
    if (visitingFunc) {
      result = visitingFunc(node, result?.state || state);
    }
    return result;
  };
  const {
    init,
    visited = (node) => undefined,
    visiting = (node, state) => ({ node, state }),
  } = options;
  let stateQueue: (T | undefined)[] = [];

  sourceFile.transform((ttc) => {
    const fatherState = stateQueue[stateQueue.length - 1] || init();
    const result = execVisiting(ttc.currentNode, fatherState, visiting);
    if (result?.behavior === "stop") {
      return ttc.currentNode;
    }
    if (result?.behavior === "replace") {
      return result.node;
    }
    // 状态传递，如果没有返回状态，继承祖先的状态
    stateQueue.push(result?.state || fatherState);
    const oneNode = ttc.visitChildren();
    stateQueue.pop();
    visited(oneNode, fatherState);
    return oneNode;
  });
};
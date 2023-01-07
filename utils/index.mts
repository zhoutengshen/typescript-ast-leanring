import { fileURLToPath } from "url";
import { SourceFile, ts } from "ts-morph";
export const projectRoot = fileURLToPath(new URL("..", import.meta.url));

export const isExportDefault = (node: ts.Node): boolean => {
  // `export default 123`, `export default "str"`
  return ts.isExportAssignment(node) && !node.isExportEquals;
};

type VisitingFunc<T> = (
  node: ts.Node,
  midState: T
) => { node: ts.Node; stop?: boolean; state: T } | undefined | void;
type KindVisitingKey = keyof typeof ts.SyntaxKind | "each";
type KindVisitingRecord<T> = {
  [P in KindVisitingKey]?: VisitingFunc<T>;
};

type TransformWidthStateOption<T> = {
  init: () => T;
  visiting?: VisitingFunc<T> | KindVisitingRecord<T>;
  visited?: (node: ts.Node) => undefined | void;
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

export const transformWidthState = <T extends any = undefined>(
  sourceFile: SourceFile,
  options: TransformWidthStateOption<T>
) => {
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
    if (result?.stop) {
      return result.node;
    }
    stateQueue.push(result?.state);
    const oneNode = ttc.visitChildren();
    stateQueue.pop();
    visited(oneNode);
    return oneNode;
  });
};

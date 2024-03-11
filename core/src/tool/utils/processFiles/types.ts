export type ProcessFilesToolConfig = {
  exclude: string[];
  include: string[];
};

export type ProcessFileHandleParams = {
  countCurrent: number;
  countTotal: number;
  fileContent: string;
  fileContentHash: string;
  filePath: string;
  filePathHash: string;
};

export type ProcessFilesHandleFunction = (
  params: ProcessFileHandleParams,
) => Promise<void>;

export type ProcessFilesParams = ProcessFilesToolConfig & {
  handle: ProcessFilesHandleFunction;
  path: string;
  toolName: string;
};

export type ProcessFileParams = {
  countCurrent: number;
  countTotal: number;
  filePath: string;
  handle: ProcessFilesHandleFunction;
  toolName: string;
};

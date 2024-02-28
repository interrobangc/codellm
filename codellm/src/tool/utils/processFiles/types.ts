export type ProcessFilesToolConfig = {
  include: string[];
  exclude: string[];
};

export type ProcessFileHandleParams = {
  fileContent: string;
  fileContentHash: string;
  filePath: string;
  filePathHash: string;
};

export type ProcessFilesHandleFunction = (
  params: ProcessFileHandleParams,
) => Promise<void>;

export type ProcessFilesParams = ProcessFilesToolConfig & {
  toolName: string;
  path: string;
  handle: ProcessFilesHandleFunction;
};

export type ProcessFileParams = {
  toolName: string;
  filePath: string;
  handle: ProcessFilesHandleFunction;
};

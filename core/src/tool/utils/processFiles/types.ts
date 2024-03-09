export type ProcessFilesToolConfig = {
  exclude: string[];
  include: string[];
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
  handle: ProcessFilesHandleFunction;
  path: string;
  toolName: string;
};

export type ProcessFileParams = {
  filePath: string;
  handle: ProcessFilesHandleFunction;
  toolName: string;
};

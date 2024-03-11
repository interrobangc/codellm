import type { ToolImportReturn } from '@/.';

export type Importer = {
  import: () => Promise<ToolImportReturn>;
};

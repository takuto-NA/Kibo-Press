/**
 * 責務: Pandoc --metadata-file に書き込む YAML 文字列を組み立てる
 */

import YAML from "yaml";
import { METADATA_KEYS_STRIPPED_BEFORE_PANDOC } from "../constants/metadataKeys";

export function buildPandocMetadataYamlString(
  mergedMetadata: Record<string, unknown>,
): string {
  const pandocReadyMetadata = stripInternalMetadataKeys(mergedMetadata);

  return YAML.stringify(pandocReadyMetadata);
}

function stripInternalMetadataKeys(
  mergedMetadata: Record<string, unknown>,
): Record<string, unknown> {
  const pandocReadyMetadata: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(mergedMetadata)) {
    if (METADATA_KEYS_STRIPPED_BEFORE_PANDOC.has(key)) {
      continue;
    }

    pandocReadyMetadata[key] = value;
  }

  return pandocReadyMetadata;
}

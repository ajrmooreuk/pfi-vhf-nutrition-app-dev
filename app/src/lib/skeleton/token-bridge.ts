/**
 * DS-ONT Token Bridge — VHF simplified variant of the PFC ds-css-bridge pattern.
 * Resolves DS-ONT instance JSONLD tokens to CSS custom properties and maps
 * them to shadcn/ui theme slots.
 */

export interface DsTokenMap {
  [cssVarName: string]: string;
}

/**
 * Extract DS-ONT tokens from a DS instance JSONLD node.
 * Expects the JSONLD to contain colour/typography/spacing definitions
 * keyed by DS-ONT property names.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function resolveTokens(dsInstanceJsonld: any): DsTokenMap {
  const tokens: DsTokenMap = {};

  if (!dsInstanceJsonld) return tokens;

  const colours = dsInstanceJsonld.colours ?? dsInstanceJsonld.colors ?? {};
  for (const [key, value] of Object.entries(colours)) {
    if (typeof value === "string") {
      tokens[`--ds-color-${key}`] = value;
    }
  }

  const typography = dsInstanceJsonld.typography ?? {};
  if (typography.fontFamily) {
    tokens["--ds-font-family"] = typography.fontFamily;
  }
  if (typography.fontSize) {
    tokens["--ds-font-size-base"] = typography.fontSize;
  }

  const radii = dsInstanceJsonld.radii ?? dsInstanceJsonld.borderRadius ?? {};
  for (const [key, value] of Object.entries(radii)) {
    if (typeof value === "string") {
      tokens[`--ds-radius-${key}`] = value;
    }
  }

  const spacing = dsInstanceJsonld.spacing ?? {};
  for (const [key, value] of Object.entries(spacing)) {
    if (typeof value === "string") {
      tokens[`--ds-spacing-${key}`] = value;
    }
  }

  return tokens;
}

/**
 * Map --ds-* CSS variables to shadcn/ui theme slot variables.
 */
export function mapToShadcnSlots(tokens: DsTokenMap): DsTokenMap {
  const slotMap: Record<string, string> = {
    "--ds-color-primary": "--primary",
    "--ds-color-primary-foreground": "--primary-foreground",
    "--ds-color-secondary": "--secondary",
    "--ds-color-secondary-foreground": "--secondary-foreground",
    "--ds-color-background": "--background",
    "--ds-color-foreground": "--foreground",
    "--ds-color-muted": "--muted",
    "--ds-color-muted-foreground": "--muted-foreground",
    "--ds-color-accent": "--accent",
    "--ds-color-accent-foreground": "--accent-foreground",
    "--ds-color-card": "--card",
    "--ds-color-card-foreground": "--card-foreground",
    "--ds-color-border": "--border",
    "--ds-color-input": "--input",
    "--ds-color-ring": "--ring",
    "--ds-color-destructive": "--destructive",
    "--ds-color-destructive-foreground": "--destructive-foreground",
  };

  const mapped: DsTokenMap = {};
  for (const [dsVar, shadcnVar] of Object.entries(slotMap)) {
    if (tokens[dsVar]) {
      mapped[shadcnVar] = tokens[dsVar];
    }
  }

  return mapped;
}

/**
 * Apply resolved tokens to the :root element as CSS custom properties.
 * Client-side only.
 */
export function applyBrandTokens(tokens: DsTokenMap): void {
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  for (const [prop, value] of Object.entries(tokens)) {
    root.style.setProperty(prop, value);
  }

  // Also apply shadcn slot mappings
  const shadcnMapped = mapToShadcnSlots(tokens);
  for (const [prop, value] of Object.entries(shadcnMapped)) {
    root.style.setProperty(prop, value);
  }
}

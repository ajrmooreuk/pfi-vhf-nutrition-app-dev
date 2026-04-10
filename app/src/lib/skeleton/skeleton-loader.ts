/**
 * App Skeleton Loader — VHF simplified variant of the PFC skeleton-loader pattern.
 * Parses skeleton JSONLD into typed registries for zone-driven navigation.
 */

export interface SkeletonApplication {
  id: string;
  name: string;
  description?: string;
  version?: string;
}

export interface SkeletonZone {
  id: string;
  label: string;
  slug: string;
  icon?: string;
  visible: boolean;
  order: number;
  requiredRole?: string;
}

export interface SkeletonNavLayer {
  id: string;
  label: string;
  position: "sidebar" | "header" | "footer";
  zones: string[]; // zone IDs
}

export interface SkeletonNavItem {
  id: string;
  label: string;
  href: string;
  zoneId: string;
  icon?: string;
  order: number;
}

export interface SkeletonAction {
  id: string;
  label: string;
  zoneId: string;
  type: "primary" | "secondary" | "destructive";
}

export interface SkeletonZoneComponent {
  id: string;
  zoneId: string;
  componentType: string;
  props?: Record<string, unknown>;
}

export interface ParsedSkeleton {
  application: SkeletonApplication;
  zones: SkeletonZone[];
  navLayers: SkeletonNavLayer[];
  navItems: SkeletonNavItem[];
  actions: SkeletonAction[];
  zoneComponents: SkeletonZoneComponent[];
}

export interface SkeletonRegistries {
  zoneRegistry: Map<string, SkeletonZone>;
  navLayerRegistry: Map<string, SkeletonNavLayer>;
  actionIndex: Map<string, SkeletonAction[]>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseAppSkeleton(jsonld: any): ParsedSkeleton {
  const graph = jsonld?.["@graph"] ?? [jsonld];

  const application: SkeletonApplication = {
    id: jsonld?.["@id"] ?? "vhf-nutrition-app",
    name: jsonld?.name ?? "VHF Nutrition",
    description: jsonld?.description,
    version: jsonld?.version,
  };

  const zones: SkeletonZone[] = [];
  const navLayers: SkeletonNavLayer[] = [];
  const navItems: SkeletonNavItem[] = [];
  const actions: SkeletonAction[] = [];
  const zoneComponents: SkeletonZoneComponent[] = [];

  for (const node of graph) {
    const type = node?.["@type"];

    if (type === "skel:Zone" || type === "Zone") {
      zones.push({
        id: node["@id"],
        label: node.label ?? node.name ?? node["@id"],
        slug: node.slug ?? node["@id"],
        icon: node.icon,
        visible: node.visible !== false,
        order: node.order ?? 0,
        requiredRole: node.requiredRole,
      });
    }

    if (type === "skel:NavLayer" || type === "NavLayer") {
      navLayers.push({
        id: node["@id"],
        label: node.label ?? node.name,
        position: node.position ?? "sidebar",
        zones: Array.isArray(node.zones) ? node.zones : [],
      });
    }

    if (type === "skel:NavItem" || type === "NavItem") {
      navItems.push({
        id: node["@id"],
        label: node.label ?? node.name,
        href: node.href ?? `/${node.slug ?? node["@id"]}`,
        zoneId: node.zoneId ?? node.zone,
        icon: node.icon,
        order: node.order ?? 0,
      });
    }

    if (type === "skel:Action" || type === "Action") {
      actions.push({
        id: node["@id"],
        label: node.label ?? node.name,
        zoneId: node.zoneId ?? node.zone,
        type: node.actionType ?? "primary",
      });
    }

    if (type === "skel:ZoneComponent" || type === "ZoneComponent") {
      zoneComponents.push({
        id: node["@id"],
        zoneId: node.zoneId ?? node.zone,
        componentType: node.componentType ?? node.component,
        props: node.props,
      });
    }
  }

  zones.sort((a, b) => a.order - b.order);
  navItems.sort((a, b) => a.order - b.order);

  return { application, zones, navLayers, navItems, actions, zoneComponents };
}

export function buildSkeletonRegistries(
  skeleton: ParsedSkeleton
): SkeletonRegistries {
  const zoneRegistry = new Map<string, SkeletonZone>();
  for (const zone of skeleton.zones) {
    zoneRegistry.set(zone.id, zone);
  }

  const navLayerRegistry = new Map<string, SkeletonNavLayer>();
  for (const layer of skeleton.navLayers) {
    navLayerRegistry.set(layer.id, layer);
  }

  const actionIndex = new Map<string, SkeletonAction[]>();
  for (const action of skeleton.actions) {
    const existing = actionIndex.get(action.zoneId) ?? [];
    existing.push(action);
    actionIndex.set(action.zoneId, existing);
  }

  return { zoneRegistry, navLayerRegistry, actionIndex };
}

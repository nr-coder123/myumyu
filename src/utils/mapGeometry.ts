import polygonClipping from 'polygon-clipping';
import * as d3Geo from 'd3-geo';
import { 
  RAW_CHINA_GEOJSON, 
  CHINA_PROVINCE_DATA, 
  PROVINCE_TO_GEOJSON_KEY, 
  PROVINCE_METADATA, 
  getSubprovinceMeta, 
  ProvinceMeta 
} from '../data/chinaProvinces';
import { RiverFeature, MountainFeature } from '../data/chinaGeography';
import { Alliance, BorderStrokeStyle, ProvinceState } from '../types/murim';

export const MAP_WIDTH = 1400;
export const MAP_HEIGHT = 920;

// Authentic Mercator projection centered on China (Longitudes ~73 to 135, Latitudes ~18 to 54)
export const chinaProjection = d3Geo.geoMercator()
  .center([104.0, 36.0])
  .scale(1100)
  .translate([MAP_WIDTH / 2, MAP_HEIGHT / 2]);

export const geoPathGenerator = d3Geo.geoPath().projection(chinaProjection);

export interface ProcessedProvince {
  key: string; // e.g. "洛阳" or "陕西"
  id: string; // e.g. "henan_luoyang" or "61"
  parentKey?: string; // e.g. "河南" (present if this is a subprovince)
  isSubdivision?: boolean;
  meta: ProvinceMeta;
  pathD: string;
  center: [number, number]; // Projected [x, y] in SVG
  geoCenter: [number, number]; // [lon, lat]
  rawFeature: any;
}

// Build pre-processed provinces with projected SVG paths and centroid
export function getProcessedProvinces(subdividedRegions: string[] = ['河南', '陕西', '四川', '湖北']): ProcessedProvince[] {
  const list: ProcessedProvince[] = [];

  for (const feature of RAW_CHINA_GEOJSON.features) {
    const rawName = feature.properties?.name || '';
    // Normalize name (strip any "省" or "市" suffix if present)
    const cleanName = rawName.replace(/(省|市|自治区|特别行政区|壮族自治区|回族自治区|维吾尔自治区)$/, '');
    const matchedKey = Object.keys(PROVINCE_METADATA).find(k => k === cleanName || cleanName.startsWith(k) || k.startsWith(cleanName)) || cleanName;

    // Check if this region is configured to be subdivided into prefectures/subprovinces
    const geoJsonKey = PROVINCE_TO_GEOJSON_KEY[matchedKey];
    const isSubdivided = subdividedRegions.includes(matchedKey) && geoJsonKey && (CHINA_PROVINCE_DATA as any)[geoJsonKey];

    if (isSubdivided) {
      const subData = (CHINA_PROVINCE_DATA as any)[geoJsonKey];
      if (subData && Array.isArray(subData.features) && subData.features.length > 0) {
        for (const subFeature of subData.features) {
          const subRawName = subFeature.properties?.name || '';
          const subCleanName = subRawName.replace(/(市|地区|藏族自治州|彝族自治州|自治州|哈萨克自治州|回族自治州|蒙古自治州|朝鲜族自治州|布依族苗族自治州|苗族侗族自治州|哈尼族彝族自治州|傣族自治州|白族自治州|藏族羌族自治州|土家族苗族自治州|壮族苗族自治州|林区|特别行政区|自治县|县|区)$/, '') || subRawName;
          
          const pathD = geoPathGenerator(subFeature) || '';
          if (!pathD) continue;

          let center: [number, number] = [MAP_WIDTH / 2, MAP_HEIGHT / 2];
          let geoCenter: [number, number] = [104, 36];

          if (subFeature.properties?.cp && Array.isArray(subFeature.properties.cp)) {
            geoCenter = [subFeature.properties.cp[0], subFeature.properties.cp[1]];
            const projected = chinaProjection(geoCenter);
            if (projected) {
              center = [projected[0], projected[1]];
            }
          } else {
            const centroid = geoPathGenerator.centroid(subFeature);
            if (centroid && !isNaN(centroid[0]) && !isNaN(centroid[1])) {
              center = [centroid[0], centroid[1]];
            }
          }

          const subMeta = getSubprovinceMeta(subCleanName, matchedKey);

          list.push({
            key: subCleanName,
            id: subMeta.id,
            parentKey: matchedKey,
            isSubdivision: true,
            meta: subMeta,
            pathD,
            center,
            geoCenter,
            rawFeature: subFeature
          });
        }
        continue;
      }
    }

    // Default: render top-level province
    const meta = PROVINCE_METADATA[matchedKey] || {
      id: feature.properties?.id || matchedKey,
      name: matchedKey,
      hanzi: matchedKey,
      historicalName: matchedKey,
      region: 'Central Plains',
      capital: 'Capital',
      landmarks: [],
      description: 'Province of the Great Realm'
    };

    const pathD = geoPathGenerator(feature) || '';
    if (!pathD) continue;

    // Projected center
    let center: [number, number] = [MAP_WIDTH / 2, MAP_HEIGHT / 2];
    let geoCenter: [number, number] = [104, 36];

    if (feature.properties?.cp && Array.isArray(feature.properties.cp)) {
      geoCenter = [feature.properties.cp[0], feature.properties.cp[1]];
      const projected = chinaProjection(geoCenter);
      if (projected) {
        center = [projected[0], projected[1]];
      }
    } else {
      const centroid = geoPathGenerator.centroid(feature);
      if (centroid && !isNaN(centroid[0]) && !isNaN(centroid[1])) {
        center = [centroid[0], centroid[1]];
      }
    }

    list.push({
      key: matchedKey,
      id: meta.id,
      isSubdivision: false,
      meta,
      pathD,
      center,
      geoCenter,
      rawFeature: feature
    });
  }

  return list;
}

// Convert River Line coordinates to SVG path
export function getRiverPath(river: RiverFeature): string {
  const points = river.coordinates
    .map(coord => chinaProjection(coord))
    .filter((pt): pt is [number, number] => pt !== null && !isNaN(pt[0]) && !isNaN(pt[1]));

  if (points.length < 2) return '';

  // Generate smooth cubic or quadratic curve string
  let path = `M ${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const midX = (prev[0] + curr[0]) / 2;
    const midY = (prev[1] + curr[1]) / 2;
    path += ` Q ${prev[0].toFixed(1)} ${prev[1].toFixed(1)}, ${midX.toFixed(1)} ${midY.toFixed(1)}`;
  }
  const last = points[points.length - 1];
  path += ` L ${last[0].toFixed(1)} ${last[1].toFixed(1)}`;

  return path;
}

// Project a mountain or pass to SVG coordinates
export function projectMountain(mountain: MountainFeature): [number, number] | null {
  const pt = chinaProjection(mountain.coordinates);
  if (!pt || isNaN(pt[0]) || isNaN(pt[1])) return null;
  return [pt[0], pt[1]];
}

// Project an arbitrary [lon, lat] coordinate
export function projectCoordinates(coords: [number, number]): [number, number] | null {
  const pt = chinaProjection(coords);
  if (!pt || isNaN(pt[0]) || isNaN(pt[1])) return null;
  return [pt[0], pt[1]];
}

// Inverse project from SVG [x, y] to [lon, lat]
export function invertCoordinates(xy: [number, number]): [number, number] | null {
  const lonLat = chinaProjection.invert?.(xy);
  if (!lonLat || isNaN(lonLat[0]) || isNaN(lonLat[1])) return null;
  return [lonLat[0], lonLat[1]];
}

// Get Dash Array for BorderStrokeStyle
export function getStrokeDashArray(style: BorderStrokeStyle, width: number): string | undefined {
  switch (style) {
    case 'dashed':
      return `${width * 3} ${width * 1.5}`;
    case 'dotted':
      return `${width} ${width * 1.5}`;
    case 'double':
      return undefined; // Handled with multiple stroke layers
    case 'glowing':
      return undefined;
    case 'solid':
    default:
      return undefined;
  }
}

// Compute alliance boundary paths for a given alliance
export function getAllianceProvincePaths(
  alliance: Alliance,
  provinces: ProcessedProvince[],
  provinceStates: Record<string, ProvinceState>
): ProcessedProvince[] {
  return provinces.filter(p => {
    const state = provinceStates[p.key];
    const isInAlliance = state?.allianceId === alliance.id || alliance.memberProvinces.includes(p.key);
    const isParentInAlliance = !!(p.parentKey && (provinceStates[p.parentKey]?.allianceId === alliance.id || alliance.memberProvinces.includes(p.parentKey)));
    return isInAlliance || isParentInAlliance;
  });
}

/**
 * Calculate absolute polygon ring area in coordinate square units.
 */
function getRingArea(ring: number[][]): number {
  if (!ring || ring.length < 4) return 0;
  let sum = 0;
  for (let i = 0; i < ring.length - 1; i++) {
    sum += (ring[i + 1][0] - ring[i][0]) * (ring[i + 1][1] + ring[i][1]);
  }
  return Math.abs(sum) / 2;
}

/**
 * Calculate signed polygon ring area.
 * Returns > 0 for clockwise winding, < 0 for counter-clockwise.
 */
function getRingSignedArea(ring: number[][]): number {
  if (!ring || ring.length < 4) return 0;
  let sum = 0;
  for (let i = 0; i < ring.length - 1; i++) {
    sum += (ring[i + 1][0] - ring[i][0]) * (ring[i + 1][1] + ring[i][1]);
  }
  return sum;
}

/**
 * Clean slivers and fix spherical polygon winding order for d3-geo:
 * 1. Removes micro-island slivers (< 0.002 deg²) created by crossing border boundaries.
 * 2. Removes micro-holes (< 0.015 deg²) created by coordinate digitization mismatches along borders,
 *    preventing dotted/beaded stroke artifacts along shared boundaries.
 * 3. Enforces spherical Mercator clockwise winding for outer boundaries and counter-clockwise for genuine enclaves.
 */
function cleanAndFixMultiPolygon(
  multiPoly: any[],
  minHoleArea: number = 0.015,
  minPolyArea: number = 0.002
): any[] {
  const cleanedPolys: any[] = [];

  for (const poly of multiPoly) {
    if (!poly || poly.length === 0) continue;
    const outerRing = poly[0];
    if (!outerRing || outerRing.length < 4) continue;

    const outerArea = getRingArea(outerRing);
    // Discard tiny sliver micro-islands
    if (outerArea < minPolyArea) continue;

    const cleanedRings: number[][][] = [];

    // Outer boundary must be clockwise in d3-geo
    const outerSigned = getRingSignedArea(outerRing);
    cleanedRings.push(outerSigned < 0 ? [...outerRing].reverse() : outerRing);

    // Process holes / enclaves
    for (let r = 1; r < poly.length; r++) {
      const holeRing = poly[r];
      if (!holeRing || holeRing.length < 4) continue;

      const holeArea = getRingArea(holeRing);
      // Discard micro-gaps from mismatched GIS vertices along shared borders
      if (holeArea < minHoleArea) continue;

      // Legitimate interior enclave (must be counter-clockwise in d3-geo)
      const holeSigned = getRingSignedArea(holeRing);
      cleanedRings.push(holeSigned > 0 ? [...holeRing].reverse() : holeRing);
    }

    if (cleanedRings.length > 0) {
      cleanedPolys.push(cleanedRings);
    }
  }

  return cleanedPolys;
}

/**
 * Union and dissolve member provinces belonging to the same alliance
 * into a single unified outer perimeter border SVG path without internal line collisions.
 */
export function getMergedAlliancePath(
  memberProvinces: ProcessedProvince[],
  minHoleArea: number = 0.05,
  minPolyArea: number = 0.005
): string {
  if (!memberProvinces || memberProvinces.length === 0) return '';
  if (memberProvinces.length === 1) return memberProvinces[0].pathD;

  try {
    const geometries: any[] = [];
    for (const p of memberProvinces) {
      const geom = p.rawFeature?.geometry;
      if (!geom || !geom.coordinates) continue;
      if (geom.type === 'Polygon' || geom.type === 'MultiPolygon') {
        geometries.push(geom.coordinates);
      }
    }

    if (geometries.length === 0) {
      return memberProvinces.map(p => p.pathD).join(' ');
    }
    if (geometries.length === 1) {
      return memberProvinces[0].pathD;
    }

    // Resolve union function safely across bundler formats
    const unionFn = typeof polygonClipping === 'function'
      ? polygonClipping
      : (polygonClipping as any).union ||
        (polygonClipping as any).default?.union ||
        (polygonClipping as any).default;

    if (typeof unionFn !== 'function') {
      return memberProvinces.map(p => p.pathD).join(' ');
    }

    // polygon-clipping union takes (poly1, poly2, ...)
    const unionResult = unionFn(geometries[0], ...geometries.slice(1));
    if (!unionResult || !Array.isArray(unionResult) || unionResult.length === 0) {
      return memberProvinces.map(p => p.pathD).join(' ');
    }

    const correctedCoordinates = cleanAndFixMultiPolygon(unionResult, minHoleArea, minPolyArea);

    if (!correctedCoordinates || correctedCoordinates.length === 0) {
      return memberProvinces.map(p => p.pathD).join(' ');
    }

    const mergedFeature: any = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'MultiPolygon',
        coordinates: correctedCoordinates
      }
    };

    const d = geoPathGenerator(mergedFeature);
    return d || memberProvinces.map(p => p.pathD).join(' ');
  } catch (err) {
    console.warn('Could not compute united alliance boundary polygon, falling back:', err);
    return memberProvinces.map(p => p.pathD).join(' ');
  }
}


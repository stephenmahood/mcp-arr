import { createHash } from 'node:crypto';

function revisionOf(value: unknown): string {
  const stable = (v: unknown): unknown => Array.isArray(v) ? v.map(stable) : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).sort(([a],[b]) => a.localeCompare(b)).map(([k,x]) => [k,stable(x)])) : v;
  return createHash('sha256').update(JSON.stringify(stable(value))).digest('hex');
}

/**
 * *arr Suite API Client
 *
 * All *arr applications (Sonarr, Radarr, Lidarr, Prowlarr) use
 * the same REST API pattern with X-Api-Key header authentication.
 */

export type ArrService = 'sonarr' | 'radarr' | 'lidarr' | 'prowlarr';

export interface ArrConfig {
  url: string;
  apiKey: string;
}

export interface SystemStatus {
  appName: string;
  version: string;
  buildTime: string;
  isDebug: boolean;
  isProduction: boolean;
  isAdmin: boolean;
  isUserInteractive: boolean;
  startupPath: string;
  appData: string;
  osName: string;
  isDocker: boolean;
  isLinux: boolean;
  isOsx: boolean;
  isWindows: boolean;
}

export interface QueueItem {
  id: number;
  title: string;
  status: string;
  trackedDownloadStatus: string;
  trackedDownloadState: string;
  statusMessages: Array<{ title: string; messages: string[] }>;
  downloadId: string;
  protocol: string;
  downloadClient: string;
  outputPath: string;
  sizeleft: number;
  size: number;
  timeleft: string;
  estimatedCompletionTime: string;
}

export interface Series {
  id: number;
  title: string;
  sortTitle: string;
  status: string;
  overview: string;
  network: string;
  airTime: string;
  images: Array<{ coverType: string; url: string }>;
  seasons: Array<{ seasonNumber: number; monitored: boolean }>;
  year: number;
  path: string;
  qualityProfileId: number;
  seasonFolder: boolean;
  monitored: boolean;
  runtime: number;
  tvdbId: number;
  tvRageId: number;
  tvMazeId: number;
  firstAired: string;
  seriesType: string;
  cleanTitle: string;
  imdbId: string;
  titleSlug: string;
  genres: string[];
  tags: number[];
  added: string;
  ratings: { votes: number; value: number };
  statistics: {
    seasonCount: number;
    episodeFileCount: number;
    episodeCount: number;
    totalEpisodeCount: number;
    sizeOnDisk: number;
    percentOfEpisodes: number;
  };
}

export interface Episode {
  id: number;
  seriesId: number;
  tvdbId: number;
  episodeFileId: number;
  seasonNumber: number;
  episodeNumber: number;
  title: string;
  airDate: string;
  airDateUtc: string;
  overview: string;
  hasFile: boolean;
  monitored: boolean;
  absoluteEpisodeNumber: number;
  unverifiedSceneNumbering: boolean;
  episodeFile?: {
    id: number;
    relativePath: string;
    path: string;
    size: number;
    dateAdded: string;
    quality: { quality: { id: number; name: string } };
  };
}

export interface SonarrRelease {
  guid?: string;
  indexerId?: number;
  title?: string;
  size?: number;
  indexer?: string;
  protocol?: string;
  quality?: { quality?: { name?: string; resolution?: number } };
  languages?: Array<{ name?: string }>;
  rejected?: boolean;
  rejections?: string[];
  customFormatScore?: number;
  seeders?: number;
  leechers?: number;
  age?: number;
  downloadAllowed?: boolean;
}

export interface SonarrEpisodeFile {
  id: number;
  seriesId: number;
  seasonNumber: number;
  relativePath: string;
  size: number;
  sceneName?: string;
  releaseGroup?: string;
  quality?: { quality?: { name?: string; resolution?: number } };
  mediaInfo?: Record<string, unknown>;
}

export interface Movie {
  id: number;
  title: string;
  sortTitle: string;
  sizeOnDisk: number;
  status: string;
  overview: string;
  inCinemas: string;
  physicalRelease: string;
  digitalRelease: string;
  images: Array<{ coverType: string; url: string }>;
  website: string;
  year: number;
  hasFile: boolean;
  youTubeTrailerId: string;
  studio: string;
  path: string;
  qualityProfileId: number;
  monitored: boolean;
  minimumAvailability: string;
  isAvailable: boolean;
  folderName: string;
  runtime: number;
  cleanTitle: string;
  imdbId: string;
  tmdbId: number;
  titleSlug: string;
  genres: string[];
  tags: number[];
  added: string;
  ratings: Record<string, { votes: number; value: number; type: string }>;
  movieFile?: {
    id: number;
    relativePath: string;
    path: string;
    size: number;
    dateAdded: string;
    quality: { quality: { id: number; name: string; source?: string; resolution?: number } };
    mediaInfo?: {
      audioBitrate: number;
      audioChannels: number;
      audioCodec: string;
      audioLanguages: string;
      audioStreamCount: number;
      videoBitDepth: number;
      videoBitrate: number;
      videoCodec: string;
      videoDynamicRange: string;
      videoDynamicRangeType: string;
      videoFps: number;
      resolution: string;
      runTime: string;
      scanType: string;
      subtitles: string;
    };
  };
}

export interface Album {
  id: number;
  title: string;
  disambiguation: string;
  overview: string;
  artistId: number;
  foreignAlbumId: string;
  monitored: boolean;
  anyReleaseOk: boolean;
  profileId: number;
  duration: number;
  albumType: string;
  genres: string[];
  images: Array<{ coverType: string; url: string }>;
  links: Array<{ url: string; name: string }>;
  statistics?: {
    trackFileCount: number;
    trackCount: number;
    totalTrackCount: number;
    sizeOnDisk: number;
    percentOfTracks: number;
  };
  releaseDate: string;
  releases: Array<{
    id: number;
    albumId: number;
    foreignReleaseId: string;
    title: string;
    status: string;
    duration: number;
    trackCount: number;
    monitored: boolean;
  }>;
  grabbed: boolean;
}

export interface Artist {
  id: number;
  artistName: string;
  sortName: string;
  status: string;
  overview: string;
  artistType: string;
  disambiguation: string;
  links: Array<{ url: string; name: string }>;
  images: Array<{ coverType: string; url: string }>;
  path: string;
  qualityProfileId: number;
  metadataProfileId: number;
  monitored: boolean;
  monitorNewItems: string;
  genres: string[];
  cleanName: string;
  foreignArtistId: string;
  tags: number[];
  added: string;
  ratings: { votes: number; value: number };
  statistics: {
    albumCount: number;
    trackFileCount: number;
    trackCount: number;
    totalTrackCount: number;
    sizeOnDisk: number;
    percentOfTracks: number;
  };
}

export interface Indexer {
  id: number;
  name: string;
  enableRss: boolean;
  enableAutomaticSearch: boolean;
  enableInteractiveSearch: boolean;
  protocol: string;
  priority: number;
  added: string;
}

// Configuration interfaces
export interface QualityProfile {
  id: number;
  name: string;
  upgradeAllowed: boolean;
  cutoff: number;
  items: Array<{
    id?: number;
    name?: string;
    quality?: { id: number; name: string; source: string; resolution: number };
    items?: Array<{ quality: { id: number; name: string } }>;
    allowed: boolean;
  }>;
  minFormatScore: number;
  cutoffFormatScore: number;
  formatItems: Array<{
    format: number;
    name: string;
    score: number;
  }>;
}

export interface QualityDefinition {
  id: number;
  quality: {
    id: number;
    name: string;
    source: string;
    resolution: number;
  };
  title: string;
  weight: number;
  minSize: number;
  maxSize?: number | null;
  preferredSize?: number | null;
}

export interface DownloadClient {
  id: number;
  name: string;
  implementation: string;
  implementationName: string;
  configContract: string;
  enable: boolean;
  protocol: string;
  priority: number;
  removeCompletedDownloads: boolean;
  removeFailedDownloads: boolean;
  fields: Array<{
    name: string;
    value: unknown;
  }>;
  tags: number[];
}

export interface NamingConfig {
  renameEpisodes?: boolean;
  replaceIllegalCharacters: boolean;
  colonReplacementFormat?: string;
  standardEpisodeFormat?: string;
  dailyEpisodeFormat?: string;
  animeEpisodeFormat?: string;
  seriesFolderFormat?: string;
  seasonFolderFormat?: string;
  specialsFolderFormat?: string;
  multiEpisodeStyle?: number;
  // Radarr
  renameMovies?: boolean;
  movieFolderFormat?: string;
  standardMovieFormat?: string;
  // Lidarr
  renameTracks?: boolean;
  artistFolderFormat?: string;
  albumFolderFormat?: string;
  trackFormat?: string;
}

export interface MediaManagementConfig {
  autoUnmonitorPreviouslyDownloadedEpisodes?: boolean;
  autoUnmonitorPreviouslyDownloadedMovies?: boolean;
  recycleBin: string;
  recycleBinCleanupDays: number;
  downloadPropersAndRepacks: string;
  createEmptySeriesFolders?: boolean;
  createEmptyMovieFolders?: boolean;
  deleteEmptyFolders: boolean;
  fileDate: string;
  rescanAfterRefresh: string;
  setPermissionsLinux: boolean;
  chmodFolder: string;
  chownGroup: string;
  episodeTitleRequired?: string;
  skipFreeSpaceCheckWhenImporting: boolean;
  minimumFreeSpaceWhenImporting: number;
  copyUsingHardlinks: boolean;
  importExtraFiles: boolean;
  extraFileExtensions: string;
  enableMediaInfo: boolean;
}

export interface HealthCheck {
  source: string;
  type: string;
  message: string;
  wikiUrl: string;
}

export interface Tag {
  id: number;
  label: string;
}

export interface RootFolder {
  id: number;
  path: string;
  accessible: boolean;
  freeSpace: number;
  unmappedFolders?: Array<{ name: string; path: string }>;
}

export interface MetadataProfile {
  id: number;
  name: string;
  minPopularity?: number;
  skipMissingDate: boolean;
  skipMissingIsbn: boolean;
  skipPartsAndSets: boolean;
  skipSeriesSecondary: boolean;
  allowedLanguages?: string;
  minPages?: number;
}

export interface SearchResult {
  title: string;
  sortTitle: string;
  status: string;
  overview: string;
  year: number;
  images: Array<{ coverType: string; url: string }>;
  remotePoster?: string;
  // Sonarr specific
  tvdbId?: number;
  // Radarr specific
  tmdbId?: number;
  imdbId?: string;
  // Lidarr specific
  foreignArtistId?: string;
  artistName?: string;
  disambiguation?: string;
}

export class ArrClient {
  private config: ArrConfig;
  private serviceName: ArrService;
  protected apiVersion: string = 'v3';

  constructor(serviceName: ArrService, config: ArrConfig) {
    this.serviceName = serviceName;
    this.config = {
      url: config.url.replace(/\/$/, ''),
      apiKey: config.apiKey
    };
  }

  /**
   * Make an API request
   */
  protected async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.config.url}/api/${this.apiVersion}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Api-Key': this.config.apiKey,
      ...(options.headers as Record<string, string> || {}),
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`${this.serviceName} API error: ${response.status} ${response.statusText} - ${text}`);
    }

    // Queue DELETE endpoints can return 200 with no body or 204.
    if (options.method === 'DELETE') {
      const body = await response.text();
      return (body.trim() ? JSON.parse(body) : undefined) as T;
    }
    return response.json() as Promise<T>;
  }

  /**
   * Get system status
   */
  async getStatus(): Promise<SystemStatus> {
    return this.request<SystemStatus>('/system/status');
  }

  /**
   * Get download queue
   */
  async getQueue(page = 1, pageSize = 100): Promise<{ records: QueueItem[]; totalRecords: number }> {
    const params = new URLSearchParams({
      includeUnknownSeriesItems: "true",
      includeUnknownMovieItems: "true",
      page: String(page),
      pageSize: String(pageSize),
    });
    return this.request<{ records: QueueItem[]; totalRecords: number }>(`/queue?${params.toString()}`);
  }

  /** Remove a queue item through *arr, optionally deleting the client download/data. */
  async deleteQueueItem(queueId: number, options: { removeFromClient?: boolean; blocklist?: boolean; skipRedownload?: boolean } = {}): Promise<void> {
    if (!Number.isSafeInteger(queueId) || queueId <= 0) {
      throw new Error('queueId must be a positive safe integer from the download queue');
    }
    const { removeFromClient = true, blocklist = false, skipRedownload = false } = options;
    for (const [name, value] of Object.entries({ removeFromClient, blocklist, skipRedownload })) {
      if (typeof value !== 'boolean') throw new Error(`${name} must be a boolean`);
    }
    // Explicit false matters: the API defaults removeFromClient to true.
    const params = new URLSearchParams({
      removeFromClient: String(removeFromClient),
      blocklist: String(blocklist),
      skipRedownload: String(skipRedownload),
    });
    try {
      await this.request<void>(`/queue/${queueId}?${params}`, { method: 'DELETE' });
    } catch {
      throw new Error(`${this.serviceName} queue deletion was not confirmed. Check the queue and download client before retrying; the item may already have been removed.`);
    }
  }

  /**
   * Get calendar items (upcoming releases)
   */
  async getCalendar(start?: string, end?: string): Promise<unknown[]> {
    const params = new URLSearchParams();
    if (start) params.append('start', start);
    if (end) params.append('end', end);
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request<unknown[]>(`/calendar${query}`);
  }

  /**
   * Get all root folders
   */
  async getRootFolders(): Promise<Array<{ id: number; path: string; freeSpace: number }>> {
    return this.request<Array<{ id: number; path: string; freeSpace: number }>>('/rootfolder');
  }

  /**
   * Test connection
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.getStatus();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get quality profiles
   */
  async getQualityProfiles(): Promise<QualityProfile[]> {
    return this.request<QualityProfile[]>('/qualityprofile');
  }

  async getQualityProfileConfig(profileId: number): Promise<{profile: QualityProfile; revision: string}> {
    if (!Number.isSafeInteger(profileId) || profileId <= 0) throw new Error('Invalid profile ID');
    const profile = await this.request<QualityProfile>(`/qualityprofile/${profileId}`);
    if (profile.id !== profileId) throw new Error('Profile identity mismatch');
    return {profile, revision: revisionOf(profile)};
  }

  async setQualityProfileLayout(input: {
    profileId: number; expectedName: string; allowedQualityIds: number[];
    orderedItemIds: number[]; cutoff: number; newName?: string;
    expectedRevision?: string; apply?: boolean;
  }): Promise<unknown> {
    const validIds = (v: unknown): v is number[] => Array.isArray(v) && v.length > 0 &&
      v.length <= 100 && v.every(x => Number.isSafeInteger(x) && x >= 0) && new Set(v).size === v.length;
    if (!input || !validIds(input.allowedQualityIds) || !validIds(input.orderedItemIds) ||
        !Number.isSafeInteger(input.cutoff) || input.cutoff < 0 ||
        typeof input.expectedName !== 'string' || !input.expectedName.trim() ||
        (input.newName !== undefined && (typeof input.newName !== 'string' || !input.newName.trim() || input.newName.length > 100)) ||
        (input.apply !== undefined && typeof input.apply !== 'boolean')) throw new Error('Invalid profile layout');
    const {profile: original, revision} = await this.getQualityProfileConfig(input.profileId);
    if (original.name !== input.expectedName) throw new Error('Profile identity mismatch');
    if (input.apply && input.expectedRevision !== revision) throw new Error('Profile changed or preview revision missing; preview again');
    const itemId = (item: QualityProfile['items'][number]) => item.quality?.id ?? item.id;
    const currentIds = original.items.map(itemId);
    if (currentIds.some(id => id === undefined) || input.orderedItemIds.length !== currentIds.length ||
        input.orderedItemIds.some(id => !currentIds.includes(id))) throw new Error('Order must contain every existing top-level item exactly once');
    const leafIds = original.items.flatMap(item => item.quality ? [item.quality.id] : (item.items ?? []).map(c => c.quality.id));
    if (input.allowedQualityIds.some(id => !leafIds.includes(id))) throw new Error('Unknown quality ID');
    const proposed: QualityProfile = structuredClone(original);
    for (const item of proposed.items) {
      if (item.quality) item.allowed = input.allowedQualityIds.includes(item.quality.id);
      else {
        for (const child of item.items ?? []) Object.assign(child, {allowed: input.allowedQualityIds.includes(child.quality.id)});
        item.allowed = (item.items ?? []).some(c => input.allowedQualityIds.includes(c.quality.id));
      }
    }
    proposed.items = input.orderedItemIds.map(id => proposed.items.find(item => itemId(item) === id)!);
    if (!proposed.items.some(item => itemId(item) === input.cutoff && item.allowed)) throw new Error('Cutoff must identify an enabled top-level quality or group');
    proposed.cutoff = input.cutoff;
    if (input.newName !== undefined) proposed.name = input.newName.trim();
    if (proposed.name !== original.name && (await this.getQualityProfiles()).some(p => p.id !== input.profileId && p.name.toLowerCase() === proposed.name.toLowerCase())) throw new Error('Profile name already exists');
    if (!input.apply) return {applied: false, original, proposed, revision};
    try { await this.request(`/qualityprofile/${input.profileId}`, {method:'PUT', body:JSON.stringify(proposed)}); }
    catch { throw new Error('Profile update outcome uncertain; read current profile before retrying'); }
    const {profile: updated} = await this.getQualityProfileConfig(input.profileId);
    return {applied: true, verified: revisionOf(updated) === revisionOf(proposed), original, proposed, updated};
  }

  async upsertCustomFormat(input: {
    name: string; specifications: Array<Record<string, unknown>>; formatId?: number;
    includeCustomFormatWhenRenaming?: boolean; expectedRevision?: string; apply?: boolean;
  }): Promise<unknown> {
    if (!input || typeof input.name !== 'string' || !input.name.trim() || input.name.length > 100 ||
        !Array.isArray(input.specifications) || !input.specifications.length || input.specifications.length > 250 ||
        input.specifications.some(s => !s || typeof s !== 'object' || Array.isArray(s) ||
          typeof s.name !== 'string' || !s.name.trim() || typeof s.implementation !== 'string' ||
          typeof s.negate !== 'boolean' || typeof s.required !== 'boolean' ||
          !Array.isArray(s.fields) || s.fields.some((f: unknown) => !f || typeof f !== 'object' || typeof (f as {name?:unknown}).name !== 'string' || !Object.prototype.hasOwnProperty.call(f, 'value'))) ||
        (input.formatId !== undefined && (!Number.isSafeInteger(input.formatId) || input.formatId <= 0)) ||
        (input.apply !== undefined && typeof input.apply !== 'boolean') ||
        (input.includeCustomFormatWhenRenaming !== undefined && typeof input.includeCustomFormatWhenRenaming !== 'boolean')) throw new Error('Invalid custom format definition');
    const formats = await this.getCustomFormats();
    const original = input.formatId === undefined ? null : formats.find(f => f.id === input.formatId);
    if (input.formatId !== undefined && (!original || original.name !== input.name)) throw new Error('Custom format identity mismatch');
    if (formats.some(f => f.id !== input.formatId && f.name.toLowerCase() === input.name.toLowerCase())) throw new Error('Custom format name already exists; inspect and use its ID to update');
    const revision = revisionOf(original ?? null);
    if (input.apply && input.expectedRevision !== revision) throw new Error('Custom format changed or preview revision missing; preview again');
    const proposed = {...original, name:input.name, specifications:input.specifications,
      includeCustomFormatWhenRenaming: input.includeCustomFormatWhenRenaming ?? original?.includeCustomFormatWhenRenaming ?? false};
    if (!input.apply) return {applied:false, original:original ?? null, proposed, revision};
    let saved: {id:number};
    try { saved = await this.request(input.formatId === undefined ? '/customformat' : `/customformat/${input.formatId}`, {method:input.formatId === undefined ? 'POST':'PUT',body:JSON.stringify(proposed)}); }
    catch { throw new Error('Custom format write outcome uncertain; inspect formats before retrying'); }
    const updated = (await this.getCustomFormats()).find(f => f.id === saved.id);
    // The server adds field metadata; compare only caller-supplied definition keys.
    const contains = (actual: unknown, expected: unknown): boolean => {
      if (Array.isArray(expected)) return Array.isArray(actual) && actual.length === expected.length && expected.every((v,i) => contains(actual[i],v));
      if (expected && typeof expected === 'object') return !!actual && typeof actual === 'object' && Object.entries(expected).every(([k,v]) => contains((actual as Record<string,unknown>)[k],v));
      return actual === expected;
    };
    return {applied:true, verified:contains(updated,proposed), original:original ?? null, proposed, updated};
  }

  async getCustomFormats(): Promise<Array<Record<string, unknown> & {id: number; name: string}>> {
    return this.request<Array<Record<string, unknown> & {id: number; name: string}>>('/customformat');
  }

  async createCustomFormat(input: { name: string; specifications: Array<Record<string, unknown>> }, apply: boolean): Promise<unknown> {
    const existing = await this.getCustomFormats();
    if (existing.some(f => f.name.toLowerCase() === input.name.toLowerCase())) {
      throw new Error('A custom format with this name already exists');
    }
    const payload = { name: input.name, includeCustomFormatWhenRenaming: false, specifications: input.specifications };
    if (!apply) return { applied: false, proposed: payload, existingNames: existing.map(x => x.name) };
    return { applied: true, created: await this.request<unknown>('/customformat', {method: 'POST', body: JSON.stringify(payload)}) };
  }

  async patchQualityProfile(id: number, patch: { upgradeAllowed?: boolean; cutoff?: number; minFormatScore?: number; cutoffFormatScore?: number; formatScores?: Array<{ formatId: number; score: number }> }, apply: boolean, expectedName?: string): Promise<unknown> {
    const original = await this.request<QualityProfile>(`/qualityprofile/${id}`);
    if (original.id !== id || (expectedName && original.name !== expectedName)) throw new Error('Profile identity mismatch');
    const proposed: QualityProfile = JSON.parse(JSON.stringify(original));
    if (patch.upgradeAllowed !== undefined) proposed.upgradeAllowed = patch.upgradeAllowed;
    if (patch.cutoff !== undefined) proposed.cutoff = patch.cutoff;
    if (patch.minFormatScore !== undefined) proposed.minFormatScore = patch.minFormatScore;
    if (patch.cutoffFormatScore !== undefined) proposed.cutoffFormatScore = patch.cutoffFormatScore;
    for (const v of patch.formatScores ?? []) {
      let item = proposed.formatItems.find(x => x.format === v.formatId);
      if (!item) {
        const format = (await this.getCustomFormats()).find(x => x.id === v.formatId);
        if (!format) throw new Error(`Custom format ID ${v.formatId} does not exist`);
        item = { format: v.formatId, name: format.name, score: 0 };
        proposed.formatItems.push(item);
      }
      item.score = v.score;
    }
    if (!apply) return { applied: false, original, proposed };
    const updated = await this.request<QualityProfile>(`/qualityprofile/${id}`, {method: 'PUT', body: JSON.stringify(proposed)});
    return { applied: true, original, updated };
  }

  /** Patch one size definition; return rollback data and verify persisted values. */
  async patchQualityDefinition(input: {
    definitionId: number; expectedQuality: string; minSize: number;
    preferredSize: number | null; maxSize: number | null; apply?: boolean;
  }): Promise<unknown> {
    const validSize = (v: unknown) => typeof v === 'number' && Number.isFinite(v) && v >= 0 && v <= 2000;
    if (!input || !Number.isSafeInteger(input.definitionId) || input.definitionId <= 0 ||
        typeof input.expectedQuality !== 'string' || !input.expectedQuality.trim() ||
        !validSize(input.minSize) ||
        (input.preferredSize !== null && !validSize(input.preferredSize)) ||
        (input.maxSize !== null && !validSize(input.maxSize)) ||
        (input.apply !== undefined && typeof input.apply !== 'boolean') ||
        (input.maxSize !== null && (input.minSize > input.maxSize || input.preferredSize === null || input.preferredSize > input.maxSize)) ||
        (input.preferredSize !== null && input.preferredSize < input.minSize)) {
      throw new Error('Invalid size definition: require 0 <= minimum <= preferred <= maximum, or null for unlimited');
    }
    const original = (await this.getQualityDefinitions()).find(d => d.id === input.definitionId);
    if (!original || original.quality.name !== input.expectedQuality) throw new Error('Quality definition identity mismatch');
    const proposed = { ...original, minSize: input.minSize, preferredSize: input.preferredSize, maxSize: input.maxSize };
    if (input.apply !== true) return { applied: false, original, proposed };
    try {
      await this.request(`/qualitydefinition/${input.definitionId}`, {method: 'PUT', body: JSON.stringify(proposed)});
    } catch {
      throw new Error('Quality definition update outcome uncertain; read definitions before retrying');
    }
    const updated = (await this.getQualityDefinitions()).find(d => d.id === input.definitionId);
    const verified = updated?.quality.name === input.expectedQuality &&
      updated.minSize === proposed.minSize &&
      (updated.preferredSize ?? null) === proposed.preferredSize &&
      (updated.maxSize ?? null) === proposed.maxSize;
    return { applied: true, verified, original, proposed, updated };
  }

  /**
   * Get quality definitions (size limits)
   */
  async getQualityDefinitions(): Promise<QualityDefinition[]> {
    return this.request<QualityDefinition[]>('/qualitydefinition');
  }

  /**
   * Get download clients
   */
  async getDownloadClients(): Promise<DownloadClient[]> {
    return this.request<DownloadClient[]>('/downloadclient');
  }

  /**
   * Get naming configuration
   */
  async getNamingConfig(): Promise<NamingConfig> {
    return this.request<NamingConfig>('/config/naming');
  }

  /**
   * Get media management configuration
   */
  async getMediaManagement(): Promise<MediaManagementConfig> {
    return this.request<MediaManagementConfig>('/config/mediamanagement');
  }

  /**
   * Get health check issues
   */
  async getHealth(): Promise<HealthCheck[]> {
    return this.request<HealthCheck[]>('/health');
  }

  /**
   * Get all tags
   */
  async getTags(): Promise<Tag[]> {
    return this.request<Tag[]>('/tag');
  }

  /**
   * Get detailed root folders
   */
  async getRootFoldersDetailed(): Promise<RootFolder[]> {
    return this.request<RootFolder[]>('/rootfolder');
  }

  /**
   * Get indexers (per-app configuration, not Prowlarr)
   */
  async getIndexers(): Promise<Indexer[]> {
    return this.request<Indexer[]>('/indexer');
  }
}

// Service-specific clients

export class SonarrClient extends ArrClient {
  constructor(config: ArrConfig) {
    super('sonarr', config);
  }

  /**
   * Get all series
   */
  async getSeries(): Promise<Series[]> {
    return this['request']<Series[]>('/series');
  }

  /**
   * Get a specific series
   */
  async getSeriesById(id: number): Promise<Series> {
    return this['request']<Series>(`/series/${id}`);
  }

  /**
   * Search for series
   */
  async searchSeries(term: string): Promise<SearchResult[]> {
    return this['request']<SearchResult[]>(`/series/lookup?term=${encodeURIComponent(term)}`);
  }

  /**
   * Add a series
   */
  async addSeries(series: Partial<Series> & { tvdbId: number; rootFolderPath: string; qualityProfileId: number }): Promise<Series> {
    return this['request']<Series>('/series', {
      method: 'POST',
      body: JSON.stringify({
        ...series,
        monitored: series.monitored ?? true,
        seasonFolder: series.seasonFolder ?? true,
        addOptions: {
          searchForMissingEpisodes: true,
        },
      }),
    });
  }

  /**
   * Trigger a search for missing episodes
   */
  async searchMissing(seriesId: number): Promise<{ id: number }> {
    return this['request']<{ id: number }>('/command', {
      method: 'POST',
      body: JSON.stringify({
        name: 'SeriesSearch',
        seriesId,
      }),
    });
  }

  /**
   * Get episodes for a series, optionally filtered by season
   */
  async getEpisodes(seriesId: number, seasonNumber?: number): Promise<Episode[]> {
    let url = `/episode?seriesId=${seriesId}`;
    if (seasonNumber !== undefined) {
      url += `&seasonNumber=${seasonNumber}`;
    }
    return this['request']<Episode[]>(url);
  }

  /**
   * Retrieve Sonarr episode-file metadata without reading media files.
   */
  async getEpisodeFiles(seriesId: number): Promise<SonarrEpisodeFile[]> {
    return this['request']<SonarrEpisodeFile[]>(`/episodefile?seriesId=${seriesId}`);
  }

  /**
   * Query indexer releases for an episode without grabbing a release.
   * Sonarr GET /release performs an interactive/manual search.
   */
  async getEpisodeReleases(episodeId: number): Promise<SonarrRelease[]> {
    return this['request']<SonarrRelease[]>(`/release?episodeId=${episodeId}`);
  }

  /**
   * Manually grab an exact indexer release. Re-check availability against the
   * episode's interactive results before posting to Sonarr.
   */
  async grabEpisodeRelease(episodeId: number, indexerId: number, guid: string): Promise<unknown> {
    const releases = await this.getEpisodeReleases(episodeId);
    const release = releases.find(r => r.indexerId === indexerId && r.guid === guid);
    if (!release) throw new Error("Selected release is no longer available for this episode");
    if (release.downloadAllowed === false) throw new Error("Sonarr reports that this release cannot be downloaded");
    return this['request']<unknown>('/release', {
      method: 'POST',
      body: JSON.stringify({ guid, indexerId }),
    });
  }

  /**
   * Search for a specific episode
   */
  async searchEpisode(episodeIds: number[]): Promise<{ id: number }> {
    return this['request']<{ id: number }>('/command', {
      method: 'POST',
      body: JSON.stringify({
        name: 'EpisodeSearch',
        episodeIds,
      }),
    });
  }

  /**
   * Trigger a refresh for a specific series
   */
  async refreshSeries(seriesId: number): Promise<{ id: number }> {
    return this['request']<{ id: number }>('/command', {
      method: 'POST',
      body: JSON.stringify({
        name: 'RefreshSeries',
        seriesId,
      }),
    });
  }
}

export interface RadarrRelease extends SonarrRelease {}
export interface ManualImportCandidate {
  path: string;
  folderName?: string;
  size: number;
  movie?: { id: number };
  quality: { quality: { id: number }; [key: string]: unknown };
  languages: Array<{ id: number; name: string }>;
  releaseGroup?: string;
  indexerFlags?: number;
  downloadId?: string;
  rejections?: Array<{ reason: string; type?: string }>;
}
export interface ManualImportSelection {
  path: string;
  movieId: number;
  expectedSizeBytes: number;
  acknowledgedRejections?: string[];
}
export interface ManualImportScope { folder?: string; downloadId?: string }

export interface RadarrMovieFile {
  id: number; movieId: number; relativePath: string; size: number;
  sceneName?: string; releaseGroup?: string;
  quality?: { quality?: { name?: string; resolution?: number } };
  mediaInfo?: Record<string, unknown>;
}

export class RadarrClient extends ArrClient {
  constructor(config: ArrConfig) {
    super('radarr', config);
  }

  async getManualImportCandidates(scope: ManualImportScope): Promise<ManualImportCandidate[]> {
    if (!scope || (!scope.folder && !scope.downloadId)) {
      throw new Error('Provide a folder or downloadId to inspect');
    }
    const params = new URLSearchParams({ filterExistingFiles: 'true' });
    for (const key of ['folder', 'downloadId'] as const) {
      if (scope[key] !== undefined) {
        if (typeof scope[key] !== 'string' || !scope[key]!.trim() || scope[key]!.length > 4096) {
          throw new Error(`Invalid ${key}`);
        }
        params.set(key, scope[key]!);
      }
    }
    return this.request<ManualImportCandidate[]>(`/manualimport?${params}`);
  }

  async manualImport(scope: ManualImportScope, files: ManualImportSelection[], importMode: string, confirmed: boolean): Promise<unknown> {
    if (confirmed !== true) throw new Error('Explicit confirmation is required for manual import');
    if (!['auto', 'copy', 'move'].includes(importMode)) throw new Error('Invalid importMode');
    if (!Array.isArray(files) || files.length < 1 || files.length > 25) throw new Error('Select 1 to 25 files');
    const paths = new Set<string>();
    for (const file of files) {
      if (!file || typeof file.path !== 'string' || !file.path.trim() || paths.has(file.path) ||
          !Number.isSafeInteger(file.movieId) || file.movieId <= 0 ||
          !Number.isSafeInteger(file.expectedSizeBytes) || file.expectedSizeBytes <= 0 ||
          (file.acknowledgedRejections !== undefined && (!Array.isArray(file.acknowledgedRejections) ||
            file.acknowledgedRejections.some(r => typeof r !== 'string')))) {
        throw new Error('Invalid or duplicate file selection');
      }
      paths.add(file.path);
    }
    // Re-scan immediately before submission; never accept caller-supplied quality or language claims.
    const candidates = await this.getManualImportCandidates(scope);
    const selected = files.map(file => {
      const candidate = candidates.find(c => c.path === file.path);
      if (!candidate || candidate.movie?.id !== file.movieId || candidate.size !== file.expectedSizeBytes) {
        throw new Error('Selected file changed or movie mapping is unresolved; inspect candidates again');
      }
      if (!candidate.quality?.quality?.id || !candidate.languages?.length || candidate.languages.some(l => !l.id)) {
        throw new Error('Resolve unknown quality or languages before importing');
      }
      const reasons = (candidate.rejections ?? []).map(r => r.reason);
      const acknowledged = file.acknowledgedRejections ?? [];
      if (reasons.some(r => !acknowledged.includes(r)) || acknowledged.some(r => !reasons.includes(r))) {
        throw new Error('Import rejections changed or were not explicitly acknowledged; inspect candidates again');
      }
      return {
        path: candidate.path, folderName: candidate.folderName, movieId: file.movieId,
        quality: candidate.quality, languages: candidate.languages,
        releaseGroup: candidate.releaseGroup, indexerFlags: candidate.indexerFlags,
        downloadId: candidate.downloadId || scope.downloadId,
      };
    });
    return this.request('/command', { method: 'POST', body: JSON.stringify({ name: 'ManualImport', files: selected, importMode }) });
  }

  async getCommand(commandId: number): Promise<unknown> {
    if (!Number.isSafeInteger(commandId) || commandId <= 0) throw new Error('Invalid commandId');
    return this.request(`/command/${commandId}`);
  }

  async getMovieFiles(movieId: number): Promise<RadarrMovieFile[]> {
    return this['request']<RadarrMovieFile[]>(`/moviefile?movieId=${movieId}`);
  }
  async getMovieReleases(movieId: number): Promise<RadarrRelease[]> {
    return this['request']<RadarrRelease[]>(`/release?movieId=${movieId}`);
  }
  async grabMovieRelease(movieId: number, indexerId: number, guid: string): Promise<unknown> {
    const releases = await this.getMovieReleases(movieId);
    const release = releases.find(r => r.indexerId === indexerId && r.guid === guid);
    if (!release) throw new Error("Selected release is no longer available for this movie");
    if (release.downloadAllowed === false) throw new Error("Radarr reports that this release cannot be downloaded");
    return this['request']<unknown>('/release', {method:'POST',body:JSON.stringify({guid,indexerId})});
  }

  /**
   * Get all movies
   */
  async getMovies(): Promise<Movie[]> {
    return this['request']<Movie[]>('/movie');
  }

  /**
   * Get a specific movie
   */
  async getMovieById(id: number): Promise<Movie> {
    return this['request']<Movie>(`/movie/${id}`);
  }

  /**
   * Search for movies
   */
  async searchMovies(term: string): Promise<SearchResult[]> {
    return this['request']<SearchResult[]>(`/movie/lookup?term=${encodeURIComponent(term)}`);
  }

  /**
   * Add a movie
   */
  async addMovie(movie: Partial<Movie> & { tmdbId: number; rootFolderPath: string; qualityProfileId: number }): Promise<Movie> {
    return this['request']<Movie>('/movie', {
      method: 'POST',
      body: JSON.stringify({
        ...movie,
        monitored: movie.monitored ?? true,
        addOptions: {
          searchForMovie: true,
        },
      }),
    });
  }

  /**
   * Trigger a search for a movie
   */
  async searchMovie(movieId: number): Promise<{ id: number }> {
    return this['request']<{ id: number }>('/command', {
      method: 'POST',
      body: JSON.stringify({
        name: 'MoviesSearch',
        movieIds: [movieId],
      }),
    });
  }

  /**
   * Trigger a search for multiple movies at once
   */
  async searchMoviesBulk(movieIds: number[]): Promise<{ id: number }> {
    return this['request']<{ id: number }>('/command', {
      method: 'POST',
      body: JSON.stringify({
        name: 'MoviesSearch',
        movieIds,
      }),
    });
  }

  /**
   * Update a movie (PUT). Used to change qualityProfileId, monitored, tags, etc.
   */
  async updateMovie(movie: Movie): Promise<Movie> {
    return this['request']<Movie>(`/movie/${movie.id}`, {
      method: 'PUT',
      body: JSON.stringify(movie),
    });
  }

  /**
   * Trigger a refresh for a specific movie
   */
  async refreshMovie(movieId: number): Promise<{ id: number }> {
    return this['request']<{ id: number }>('/command', {
      method: 'POST',
      body: JSON.stringify({
        name: 'RefreshMovie',
        movieIds: [movieId],
      }),
    });
  }
}

export class LidarrClient extends ArrClient {
  constructor(config: ArrConfig) {
    super('lidarr', config);
    this.apiVersion = 'v1';
  }

  /**
   * Get all artists
   */
  async getArtists(): Promise<Artist[]> {
    return this['request']<Artist[]>('/artist');
  }

  /**
   * Get a specific artist
   */
  async getArtistById(id: number): Promise<Artist> {
    return this['request']<Artist>(`/artist/${id}`);
  }

  /**
   * Search for artists
   */
  async searchArtists(term: string): Promise<SearchResult[]> {
    return this['request']<SearchResult[]>(`/artist/lookup?term=${encodeURIComponent(term)}`);
  }

  /**
   * Add an artist
   */
  async addArtist(artist: Partial<Artist> & { foreignArtistId: string; rootFolderPath: string; qualityProfileId: number; metadataProfileId: number }): Promise<Artist> {
    return this['request']<Artist>('/artist', {
      method: 'POST',
      body: JSON.stringify({
        ...artist,
        monitored: artist.monitored ?? true,
        addOptions: {
          searchForMissingAlbums: true,
        },
      }),
    });
  }

  /**
   * Get all albums, optionally filtered by artist
   */
  async getAlbums(artistId?: number): Promise<Album[]> {
    const url = artistId ? `/album?artistId=${artistId}` : '/album';
    return this['request']<Album[]>(url);
  }

  /**
   * Get a specific album
   */
  async getAlbumById(id: number): Promise<Album> {
    return this['request']<Album>(`/album/${id}`);
  }

  /**
   * Search for missing albums for an artist
   */
  async searchMissingAlbums(artistId: number): Promise<{ id: number }> {
    return this['request']<{ id: number }>('/command', {
      method: 'POST',
      body: JSON.stringify({
        name: 'ArtistSearch',
        artistId,
      }),
    });
  }

  /**
   * Search for a specific album
   */
  async searchAlbum(albumId: number): Promise<{ id: number }> {
    return this['request']<{ id: number }>('/command', {
      method: 'POST',
      body: JSON.stringify({
        name: 'AlbumSearch',
        albumIds: [albumId],
      }),
    });
  }

  /**
   * Get calendar (upcoming album releases)
   */
  async getCalendar(start?: string, end?: string): Promise<Album[]> {
    const params = new URLSearchParams();
    if (start) params.append('start', start);
    if (end) params.append('end', end);
    const query = params.toString() ? `?${params.toString()}` : '';
    return this['request']<Album[]>(`/calendar${query}`);
  }

  /**
   * Get metadata profiles
   */
  async getMetadataProfiles(): Promise<MetadataProfile[]> {
    return this['request']<MetadataProfile[]>('/metadataprofile');
  }
}

export interface IndexerStats {
  id: number;
  indexerId: number;
  indexerName: string;
  averageResponseTime: number;
  numberOfQueries: number;
  numberOfGrabs: number;
  numberOfRssQueries: number;
  numberOfAuthQueries: number;
  numberOfFailedQueries: number;
  numberOfFailedGrabs: number;
  numberOfFailedRssQueries: number;
  numberOfFailedAuthQueries: number;
}

export class ProwlarrClient extends ArrClient {
  constructor(config: ArrConfig) {
    super('prowlarr', config);
    this.apiVersion = 'v1';
  }

  /**
   * Get all indexers
   */
  async getIndexers(): Promise<Indexer[]> {
    return this['request']<Indexer[]>('/indexer');
  }

  /**
   * Test all indexers
   */
  async testAllIndexers(): Promise<Array<{ id: number; isValid: boolean; validationFailures: Array<{ propertyName: string; errorMessage: string }> }>> {
    return this['request']<Array<{ id: number; isValid: boolean; validationFailures: Array<{ propertyName: string; errorMessage: string }> }>>('/indexer/testall', { method: 'POST' });
  }

  /**
   * Test a specific indexer
   */
  async testIndexer(indexerId: number): Promise<{ id: number; isValid: boolean; validationFailures: Array<{ propertyName: string; errorMessage: string }> }> {
    return this['request']<{ id: number; isValid: boolean; validationFailures: Array<{ propertyName: string; errorMessage: string }> }>(`/indexer/${indexerId}/test`, { method: 'POST' });
  }

  /**
   * Get indexer statistics
   */
  async getIndexerStats(): Promise<{ indexers: IndexerStats[] }> {
    return this['request']<{ indexers: IndexerStats[] }>('/indexerstats');
  }

  /**
   * Search across all indexers
   */
  async search(query: string, categories?: number[]): Promise<unknown[]> {
    const params = new URLSearchParams({ query });
    if (categories) {
      categories.forEach(c => params.append('categories', c.toString()));
    }
    return this['request']<unknown[]>(`/search?${params.toString()}`);
  }
}

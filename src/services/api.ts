import { DocumentAnalysis } from '../types';
import { analyzePastedDocument } from '../utils/analyzer';
import { SEARCH_DATABASE, SearchResultItem } from '../data/searchDatabase';

export interface BackendStatus {
  online: boolean;
  service?: string;
  version?: string;
  model?: string;
  geminiConfigured?: boolean;
}

/**
 * Check health and status of the Ctrl+V Access Backend API
 */
export async function checkBackendHealth(): Promise<BackendStatus> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const res = await fetch('/api/health', { signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      return {
        online: true,
        service: data.service,
        version: data.version,
        model: data.model,
        geminiConfigured: data.geminiConfigured
      };
    }
  } catch (err) {
    // Backend offline or unreachable
  }
  return {
    online: false,
    model: 'Client-Side Offline Engine'
  };
}

/**
 * Analyze document via Backend API with automatic resilient fallback
 */
export async function analyzeDocumentWithBackend(
  text: string, 
  customApiKey?: string,
  model?: string,
  language?: string
): Promise<{ analysis: DocumentAnalysis; source: 'backend-gemini' | 'backend-nlp' | 'client-fallback' }> {
  try {
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(customApiKey ? { 'x-gemini-api-key': customApiKey } : {})
      },
      body: JSON.stringify({
        text,
        apiKey: customApiKey,
        model: model || 'gemini-3.8-flash',
        language: language || 'en'
      })
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        return {
          analysis: json.data,
          source: json.source === 'gemini-frontier' ? 'backend-gemini' : 'backend-nlp'
        };
      }
    }
  } catch (err) {
    console.warn('Backend API request failed, switching to client offline engine:', err);
  }

  // Graceful client-side fallback
  const clientAnalysis = analyzePastedDocument(text);
  return {
    analysis: clientAnalysis,
    source: 'client-fallback'
  };
}

/**
 * Search statutory rights database via backend with client fallback
 */
export async function searchRightsWithBackend(query: string, category?: string): Promise<SearchResultItem[]> {
  try {
    const res = await fetch('/api/rights/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, category })
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.results)) {
        return json.results;
      }
    }
  } catch (err) {
    console.warn('Backend search unreachable, using local database:', err);
  }

  // Fallback to local SEARCH_DATABASE
  const q = query.toLowerCase().trim();
  let results = SEARCH_DATABASE;
  if (category && category !== 'all') {
    results = results.filter(item => item.category === category);
  }
  if (q) {
    results = results.filter(item => {
      const titleMatch = item.title.toLowerCase().includes(q);
      const authMatch = item.statutoryAuthority.toLowerCase().includes(q);
      const sumMatch = item.summary.toLowerCase().includes(q);
      const kwMatch = item.keywords.some(k => k.toLowerCase().includes(q));
      return titleMatch || authMatch || sumMatch || kwMatch;
    });
  }
  return results;
}

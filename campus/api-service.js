// api-service.js - Centralized API service for Campus Hub

const API_BASE_URL = 'https://api.campushub.com/v1';
const TOKEN_KEY = 'campus_auth_token';

/**
 * Core API service with authentication and error handling
 */
class ApiService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  // Get auth token from storage
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  // Set auth token to storage
  setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  // Clear auth token from storage
  clearToken() {
    localStorage.removeItem(TOKEN_KEY);
  }

  // Build request headers including auth if available
  getHeaders(customHeaders = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...customHeaders
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  // Core fetch method with error handling
  async fetchData(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: this.getHeaders(options.headers)
      });

      // Handle HTTP errors
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API error: ${response.status}`);
      }

      // Return empty object for 204 No Content
      if (response.status === 204) {
        return {};
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${url}:`, error);
      throw error;
    }
  }

  // HTTP method wrappers
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.fetchData(url, { method: 'GET' });
  }

  async post(endpoint, data) {
    return this.fetchData(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async put(endpoint, data) {
    return this.fetchData(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async patch(endpoint, data) {
    return this.fetchData(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }

  async delete(endpoint) {
    return this.fetchData(endpoint, { method: 'DELETE' });
  }
}

/**
 * News-specific API with local storage fallback
 */
class NewsApi {
  constructor(apiService) {
    this.api = apiService;
    this.endpoint = '/news';
    this.localStorageKey = 'newsData';
  }

  // Get all news items with local fallback
  async getAll(params = {}) {
    try {
      return await this.api.get(this.endpoint, params);
    } catch (error) {
      console.warn('Falling back to local storage for news data');
      return JSON.parse(localStorage.getItem(this.localStorageKey) || '[]');
    }
  }

  // Get news by ID with local fallback
  async getById(id) {
    try {
      return await this.api.get(`${this.endpoint}/${id}`);
    } catch (error) {
      console.warn(`Falling back to local storage for news item ${id}`);
      const localNews = JSON.parse(localStorage.getItem(this.localStorageKey) || '[]');
      const newsItem = localNews.find(item => item.id == id);
      
      if (!newsItem) {
        throw new Error(`News item ${id} not found`);
      }
      
      return newsItem;
    }
  }

  // Create news with local fallback
  async create(newsData) {
    try {
      return await this.api.post(this.endpoint, newsData);
    } catch (error) {
      console.warn('Falling back to local storage for news creation');
      const localNews = JSON.parse(localStorage.getItem(this.localStorageKey) || '[]');
      const newItem = { 
        id: `local-${Date.now()}`, 
        ...newsData,
        createdAt: new Date().toISOString()
      };
      
      localNews.push(newItem);
      localStorage.setItem(this.localStorageKey, JSON.stringify(localNews));
      return newItem;
    }
  }

  // Update news with local fallback
  async update(id, newsData) {
    try {
      return await this.api.put(`${this.endpoint}/${id}`, newsData);
    } catch (error) {
      console.warn(`Falling back to local storage for news update ${id}`);
      const localNews = JSON.parse(localStorage.getItem(this.localStorageKey) || '[]');
      const updatedNews = localNews.map(item => {
        if (item.id == id) {
          return { 
            ...item, 
            ...newsData,
            updatedAt: new Date().toISOString() 
          };
        }
        return item;
      });
      
      localStorage.setItem(this.localStorageKey, JSON.stringify(updatedNews));
      return updatedNews.find(item => item.id == id);
    }
  }

  // Delete news with local fallback
  async delete(id) {
    try {
      return await this.api.delete(`${this.endpoint}/${id}`);
    } catch (error) {
      console.warn(`Falling back to local storage for news deletion ${id}`);
      const localNews = JSON.parse(localStorage.getItem(this.localStorageKey) || '[]');
      const filteredNews = localNews.filter(item => item.id != id);
      localStorage.setItem(this.localStorageKey, JSON.stringify(filteredNews));
      return { success: true };
    }
  }

  // Search news with local fallback
  async search(query) {
    try {
      return await this.api.get(`${this.endpoint}/search`, { query });
    } catch (error) {
      console.warn('Falling back to local storage for news search');
      const localNews = JSON.parse(localStorage.getItem(this.localStorageKey) || '[]');
      const searchTerm = query.toLowerCase();
      
      return localNews.filter(item => 
        item.title.toLowerCase().includes(searchTerm) || 
        item.content.toLowerCase().includes(searchTerm)
      );
    }
  }
}

/**
 * Auth API for user authentication
 */
class AuthApi {
  constructor(apiService) {
    this.api = apiService;
    this.endpoint = '/auth';
  }

  async login(email, password) {
    try {
      const response = await this.api.post(`${this.endpoint}/login`, { email, password });
      if (response.token) {
        this.api.setToken(response.token);
      }
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  async register(userData) {
    try {
      return await this.api.post(`${this.endpoint}/register`, userData);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

  async logout() {
    try {
      await this.api.post(`${this.endpoint}/logout`, {});
    } catch (error) {
      console.warn('Logout API call failed:', error);
    } finally {
      this.api.clearToken();
    }
  }

  async getCurrentUser() {
    try {
      return await this.api.get(`${this.endpoint}/me`);
    } catch (error) {
      console.error('Failed to fetch current user:', error);
      throw error;
    }
  }
}

// Create API instances
const apiService = new ApiService(API_BASE_URL);
const newsApi = new NewsApi(apiService);
const authApi = new AuthApi(apiService);

// Export API modules
export { apiService, newsApi, authApi };
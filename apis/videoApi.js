const BASE_URL = 'https://uapis.cn/api/v1/social/bilibili';

const CACHE_DURATION = 5 * 60 * 1000;

const cache = new Map();

function getCacheKey(endpoint, params) {
  return `${endpoint}:${JSON.stringify(params)}`;
}

function isCacheValid(cacheEntry) {
  return Date.now() - cacheEntry.timestamp < CACHE_DURATION;
}

async function fetchWithRetry(url, options = {}, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        ...options,
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response;
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}

async function getUserVideos(mid, page = 1, pageSize = 20, keywords = '', orderby = 'pubdate') {
  console.log('getUserVideos called with:', {
    mid,
    page,
    pageSize,
    keywords,
    orderby
  });
  
  const cacheKey = getCacheKey('/archives', { mid, page, pageSize, keywords, orderby });
  console.log('Cache key:', cacheKey);
  // 强制刷新缓存，确保排序变化能够生效
  // const cached = cache.get(cacheKey);
  // if (cached && isCacheValid(cached)) {
  //   console.log('Returning cached data');
  //   return cached.data;
  // }
  console.log('Cache bypassed for sorting test');
  

  try {
    const params = new URLSearchParams({
      mid: mid,
      ps: pageSize,
      pn: page
    });

    if (keywords) {
      params.append('keywords', keywords);
    }

    if (orderby) {
      // 确保使用正确的排序参数名
      params.append('orderby', orderby);
      console.log('Added orderby parameter:', orderby);
    }

    const url = `${BASE_URL}/archives?${params.toString()}`;
    console.log('API request URL:', url);
    const response = await fetchWithRetry(url);
    const data = await response.json();

    console.log('API response:', data);

    if (data.code && data.code !== 200) {
      throw new Error(data.message || '获取视频失败');
    }

    const videosData = data.data || data;
    const videos = videosData.videos.map(video => ({
      aid: video.aid,
      bvid: video.bvid,
      title: video.title,
      cover: video.cover,
      duration: video.duration,
      playCount: video.play_count || video.playCount,
      publishTime: video.publish_time || video.publishTime,
      createTime: video.create_time || video.createTime,
      state: video.state,
      isUgcPay: video.is_ugc_pay || video.isUgcPay,
      isInteractive: video.is_interactive || video.isInteractive
    }));

    const result = {
      videos,
      page: videosData.page,
      pageSize: videosData.size || videosData.pageSize,
      total: videosData.total,
      hasMore: page * pageSize < (videosData.total || 0)
    };

    console.log('Processed result:', result);
    
    cache.set(cacheKey, { data: result, timestamp: Date.now() });
    return result;
  } catch (error) {
    console.error('获取用户视频失败:', error);
    throw error;
  }
}

function clearCache() {
  cache.clear();
}

function getCacheStats() {
  return {
    size: cache.size,
    entries: Array.from(cache.entries()).map(([key, value]) => ({
      key,
      age: Date.now() - value.timestamp,
      isValid: isCacheValid(value)
    }))
  };
}

export default {
  getUserVideos,
  clearCache,
  getCacheStats
};
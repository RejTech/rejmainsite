const API_PROVIDERS = [
    { name: 'uapis', url: 'https://uapis.cn/api/v1/social/bilibili' },
    { name: 'bilibili-api', url: 'https://api.bilibili.cn' },
    { name: 'darkflame', url: 'https://api.darkflame.ga/bilibili' },
    { name: 'bili-api', url: 'https://bili-api.upyun.net' },
    { name: 'bilibili-proxy', url: 'https://bilibili-proxy.yuban10707.xyz' }
];

const CACHE_DURATION = 5 * 60 * 1000;

const cache = new Map();

const mockVideos = [
    {
        aid: 1700001,
        bvid: 'BV1xx411c7mZ',
        title: '锐机科技产品发布会2026',
        cover: 'https://i0.hdslb.com/bfs/archive/5f7d3a8d5b1c2e0a9f8b7c6d5e4f3a2b1c0d9e8f7g6h5j4k3l2m1n0o.jpg',
        duration: 3600,
        play_count: 125800,
        publish_time: Math.floor(Date.now() / 1000) - 86400,
        state: 0,
        is_ugc_pay: false,
        is_interactive: false
    },
    {
        aid: 1700002,
        bvid: 'BV2xx411c7mY',
        title: '全新功能演示：主题系统与广告系统',
        cover: 'https://i0.hdslb.com/bfs/archive/6f8e4b9e6c2d3f1b0a9f8b7c6d5e4f3a2b1c0d9e8f7g6h5j4k3l2m1n0p.jpg',
        duration: 1800,
        play_count: 89200,
        publish_time: Math.floor(Date.now() / 1000) - 172800,
        state: 0,
        is_ugc_pay: false,
        is_interactive: false
    },
    {
        aid: 1700003,
        bvid: 'BV3xx411c7mX',
        title: 'RMS综合站使用教程',
        cover: 'https://i0.hdslb.com/bfs/archive/7g9f5c0f7d3e4g2c1d0b9a8f7e6d5c4b3a2b1c0d9e8f7g6h5j4k3l2m1n0q.jpg',
        duration: 2400,
        play_count: 156300,
        publish_time: Math.floor(Date.now() / 1000) - 259200,
        state: 0,
        is_ugc_pay: false,
        is_interactive: false
    },
    {
        aid: 1700004,
        bvid: 'BV4xx411c7mW',
        title: '深度解析：RTOS TurboWarp技术',
        cover: 'https://i0.hdslb.com/bfs/archive/8h0g6d1g8e4f5h3d2e1f0g9h8i7j6k5l4m3n2o1p0q9r8s7t6u5v4w3x2y1z0a.jpg',
        duration: 4200,
        play_count: 67500,
        publish_time: Math.floor(Date.now() / 1000) - 345600,
        state: 0,
        is_ugc_pay: false,
        is_interactive: false
    },
    {
        aid: 1700005,
        bvid: 'BV5xx411c7mV',
        title: '产品更新日志解读',
        cover: 'https://i0.hdslb.com/bfs/archive/9i1h7e2h9f5g6i4e3f2g1h0i9j8k7l6m5n4o3p2q1r0s9t8u7v6w5x4y3z2a1b0c.jpg',
        duration: 1200,
        play_count: 45200,
        publish_time: Math.floor(Date.now() / 1000) - 432000,
        state: 0,
        is_ugc_pay: false,
        is_interactive: false
    },
    {
        aid: 1700006,
        bvid: 'BV6xx411c7mU',
        title: '锐机科技团队介绍',
        cover: 'https://i0.hdslb.com/bfs/archive/0j2i8f3i0g6h7j5f4g3h2i1j0k9l8m7n6o5p4q3r2s1t0u9v8w7x6y5z4a3b2c1d0e.jpg',
        duration: 1500,
        play_count: 98700,
        publish_time: Math.floor(Date.now() / 1000) - 518400,
        state: 0,
        is_ugc_pay: false,
        is_interactive: false
    },
    {
        aid: 1700007,
        bvid: 'BV7xx411c7mT',
        title: 'Web技术分享：Bootstrap5实战',
        cover: 'https://i0.hdslb.com/bfs/archive/1k3j9g4j1h7i8k6g5h4i3j2k1l0m9n8o7p6q5r4s3t2u1v0w9x8y7z6a5b4c3d2e1f0g.jpg',
        duration: 3000,
        play_count: 76400,
        publish_time: Math.floor(Date.now() / 1000) - 604800,
        state: 0,
        is_ugc_pay: false,
        is_interactive: false
    },
    {
        aid: 1700008,
        bvid: 'BV8xx411c7mS',
        title: '如何贡献代码到RMS项目',
        cover: 'https://i0.hdslb.com/bfs/archive/2l4k0h5k2i8j9l7h6i5j4k3l2m1n0o9p8q7r6s5t4u3v2w1x0y9z8a7b6c5d4e3f2g1h0i.jpg',
        duration: 1800,
        play_count: 34200,
        publish_time: Math.floor(Date.now() / 1000) - 691200,
        state: 0,
        is_ugc_pay: false,
        is_interactive: false
    },
    {
        aid: 1700009,
        bvid: 'BV9xx411c7mR',
        title: '开发者访谈：技术架构设计',
        cover: 'https://i0.hdslb.com/bfs/archive/3m5l1i6l3j9k0m8i7j6k5l4m3n2o1p0q9r8s7t6u5v4w3x2y1z0a9b8c7d6e5f4g3h2i1j0k.jpg',
        duration: 4800,
        play_count: 56800,
        publish_time: Math.floor(Date.now() / 1000) - 777600,
        state: 0,
        is_ugc_pay: false,
        is_interactive: false
    }
];

function getMockVideos(page = 1, pageSize = 9, keywords = '') {
    let filtered = mockVideos;
    if (keywords) {
        filtered = mockVideos.filter(v => v.title.includes(keywords));
    }
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginated = filtered.slice(start, end);
    
    return {
        videos: paginated,
        page,
        pageSize,
        total: filtered.length,
        hasMore: end < filtered.length
    };
}

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
  
  for (const provider of API_PROVIDERS) {
    try {
      console.log(`尝试API提供商: ${provider.name} (${provider.url})`);
      
      const params = new URLSearchParams({
        mid: mid,
        ps: pageSize,
        pn: page
      });

      if (keywords) {
        params.append('keywords', keywords);
      }

      if (orderby) {
        params.append('orderby', orderby);
      }

      const url = `${provider.url}/archives?${params.toString()}`;
      console.log('API request URL:', url);
      const response = await fetchWithRetry(url, {}, 1);
      const data = await response.json();

      console.log('API response:', data);

      if (data.code && data.code !== 200) {
        throw new Error(data.message || '获取视频失败');
      }

      const videosData = data.data || data;
      if (!videosData || !videosData.videos || !Array.isArray(videosData.videos)) {
        throw new Error('无效的API响应格式');
      }

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
      console.log(`API提供商 ${provider.name} 成功获取视频`);
      
      cache.set(cacheKey, { data: result, timestamp: Date.now() });
      return result;
    } catch (error) {
      console.warn(`API提供商 ${provider.name} 失败: ${error.message}`);
    }
  }
  
  console.warn('所有API提供商均失败，使用mock数据');
  const mockResult = getMockVideos(page, pageSize, keywords);
  cache.set(cacheKey, { data: mockResult, timestamp: Date.now() });
  return mockResult;
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
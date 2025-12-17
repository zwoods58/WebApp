/**
 * Redis Caching Client
 * P1 Feature 17: Caching Strategy - Redis Caching
 */

// Note: This is a server-side only module
// Requires: npm install ioredis

let redisClient: any = null

/**
 * Get Redis client (server-side only)
 */
export async function getRedisClient() {
  if (typeof window !== 'undefined') {
    throw new Error('Redis client can only be used server-side')
  }

  if (redisClient) {
    return redisClient
  }

  try {
    const Redis = await import('ioredis')
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379'
    
    redisClient = new Redis.default(redisUrl, {
      maxRetriesPerRequest: 3,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000)
        return delay
      }
    })

    redisClient.on('error', (err: Error) => {
      console.error('Redis error:', err)
    })

    console.log('✅ Redis client connected')
    return redisClient
  } catch (error) {
    console.error('Failed to initialize Redis:', error)
    return null
  }
}

/**
 * Get cached value
 */
export async function getCache(key: string): Promise<string | null> {
  const client = await getRedisClient()
  if (!client) return null

  try {
    return await client.get(key)
  } catch (error) {
    console.error('Redis get error:', error)
    return null
  }
}

/**
 * Set cached value
 */
export async function setCache(
  key: string,
  value: string,
  ttlSeconds?: number
): Promise<boolean> {
  const client = await getRedisClient()
  if (!client) return false

  try {
    if (ttlSeconds) {
      await client.setex(key, ttlSeconds, value)
    } else {
      await client.set(key, value)
    }
    return true
  } catch (error) {
    console.error('Redis set error:', error)
    return false
  }
}

/**
 * Delete cached value
 */
export async function deleteCache(key: string): Promise<boolean> {
  const client = await getRedisClient()
  if (!client) return false

  try {
    await client.del(key)
    return true
  } catch (error) {
    console.error('Redis delete error:', error)
    return false
  }
}

/**
 * Cache with JSON serialization
 */
export async function getCacheJSON<T>(key: string): Promise<T | null> {
  const value = await getCache(key)
  if (!value) return null

  try {
    return JSON.parse(value) as T
  } catch {
    return null
  }
}

export async function setCacheJSON<T>(
  key: string,
  value: T,
  ttlSeconds?: number
): Promise<boolean> {
  try {
    return await setCache(key, JSON.stringify(value), ttlSeconds)
  } catch {
    return false
  }
}






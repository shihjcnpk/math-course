import { request } from 'node:https'
import { stdin } from 'node:process'

const owner = 'shihjcnpk'
const repo = 'math-course'
const source = { branch: 'gh-pages', path: '/' }
const apiVersion = '2022-11-28'

function readStdin() {
  return new Promise((resolve, reject) => {
    let data = ''
    stdin.setEncoding('utf8')
    stdin.on('data', chunk => {
      data += chunk
    })
    stdin.on('end', () => resolve(data.trim()))
    stdin.on('error', reject)
  })
}

function githubRequest(token, method, path, body) {
  const payload = body ? JSON.stringify(body) : ''

  return new Promise((resolve, reject) => {
    const req = request({
      hostname: 'api.github.com',
      path,
      method,
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        'User-Agent': 'math-course-pages-deploy',
        'X-GitHub-Api-Version': apiVersion,
      },
    }, res => {
      let text = ''
      res.setEncoding('utf8')
      res.on('data', chunk => {
        text += chunk
      })
      res.on('end', () => {
        const parsed = text ? tryParseJson(text) : null
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ statusCode: res.statusCode, body: parsed })
          return
        }

        const message = parsed?.message || text || `HTTP ${res.statusCode}`
        const error = new Error(`${method} ${path} failed: ${res.statusCode} ${message}`)
        error.statusCode = res.statusCode
        error.body = parsed
        reject(error)
      })
    })

    req.on('error', reject)
    if (payload) req.write(payload)
    req.end()
  })
}

function tryParseJson(text) {
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

async function main() {
  const token = await readStdin()
  if (!token) {
    throw new Error('Missing GitHub token on stdin')
  }

  const pagesPath = `/repos/${owner}/${repo}/pages`

  try {
    const current = await githubRequest(token, 'GET', pagesPath)
    console.log(`GitHub Pages status: ${current.body?.status ?? 'unknown'}`)

    await githubRequest(token, 'PUT', pagesPath, {
      build_type: 'legacy',
      source,
    })
    console.log('GitHub Pages source updated: gh-pages /')
  } catch (error) {
    if (error.statusCode !== 404) throw error

    await githubRequest(token, 'POST', pagesPath, {
      build_type: 'legacy',
      source,
    })
    console.log('GitHub Pages enabled: gh-pages /')
  }

  try {
    const build = await githubRequest(token, 'POST', `${pagesPath}/builds`)
    console.log(`GitHub Pages build requested: ${build.body?.status ?? 'queued'}`)
  } catch (error) {
    if (error.statusCode === 409) {
      console.log('GitHub Pages build already in progress')
      return
    }
    throw error
  }
}

main().catch(error => {
  console.error(error.message)
  process.exit(1)
})

class FileAwareness {
  constructor() {
    this.fileTree = {}
    this.fileSummaries = {}
    this.projectContext = {}
    this.scanHistory = []
  }

  // Scan project directory and build file tree
  async scanProject() {
    try {
      console.log('🔍 Scanning project directory...')
      
      // Scan common project directories
      const directories = ['src', 'components', 'stores', 'identity', 'memory', 'emotions', 'rituals', 'orchestration', 'tasks']
      
      for (const dir of directories) {
        await this.scanDirectory(dir)
      }
      
      // Generate project context
      this.generateProjectContext()
      
      console.log('✅ Project scan complete')
      return this.fileTree
    } catch (error) {
      console.error('❌ Project scan failed:', error)
      return {}
    }
  }

  // Scan a specific directory
  async scanDirectory(dirPath) {
    try {
      const response = await fetch(`/api/scan-directory?path=${dirPath}`)
      const files = await response.json()
      
      this.fileTree[dirPath] = files
      
      // Generate summaries for each file
      for (const file of files) {
        if (this.shouldSummarize(file.name)) {
          await this.generateFileSummary(dirPath, file)
        }
      }
    } catch (error) {
      console.error(`❌ Failed to scan directory ${dirPath}:`, error)
    }
  }

  // Determine if file should be summarized
  shouldSummarize(filename) {
    const summarizableExtensions = ['.js', '.jsx', '.ts', '.tsx', '.json', '.md', '.txt', '.html', '.css']
    return summarizableExtensions.some(ext => filename.endsWith(ext))
  }

  // Generate summary for a file
  async generateFileSummary(dirPath, file) {
    try {
      const filePath = `${dirPath}/${file.name}`
      const response = await fetch(`/api/file-content?path=${filePath}`)
      const content = await response.text()
      
      const summary = await this.createSummary(file.name, content)
      
      this.fileSummaries[filePath] = {
        name: file.name,
        path: filePath,
        size: file.size,
        lastModified: file.lastModified,
        summary: summary,
        type: this.detectFileType(file.name),
        importance: this.calculateImportance(file.name, content)
      }
    } catch (error) {
      console.error(`❌ Failed to summarize ${file.name}:`, error)
    }
  }

  // Detect file type and purpose
  detectFileType(filename) {
    const lowerName = filename.toLowerCase()
    
    if (lowerName.includes('component')) return 'component'
    if (lowerName.includes('store')) return 'state'
    if (lowerName.includes('config')) return 'configuration'
    if (lowerName.includes('util')) return 'utility'
    if (lowerName.includes('api')) return 'api'
    if (lowerName.includes('test')) return 'test'
    if (lowerName.includes('style')) return 'styling'
    if (lowerName.includes('index')) return 'entry'
    
    return 'general'
  }

  // Calculate file importance
  calculateImportance(filename, content) {
    let importance = 1
    
    // Core files are more important
    if (filename.includes('App.jsx') || filename.includes('main.jsx')) importance += 3
    if (filename.includes('index')) importance += 2
    
    // Configuration files
    if (filename.includes('config') || filename.includes('package.json')) importance += 2
    
    // Content length indicates complexity
    if (content.length > 1000) importance += 1
    if (content.length > 5000) importance += 1
    
    return Math.min(importance, 5)
  }

  // Create AI-generated summary
  async createSummary(filename, content) {
    try {
      const prompt = `Summarize this file in 2-3 sentences: ${filename}\n\nContent:\n${content.substring(0, 2000)}`
      
      // Use a simple summary approach instead of importing the store
      const summary = `File: ${filename} (${content.length} characters) - ${content.substring(0, 100)}...`
      
      return summary
    } catch (error) {
      console.error('❌ Failed to create AI summary:', error)
      return `File: ${filename} (${content.length} characters)`
    }
  }

  // Generate overall project context
  generateProjectContext() {
    const context = {
      totalFiles: Object.values(this.fileTree).flat().length,
      fileTypes: {},
      importantFiles: [],
      recentChanges: [],
      projectStructure: this.fileTree
    }
    
    // Analyze file types
    Object.values(this.fileSummaries).forEach(file => {
      const type = file.type
      context.fileTypes[type] = (context.fileTypes[type] || 0) + 1
      
      if (file.importance >= 4) {
        context.importantFiles.push(file)
      }
    })
    
    this.projectContext = context
    return context
  }

  // Search files by content or name
  async searchFiles(query) {
    const results = []
    
    Object.entries(this.fileSummaries).forEach(([path, file]) => {
      const searchText = `${file.name} ${file.summary}`.toLowerCase()
      const queryLower = query.toLowerCase()
      
      if (searchText.includes(queryLower)) {
        results.push({
          path: path,
          file: file,
          relevance: this.calculateRelevance(queryLower, searchText)
        })
      }
    })
    
    return results.sort((a, b) => b.relevance - a.relevance)
  }

  // Calculate search relevance
  calculateRelevance(query, text) {
    const words = query.split(' ')
    let relevance = 0
    
    words.forEach(word => {
      const matches = (text.match(new RegExp(word, 'gi')) || []).length
      relevance += matches
    })
    
    return relevance
  }

  // Get project overview
  getProjectOverview() {
    return {
      structure: this.fileTree,
      context: this.projectContext,
      summaries: this.fileSummaries,
      scanHistory: this.scanHistory
    }
  }

  // Get file by path
  getFile(path) {
    return this.fileSummaries[path]
  }

  // Get important files
  getImportantFiles() {
    return Object.values(this.fileSummaries)
      .filter(file => file.importance >= 4)
      .sort((a, b) => b.importance - a.importance)
  }

  // Get recent files
  getRecentFiles(limit = 10) {
    return Object.values(this.fileSummaries)
      .sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified))
      .slice(0, limit)
  }

  // Update file information
  updateFile(path, content) {
    if (this.fileSummaries[path]) {
      this.fileSummaries[path].lastModified = new Date().toISOString()
      this.fileSummaries[path].size = content.length
      
      // Regenerate summary if needed
      this.generateFileSummary(path.split('/')[0], { name: path.split('/').pop() })
    }
  }
}

export default FileAwareness 
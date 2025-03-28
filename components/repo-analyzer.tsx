"use client"

import { useState } from "react"
import {
  Loader2,
  FolderIcon,
  FileIcon,
  ChevronRight,
  ChevronDown,
  Copy,
  ExternalLink,
  AlertCircle,
  Download,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

// Types for repository data
interface RepoFile {
  name: string
  path: string
  type: "file" | "dir"
  content?: string
  size?: number
  children?: RepoFile[]
}

interface RepoStats {
  name: string
  owner: string
  filesAnalyzed: number
  estimatedTokens: string
  totalSize: string
}

export function RepoAnalyzer() {
  const [repoUrl, setRepoUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [repoStats, setRepoStats] = useState<RepoStats | null>(null)
  const [repoFiles, setRepoFiles] = useState<RepoFile[]>([])
  const [fileContents, setFileContents] = useState<{ [path: string]: string }>({})
  const [directoryStructure, setDirectoryStructure] = useState("")
  const [selectedFile, setSelectedFile] = useState<RepoFile | null>(null)
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("summary")

  // Function to parse GitHub URL
  const parseGitHubUrl = (url: string) => {
    try {
      const urlObj = new URL(url)
      if (urlObj.hostname !== "github.com") {
        return { valid: false, owner: "", repo: "" }
      }

      const pathParts = urlObj.pathname.split("/").filter(Boolean)
      if (pathParts.length < 2) {
        return { valid: false, owner: "", repo: "" }
      }

      return { valid: true, owner: pathParts[0], repo: pathParts[1] }
    } catch (error) {
      return { valid: false, owner: "", repo: "" }
    }
  }

  // Function to toggle folder expansion
  const toggleFolder = (path: string) => {
    const newExpandedFolders = new Set(expandedFolders)
    if (expandedFolders.has(path)) {
      newExpandedFolders.delete(path)
    } else {
      newExpandedFolders.add(path)
    }
    setExpandedFolders(newExpandedFolders)
  }

  // Function to select a file
  const selectFile = (file: RepoFile) => {
    setSelectedFile(file)
    setActiveTab("file-content")
  }

  // Function to fetch repository structure
  const fetchRepoStructure = async (owner: string, repo: string) => {
    try {
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/main?recursive=1`)

      if (!response.ok) {
        // Try master branch if main doesn't exist
        const masterResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/master?recursive=1`)
        if (!masterResponse.ok) {
          throw new Error("Failed to fetch repository structure")
        }
        return await masterResponse.json()
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching repository structure:", error)
      throw error
    }
  }

  // Function to fetch file content
  const fetchFileContent = async (owner: string, repo: string, path: string) => {
    try {
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch file content for ${path}`)
      }

      const data = await response.json()

      // GitHub API returns content as base64 encoded
      if (data.encoding === "base64" && data.content) {
        return atob(data.content.replace(/\n/g, ""))
      }

      return "Unable to display content (possibly a binary file or too large)"
    } catch (error) {
      console.error(`Error fetching content for ${path}:`, error)
      return "Error loading file content"
    }
  }

  // Function to build directory tree from flat list
  const buildDirectoryTree = (items: any[]) => {
    const root: RepoFile[] = []
    const map: { [path: string]: RepoFile } = {}

    // First pass: create all file and directory objects
    items.forEach((item) => {
      map[item.path] = {
        name: item.path.split("/").pop() || item.path,
        path: item.path,
        type: item.type === "blob" ? "file" : "dir",
        size: item.size,
        children: item.type === "tree" ? [] : undefined,
      }
    })

    // Second pass: build tree structure
    items.forEach((item) => {
      const node = map[item.path]

      if (item.path.includes("/")) {
        // This is a nested item, add it to its parent
        const parentPath = item.path.substring(0, item.path.lastIndexOf("/"))
        const parent = map[parentPath]

        if (parent && parent.children) {
          parent.children.push(node)
        }
      } else {
        // This is a root item
        root.push(node)
      }
    })

    return root
  }

  // Function to generate directory structure string
  const generateDirectoryStructure = (files: RepoFile[], prefix = "") => {
    let result = ""

    files.forEach((file, index) => {
      const isLast = index === files.length - 1
      const line = `${prefix}${isLast ? "└── " : "├── "}${file.name}\n`
      result += line

      if (file.children && file.children.length > 0) {
        const newPrefix = `${prefix}${isLast ? "    " : "│   "}`
        result += generateDirectoryStructure(file.children, newPrefix)
      }
    })

    return result
  }

  // Function to estimate token count
  const estimateTokens = (content: string) => {
    // Very rough estimate: 1 token ≈ 4 characters
    const characterCount = content.length
    const estimatedTokens = Math.ceil(characterCount / 4)

    if (estimatedTokens < 1000) {
      return `${estimatedTokens}`
    } else {
      return `${(estimatedTokens / 1000).toFixed(1)}k`
    }
  }

  // Function to format file size
  const formatSize = (bytes?: number) => {
    if (bytes === undefined) return "Unknown"
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  // Calculate total size
  const calculateTotalSize = (files: RepoFile[]) => {
    let total = 0

    const traverse = (nodes: RepoFile[]) => {
      nodes.forEach((node) => {
        if (node.type === "file" && node.size) {
          total += node.size
        }
        if (node.children) {
          traverse(node.children)
        }
      })
    }

    traverse(files)
    return formatSize(total)
  }

  // Count files
  const countFiles = (files: RepoFile[]) => {
    let count = 0

    const traverse = (nodes: RepoFile[]) => {
      nodes.forEach((node) => {
        if (node.type === "file") {
          count++
        }
        if (node.children) {
          traverse(node.children)
        }
      })
    }

    traverse(files)
    return count
  }

  // Function to copy content to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("Copied to clipboard")
      })
      .catch((err) => {
        console.error("Failed to copy: ", err)
      })
  }

  // Function to export as text file
  const downloadAsFile = (content: string, filename: string) => {
    const element = document.createElement("a")
    const file = new Blob([content], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = filename
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  // Function to generate all file contents
  const generateAllContents = () => {
    let result = ""

    const traverse = (nodes: RepoFile[], level = 0) => {
      nodes.forEach((node) => {
        if (node.type === "file") {
          result += "=".repeat(40) + "\n"
          result += `File: ${node.path}\n`
          result += "=".repeat(40) + "\n"
          result += fileContents[node.path] || "Content not loaded\n"
          result += "\n\n"
        }
        if (node.children) {
          traverse(node.children, level + 1)
        }
      })
    }

    traverse(repoFiles)
    return result
  }

  // Function to analyze repository
  const analyzeRepo = async () => {
    if (!repoUrl) {
      setError("Please enter a GitHub repository URL")
      return
    }

    // Validate GitHub URL format
    const { valid, owner, repo } = parseGitHubUrl(repoUrl)
    if (!valid) {
      setError("Please enter a valid GitHub repository URL (https://github.com/username/repo)")
      return
    }

    setIsLoading(true)
    setError("")
    setSelectedFile(null)
    setExpandedFolders(new Set())
    setActiveTab("summary")
    setFileContents({})

    try {
      // Fetch repository structure
      const repoData = await fetchRepoStructure(owner, repo)

      // Build directory tree
      const tree = buildDirectoryTree(repoData.tree)
      setRepoFiles(tree)

      // Generate directory structure string
      const structureString = `Directory structure:\n${generateDirectoryStructure(tree)}`
      setDirectoryStructure(structureString)

      // Calculate stats
      const fileCount = countFiles(tree)
      const totalSize = calculateTotalSize(tree)

      setRepoStats({
        name: repo,
        owner,
        filesAnalyzed: fileCount,
        estimatedTokens: "calculating...",
        totalSize,
      })

      // Fetch content for text files (exclude binaries, large files)
      const textFileExtensions = [
        ".js",
        ".jsx",
        ".ts",
        ".tsx",
        ".html",
        ".css",
        ".scss",
        ".json",
        ".md",
        ".py",
        ".rb",
        ".java",
        ".c",
        ".cpp",
        ".h",
        ".php",
        ".go",
        ".rust",
        ".swift",
        ".kt",
        ".sh",
        ".yaml",
        ".yml",
        ".toml",
        ".ini",
        ".config",
        ".txt",
        ".csv",
      ]

      const fetchFilePromises: Promise<void>[] = []

      const getFileContent = async (file: RepoFile) => {
        if (file.type === "file") {
          const ext = file.path.substring(file.path.lastIndexOf(".")).toLowerCase()
          const shouldFetch = textFileExtensions.includes(ext) && (file.size === undefined || file.size < 1000000)

          if (shouldFetch) {
            const content = await fetchFileContent(owner, repo, file.path)
            setFileContents((prev) => ({
              ...prev,
              [file.path]: content,
            }))
          }
        }

        if (file.children) {
          file.children.forEach((child) => {
            fetchFilePromises.push(getFileContent(child))
          })
        }
      }

      // Start fetching file contents
      tree.forEach((file) => {
        fetchFilePromises.push(getFileContent(file))
      })

      // Wait for all file content to be fetched
      await Promise.allSettled(fetchFilePromises)

      // Calculate token estimate based on all fetched content
      const allContent = Object.values(fileContents).join("\n")
      const tokenEstimate = estimateTokens(allContent)

      setRepoStats((prev) =>
        prev
          ? {
              ...prev,
              estimatedTokens: tokenEstimate,
            }
          : null,
      )
    } catch (error) {
      console.error("Error analyzing repository:", error)
      setError(
        "Failed to analyze repository. Please try again with a different repository URL or check if the repository exists.",
      )
    } finally {
      setIsLoading(false)
    }
  }

  // Function to render file tree
  const renderFileTree = (files: RepoFile[], level = 0) => {
    return (
      <div className={level === 0 ? "" : "ml-4"}>
        {files.map((file) => (
          <div key={file.path}>
            <div
              className={`flex items-center gap-2 py-1 cursor-pointer hover:bg-muted/50 rounded px-2 ${selectedFile?.path === file.path ? "bg-muted" : ""}`}
              onClick={() => (file.type === "dir" ? toggleFolder(file.path) : selectFile(file))}
            >
              {file.type === "dir" ? (
                <>
                  {expandedFolders.has(file.path) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                  <FolderIcon className="h-4 w-4 text-amber-500" />
                </>
              ) : (
                <>
                  <div className="w-4"></div>
                  <FileIcon className="h-4 w-4 text-blue-500" />
                </>
              )}
              <span className="text-sm">{file.name}</span>
              {file.size !== undefined && (
                <span className="text-xs text-muted-foreground ml-auto">{formatSize(file.size)}</span>
              )}
            </div>

            {file.type === "dir" &&
              expandedFolders.has(file.path) &&
              file.children &&
              renderFileTree(file.children, level + 1)}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-6">
      <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-background to-muted">
        <CardHeader>
          <CardTitle>GitHub Repository Analyzer</CardTitle>
          <CardDescription>Enter a GitHub repository URL to explore its structure and code</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Input
              placeholder="https://github.com/username/repo"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={analyzeRepo}
              disabled={isLoading}
              className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Analyze Repository"
              )}
            </Button>
          </div>
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {repoStats && (
        <div className="grid gap-6 md:grid-cols-1">
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="directory">Directory Structure</TabsTrigger>
              <TabsTrigger value="file-content">Files Content</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="mt-4">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-background to-muted">
                  <CardHeader>
                    <CardTitle>Repository Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-amber-50/10 rounded-lg p-4 font-mono text-sm">
                      <p>
                        Repository: {repoStats.owner}/{repoStats.name}
                      </p>
                      <p>Files analyzed: {repoStats.filesAnalyzed}</p>
                      <p>Total size: {repoStats.totalSize}</p>
                      <p>Estimated tokens: {repoStats.estimatedTokens}</p>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          downloadAsFile(
                            `Repository: ${repoStats.owner}/${repoStats.name}\n` +
                              `Files analyzed: ${repoStats.filesAnalyzed}\n` +
                              `Total size: ${repoStats.totalSize}\n` +
                              `Estimated tokens: ${repoStats.estimatedTokens}\n\n` +
                              directoryStructure +
                              "\n\n" +
                              generateAllContents(),
                            `${repoStats.owner}-${repoStats.name}-analysis.txt`,
                          )
                        }
                        className="flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(
                            `Repository: ${repoStats.owner}/${repoStats.name}\n` +
                              `Files analyzed: ${repoStats.filesAnalyzed}\n` +
                              `Total size: ${repoStats.totalSize}\n` +
                              `Estimated tokens: ${repoStats.estimatedTokens}`,
                          )
                        }
                        className="flex items-center gap-2"
                      >
                        <Copy className="h-4 w-4" />
                        Copy all
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-background to-muted h-[400px] overflow-y-auto">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Repository Structure</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="file-tree">{renderFileTree(repoFiles)}</div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="directory" className="mt-4">
              <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-background to-muted">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Directory Structure</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(directoryStructure)}
                    className="flex items-center gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    Copy
                  </Button>
                </CardHeader>
                <CardContent>
                  <pre className="bg-amber-50/10 rounded-lg p-4 overflow-x-auto font-mono text-sm whitespace-pre">
                    {directoryStructure}
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="file-content" className="mt-4">
              <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-background to-muted">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Files Content</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(generateAllContents())}
                    className="flex items-center gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    Copy all files
                  </Button>
                </CardHeader>
                <CardContent>
                  {selectedFile ? (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">{selectedFile.path}</h3>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(fileContents[selectedFile.path] || "Content not available")}
                            className="flex items-center gap-2"
                          >
                            <Copy className="h-4 w-4" />
                            Copy
                          </Button>

                          <a
                            href={`https://github.com/${repoStats.owner}/${repoStats.name}/blob/main/${selectedFile.path}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-sm hover:underline"
                          >
                            <ExternalLink className="h-4 w-4" />
                            View on GitHub
                          </a>
                        </div>
                      </div>
                      <pre className="bg-amber-50/10 rounded-lg p-4 overflow-x-auto font-mono text-sm max-h-[600px] overflow-y-auto">
                        {fileContents[selectedFile.path] ||
                          "Loading content..." +
                            (selectedFile.size && selectedFile.size > 1000000
                              ? "\n\nThis file is too large to display."
                              : "")}
                      </pre>
                    </div>
                  ) : (
                    <Accordion type="single" collapsible className="w-full">
                      {repoFiles.map((file) => (
                        <AccordionRecursive
                          key={file.path}
                          file={file}
                          fileContents={fileContents}
                          onSelectFile={selectFile}
                          owner={repoStats.owner}
                          repo={repoStats.name}
                        />
                      ))}
                    </Accordion>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}

interface AccordionRecursiveProps {
  file: RepoFile
  fileContents: { [path: string]: string }
  onSelectFile: (file: RepoFile) => void
  owner: string
  repo: string
}

function AccordionRecursive({ file, fileContents, onSelectFile, owner, repo }: AccordionRecursiveProps) {
  if (file.type === "file") {
    return (
      <div className="border-b py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer hover:underline" onClick={() => onSelectFile(file)}>
            <FileIcon className="h-4 w-4 text-blue-500" />
            <span>{file.path}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(fileContents[file.path] || "Content not available")
              }}
              className="h-8 w-8 p-0"
            >
              <Copy className="h-4 w-4" />
              <span className="sr-only">Copy</span>
            </Button>

            <a
              href={`https://github.com/${owner}/${repo}/blob/main/${file.path}`}
              target="_blank"
              rel="noopener noreferrer"
              className="h-8 w-8 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <ExternalLink className="h-4 w-4" />
              <span className="sr-only">View on GitHub</span>
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <AccordionItem value={file.path}>
      <AccordionTrigger className="hover:no-underline">
        <div className="flex items-center gap-2">
          <FolderIcon className="h-4 w-4 text-amber-500" />
          <span>{file.path}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        {file.children?.map((child) => (
          <AccordionRecursive
            key={child.path}
            file={child}
            fileContents={fileContents}
            onSelectFile={onSelectFile}
            owner={owner}
            repo={repo}
          />
        ))}
      </AccordionContent>
    </AccordionItem>
  )
}


import Link from "next/link"
import { ExternalLink, Github, type LucideIcon } from "lucide-react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface ProjectCardProps {
  title: string
  description: string
  tags: string[]
  link: string
  demoLink?: string
  icon?: LucideIcon
  gradient?: string
}

export function ProjectCard({
  title,
  description,
  tags,
  link,
  demoLink,
  icon: Icon,
  gradient = "from-primary to-primary",
}: ProjectCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden border-none shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className={`h-2 w-full bg-gradient-to-r ${gradient}`}></div>
      <CardHeader className="flex flex-row items-center gap-4">
        {Icon && (
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${gradient} text-white`}
          >
            <Icon className="h-6 w-6" />
          </div>
        )}
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription className="mt-1.5">{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="bg-secondary/30">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 border-t p-4">
        <Button asChild variant="outline" size="sm" className="flex-1">
          <Link href={link} target="_blank" rel="noopener noreferrer">
            <Github className="mr-2 h-4 w-4" />
            View Code
          </Link>
        </Button>
        {demoLink && (
          <Button asChild size="sm" className={`flex-1 bg-gradient-to-r ${gradient} hover:opacity-90`}>
            <Link href={demoLink} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Live Demo
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}


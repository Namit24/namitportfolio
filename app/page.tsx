import type React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { Github, Linkedin, Mail, Code, Database, Brain, Shield, HeartPulse, LineChart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ProjectCard } from "@/components/project-card"
import { RepoAnalyzer } from "@/components/repo-analyzer"
import { Timeline } from "@/components/timeline"
import { HeroSection } from "@/components/hero-section"

export const metadata: Metadata = {
  title: "Namit Solanki | Portfolio",
  description: "Machine Learning Engineer and App Developer",
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-background/80">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 font-bold">
            <span className="text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
              Namit Solanki
            </span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {/* Empty navbar as requested */}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <HeroSection />

        <section id="about" className="container py-12 md:py-16">
          <div className="flex items-center gap-2 mb-8">
            <div className="h-1 w-10 rounded-full bg-primary"></div>
            <h2 className="text-2xl font-bold tracking-tight">About Me</h2>
          </div>
          <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-background to-muted">
            <CardContent className="p-6 md:p-8">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Who I Am</h3>
                  <p className="text-muted-foreground mb-4">
                    I'm a Machine Learning Engineer and App Developer specializing in building no-code ML solutions and
                    data-driven applications. With a passion for creating accessible technology, I focus on developing
                    tools that make complex processes simple for users.
                  </p>
                  <p className="text-muted-foreground">
                    My expertise spans machine learning, data science, and application development, with a particular
                    focus on creating intuitive interfaces for complex systems.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">My Skills</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <SkillCard title="Machine Learning" icon={Brain} />
                    <SkillCard title="Data Science" icon={LineChart} />
                    <SkillCard title="Python" icon={Code} />
                    <SkillCard title="SQL" icon={Database} />
                    <SkillCard title="Firebase" icon={Shield} />
                    <SkillCard title="Git/GitHub" icon={Github} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section id="projects" className="container py-12 md:py-16">
          <div className="flex items-center gap-2 mb-8">
            <div className="h-1 w-10 rounded-full bg-primary"></div>
            <h2 className="text-2xl font-bold tracking-tight">Projects</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            <ProjectCard
              title="Women Safety App"
              description="A mobile application designed to enhance women's safety with emergency features, location tracking, and alert systems."
              tags={["Android", "Firebase", "Google Maps API", "Safety"]}
              link="https://github.com/Namit24/Women-Safety"
              icon={Shield}
              gradient="from-pink-500 to-rose-500"
            />
            <ProjectCard
              title="Health Report App"
              description="A Streamlit application that analyzes health data and generates comprehensive reports for users to track their health metrics."
              tags={["Python", "Streamlit", "Data Visualization", "Healthcare"]}
              link="https://github.com/Namit24/HealthApp"
              icon={HeartPulse}
              gradient="from-green-500 to-emerald-500"
            />
            <ProjectCard
              title="Enhanced Random Forest"
              description="An optimized implementation of the Random Forest algorithm using NumPy for improved performance and customization."
              tags={["Python", "NumPy", "Machine Learning", "Algorithm"]}
              link="https://github.com/Namit24/Random-Forest-from-Numpy"
              icon={Brain}
              gradient="from-blue-500 to-cyan-500"
            />
            <ProjectCard
              title="No Code ML Platform"
              description="A platform that allows users to create machine learning models without writing code, using a simple drag-and-drop interface."
              tags={["Python", "Streamlit", "scikit-learn", "UI/UX"]}
              link="https://github.com/shaah1d/Nocode-V1"
              icon={Code}
              gradient="from-violet-500 to-purple-500"
            />
          </div>
        </section>

        <section id="experience" className="container py-12 md:py-16 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background/0 rounded-3xl -z-10"></div>
          <div className="flex items-center gap-2 mb-8">
            <div className="h-1 w-10 rounded-full bg-primary"></div>
            <h2 className="text-2xl font-bold tracking-tight">Experience & Awards</h2>
          </div>
          <Timeline />
        </section>

        <section id="analyzer" className="container py-12 md:py-16">
          <div className="flex items-center gap-2 mb-8">
            <div className="h-1 w-10 rounded-full bg-primary"></div>
            <h2 className="text-2xl font-bold tracking-tight">GitHub Repository Analyzer</h2>
          </div>
          <p className="mb-6 text-muted-foreground">
            Enter a GitHub repository URL to get a detailed breakdown of the project structure and functionality.
          </p>
          <RepoAnalyzer />
        </section>

        <section id="contact" className="container py-12 md:py-16 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background/0 rounded-3xl -z-10"></div>
          <div className="flex items-center gap-2 mb-8">
            <div className="h-1 w-10 rounded-full bg-primary"></div>
            <h2 className="text-2xl font-bold tracking-tight">Get In Touch</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-background to-muted">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Reach out through any of these channels</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <a href="mailto:namitsolanki48@gmail.com" className="hover:underline">
                    namitsolanki48@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Github className="h-5 w-5 text-primary" />
                  </div>
                  <a
                    href="https://github.com/Namit24"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    github.com/Namit24
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Linkedin className="h-5 w-5 text-primary" />
                  </div>
                  <a
                    href="https://linkedin.com/in/namit-solanki"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    linkedin.com/in/namit-solanki
                  </a>
                </div>
              </CardContent>
            </Card>
            <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-background to-muted">
              <CardHeader>
                <CardTitle>Send a Message</CardTitle>
                <CardDescription>Fill out the form and I'll get back to you</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="grid gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Name
                    </label>
                    <input
                      id="name"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Your name"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Your email"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Message
                    </label>
                    <textarea
                      id="message"
                      className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Your message"
                    />
                  </div>
                </form>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90">
                  Send Message
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © {new Date().getFullYear()} Namit Solanki. All rights reserved.
          </p>
          <div className="flex items-center space-x-1">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              Interests: Photography, Creative Writing, Canva Designing
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

interface SkillCardProps {
  title: string
  icon: React.ComponentType<any>
}

function SkillCard({ title, icon: Icon }: SkillCardProps) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <span className="font-medium">{title}</span>
    </div>
  )
}


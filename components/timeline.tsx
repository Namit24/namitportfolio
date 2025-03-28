import type React from "react"
import { Briefcase, Award } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function Timeline() {
  return (
    <div className="space-y-8">
      <TimelineItem
        icon={Briefcase}
        date="March 2025 - April 2025"
        title="DBMS & Data Science Intern"
        organization="Nereus Technologies, Bengaluru"
        description={
          <>
            <ul className="mt-2 space-y-2 text-sm">
              <li className="flex gap-2">
                <span className="h-2 w-2 translate-y-1.5 rounded-full bg-primary"></span>
                <span>
                  Developed a PostgreSQL database and backend system to handle real-time IMU sensor data (velocity,
                  acceleration, joint angles, timestamps)
                </span>
              </li>
              <li className="flex gap-2">
                <span className="h-2 w-2 translate-y-1.5 rounded-full bg-primary"></span>
                <span>Implemented Bluetooth connectivity for real-time CSV generation</span>
              </li>
              <li className="flex gap-2">
                <span className="h-2 w-2 translate-y-1.5 rounded-full bg-primary"></span>
                <span>
                  Designed admin and user dashboards for managing sessions, user data, and exercise configurations
                </span>
              </li>
            </ul>
          </>
        }
        tags={["PostgreSQL", "Bluetooth", "Dashboard Design", "Data Visualization"]}
        gradient="from-blue-500 to-cyan-500"
      />

      <TimelineItem
        icon={Briefcase}
        date="September 2024 - Present"
        title="No Code ML Model Builder"
        organization="Self-Employed, Pune"
        description={
          <>
            <ul className="mt-2 space-y-2 text-sm">
              <li className="flex gap-2">
                <span className="h-2 w-2 translate-y-1.5 rounded-full bg-primary"></span>
                <span>
                  Developed a no-code machine learning model builder with Python scripts running on a Uvicorn server
                </span>
              </li>
              <li className="flex gap-2">
                <span className="h-2 w-2 translate-y-1.5 rounded-full bg-primary"></span>
                <span>
                  Integrated scikit-learn for model creation, matplotlib for visualizations, and Streamlit for the
                  frontend interface
                </span>
              </li>
              <li className="flex gap-2">
                <span className="h-2 w-2 translate-y-1.5 rounded-full bg-primary"></span>
                <span>
                  Implemented automated data preprocessing features, including data cleaning, encoding, and
                  transformation
                </span>
              </li>
            </ul>
          </>
        }
        tags={["Python", "Machine Learning", "Streamlit", "scikit-learn"]}
        gradient="from-violet-500 to-purple-500"
      />

      <TimelineItem
        icon={Award}
        date="February 2025"
        title="All India Rank 6 in TechXlerate Hackathon"
        organization="BITS Pilani"
        description={
          <>
            <p className="mt-2 text-sm">
              Our team developed a platform where anyone can build their own ML models using a simple drag-and-drop
              technique without any coding required.
            </p>
          </>
        }
        tags={["Hackathon", "Machine Learning", "No-Code", "Award"]}
        gradient="from-amber-500 to-orange-500"
      />

      <TimelineItem
        icon={Award}
        date="August 2023 - Present"
        title="Computer Science Subject Topper"
        organization="XII Boards"
        description={
          <>
            <p className="mt-2 text-sm">
              Award given to the student securing highest marks in Computer Science in XII Boards.
            </p>
          </>
        }
        tags={["Academic Excellence", "Computer Science", "Award"]}
        gradient="from-green-500 to-emerald-500"
      />
    </div>
  )
}

interface TimelineItemProps {
  icon: React.ComponentType<any>
  date: string
  title: string
  organization: string
  description: React.ReactNode
  tags: string[]
  gradient?: string
}

function TimelineItem({
  icon: Icon,
  date,
  title,
  organization,
  description,
  tags,
  gradient = "from-primary to-primary",
}: TimelineItemProps) {
  return (
    <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-background to-muted transition-all duration-300 hover:shadow-xl">
      <div className={`h-1 w-full bg-gradient-to-r ${gradient}`}></div>
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${gradient} text-white`}
        >
          <Icon className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{title}</CardTitle>
            <span className="text-sm text-muted-foreground">{date}</span>
          </div>
          <CardDescription>{organization}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {description}
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="outline" className="bg-primary/5">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}


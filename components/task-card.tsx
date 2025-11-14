import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Check } from "lucide-react"

interface TaskCardProps {
  task: {
    id: string
    title: string
    description?: string
    completed: boolean
    created_at: string
  }
  onEdit: (task: any) => void
  onDelete: (id: string) => void
  onToggle: (id: string, completed: boolean) => void
}

export function TaskCard({ task, onEdit, onDelete, onToggle }: TaskCardProps) {
  return (
    <Card 
      className="border-2 relative flex items-center"
      style={{ backgroundColor: task.completed ? "#00af3b" : "#fd6e41" }}
    >
      {/* Edit/Delete buttons in top right */}
      <div className="absolute top-2 right-2 flex gap-1 z-10">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-white hover:bg-white/20"
          onClick={() => onEdit(task)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-white hover:bg-white/20"
          onClick={() => onDelete(task.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Content area */}
      <div className="flex-1 pr-16">
        <CardHeader>
          <CardTitle>
            <span className={task.completed ? "line-through text-white" : "text-white"}>
              {task.title}
            </span>
          </CardTitle>
        </CardHeader>
        
        {task.description && (
          <CardContent>
            <p className="text-sm text-white/90">{task.description}</p>
          </CardContent>
        )}
        
        <CardFooter>
          <span className="text-xs text-white/80">
            {new Date(task.created_at).toLocaleDateString()}
          </span>
        </CardFooter>
      </div>

      {/* Complete button - center right */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2">
        <Button
          variant="secondary"
          size="icon"
          className={
            task.completed
              ? "h-10 w-10 rounded-full bg-white text-green-600 hover:bg-white/90 border-2 border-white"
              : "h-10 w-10 rounded-full bg-transparent hover:bg-white/10 text-white border-2 border-white/60"
          }
          onClick={() => onToggle(task.id, task.completed)}
        >
          {task.completed && <Check className="h-6 w-6" />}
        </Button>
      </div>
    </Card>
  )
}

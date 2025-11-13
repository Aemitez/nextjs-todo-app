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
    <Card className={task.completed ? "opacity-60" : ""}>
      <CardHeader>
        <CardTitle className="flex items-start justify-between">
          <span className={task.completed ? "line-through" : ""}>
            {task.title}
          </span>
          <Button
            variant={task.completed ? "default" : "outline"}
            size="icon"
            className="h-6 w-6 ml-2"
            onClick={() => onToggle(task.id, task.completed)}
          >
            <Check className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      {task.description && (
        <CardContent>
          <p className="text-sm text-muted-foreground">{task.description}</p>
        </CardContent>
      )}
      <CardFooter className="flex justify-between">
        <span className="text-xs text-muted-foreground">
          {new Date(task.created_at).toLocaleDateString()}
        </span>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onEdit(task)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive"
            onClick={() => onDelete(task.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

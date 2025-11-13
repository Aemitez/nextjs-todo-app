import { useState, useEffect } from "react"
import { useMutation } from "@apollo/client"
import { CREATE_TASK, UPDATE_TASK } from "@/graphql/mutations"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface TaskDialogProps {
  open: boolean
  onClose: () => void
  task?: any
  userId: string
}

export function TaskDialog({ open, onClose, task, userId }: TaskDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    if (task) {
      setTitle(task.title || "")
      setDescription(task.description || "")
    } else {
      setTitle("")
      setDescription("")
    }
  }, [task])

  const [createTask, { loading: creating }] = useMutation(CREATE_TASK, {
    onCompleted: () => {
      toast({
        title: "Success",
        description: "Task created successfully",
      })
      handleClose()
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  const [updateTask, { loading: updating }] = useMutation(UPDATE_TASK, {
    onCompleted: () => {
      toast({
        title: "Success",
        description: "Task updated successfully",
      })
      handleClose()
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  const handleClose = () => {
    setTitle("")
    setDescription("")
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      toast({
        title: "Validation Error",
        description: "Title is required",
        variant: "destructive",
      })
      return
    }

    if (task) {
      await updateTask({
        variables: {
          id: task.id,
          title: title.trim(),
          description: description.trim() || null,
        },
      })
    } else {
      await createTask({
        variables: {
          title: title.trim(),
          description: description.trim() || null,
          userId,
        },
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{task ? "Edit Task" : "Create New Task"}</DialogTitle>
          <DialogDescription>
            {task ? "Update your task details" : "Add a new task to your list"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                placeholder="Enter task description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={creating || updating}>
              {creating || updating
                ? "Saving..."
                : task
                ? "Update"
                : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

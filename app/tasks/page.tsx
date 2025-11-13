"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useQuery, useMutation } from "@apollo/client"
import { GET_TASKS } from "@/graphql/queries"
import { DELETE_TASK, TOGGLE_TASK } from "@/graphql/mutations"
import { getUser, isAuthenticated, removeAuthToken } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { TaskCard } from "@/components/task-card"
import { TaskDialog } from "@/components/task-dialog"
import { useToast } from "@/hooks/use-toast"
import { Plus, LogOut } from "lucide-react"

export default function TasksPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<any>(null)
  const router = useRouter()
  const { toast } = useToast()
  const user = getUser()

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/auth/login")
    }
  }, [router])

  const { data, loading, refetch } = useQuery(GET_TASKS, {
    variables: { userId: user?.id },
    skip: !user?.id,
  })

  const [deleteTask] = useMutation(DELETE_TASK, {
    onCompleted: () => {
      toast({
        title: "Success",
        description: "Task deleted successfully",
      })
      refetch()
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  const [toggleTask] = useMutation(TOGGLE_TASK, {
    onCompleted: () => {
      refetch()
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  const handleLogout = () => {
    removeAuthToken()
    router.push("/auth/login")
  }

  const handleEdit = (task: any) => {
    setEditingTask(task)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      await deleteTask({ variables: { id } })
    }
  }

  const handleToggle = async (id: string, completed: boolean) => {
    await toggleTask({ variables: { id, completed: !completed } })
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setEditingTask(null)
    refetch()
  }

  if (!isAuthenticated()) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">My Tasks</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {user?.name}
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {data?.tasks?.length || 0} Tasks
          </h2>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading tasks...</div>
        ) : data?.tasks?.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No tasks yet. Create your first task to get started!
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data?.tasks?.map((task: any) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggle={handleToggle}
              />
            ))}
          </div>
        )}
      </main>

      <TaskDialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        task={editingTask}
        userId={user?.id || ""}
      />
    </div>
  )
}

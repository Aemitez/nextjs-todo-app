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
  const [dateData, setDateData] = useState({ day: "", dayName: "", month: "", year: "" })
  const [user, setUser] = useState<any>(null)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    setMounted(true)
    const userData = getUser()
    setUser(userData)
    
    if (!isAuthenticated()) {
      router.push("/auth/login")
    }
  }, [router])

  useEffect(() => {
    // Set date on client-side only to avoid hydration mismatch
    const currentDate = new Date()
    const englishMonths = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ]
    const englishDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    
    const dayName = englishDays[currentDate.getDay()]
    const day = currentDate.getDate().toString()
    const month = englishMonths[currentDate.getMonth()]
    const year = currentDate.getFullYear().toString()
    
    setDateData({ day, dayName, month, year })
  }, [])

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

  if (!mounted) {
    return null
  }

  if (!isAuthenticated()) {
    return null
  }

  const todoTasks = data?.tasks?.filter((task: any) => !task.completed) || []
  const doneTasks = data?.tasks?.filter((task: any) => task.completed) || []

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex justify-between items-center">
            {/* Date Display */}
            <div className="flex items-center gap-2 sm:gap-4">
              {dateData.day && (
                <>
                  <div className="text-4xl sm:text-5xl md:text-7xl font-bold leading-none">
                    {dateData.day}
                  </div>
                  <div className="flex flex-col text-sm sm:text-base md:text-xl text-muted-foreground">
                    <span>{dateData.dayName}</span>
                    <span className="text-xs sm:text-sm md:text-xl">{dateData.month} {dateData.year}</span>
                  </div>
                </>
              )}
            </div>
            
            {/* User Info & Logout */}
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="text-xs sm:text-sm text-muted-foreground hidden sm:inline">
                Welcome, {user?.name}
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="text-xs sm:text-sm">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4 sm:py-6 md:py-8">
        <div className="flex justify-between items-center gap-2 sm:gap-4 mb-6">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold">
            {data?.tasks?.length || 0} Tasks Total
          </h2>
          <button 
            onClick={() => setIsDialogOpen(true)}
            className="flex items-center gap-1 sm:gap-2 md:gap-3 group"
          >
            <div 
              className="w-10 h-10 sm:w-14 sm:h-14 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-lg transition-all hover:opacity-90"
              style={{ backgroundColor: "#e145e5" }}
            >
              <Plus className="h-5 w-5 sm:h-7 sm:w-7 md:h-7 md:w-7 text-white" />
            </div>
            <span className="text-sm sm:text-xl md:text-xl font-bold text-gray-800">NEW TASK</span>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading tasks...</div>
        ) : data?.tasks?.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No tasks yet. Create your first task to get started!
          </div>
        ) : (
          <div className="space-y-8">
            {/* TODO Tasks Section */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center justify-center sm:justify-start gap-2">
                <span>TODO TASKS</span>
                <span className="text-xs sm:text-sm text-muted-foreground">
                  ({todoTasks.length})
                </span>
              </h3>
              {todoTasks.length === 0 ? (
                <div className="text-center py-6 sm:py-8 text-sm sm:text-base text-muted-foreground bg-white rounded-lg border-2 border-dashed">
                  No pending tasks. Great job! 🎉
                </div>
              ) : (
                <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {todoTasks.map((task: any) => (
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
            </div>

            {/* Divider */}
            <div className="border-t border-gray-300"></div>

            {/* Done Tasks Section */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center justify-center sm:justify-start gap-2">
                <span>DONE TASKS</span>
                <span className="text-xs sm:text-sm text-muted-foreground">
                  ({doneTasks.length})
                </span>
              </h3>
              {doneTasks.length === 0 ? (
                <div className="text-center py-6 sm:py-8 text-sm sm:text-base text-muted-foreground bg-white rounded-lg border-2 border-dashed">
                  No completed tasks yet
                </div>
              ) : (
                <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {doneTasks.map((task: any) => (
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
            </div>
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

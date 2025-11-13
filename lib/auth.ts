export interface User {
  id: string
  email: string
  name: string
}

export const setAuthToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token)
  }
}

export const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token")
  }
  return null
}

export const removeAuthToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  }
}

export const setUser = (user: User) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("user", JSON.stringify(user))
  }
}

export const getUser = (): User | null => {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("user")
    return user ? JSON.parse(user) : null
  }
  return null
}

export const isAuthenticated = (): boolean => {
  return !!getAuthToken()
}

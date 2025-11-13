import { gql } from "@apollo/client"

export const GET_TASKS = gql`
  query GetTasks($userId: uuid!) {
    tasks(where: { user_id: { _eq: $userId } }, order_by: { created_at: desc }) {
      id
      title
      description
      completed
      created_at
      updated_at
    }
  }
`

export const GET_TASK = gql`
  query GetTask($id: uuid!) {
    tasks_by_pk(id: $id) {
      id
      title
      description
      completed
      created_at
      updated_at
    }
  }
`

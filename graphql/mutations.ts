import { gql } from "@apollo/client"

// เปลี่ยนจาก mutation เป็น query เพื่ออ่านข้อมูล user จาก database
export const LOGIN_USER = gql`
  query LoginUser($email: String!) {
    users(where: { email: { _eq: $email } }, limit: 1) {
      id
      email
      name
      password_hash
    }
  }
`

export const CREATE_USER = gql`
  mutation CreateUser($email: String!, $name: String!, $password_hash: String!) {
    insert_users_one(object: { email: $email, name: $name, password_hash: $password_hash }) {
      id
      email
      name
      created_at
    }
  }
`

export const CREATE_TASK = gql`
  mutation CreateTask($title: String!, $description: String, $userId: uuid!) {
    insert_tasks_one(object: { title: $title, description: $description, user_id: $userId }) {
      id
      title
      description
      completed
      created_at
    }
  }
`

export const UPDATE_TASK = gql`
  mutation UpdateTask($id: uuid!, $title: String, $description: String, $completed: Boolean) {
    update_tasks_by_pk(
      pk_columns: { id: $id }
      _set: { title: $title, description: $description, completed: $completed }
    ) {
      id
      title
      description
      completed
      updated_at
    }
  }
`

export const DELETE_TASK = gql`
  mutation DeleteTask($id: uuid!) {
    delete_tasks_by_pk(id: $id) {
      id
    }
  }
`

export const TOGGLE_TASK = gql`
  mutation ToggleTask($id: uuid!, $completed: Boolean!) {
    update_tasks_by_pk(pk_columns: { id: $id }, _set: { completed: $completed }) {
      id
      completed
    }
  }
`

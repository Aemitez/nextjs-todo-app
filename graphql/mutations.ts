import { gql } from "@apollo/client"

export const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        name
      }
    }
  }
`

export const REGISTER_USER = gql`
  mutation RegisterUser($email: String!, $password: String!, $name: String!) {
    register(email: $email, password: $password, name: $name) {
      token
      user {
        id
        email
        name
      }
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

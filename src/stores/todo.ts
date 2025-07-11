import { create } from 'zustand'
import { combine } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import axios from 'axios'

export type Todos = Todo[] // 할 일 목록
export interface Todo {
  id: string // 할 일 ID
  order: number // 할 일 순서
  title: string // 할 일 제목
  done: boolean // 할 일 완료 여부
  createdAt: string // 할 일 생성일
  updatedAt: string // 할 일 수정일
}

const api = axios.create({
  baseURL: 'https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos',
  headers: {
    'content-type': 'application/json',
    apikey: import.meta.env.VITE_APIKEY,
    username: import.meta.env.VITE_USERNAME
  }
})

export const useTodoStore = create(
  immer(
    combine(
      {
        todos: [] as Todos,
        isLoadingForFetch: true,
        isLoadingForCreate: false,
        isLoadingForUpdate: false,
        isLoadingForDelete: false
      },
      (set, get) => {
        return {
          fetchTodos: async () => {
            set({ isLoadingForFetch: true })
            const { data } = await api({
              method: 'GET'
            })
            set({
              todos: data,
              isLoadingForFetch: false
            })
          },
          createTodo: async (title: string) => {
            if (get().isLoadingForCreate) return
            set({ isLoadingForCreate: true })
            const { data } = await api<Todo>({
              method: 'POST',
              data: {
                title
              }
            })
            set(state => {
              return {
                todos: [data, ...state.todos],
                isLoadingForCreate: false
              }
            })
          },
          updateTodo: async (todo: Todo) => {
            if (get().isLoadingForUpdate) return
            set({ isLoadingForUpdate: true })
            await api({
              url: `/${todo.id}`,
              method: 'PUT',
              data: todo
            })
            set(state => {
              const index = state.todos.findIndex(t => t.id === todo.id)
              state.todos[index] = todo
              state.isLoadingForUpdate = false
            })
          },
          deleteTodo: async (todo: Todo) => {
            if (get().isLoadingForDelete) return
            set({ isLoadingForDelete: true })
            await api({
              url: `/${todo.id}`,
              method: 'DELETE'
            })
            set(state => {
              const index = state.todos.findIndex(t => t.id === todo.id)
              state.todos.splice(index, 1)
              state.isLoadingForDelete = false
            })
          }
        }
      }
    )
  )
)

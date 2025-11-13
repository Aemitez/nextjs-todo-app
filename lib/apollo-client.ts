import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from "@apollo/client"

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL,
})

const authLink = new ApolloLink((operation, forward) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
  
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : "",
      "x-hasura-admin-secret": process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET || "",
    },
  })
  
  return forward(operation)
})

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})

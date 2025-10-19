const API_URL = "http://localhost:3001/graphql";

interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{
    message: string;
    locations?: Array<{
      line: number;
      column: number;
    }>;
    path?: Array<string | number>;
  }>;
}

export class GraphQLClient {
  private token: string | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("auth-token");
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem("auth-token", token);
      } else {
        localStorage.removeItem("auth-token");
      }
    }
  }

  async request<T>(query: string, variables?: Record<string, any>): Promise<T> {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const result: GraphQLResponse<T> = await response.json();

    if (result.errors) {
      throw new Error(result.errors[0].message);
    }

    if (!result.data) {
      throw new Error("No data returned");
    }

    return result.data;
  }

  async query<T>(query: string, variables?: Record<string, any>): Promise<T> {
    return this.request<T>(query, variables);
  }

  async mutate<T>(
    mutation: string,
    variables?: Record<string, any>
  ): Promise<T> {
    return this.request<T>(mutation, variables);
  }
}

export const graphqlClient = new GraphQLClient();

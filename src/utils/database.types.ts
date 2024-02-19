export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      classes: {
        Row: {
          created_at: string
          grade: string | null
          id: string
          period: Database["public"]["Enums"]["period"]
          teacher: string | null
        }
        Insert: {
          created_at?: string
          grade?: string | null
          id?: string
          period?: Database["public"]["Enums"]["period"]
          teacher?: string | null
        }
        Update: {
          created_at?: string
          grade?: string | null
          id?: string
          period?: Database["public"]["Enums"]["period"]
          teacher?: string | null
        }
        Relationships: []
      }
      responsibles: {
        Row: {
          children: string[] | null
          code: number
          cpf: string | null
          created_at: string
          email: string | null
          id: string
          name: string | null
          phone: string | null
          responsible_type: Database["public"]["Enums"]["responsibleType"]
        }
        Insert: {
          children?: string[] | null
          code?: number
          cpf?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          phone?: string | null
          responsible_type?: Database["public"]["Enums"]["responsibleType"]
        }
        Update: {
          children?: string[] | null
          code?: number
          cpf?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          phone?: string | null
          responsible_type?: Database["public"]["Enums"]["responsibleType"]
        }
        Relationships: []
      }
      students: {
        Row: {
          class_id: string | null
          code: number
          created_at: string
          date_of_birth: string | null
          father_id: string | null
          id: string
          invoices: boolean[] | null
          mother_id: string | null
          name: string | null
          responsible_id: string | null
        }
        Insert: {
          class_id?: string | null
          code?: number
          created_at?: string
          date_of_birth?: string | null
          father_id?: string | null
          id?: string
          invoices?: boolean[] | null
          mother_id?: string | null
          name?: string | null
          responsible_id?: string | null
        }
        Update: {
          class_id?: string | null
          code?: number
          created_at?: string
          date_of_birth?: string | null
          father_id?: string | null
          id?: string
          invoices?: boolean[] | null
          mother_id?: string | null
          name?: string | null
          responsible_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      period: "morning" | "afternoon" | "fulltime"
      responsibleType: "mother" | "father" | "other"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never

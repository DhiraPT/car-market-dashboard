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
      CarBrands: {
        Row: {
          brand: string
        }
        Insert: {
          brand: string
        }
        Update: {
          brand?: string
        }
        Relationships: []
      }
      CarModels: {
        Row: {
          brand: string | null
          is_parallel_imported: boolean
          model: string
          model_id: number
        }
        Insert: {
          brand?: string | null
          is_parallel_imported: boolean
          model: string
          model_id: number
        }
        Update: {
          brand?: string | null
          is_parallel_imported?: boolean
          model?: string
          model_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_CarModels_brand_name_fkey"
            columns: ["brand"]
            isOneToOne: false
            referencedRelation: "CarBrands"
            referencedColumns: ["brand"]
          },
        ]
      }
      CarPrices: {
        Row: {
          date: string
          is_coe_included: boolean
          price: number
          submodel_id: number
        }
        Insert: {
          date: string
          is_coe_included: boolean
          price: number
          submodel_id: number
        }
        Update: {
          date?: string
          is_coe_included?: boolean
          price?: number
          submodel_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_Prices_submodel_id_fkey"
            columns: ["submodel_id"]
            isOneToOne: false
            referencedRelation: "CarSubmodels"
            referencedColumns: ["submodel_id"]
          },
        ]
      }
      CarSubmodels: {
        Row: {
          coe_type: string | null
          model_id: number
          submodel: string
          submodel_id: number
        }
        Insert: {
          coe_type?: string | null
          model_id: number
          submodel: string
          submodel_id: number
        }
        Update: {
          coe_type?: string | null
          model_id?: number
          submodel?: string
          submodel_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_CarSubmodels_coe_type_fkey"
            columns: ["coe_type"]
            isOneToOne: false
            referencedRelation: "Coes"
            referencedColumns: ["coe_type"]
          },
          {
            foreignKeyName: "public_CarSubModels_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "CarModels"
            referencedColumns: ["model_id"]
          },
        ]
      }
      CoeBiddings: {
        Row: {
          bidding_date: string
          coe_type: string
          premium: number
          quota: number
        }
        Insert: {
          bidding_date: string
          coe_type: string
          premium: number
          quota: number
        }
        Update: {
          bidding_date?: string
          coe_type?: string
          premium?: number
          quota?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_CoePremiums_coe_type_fkey"
            columns: ["coe_type"]
            isOneToOne: false
            referencedRelation: "Coes"
            referencedColumns: ["coe_type"]
          },
        ]
      }
      Coes: {
        Row: {
          coe_type: string
        }
        Insert: {
          coe_type: string
        }
        Update: {
          coe_type?: string
        }
        Relationships: []
      }
      LastUpdates: {
        Row: {
          data_title: string
          updated_at: string
        }
        Insert: {
          data_title: string
          updated_at?: string
        }
        Update: {
          data_title?: string
          updated_at?: string
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

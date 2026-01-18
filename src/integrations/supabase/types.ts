export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      badges: {
        Row: {
          created_at: string | null
          description: string | null
          description_kg: string | null
          icon: string
          id: string
          name: string
          name_kg: string | null
          points_required: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          description_kg?: string | null
          icon: string
          id?: string
          name: string
          name_kg?: string | null
          points_required?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          description_kg?: string | null
          icon?: string
          id?: string
          name?: string
          name_kg?: string | null
          points_required?: number | null
        }
        Relationships: []
      }
      businesses: {
        Row: {
          address: string | null
          category: string
          created_at: string | null
          description: string | null
          description_kg: string | null
          id: string
          image_url: string | null
          is_verified: boolean | null
          latitude: number | null
          longitude: number | null
          name: string
          name_kg: string | null
          owner_id: string
          phone: string | null
          rating: number | null
          reviews_count: number | null
          village_id: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          category: string
          created_at?: string | null
          description?: string | null
          description_kg?: string | null
          id?: string
          image_url?: string | null
          is_verified?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name: string
          name_kg?: string | null
          owner_id: string
          phone?: string | null
          rating?: number | null
          reviews_count?: number | null
          village_id?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          category?: string
          created_at?: string | null
          description?: string | null
          description_kg?: string | null
          id?: string
          image_url?: string | null
          is_verified?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          name_kg?: string | null
          owner_id?: string
          phone?: string | null
          rating?: number | null
          reviews_count?: number | null
          village_id?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "businesses_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "businesses_village_id_fkey"
            columns: ["village_id"]
            isOneToOne: false
            referencedRelation: "villages"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_bot_messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          role: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          role: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_bot_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_participants: {
        Row: {
          conversation_id: string
          created_at: string
          id: string
          profile_id: string
        }
        Insert: {
          conversation_id: string
          created_at?: string
          id?: string
          profile_id: string
        }
        Update: {
          conversation_id?: string
          created_at?: string
          id?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_participants_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversation_participants_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      donation_contributions: {
        Row: {
          amount: number
          created_at: string | null
          donation_id: string
          id: string
          is_anonymous: boolean | null
          message: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          donation_id: string
          id?: string
          is_anonymous?: boolean | null
          message?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          donation_id?: string
          id?: string
          is_anonymous?: boolean | null
          message?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "donation_contributions_donation_id_fkey"
            columns: ["donation_id"]
            isOneToOne: false
            referencedRelation: "donations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donation_contributions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      donations: {
        Row: {
          author_id: string
          created_at: string | null
          current_amount: number | null
          description: string | null
          description_kg: string | null
          ends_at: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          target_amount: number
          title: string
          title_kg: string | null
          village_id: string | null
        }
        Insert: {
          author_id: string
          created_at?: string | null
          current_amount?: number | null
          description?: string | null
          description_kg?: string | null
          ends_at?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          target_amount: number
          title: string
          title_kg?: string | null
          village_id?: string | null
        }
        Update: {
          author_id?: string
          created_at?: string | null
          current_amount?: number | null
          description?: string | null
          description_kg?: string | null
          ends_at?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          target_amount?: number
          title?: string
          title_kg?: string | null
          village_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donations_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donations_village_id_fkey"
            columns: ["village_id"]
            isOneToOne: false
            referencedRelation: "villages"
            referencedColumns: ["id"]
          },
        ]
      }
      followers: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "followers_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "followers_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      issues: {
        Row: {
          author_id: string
          category: string
          created_at: string | null
          description: string
          description_kg: string | null
          id: string
          image_url: string | null
          latitude: number | null
          longitude: number | null
          resolved_at: string | null
          status: string
          title: string
          title_kg: string | null
          village_id: string | null
          votes_count: number | null
        }
        Insert: {
          author_id: string
          category?: string
          created_at?: string | null
          description: string
          description_kg?: string | null
          id?: string
          image_url?: string | null
          latitude?: number | null
          longitude?: number | null
          resolved_at?: string | null
          status?: string
          title: string
          title_kg?: string | null
          village_id?: string | null
          votes_count?: number | null
        }
        Update: {
          author_id?: string
          category?: string
          created_at?: string | null
          description?: string
          description_kg?: string | null
          id?: string
          image_url?: string | null
          latitude?: number | null
          longitude?: number | null
          resolved_at?: string | null
          status?: string
          title?: string
          title_kg?: string | null
          village_id?: string | null
          votes_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "issues_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "issues_village_id_fkey"
            columns: ["village_id"]
            isOneToOne: false
            referencedRelation: "villages"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          author_id: string
          company_name: string
          contact_email: string | null
          contact_phone: string | null
          created_at: string | null
          description: string
          description_kg: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          job_type: string
          salary_max: number | null
          salary_min: number | null
          title: string
          title_kg: string | null
          village_id: string | null
        }
        Insert: {
          author_id: string
          company_name: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description: string
          description_kg?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          job_type?: string
          salary_max?: number | null
          salary_min?: number | null
          title: string
          title_kg?: string | null
          village_id?: string | null
        }
        Update: {
          author_id?: string
          company_name?: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description?: string
          description_kg?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          job_type?: string
          salary_max?: number | null
          salary_min?: number | null
          title?: string
          title_kg?: string | null
          village_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jobs_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_village_id_fkey"
            columns: ["village_id"]
            isOneToOne: false
            referencedRelation: "villages"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          read_at: string | null
          sender_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          read_at?: string | null
          sender_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          read_at?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          link: string | null
          message: string
          message_kg: string | null
          title: string
          title_kg: string | null
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          link?: string | null
          message: string
          message_kg?: string | null
          title: string
          title_kg?: string | null
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          link?: string | null
          message?: string
          message_kg?: string | null
          title?: string
          title_kg?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      poll_options: {
        Row: {
          created_at: string | null
          id: string
          poll_id: string
          text: string
          text_kg: string | null
          votes_count: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          poll_id: string
          text: string
          text_kg?: string | null
          votes_count?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          poll_id?: string
          text?: string
          text_kg?: string | null
          votes_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "poll_options_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "voting_polls"
            referencedColumns: ["id"]
          },
        ]
      }
      post_likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          author_id: string
          category: string | null
          comments_count: number | null
          content: string
          created_at: string
          id: string
          image_url: string | null
          likes_count: number | null
          updated_at: string
          village_id: string | null
        }
        Insert: {
          author_id: string
          category?: string | null
          comments_count?: number | null
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          likes_count?: number | null
          updated_at?: string
          village_id?: string | null
        }
        Update: {
          author_id?: string
          category?: string | null
          comments_count?: number | null
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          likes_count?: number | null
          updated_at?: string
          village_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          full_name: string | null
          id: string
          score: number | null
          updated_at: string
          user_id: string
          username: string | null
          village_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          score?: number | null
          updated_at?: string
          user_id: string
          username?: string | null
          village_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          score?: number | null
          updated_at?: string
          user_id?: string
          username?: string | null
          village_id?: string | null
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          badge_id: string
          earned_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          badge_id: string
          earned_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          badge_id?: string
          earned_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_mission_progress: {
        Row: {
          completed_at: string | null
          created_at: string | null
          current_progress: number
          id: string
          is_completed: boolean | null
          mission_id: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          current_progress?: number
          id?: string
          is_completed?: boolean | null
          mission_id: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          current_progress?: number
          id?: string
          is_completed?: boolean | null
          mission_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_mission_progress_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "weekly_missions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_mission_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      villages: {
        Row: {
          created_at: string | null
          district: string | null
          id: string
          latitude: number
          longitude: number
          name: string
          name_kg: string | null
          population: number | null
          region: string
        }
        Insert: {
          created_at?: string | null
          district?: string | null
          id?: string
          latitude: number
          longitude: number
          name: string
          name_kg?: string | null
          population?: number | null
          region: string
        }
        Update: {
          created_at?: string | null
          district?: string | null
          id?: string
          latitude?: number
          longitude?: number
          name?: string
          name_kg?: string | null
          population?: number | null
          region?: string
        }
        Relationships: []
      }
      votes: {
        Row: {
          created_at: string | null
          id: string
          option_id: string
          poll_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          option_id: string
          poll_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          option_id?: string
          poll_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "votes_option_id_fkey"
            columns: ["option_id"]
            isOneToOne: false
            referencedRelation: "poll_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "voting_polls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      voting_polls: {
        Row: {
          author_id: string
          created_at: string | null
          description: string | null
          description_kg: string | null
          ends_at: string
          id: string
          is_active: boolean | null
          title: string
          title_kg: string | null
          village_id: string | null
        }
        Insert: {
          author_id: string
          created_at?: string | null
          description?: string | null
          description_kg?: string | null
          ends_at: string
          id?: string
          is_active?: boolean | null
          title: string
          title_kg?: string | null
          village_id?: string | null
        }
        Update: {
          author_id?: string
          created_at?: string | null
          description?: string | null
          description_kg?: string | null
          ends_at?: string
          id?: string
          is_active?: boolean | null
          title?: string
          title_kg?: string | null
          village_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "voting_polls_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "voting_polls_village_id_fkey"
            columns: ["village_id"]
            isOneToOne: false
            referencedRelation: "villages"
            referencedColumns: ["id"]
          },
        ]
      }
      weekly_missions: {
        Row: {
          created_at: string | null
          description: string | null
          description_kg: string | null
          ends_at: string
          id: string
          is_active: boolean | null
          mission_type: string
          reward_points: number
          starts_at: string
          target_count: number
          title: string
          title_kg: string | null
          village_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          description_kg?: string | null
          ends_at?: string
          id?: string
          is_active?: boolean | null
          mission_type?: string
          reward_points?: number
          starts_at?: string
          target_count?: number
          title: string
          title_kg?: string | null
          village_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          description_kg?: string | null
          ends_at?: string
          id?: string
          is_active?: boolean | null
          mission_type?: string
          reward_points?: number
          starts_at?: string
          target_count?: number
          title?: string
          title_kg?: string | null
          village_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "weekly_missions_village_id_fkey"
            columns: ["village_id"]
            isOneToOne: false
            referencedRelation: "villages"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_user_score: {
        Args: { p_points: number; p_user_id: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface UserWithRole {
  id: string;
  user_id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  score: number;
  created_at: string;
  role?: string;
}

interface Stats {
  totalUsers: number;
  totalPosts: number;
  totalIssues: number;
  resolvedIssues: number;
  pendingIssues: number;
  totalDonations: number;
}

export const useAdmin = () => {
  const { user, profile } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalPosts: 0,
    totalIssues: 0,
    resolvedIssues: 0,
    pendingIssues: 0,
    totalDonations: 0
  });

  const checkAdminStatus = async () => {
    if (!user) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    } else {
      setIsAdmin(!!data);
    }
    setLoading(false);
  };

  const fetchUsers = async () => {
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (profilesError) {
      console.error('Error fetching users:', profilesError);
      return;
    }

    const { data: roles } = await supabase
      .from('user_roles')
      .select('user_id, role');

    const usersWithRoles = (profiles || []).map(profile => ({
      ...profile,
      role: roles?.find(r => r.user_id === profile.user_id)?.role || 'user'
    }));

    setUsers(usersWithRoles);
  };

  const fetchStats = async () => {
    const [usersRes, postsRes, issuesRes, donationsRes] = await Promise.all([
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('posts').select('id', { count: 'exact', head: true }),
      supabase.from('issues').select('id, status'),
      supabase.from('donations').select('id', { count: 'exact', head: true })
    ]);

    const issues = issuesRes.data || [];
    
    setStats({
      totalUsers: usersRes.count || 0,
      totalPosts: postsRes.count || 0,
      totalIssues: issues.length,
      resolvedIssues: issues.filter(i => i.status === 'resolved').length,
      pendingIssues: issues.filter(i => i.status === 'pending').length,
      totalDonations: donationsRes.count || 0
    });
  };

  const makeAdmin = async (userId: string) => {
    const { error } = await supabase
      .from('user_roles')
      .insert({ user_id: userId, role: 'admin' });

    if (error) {
      if (error.code === '23505') {
        toast.error('Колдонуучу мурунтан эле админ');
      } else {
        toast.error('Ката кетти');
        console.error(error);
      }
      return false;
    }

    toast.success('Админ укугу берилди');
    fetchUsers();
    return true;
  };

  const removeAdmin = async (userId: string) => {
    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId)
      .eq('role', 'admin');

    if (error) {
      toast.error('Ката кетти');
      return false;
    }

    toast.success('Админ укугу алынды');
    fetchUsers();
    return true;
  };

  const deleteIssue = async (issueId: string) => {
    const { error } = await supabase
      .from('issues')
      .delete()
      .eq('id', issueId);

    if (error) {
      toast.error('Ката кетти');
      return false;
    }

    toast.success('Маселе өчүрүлдү');
    return true;
  };

  const updateIssueStatus = async (issueId: string, status: string) => {
    const { error } = await supabase
      .from('issues')
      .update({ 
        status,
        resolved_at: status === 'resolved' ? new Date().toISOString() : null
      })
      .eq('id', issueId);

    if (error) {
      toast.error('Ката кетти');
      return false;
    }

    toast.success('Статус жаңыртылды');
    return true;
  };

  const deletePost = async (postId: string) => {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId);

    if (error) {
      toast.error('Ката кетти');
      return false;
    }

    toast.success('Пост өчүрүлдү');
    return true;
  };

  const deleteUser = async (userId: string) => {
    // First delete user roles
    await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId);

    // Delete profile
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('user_id', userId);

    if (error) {
      toast.error('Ката кетти');
      return false;
    }

    toast.success('Колдонуучу өчүрүлдү');
    fetchUsers();
    return true;
  };

  useEffect(() => {
    checkAdminStatus();
  }, [user]);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
      fetchStats();
    }
  }, [isAdmin]);

  return {
    isAdmin,
    loading,
    users,
    stats,
    makeAdmin,
    removeAdmin,
    deleteIssue,
    updateIssueStatus,
    deletePost,
    deleteUser,
    refetchUsers: fetchUsers,
    refetchStats: fetchStats
  };
};

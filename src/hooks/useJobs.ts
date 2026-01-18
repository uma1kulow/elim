import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Job {
  id: string;
  title: string;
  title_kg: string | null;
  description: string;
  description_kg: string | null;
  company_name: string;
  salary_min: number | null;
  salary_max: number | null;
  job_type: string;
  contact_phone: string | null;
  contact_email: string | null;
  is_active: boolean;
  created_at: string;
  expires_at: string | null;
  author: {
    full_name: string | null;
    avatar_url: string | null;
  };
}

export interface Business {
  id: string;
  name: string;
  name_kg: string | null;
  description: string | null;
  description_kg: string | null;
  category: string;
  address: string | null;
  phone: string | null;
  website: string | null;
  image_url: string | null;
  rating: number;
  reviews_count: number;
  is_verified: boolean;
  created_at: string;
  owner: {
    full_name: string | null;
    avatar_url: string | null;
  };
}

export const useEconomy = () => {
  const { profile } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    const { data, error } = await supabase
      .from('jobs')
      .select(`
        *,
        author:profiles!author_id(full_name, avatar_url)
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (!error) {
      setJobs(data || []);
    }
  };

  const fetchBusinesses = async () => {
    const { data, error } = await supabase
      .from('businesses')
      .select(`
        *,
        owner:profiles!owner_id(full_name, avatar_url)
      `)
      .order('created_at', { ascending: false });

    if (!error) {
      setBusinesses(data || []);
    }
  };

  const fetchAll = async () => {
    setLoading(true);
    await Promise.all([fetchJobs(), fetchBusinesses()]);
    setLoading(false);
  };

  const createJob = async (
    title: string,
    description: string,
    companyName: string,
    jobType: string,
    salaryMin?: number,
    salaryMax?: number,
    contactPhone?: string,
    contactEmail?: string
  ) => {
    if (!profile) {
      toast.error('Жарыя берүү үчүн кириңиз');
      return null;
    }

    const { data, error } = await supabase
      .from('jobs')
      .insert({
        title,
        title_kg: title,
        description,
        description_kg: description,
        company_name: companyName,
        job_type: jobType,
        salary_min: salaryMin,
        salary_max: salaryMax,
        contact_phone: contactPhone,
        contact_email: contactEmail,
        author_id: profile.id
      })
      .select()
      .single();

    if (error) {
      toast.error('Ката кетти');
      return null;
    }

    toast.success('Жумуш жарыяланды!');
    fetchJobs();
    return data;
  };

  const createBusiness = async (
    name: string,
    description: string,
    category: string,
    address?: string,
    phone?: string,
    website?: string,
    imageUrl?: string
  ) => {
    if (!profile) {
      toast.error('Бизнес каттоо үчүн кириңиз');
      return null;
    }

    const { data, error } = await supabase
      .from('businesses')
      .insert({
        name,
        name_kg: name,
        description,
        description_kg: description,
        category,
        address,
        phone,
        website,
        image_url: imageUrl,
        owner_id: profile.id
      })
      .select()
      .single();

    if (error) {
      toast.error('Ката кетти');
      return null;
    }

    // Update user score and potentially award badge
    await supabase.rpc('add_user_score', { p_user_id: profile.id, p_points: 50 });
    
    toast.success('Бизнес катталды! +50 балл');
    fetchBusinesses();
    return data;
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return { 
    jobs, 
    businesses, 
    loading, 
    createJob, 
    createBusiness, 
    refetchJobs: fetchJobs,
    refetchBusinesses: fetchBusinesses 
  };
};

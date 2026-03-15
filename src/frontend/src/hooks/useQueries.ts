import type { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  AppUserRole,
  Application,
  FreelancerProfile,
  Job,
  PlatformStats,
  UserProfile,
} from "../backend.d";
import { useActor } from "./useActor";

export function useAllJobs() {
  const { actor, isFetching } = useActor();
  return useQuery<Job[]>({
    queryKey: ["jobs"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllJobs();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useJobsByCategory(category: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Job[]>({
    queryKey: ["jobs", "category", category],
    queryFn: async () => {
      if (!actor) return [];
      if (!category || category === "all") return actor.getAllJobs();
      return actor.browseJobsByCategory(category);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllFreelancers() {
  const { actor, isFetching } = useActor();
  return useQuery<FreelancerProfile[]>({
    queryKey: ["freelancers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllFreelancersByName();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useFreelancersBySkill(skill: string) {
  const { actor, isFetching } = useActor();
  return useQuery<FreelancerProfile[]>({
    queryKey: ["freelancers", "skill", skill],
    queryFn: async () => {
      if (!actor) return [];
      if (!skill) return actor.getAllFreelancersByName();
      return actor.browseFreelancersBySkill(skill);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useFreelancerProfile(principal: Principal | null) {
  const { actor, isFetching } = useActor();
  return useQuery<FreelancerProfile | null>({
    queryKey: ["freelancerProfile", principal?.toString()],
    queryFn: async () => {
      if (!actor || !principal) return null;
      return actor.getFreelancerProfile(principal);
    },
    enabled: !!actor && !isFetching && !!principal,
  });
}

export function useJobApplications(jobId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Application[]>({
    queryKey: ["applications", jobId?.toString()],
    queryFn: async () => {
      if (!actor || jobId === null) return [];
      return actor.getJobApplications(jobId);
    },
    enabled: !!actor && !isFetching && jobId !== null,
  });
}

export function useCallerProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile | null>({
    queryKey: ["callerProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePlatformStats() {
  const { actor, isFetching } = useActor();
  return useQuery<PlatformStats | null>({
    queryKey: ["platformStats"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getPlatformStats();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRegisterFreelancer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      bio: string;
      skills: string[];
      hourlyRate: bigint;
      portfolio: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.registerFreelancer(
        data.name,
        data.bio,
        data.skills,
        data.hourlyRate,
        data.portfolio,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["callerProfile"] });
      queryClient.invalidateQueries({ queryKey: ["freelancers"] });
    },
  });
}

export function useRegisterClient() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { name: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.registerClient(data.name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["callerProfile"] });
    },
  });
}

export function usePostJob() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      budget: bigint;
      requiredSkills: string[];
      category: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.postJob(
        data.title,
        data.description,
        data.budget,
        data.requiredSkills,
        data.category,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
}

export function useApplyToJob() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { jobId: bigint; proposal: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.applyToJob(data.jobId, data.proposal);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["applications", variables.jobId.toString()],
      });
    },
  });
}

export function useAcceptApplication() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { jobId: bigint; freelancer: Principal }) => {
      if (!actor) throw new Error("Not connected");
      return actor.acceptApplication(data.jobId, data.freelancer);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["applications", variables.jobId.toString()],
      });
    },
  });
}

export function useRejectApplication() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { jobId: bigint; freelancer: Principal }) => {
      if (!actor) throw new Error("Not connected");
      return actor.rejectApplication(data.jobId, data.freelancer);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["applications", variables.jobId.toString()],
      });
    },
  });
}

export type {
  FreelancerProfile,
  Job,
  Application,
  PlatformStats,
  UserProfile,
  AppUserRole,
};

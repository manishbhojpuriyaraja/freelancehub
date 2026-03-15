import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Application {
    jobId: bigint;
    proposal: string;
    freelancer: Principal;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface Job {
    id: bigint;
    client: Principal;
    title: string;
    description: string;
    category: string;
    budget: bigint;
    requiredSkills: Array<string>;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface FreelancerProfile {
    id: Principal;
    bio: string;
    portfolio: string;
    name: string;
    hourlyRate: bigint;
    skills: Array<string>;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export interface PlatformStats {
    totalJobs: bigint;
    totalUsers: bigint;
    totalApplications: bigint;
}
export interface UserProfile {
    name: string;
    role: AppUserRole;
}
export enum AppUserRole {
    client = "client",
    freelancer = "freelancer"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    acceptApplication(jobId: bigint, freelancer: Principal): Promise<void>;
    applyToJob(jobId: bigint, proposal: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    browseFreelancersBySkill(skill: string): Promise<Array<FreelancerProfile>>;
    browseJobsByCategory(category: string): Promise<Array<Job>>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    createJobPayment(jobId: bigint, successUrl: string, cancelUrl: string): Promise<string>;
    getAllFreelancersByName(): Promise<Array<FreelancerProfile>>;
    getAllJobs(): Promise<Array<Job>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getFreelancerProfile(freelancer: Principal): Promise<FreelancerProfile | null>;
    getJobApplications(jobId: bigint): Promise<Array<Application>>;
    getJobPaymentStatus(jobId: bigint): Promise<string | null>;
    getPlatformStats(): Promise<PlatformStats>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    postJob(title: string, description: string, budget: bigint, requiredSkills: Array<string>, category: string): Promise<void>;
    registerClient(name: string): Promise<void>;
    registerFreelancer(name: string, bio: string, skills: Array<string>, hourlyRate: bigint, portfolio: string): Promise<void>;
    rejectApplication(jobId: bigint, freelancer: Principal): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    verifyJobPayment(sessionId: string): Promise<StripeSessionStatus>;
}

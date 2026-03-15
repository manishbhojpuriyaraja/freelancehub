import Map "mo:core/Map";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";

module {
  type OldAppUserRole = {
    #freelancer : ();
    #client : ();
  };

  type OldUserProfile = {
    name : Text;
    role : OldAppUserRole;
  };

  type OldFreelancerProfile = {
    id : Principal;
    name : Text;
    bio : Text;
    skills : [Text];
    hourlyRate : Nat;
    portfolio : Text;
  };

  type OldJob = {
    id : Nat;
    client : Principal;
    title : Text;
    description : Text;
    budget : Nat;
    requiredSkills : [Text];
    category : Text;
  };

  type OldApplication = {
    jobId : Nat;
    freelancer : Principal;
    proposal : Text;
  };

  type OldActor = {
    userProfiles : Map.Map<Principal, OldUserProfile>;
    freelancerProfiles : Map.Map<Principal, OldFreelancerProfile>;
    jobs : Map.Map<Nat, OldJob>;
    applications : Map.Map<Nat, List.List<OldApplication>>;
    nextJobId : Nat;
    accessControlState : AccessControl.AccessControlState;
  };

  type NewAppUserRole = {
    #freelancer;
    #client;
  };

  type NewUserProfile = {
    name : Text;
    role : NewAppUserRole;
  };

  type NewFreelancerProfile = {
    id : Principal;
    name : Text;
    bio : Text;
    skills : [Text];
    hourlyRate : Nat;
    portfolio : Text;
  };

  type NewJob = {
    id : Nat;
    client : Principal;
    title : Text;
    description : Text;
    budget : Nat;
    requiredSkills : [Text];
    category : Text;
  };

  type NewApplication = {
    jobId : Nat;
    freelancer : Principal;
    proposal : Text;
  };

  type NewActor = {
    userProfiles : Map.Map<Principal, NewUserProfile>;
    freelancerProfiles : Map.Map<Principal, NewFreelancerProfile>;
    jobs : Map.Map<Nat, NewJob>;
    applications : Map.Map<Nat, List.List<NewApplication>>;
    jobPayments : Map.Map<Nat, Text>;
    nextJobId : Nat;
    stripeSecretKey : ?Text;
    accessControlState : AccessControl.AccessControlState;
  };

  public func run(old : OldActor) : NewActor {
    {
      userProfiles = old.userProfiles;
      freelancerProfiles = old.freelancerProfiles;
      jobs = old.jobs;
      applications = old.applications;
      jobPayments = Map.empty<Nat, Text>();
      nextJobId = old.nextJobId;
      stripeSecretKey = null;
      accessControlState = old.accessControlState;
    };
  };
};

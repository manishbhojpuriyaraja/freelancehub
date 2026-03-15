import List "mo:core/List";
import Text "mo:core/Text";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Stripe "stripe/stripe";
import OutCall "http-outcalls/outcall";
import Migration "migration";
import Nat "mo:core/Nat";

(with migration = Migration.run)
actor {
  // Application-specific role types for user profiles
  public type AppUserRole = {
    #freelancer;
    #client;
  };

  public type UserProfile = {
    name : Text;
    role : AppUserRole;
  };

  public type FreelancerProfile = {
    id : Principal;
    name : Text;
    bio : Text;
    skills : [Text];
    hourlyRate : Nat;
    portfolio : Text;
  };

  public type Job = {
    id : Nat;
    client : Principal;
    title : Text;
    description : Text;
    budget : Nat;
    requiredSkills : [Text];
    category : Text;
  };

  public type Application = {
    jobId : Nat;
    freelancer : Principal;
    proposal : Text;
  };

  public type PlatformStats = {
    totalUsers : Nat;
    totalJobs : Nat;
    totalApplications : Nat;
  };

  public type JobPaymentStatus = {
    jobId : Nat;
    sessionId : Text;
    status : Stripe.StripeSessionStatus;
  };

  module FreelancerProfile {
    public func compareByName(profile1 : FreelancerProfile, profile2 : FreelancerProfile) : Order.Order {
      Text.compare(profile1.name, profile2.name);
    };
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let freelancerProfiles = Map.empty<Principal, FreelancerProfile>();
  let jobs = Map.empty<Nat, Job>();
  let applications = Map.empty<Nat, List.List<Application>>();
  let jobPayments = Map.empty<Nat, Text>();
  var nextJobId = 0;

  var stripeSecretKey : ?Text = null;

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User profile management functions required by frontend
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Register as freelancer
  public shared ({ caller }) func registerFreelancer(name : Text, bio : Text, skills : [Text], hourlyRate : Nat, portfolio : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can register as freelancers");
    };
    if (freelancerProfiles.containsKey(caller)) {
      Runtime.trap("Freelancer profile already exists");
    };
    let profile : FreelancerProfile = {
      id = caller;
      name;
      bio;
      skills;
      hourlyRate;
      portfolio;
    };
    freelancerProfiles.add(caller, profile);

    // Save user profile with freelancer role
    let userProfile : UserProfile = {
      name;
      role = #freelancer;
    };
    userProfiles.add(caller, userProfile);
  };

  // Register as client
  public shared ({ caller }) func registerClient(name : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can register as clients");
    };

    // Check if already registered
    switch (userProfiles.get(caller)) {
      case (?existing) {
        Runtime.trap("User already registered");
      };
      case null {
        let userProfile : UserProfile = {
          name;
          role = #client;
        };
        userProfiles.add(caller, userProfile);
      };
    };
  };

  // Post a job (clients only)
  public shared ({ caller }) func postJob(title : Text, description : Text, budget : Nat, requiredSkills : [Text], category : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can post jobs");
    };

    // Verify caller is a client
    switch (userProfiles.get(caller)) {
      case (?profile) {
        switch (profile.role) {
          case (#client) {
            let job : Job = {
              id = nextJobId;
              client = caller;
              title;
              description;
              budget;
              requiredSkills;
              category;
            };
            jobs.add(nextJobId, job);
            nextJobId += 1;
          };
          case (#freelancer) {
            Runtime.trap("Only clients can post jobs");
          };
        };
      };
      case null {
        Runtime.trap("User must register as a client first");
      };
    };
  };

  // Apply to a job (freelancers only)
  public shared ({ caller }) func applyToJob(jobId : Nat, proposal : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can apply to jobs");
    };

    // Verify caller is a freelancer
    switch (userProfiles.get(caller)) {
      case (?profile) {
        switch (profile.role) {
          case (#freelancer) {
            switch (jobs.get(jobId)) {
              case (null) { Runtime.trap("Job does not exist") };
              case (?_job) {
                let application = {
                  jobId;
                  freelancer = caller;
                  proposal;
                };
                switch (applications.get(jobId)) {
                  case (null) {
                    let list = List.empty<Application>();
                    list.add(application);
                    applications.add(jobId, list);
                  };
                  case (?appList) {
                    appList.add(application);
                  };
                };
              };
            };
          };
          case (#client) {
            Runtime.trap("Only freelancers can apply to jobs");
          };
        };
      };
      case null {
        Runtime.trap("User must register as a freelancer first");
      };
    };
  };

  // Browse freelancers by skill (public, no auth required)
  public query ({ caller }) func browseFreelancersBySkill(skill : Text) : async [FreelancerProfile] {
    freelancerProfiles.values().toArray().filter(
      func(profile) {
        profile.skills.values().any(func(x) { x == skill });
      }
    );
  };

  // Browse jobs by category (public, no auth required)
  public query ({ caller }) func browseJobsByCategory(category : Text) : async [Job] {
    jobs.values().toArray().filter(func(job) { job.category == category });
  };

  // Get all jobs (public, no auth required)
  public query ({ caller }) func getAllJobs() : async [Job] {
    jobs.values().toArray();
  };

  // Get freelancer profile (public, no auth required)
  public query ({ caller }) func getFreelancerProfile(freelancer : Principal) : async ?FreelancerProfile {
    freelancerProfiles.get(freelancer);
  };

  // Get all freelancers sorted by name (public, no auth required)
  public query ({ caller }) func getAllFreelancersByName() : async [FreelancerProfile] {
    freelancerProfiles.values().toArray().sort(FreelancerProfile.compareByName);
  };

  // Get applications for a job (only job owner can view)
  public query ({ caller }) func getJobApplications(jobId : Nat) : async [Application] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view applications");
    };

    switch (jobs.get(jobId)) {
      case (null) { Runtime.trap("Job does not exist") };
      case (?job) {
        if (job.client != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Only the job owner or admin can view applications");
        };
        switch (applications.get(jobId)) {
          case (null) { [] };
          case (?appList) { appList.toArray() };
        };
      };
    };
  };

  // Accept application (only job owner)
  public shared ({ caller }) func acceptApplication(jobId : Nat, freelancer : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can accept applications");
    };

    switch (jobs.get(jobId)) {
      case (null) { Runtime.trap("Job does not exist") };
      case (?job) {
        if (job.client != caller) {
          Runtime.trap("Only the client who posted the job can accept applications");
        };
        switch (applications.get(jobId)) {
          case (null) { Runtime.trap("No applications for this job") };
          case (?appList) {
            let hasApplication = appList.toArray().any(func(app) { app.freelancer == freelancer });
            if (not hasApplication) {
              Runtime.trap("Freelancer has not applied to this job");
            };
            // Application acceptance logic would go here
          };
        };
      };
    };
  };

  // Reject application (only job owner)
  public shared ({ caller }) func rejectApplication(jobId : Nat, freelancer : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can reject applications");
    };

    switch (jobs.get(jobId)) {
      case (null) { Runtime.trap("Job does not exist") };
      case (?job) {
        if (job.client != caller) {
          Runtime.trap("Only the client who posted the job can reject applications");
        };
        switch (applications.get(jobId)) {
          case (null) { Runtime.trap("No applications for this job") };
          case (?appList) {
            let filteredApps = appList.filter(func(app) { app.freelancer != freelancer });
            applications.add(jobId, filteredApps);
          };
        };
      };
    };
  };

  // Get platform statistics (admin only)
  public query ({ caller }) func getPlatformStats() : async PlatformStats {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view platform statistics");
    };

    let appLists = applications.values().toArray();
    var totalApplications = 0;
    for (appList in appLists.values()) {
      totalApplications += appList.toArray().size();
    };

    {
      totalUsers = userProfiles.size();
      totalJobs = jobs.size();
      totalApplications;
    };
  };

  // Stripe Integration
  public query ({ caller }) func isStripeConfigured() : async Bool {
    switch (stripeSecretKey) {
      case (null) { false };
      case (?_key) { true };
    };
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can set Stripe configuration");
    };
    stripeSecretKey := ?config.secretKey;
  };

  func getStripeConfig() : Stripe.StripeConfiguration {
    switch (stripeSecretKey) {
      case (null) { Runtime.trap("Stripe secret key not configured") };
      case (?key) {
        {
          secretKey = key;
          allowedCountries = ["US", "GB", "DE"];
        };
      };
    };
  };

  public shared ({ caller }) func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    await Stripe.getSessionStatus(getStripeConfig(), sessionId, transform);
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    await Stripe.createCheckoutSession(getStripeConfig(), caller, items, successUrl, cancelUrl, transform);
  };

  public shared ({ caller }) func createJobPayment(jobId : Nat, successUrl : Text, cancelUrl : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create payments");
    };

    switch (jobs.get(jobId)) {
      case (null) { Runtime.trap("Job does not exist") };
      case (?job) {
        if (caller != job.client) {
          Runtime.trap("Only the client who posted the job can create a payment");
        };

        // Calculate 10% commission
        let commission = (job.budget * 10) / 100;
        let totalAmount = job.budget + commission;

        let item : Stripe.ShoppingItem = {
          currency = "usd";
          productName = job.title;
          productDescription = job.description;
          priceInCents = totalAmount * 100;
          quantity = 1;
        };

        let sessionId = await Stripe.createCheckoutSession(
          getStripeConfig(),
          caller,
          [item],
          successUrl,
          cancelUrl,
          transform
        );

        jobPayments.add(jobId, sessionId);
        sessionId;
      };
    };
  };

  public shared ({ caller }) func verifyJobPayment(sessionId : Text) : async Stripe.StripeSessionStatus {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can verify payments");
    };

    await Stripe.getSessionStatus(getStripeConfig(), sessionId, transform);
  };

  public query ({ caller }) func getJobPaymentStatus(jobId : Nat) : async ?Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view payment status");
    };

    switch (jobs.get(jobId)) {
      case (null) { Runtime.trap("Job does not exist") };
      case (?job) {
        // Allow job owner or admin to view payment status
        if (caller != job.client and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Only the job owner or admin can view payment status");
        };
        jobPayments.get(jobId);
      };
    };
  };

  public query ({ caller }) func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };
};

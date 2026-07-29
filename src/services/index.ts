// ── API Service Layer ──
// Centralized exports for all API service modules

export { authApi, type AuthUser, type LoginResponse } from "./Auth";
export { servicesApi, type ServiceData } from "./Service";
export { partnersApi, type PartnerData } from "./Partner";
export { testimonialsApi, type TestimonialData } from "./Testimonial";
export { contactApi, type ContactInfoData } from "./Contact";
export { domainPlansApi, type DomainPlanData } from "./DomainPlan";
export {
  servicePackagesApi,
  type ServicePackageData,
  type ServicePackagesGrouped,
} from "./ServicePackage";
export { blogsApi, type BlogData, type PaginatedBlogs } from "./Blog";

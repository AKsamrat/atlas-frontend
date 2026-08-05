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
export {
  ordersApi,
  type OrderData,
  type OrderItemData,
  type OrderStats,
  type CreateOrderPayload,
  type PaginatedOrders,
} from "./Order";
export {
  productsApi,
  type ProductData,
  type ProductStats,
  type CreateProductPayload,
  type PaginatedProducts,
} from "./Product";
export {
  customersApi,
  type CustomerData,
  type CustomerStats,
  type CreateCustomerPayload,
  type PaginatedCustomers,
} from "./Customer";
export {
  accountsApi,
  transactionsApi,
  type AccountData,
  type TransactionData,
  type AccountStats,
  type CreateAccountPayload,
  type CreateTransactionPayload,
  type PaginatedAccounts,
  type PaginatedTransactions,
} from "./Account";
export {
  expensesApi,
  type ExpenseData,
  type ExpenseStats,
  type CreateExpensePayload,
  type PaginatedExpenses,
} from "./Expense";
export {
  salaryApi,
  type SalaryData,
  type SalaryStats,
  type CreateSalaryPayload,
  type PaginatedSalary,
} from "./Salary";
export {
  employeesApi,
  type EmployeeData,
  type EmployeeStats,
  type CreateEmployeePayload,
  type PaginatedEmployees,
} from "./Employee";
export {
  attendanceApi,
  type AttendanceData,
  type AttendanceStats,
  type CreateAttendancePayload,
  type PaginatedAttendance,
} from "./Attendance";
export {
  leavesApi,
  type LeaveRequestData,
  type LeaveStats,
  type CreateLeavePayload,
  type PaginatedLeaves,
} from "./LeaveRequest";
export {
  departmentsApi,
  type DepartmentData,
  type DepartmentStats,
  type CreateDepartmentPayload,
  type PaginatedDepartments,
} from "./Department";
export {
  payrollApi,
  type PayrollData,
  type PayrollStats,
  type CreatePayrollPayload,
  type PaginatedPayroll,
} from "./Payroll";
export {
  userApi,
  type MyEmployee,
  type MyAttendance,
  type MyLeaveRequest,
  type MyPayroll,
  type MyDailySubmission,
} from "./User";
export {
  dailySubmissionApi,
  type DailySubmissionData,
  type DailySubmissionStats,
  type PaginatedDailySubmissions,
} from "./DailySubmission";
export {
  subscribersApi,
  type SubscriberData,
  type SubscriberStats,
  type PaginatedSubscribers,
  type SubscriberParams,
} from "./Subscriber";
export {
  customerPanelApi,
  type CustomerPanelProfile,
  type CustomerOrder as CustomerPanelOrder,
  type CustomerOrderItem as CustomerPanelOrderItem,
  type CustomerStats as CustomerPanelStats,
  type PaginatedCustomerOrders as PaginatedCustomerPanelOrders,
  type CustomerOrderParams as CustomerPanelOrderParams,
} from "./CustomerPanel";
export {
  usersApi,
  type UserData,
  type UserStats,
  type CreateUserPayload,
  type PaginatedUsers,
} from "./Users";

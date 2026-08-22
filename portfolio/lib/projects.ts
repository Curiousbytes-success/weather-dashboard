export type Project = {
  slug: string;
  title: string;
  fileName: string;
  tags: string[];
  summary: string;
  whatItDoes: string[];
  howItsBuilt: string[];
};

export const projects: Project[] = [
  {
    slug: "payroll-management-system",
    title: "Payroll Management System",
    fileName: "payroll-system/ — full-stack web app",
    tags: ["PHP", "MySQL", "JavaScript"],
    summary:
      "A full-stack web application that takes payroll from attendance to payslip, built solo end to end.",
    whatItDoes: [
      "Employee management, attendance tracking, and payroll processing",
      "Leave management and automated payslip generation",
      "A responsive, user-friendly interface for day-to-day HR use",
    ],
    howItsBuilt: [
      "PHP backend with a MySQL database for secure, structured data",
      "HTML/CSS/JS frontend, built for real use rather than just a demo",
      "Local development and testing on XAMPP",
    ],
  },
  {
    slug: "billing-management-system",
    title: "Billing Management System",
    fileName: "billing-system/ — desktop application",
    tags: ["C#", "Windows Forms", "SQL Server"],
    summary:
      "A desktop billing application for invoicing, customer management, and product tracking.",
    whatItDoes: [
      "Invoice generation for day-to-day billing",
      "Customer management and product tracking",
      "Accurate, consistent billing records",
    ],
    howItsBuilt: [
      "Desktop app built with C# Windows Forms",
      "SQL Server for storage, structured around invoice/customer/product modules",
      "Built for reliability over flash — a tool people would actually use daily",
    ],
  },
];


export enum TicketStatus {
  PENDING = 'در انتظار بررسی',
  ASSIGNED = 'اختصاص یافته',
  IN_PROGRESS = 'در حال انجام',
  COMPLETED = 'تکمیل شده',
  CANCELED = 'لغو شده'
}

export enum TicketPriority {
  LOW = 'کم',
  MEDIUM = 'متوسط',
  HIGH = 'زیاد',
  CRITICAL = 'بحرانی'
}

export enum ElevatorStatus {
  ACTIVE = 'فعال',
  MAINTENANCE = 'در حال سرویس',
  STOPPED = 'خراب / متوقف',
  INSPECTION = 'نیازمند بازرسی'
}

// --- Control Panel Models ---
export enum ControlPanelModel {
  ALPHA = 'Alpha',
  SMART = 'Smart',
  TRON_1 = 'Tron 1',
  TRON_2 = 'Tron 2',
  TRON_3 = 'Tron 3',
  TRON_5 = 'Tron 5',
  PRIMAT = 'Primat',
  HYROLIC = 'Hyrolic' 
}

// --- User & Roles ---
export type UserRole = 
  | 'CEO' 
  | 'SUPPORT_SUPERVISOR' 
  | 'CALL_CENTER' 
  | 'ACCOUNTING_HEAD' 
  | 'ACCOUNTANT' 
  | 'WAREHOUSE' 
  | 'REPAIR_RECEPTION' 
  | 'REPAIR_SUPERVISOR' 
  | 'REPAIR_TECH' 
  | 'SITE_TECH' 
  | 'RENOVATION_HEAD'; 

export interface User {
  id: string;
  username: string;
  fullName: string;
  role: UserRole;
  avatar?: string;
}

export interface Customer {
  id: string;
  name: string;
  buildingName: string;
  address: string;
  subscriptionActive: boolean;
}

export interface Technician {
  id: string;
  name: string;
  specialty: string;
  isAvailable: boolean;
  avatar: string;
}

export interface Elevator {
  id: string;
  serialNumber: string;
  buildingName: string;
  type: string; 
  capacity: number; 
  floors: number;
  installDate: string;
  lastServiceDate: string;
  status: ElevatorStatus;
}

// --- Warranty Type ---
export interface WarrantyRecord {
  id: string;
  serialNumber: string;
  model: ControlPanelModel | string;
  installDate: string;
  expiryDate: string; 
  buildingName?: string;
  isActive: boolean;
}

export interface Ticket {
  id: string;
  customerId: string;
  customerName: string;
  buildingName: string;
  elevatorId?: string;
  
  controlPanelModel?: string;
  controlPanelSerial?: string;
  warrantyStatus?: 'VALID' | 'EXPIRED' | 'UNKNOWN';
  
  paymentStatus?: 'PAID' | 'PENDING' | 'NONE';
  paymentAmount?: number; 
  paymentTrackingCode?: string;

  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  technicianId?: string;
  createdAt: string;
  
  // New Fields for Report
  technicianReport?: string;
  completionDate?: string;
  usedParts?: string; // e.g., "2x Relay, 1x Fuse"
  
  aiAnalysis?: string;
  aiSolution?: string;
}

// --- Inventory Types ---
export interface Part {
  id: string;
  sku: string; // Stock Keeping Unit (Code Kala)
  name: string;
  brand: string;
  category: string;
  location: string; // Shelf A-1, Bin 2
  stock: number;
  minStockLevel: number;
  buyPrice: number;
  sellPrice: number;
  supplier?: string;
  lastUpdated?: string;
}

export interface InventoryTransaction {
  id: string;
  partId: string;
  partName: string;
  type: 'IN' | 'OUT'; // IN = Purchase/Return, OUT = Usage/Sale
  quantity: number;
  date: string;
  user: string; // Who performed the action
  reason: string; // e.g., "Ticket #1001" or "Purchase Invoice #55"
}

// --- Accounting Types ---
export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  date: string;
  customerName: string;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
  items: InvoiceItem[];
  totalAmount: number;
}

// --- Repair Center Types (Boards) ---
export type RepairStatus = 'RECEIVED' | 'DIAGNOSIS' | 'REPAIRING' | 'TESTING' | 'READY' | 'DELIVERED';

export interface RepairJob {
  id: string;
  customerName: string;
  boardType: string; 
  serialNumber?: string;
  faultDescription: string;
  status: RepairStatus;
  technicianName?: string; // Assigned repairman
  entryDate: string;
  completionDate?: string;
  cost?: number;
  technicalReport?: string; // What was fixed
  replacedParts?: string;
}

// --- Renovation Types ---
export type RenovationStatus = 'NEW' | 'VISITED' | 'QUOTATION' | 'CONTRACT' | 'IN_PROGRESS' | 'COMPLETED';

export interface RenovationRequest {
  id: string;
  customerName: string;
  buildingAddress: string;
  currentElevatorAge: number; 
  requestDate: string;
  status: RenovationStatus;
  notes: string;
  visitReport?: string;
  quotationAmount?: number;
}

// --- Training & Resources Types ---
export type ResourceType = 'PDF' | 'VIDEO' | 'MAP';

export interface Resource {
  id: string;
  title: string;
  type: ResourceType;
  category: 'CONTROL_PANEL' | 'MOTOR' | 'DOOR' | 'MECHANICAL' | 'STANDARD';
  model?: string;
  description: string;
  downloadUrl?: string;
  thumbnailUrl?: string;
  technicalContent?: string;
}

export type ViewState = 
  | 'LANDING'
  | 'LOGIN'
  | 'PUBLIC_NEW_TICKET'
  | 'PUBLIC_AI_SUPPORT'
  | 'PUBLIC_RENOVATION'
  | 'PUBLIC_TRAINING'
  | 'PAYMENT_GATEWAY' 
  | 'DASHBOARD' 
  | 'TICKETS' 
  | 'NEW_TICKET' 
  | 'TECHNICIANS' 
  | 'ELEVATORS' 
  | 'NEW_ELEVATOR'
  | 'INVENTORY'
  | 'ACCOUNTING'
  | 'TRAINING'
  | 'AI_SUPPORT'
  | 'REPAIR_CENTER'
  | 'RENOVATION_LIST'
  | 'WARRANTY_MANAGEMENT'
  | 'WORKFLOW_GUIDE';

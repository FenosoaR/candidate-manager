export interface Candidate {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    position: string;
    status: 'pending' | 'validated' | 'rejected';
    createdAt: string;
  }
  
  export interface PaginatedResponse {
    data: Candidate[];
    total: number;
    page: number;
    limit: number;
  }
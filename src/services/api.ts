const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Types
export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  imagePath: string;
  category: string;
}

export interface TeamMember {
  id: number;
  firstName: string;
  lastName: string;
  position: string;
  description: string;
  imagePath: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  capacity: string;
  imagePath: string;
  type: 'brasero' | 'tapas' | 'afterwork' | 'anniversaire' | 'fête' | 'autre';
  createdAt: string;
  updatedAt: string;
}

export interface GalleryItem {
  id: number;
  title: string;
  description: string;
  imagePath: string;
  category: string;
  displayOrder?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface GalleryCategory {
  id: string;
  name: string;
}

// Interface pour le personnel
export interface Personnel {
  id: number;
  firstName: string;
  lastName: string;
  role: string;
  service: string;
  description: string;
  speciality: string;
  experience: string;
  schedule: string;
  imagePath: string;
  createdAt?: string;
  updatedAt?: string;
}

// Events API calls
export const eventsApi = {
  getAll: async (): Promise<Event[]> => {
    const response = await fetch(`${API_URL}/events`);
    if (!response.ok) throw new Error('Failed to fetch events');
    return response.json();
  },

  getByType: async (type: string): Promise<Event[]> => {
    const response = await fetch(`${API_URL}/events/type/${type}`);
    if (!response.ok) throw new Error(`Failed to fetch events of type ${type}`);
    return response.json();
  },

  getById: async (id: number): Promise<Event> => {
    const response = await fetch(`${API_URL}/events/${id}`);
    if (!response.ok) throw new Error(`Failed to fetch event with id ${id}`);
    return response.json();
  },

  create: async (event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Promise<Event> => {
    const response = await fetch(`${API_URL}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(event),
    });
    if (!response.ok) throw new Error('Failed to create event');
    return response.json();
  },

  update: async (id: number, event: Partial<Omit<Event, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Event> => {
    const response = await fetch(`${API_URL}/events/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(event),
    });
    if (!response.ok) throw new Error('Failed to update event');
    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/events/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (!response.ok) throw new Error('Failed to delete event');
  },
};

// Menu API calls
export const menuApi = {
  getAll: async (): Promise<Record<string, MenuItem[]>> => {
    const response = await fetch(`${API_URL}/menu`);
    if (!response.ok) throw new Error('Failed to fetch menu items');
    return response.json();
  },

  create: async (item: Omit<MenuItem, 'id'>): Promise<MenuItem> => {
    const response = await fetch(`${API_URL}/menu`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(item),
    });
    if (!response.ok) throw new Error('Failed to create menu item');
    return response.json();
  },

  update: async (id: number, item: Partial<MenuItem>): Promise<MenuItem> => {
    const response = await fetch(`${API_URL}/menu/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(item),
    });
    if (!response.ok) throw new Error('Failed to update menu item');
    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/menu/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (!response.ok) throw new Error('Failed to delete menu item');
  },
};

// Team API calls
export const teamApi = {
  getAll: async (): Promise<TeamMember[]> => {
    const response = await fetch(`${API_URL}/team`);
    if (!response.ok) throw new Error('Failed to fetch team members');
    return response.json();
  },

  create: async (member: Omit<TeamMember, 'id'>): Promise<TeamMember> => {
    const response = await fetch(`${API_URL}/team`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(member),
    });
    if (!response.ok) throw new Error('Failed to create team member');
    return response.json();
  },

  update: async (id: number, member: Partial<TeamMember>): Promise<TeamMember> => {
    const response = await fetch(`${API_URL}/team/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(member),
    });
    if (!response.ok) throw new Error('Failed to update team member');
    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/team/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (!response.ok) throw new Error('Failed to delete team member');
  },
};

// Gallery API calls
export const galleryApi = {
  async getAll(): Promise<GalleryItem[]> {
    const response = await fetch(`${API_URL}/gallery`);
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des images');
    }
    return response.json();
  },

  async getCategories(): Promise<string[]> {
    const response = await fetch(`${API_URL}/gallery/categories`);
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des catégories');
    }
    return response.json();
  },

  async getByCategory(category: string): Promise<GalleryItem[]> {
    const response = await fetch(`${API_URL}/gallery/category/${category}`);
    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération des images de la catégorie ${category}`);
    }
    return response.json();
  },

  async getById(id: number): Promise<GalleryItem> {
    const response = await fetch(`${API_URL}/gallery/${id}`);
    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération de l'image avec l'ID ${id}`);
    }
    return response.json();
  },

  async create(galleryItem: Omit<GalleryItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<GalleryItem> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentification requise');
    }

    const response = await fetch(`${API_URL}/gallery`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(galleryItem)
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la création de l\'image');
    }

    return response.json();
  },

  async update(id: number, galleryItem: Partial<GalleryItem>): Promise<GalleryItem> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentification requise');
    }

    const response = await fetch(`${API_URL}/gallery/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(galleryItem)
    });

    if (!response.ok) {
      throw new Error(`Erreur lors de la mise à jour de l'image avec l'ID ${id}`);
    }

    return response.json();
  },

  async delete(id: number): Promise<void> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentification requise');
    }

    const response = await fetch(`${API_URL}/gallery/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Erreur lors de la suppression de l'image avec l'ID ${id}`);
    }
  }
};

// Service API pour le personnel
export const personnelApi = {
  async getAll(): Promise<Personnel[]> {
    const response = await fetch(`${API_URL}/personnel`);
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération du personnel');
    }
    return response.json();
  },

  async getByService(service: string): Promise<Personnel[]> {
    const response = await fetch(`${API_URL}/personnel?service=${service}`);
    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération du personnel du service ${service}`);
    }
    return response.json();
  },

  async getById(id: number): Promise<Personnel> {
    const response = await fetch(`${API_URL}/personnel/${id}`);
    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération du membre du personnel avec l'ID ${id}`);
    }
    return response.json();
  },

  async create(personnel: Omit<Personnel, 'id' | 'createdAt' | 'updatedAt'>): Promise<Personnel> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentification requise');
    }

    const response = await fetch(`${API_URL}/personnel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(personnel)
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la création du membre du personnel');
    }

    return response.json();
  },

  async update(id: number, personnel: Partial<Personnel>): Promise<Personnel> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentification requise');
    }

    const response = await fetch(`${API_URL}/personnel/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(personnel)
    });

    if (!response.ok) {
      throw new Error(`Erreur lors de la mise à jour du membre du personnel avec l'ID ${id}`);
    }

    return response.json();
  },

  async delete(id: number): Promise<void> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentification requise');
    }

    const response = await fetch(`${API_URL}/personnel/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Erreur lors de la suppression du membre du personnel avec l'ID ${id}`);
    }
  }
}; 
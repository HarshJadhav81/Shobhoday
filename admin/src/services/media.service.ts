import { api } from './api';

export interface Media {
  _id: string;
  publicId: string;
  url: string;
  secureUrl: string;
  folder: string;
  mediaType: string;
  width?: number;
  height?: number;
  size: number;
  altText?: string;
  createdAt: string;
}

export const MediaService = {
  upload: async (file: File, folder: string, altText?: string): Promise<Media> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    if (altText) {
      formData.append('altText', altText);
    }

    const response = await api.post('/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/media/${id}`);
  }
};

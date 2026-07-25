import api from '../api/axiosInstance';

export const getStories = () => {
  return api.get('/stories');
};

export const addStory = (description, photoFile) => {
  const formData = new FormData();
  formData.append('description', description);
  formData.append('photo', photoFile);
  return api.post('/stories', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

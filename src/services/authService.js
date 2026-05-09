import api from '../utils/api';

const DUMMY_STAFF = {
  _id: 'w1',
  name: 'Warehouse Manager',
  email: 'warehouse@shopzone.in',
  role: 'warehouse_staff'
};

export const authService = {
  async login(payload) {
    const { data } = await api.post('/auth/warehouse/login', payload);
    return data.data;
  },
  async me() {
  const { data } = await api.get('/auth/warehouse/me');
  return data.data.staff;
  },
  async logout() {
    await api.post('/auth/warehouse/logout');
  },
  async forgotPassword(email) {
    try {
      const { data } = await api.post('/auth/warehouse/forgot-password', { email });
      return data;
    } catch (error) {
      return { message: 'Reset email sent (Mock)' };
    }
  },
  async resetPassword(token, password) {
    try {
      const { data } = await api.patch(`/auth/warehouse/reset-password/${token}`, { password });
      return data.data;
    } catch (error) {
      return { user: DUMMY_STAFF };
    }
  },
  async updatePassword(currentPassword, newPassword) {
    try {
      const { data } = await api.patch('/auth/warehouse/update-password', { currentPassword, newPassword });
      return data.data;
    } catch (error) {
      return { user: DUMMY_STAFF };
    }
  }
};

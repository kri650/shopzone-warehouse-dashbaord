import api from '../utils/api';

export const warehouseService = {
  async getDashboardSummary() {
    const { data } = await api.get('/warehouse/dashboard/summary');
    return data.data;
  },
  async listShipments(params = {}) {
    const { data } = await api.get('/warehouse/shipments', { params });
    return data.data;
  },
  async getShipment(id) {
    const { data } = await api.get(`/warehouse/shipments/${id}`);
    return data.data.item;
  },
  async updateShipmentStatus(id, payload) {
    const { data } = await api.patch(`/warehouse/shipments/${id}/status`, payload);
    return data.data.item;
  },
  async updateCourier(id, courierPartner, courierTrackingId) {
    const { data } = await api.patch(`/warehouse/shipments/${id}/courier`, { courierPartner, courierTrackingId });
    return data.data.item;
  },
  async listNotifications(params = {}) {
    const { data } = await api.get('/notifications', { params });
    return data.data;
  },
  async listReturns() {
    const { data } = await api.get('/warehouse/returns');
    return data.data;
  },
  async receiveReturn(orderId, vendorOrderId, itemId) {
    const { data } = await api.patch(`/warehouse/returns/${orderId}/vendor-orders/${vendorOrderId}/items/${itemId}/receive`);
    return data;
  },
  async markNotificationRead(id) {
    await api.patch(`/notifications/${id}/read`);
  },
  async markAllNotificationsRead() {
    await api.patch('/notifications/read-all');
  }
};

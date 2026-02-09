import mainApi from "../../../api/mainApi";

export const getDashboardStats = async () => {
    const response = await mainApi.get('admin/stats');
    return response.data;
};

import { fetchApi } from '../../../common/utils/apiUtils';
import config from '../../../config/config';

export const inventoryService = {
    async getFurnitureOptions() {
        // Mock data for now - replace with actual API call
        return [
            'Sofa',
            'Bed',
            'Wardrobe',
            'Desk',
            'Chair',
            'Table',
            'Bookshelf',
            'TV Stand',
            'Dresser',
            'Nightstand'
        ];
    },

    async getApplianceOptions() {
        // Mock data for now - replace with actual API call
        return [
            'Refrigerator',
            'Washing Machine',
            'Dryer',
            'Dishwasher',
            'Microwave',
            'Oven',
            'TV',
            'Computer',
            'Printer',
            'Air Conditioner'
        ];
    },

    async getSpecialItemTypes() {
        return [
            { value: 'fragile', label: 'Fragile Items' },
            { value: 'bulky', label: 'Bulky Items' },
            { value: 'valuable', label: 'Valuable Items' },
            { value: 'antique', label: 'Antique Items' },
            { value: 'artwork', label: 'Artwork' },
            { value: 'other', label: 'Other (Specify)' }
        ];
    }
};

export default inventoryService;
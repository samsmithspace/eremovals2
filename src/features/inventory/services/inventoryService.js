import { fetchApi } from 'common/utils/apiUtils';
import config from 'config/config';

export const inventoryService = {
    /**
     * Fetch furniture options from the API
     * @returns {Promise<string[]>} Array of furniture item names
     */
    async getFurnitureOptions() {
        try {
            console.log('Fetching furniture items from API');

            // Use the API endpoint from config
            const response = await fetch(`${config.api.baseUrl}${config.api.endpoints.priceItems}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // Filter for furniture items and extract itemName
            const furniture = data
              .filter(item => item.category === 'Furniture')
              .map(item => item.itemName)
              .filter(name => name) // Remove any null/undefined names
              .sort(); // Sort alphabetically for better UX

            console.log(`Loaded ${furniture.length} furniture items`);
            return furniture;

        } catch (error) {
            console.error('Error fetching furniture options:', error);

            // Fallback to mock data if API fails
            console.log('Falling back to mock furniture data');
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
        }
    },

    /**
     * Fetch appliance options from the API
     * @returns {Promise<string[]>} Array of appliance item names
     */
    async getApplianceOptions() {
        try {
            console.log('Fetching appliance items from API');

            // Use the API endpoint from config
            const response = await fetch(`${config.api.baseUrl}${config.api.endpoints.priceItems}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // Filter for appliance items and extract itemName
            const appliances = data
              .filter(item => item.category === 'Appliances')
              .map(item => item.itemName)
              .filter(name => name) // Remove any null/undefined names
              .sort(); // Sort alphabetically for better UX

            console.log(`Loaded ${appliances.length} appliance items`);
            return appliances;

        } catch (error) {
            console.error('Error fetching appliance options:', error);

            // Fallback to mock data if API fails
            console.log('Falling back to mock appliance data');
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
        }
    },

    /**
     * Fetch all price items from the API
     * @returns {Promise<Object[]>} Array of all price items with full details
     */
    async getAllPriceItems() {
        try {
            console.log('Fetching all price items from API');

            const response = await fetch(`${config.api.baseUrl}${config.api.endpoints.priceItems}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log(`Loaded ${data.length} total price items`);

            return data;

        } catch (error) {
            console.error('Error fetching all price items:', error);
            throw error; // Re-throw for calling code to handle
        }
    },

    /**
     * Get categorized items from the API
     * @returns {Promise<Object>} Object with furniture and appliances arrays
     */
    async getCategorizedItems() {
        try {
            const data = await this.getAllPriceItems();

            const categorizedItems = {
                furniture: data
                  .filter(item => item.category === 'Furniture')
                  .map(item => ({
                      id: item.id || item._id,
                      name: item.itemName,
                      category: item.category,
                      price: item.price,
                      description: item.description
                  }))
                  .sort((a, b) => a.name.localeCompare(b.name)),

                appliances: data
                  .filter(item => item.category === 'Appliances')
                  .map(item => ({
                      id: item.id || item._id,
                      name: item.itemName,
                      category: item.category,
                      price: item.price,
                      description: item.description
                  }))
                  .sort((a, b) => a.name.localeCompare(b.name))
            };

            console.log(`Categorized items: ${categorizedItems.furniture.length} furniture, ${categorizedItems.appliances.length} appliances`);

            return categorizedItems;

        } catch (error) {
            console.error('Error getting categorized items:', error);

            // Return fallback data structure
            return {
                furniture: [],
                appliances: []
            };
        }
    },

    /**
     * Get special item types (static data for now)
     * @returns {Promise<Object[]>} Array of special item type objects
     */
    async getSpecialItemTypes() {
        // This could be extended to fetch from API in the future
        return [
            { value: 'fragile', label: 'Fragile Items' },
            { value: 'bulky', label: 'Bulky Items' },
            { value: 'valuable', label: 'Valuable Items' },
            { value: 'antique', label: 'Antique Items' },
            { value: 'artwork', label: 'Artwork' },
            { value: 'hazardous', label: 'Hazardous Materials' },
            { value: 'other', label: 'Other (Specify)' }
        ];
    },

    /**
     * Search items by name or category
     * @param {string} searchTerm - Search term
     * @param {string} category - Optional category filter
     * @returns {Promise<Object[]>} Array of matching items
     */
    async searchItems(searchTerm, category = null) {
        try {
            const data = await this.getAllPriceItems();

            let filteredItems = data.filter(item =>
              item.itemName &&
              item.itemName.toLowerCase().includes(searchTerm.toLowerCase())
            );

            if (category) {
                filteredItems = filteredItems.filter(item =>
                  item.category === category
                );
            }

            return filteredItems.map(item => ({
                id: item.id || item._id,
                name: item.itemName,
                category: item.category,
                price: item.price,
                description: item.description
            }));

        } catch (error) {
            console.error('Error searching items:', error);
            return [];
        }
    }
};

export default inventoryService;
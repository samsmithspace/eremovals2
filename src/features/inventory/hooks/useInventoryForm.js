// src/features/inventory/hooks/useInventoryForm.js
import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for managing inventory form state and validation
 * @param {Object} initialDetails - Initial inventory details
 * @param {Function} onDetailsChange - Callback when details change
 * @returns {Object} Inventory form state and handlers
 */
export const useInventoryForm = (initialDetails = {}, onDetailsChange) => {
    // Initialize box details with default structure
    const initializeBoxDetails = () => [
        { boxSize: 'small', numberOfBoxes: 0 },
        { boxSize: 'medium', numberOfBoxes: 0 },
        { boxSize: 'large', numberOfBoxes: 0 },
        { boxSize: 'extraLarge', numberOfBoxes: 0 }
    ];

    // Initialize state
    const [inventoryData, setInventoryData] = useState({
        boxDetails: initialDetails.boxDetails || initializeBoxDetails(),
        furnitureDetails: initialDetails.furnitureDetails || [],
        applianceDetails: initialDetails.applianceDetails || [],
        specialItems: initialDetails.specialItems || []
    });

    const [floorDetails, setFloorDetails] = useState({
        liftAvailable: initialDetails.liftAvailable || false,
        numberOfStairs: initialDetails.numberOfStairs || 0,
        liftAvailabledest: initialDetails.liftAvailabledest || false,
        numberofstairsright: initialDetails.numberofstairsright || 0
    });

    // Validation state
    const [isValid, setIsValid] = useState(false);

    // Validate inventory data
    const validateInventory = useCallback(() => {
        const hasBoxes = inventoryData.boxDetails.some(box => box.numberOfBoxes > 0);
        const hasFurniture = inventoryData.furnitureDetails.some(furniture =>
            furniture.item && furniture.quantity > 0
        );
        const hasAppliances = inventoryData.applianceDetails.some(appliance =>
            appliance.item && appliance.quantity > 0
        );
        const hasSpecialItems = inventoryData.specialItems.some(item =>
            item.type && item.description.trim()
        );

        // At least one item must be selected
        const hasItems = hasBoxes || hasFurniture || hasAppliances || hasSpecialItems;

        // All special items must have both type and description
        const validSpecialItems = inventoryData.specialItems.every(item =>
            (item.type && item.description.trim()) || (!item.type && !item.description.trim())
        );

        // All furniture items must have both item and quantity
        const validFurniture = inventoryData.furnitureDetails.every(furniture =>
            (furniture.item && furniture.quantity > 0) || (!furniture.item && furniture.quantity === 1)
        );

        // All appliance items must have both item and quantity
        const validAppliances = inventoryData.applianceDetails.every(appliance =>
            (appliance.item && appliance.quantity > 0) || (!appliance.item && appliance.quantity === 1)
        );

        return hasItems && validSpecialItems && validFurniture && validAppliances;
    }, [inventoryData]);

    // Update validation state when data changes
    useEffect(() => {
        const valid = validateInventory();
        setIsValid(valid);
    }, [validateInventory]);

    // Notify parent of changes
    useEffect(() => {
        if (onDetailsChange) {
            const allDetails = {
                ...inventoryData,
                ...floorDetails
            };
            onDetailsChange(allDetails);
        }
    }, [inventoryData, floorDetails, onDetailsChange]);

    // Box details handlers
    const updateBoxDetails = useCallback((newBoxDetails) => {
        setInventoryData(prev => ({
            ...prev,
            boxDetails: newBoxDetails
        }));
    }, []);

    // Furniture details handlers
    const updateFurnitureDetails = useCallback((newFurnitureDetails) => {
        setInventoryData(prev => ({
            ...prev,
            furnitureDetails: newFurnitureDetails
        }));
    }, []);

    // Appliance details handlers
    const updateApplianceDetails = useCallback((newApplianceDetails) => {
        setInventoryData(prev => ({
            ...prev,
            applianceDetails: newApplianceDetails
        }));
    }, []);

    // Special items handlers
    const updateSpecialItems = useCallback((newSpecialItems) => {
        setInventoryData(prev => ({
            ...prev,
            specialItems: newSpecialItems
        }));
    }, []);

    // Floor details handlers
    const updateFloorDetails = useCallback((field, value) => {
        setFloorDetails(prev => ({
            ...prev,
            [field]: value
        }));
    }, []);

    // Reset form
    const resetForm = useCallback(() => {
        setInventoryData({
            boxDetails: initializeBoxDetails(),
            furnitureDetails: [],
            applianceDetails: [],
            specialItems: []
        });
        setFloorDetails({
            liftAvailable: false,
            numberOfStairs: 0,
            liftAvailabledest: false,
            numberofstairsright: 0
        });
    }, []);

    // Get total item count
    const getTotalItemCount = useCallback(() => {
        const boxCount = inventoryData.boxDetails.reduce((sum, box) => sum + box.numberOfBoxes, 0);
        const furnitureCount = inventoryData.furnitureDetails.reduce((sum, furniture) => sum + furniture.quantity, 0);
        const applianceCount = inventoryData.applianceDetails.reduce((sum, appliance) => sum + appliance.quantity, 0);
        const specialItemCount = inventoryData.specialItems.length;

        return boxCount + furnitureCount + applianceCount + specialItemCount;
    }, [inventoryData]);

    // Get summary of selected items
    const getInventorySummary = useCallback(() => {
        const summary = {
            boxes: inventoryData.boxDetails.filter(box => box.numberOfBoxes > 0),
            furniture: inventoryData.furnitureDetails.filter(furniture => furniture.item && furniture.quantity > 0),
            appliances: inventoryData.applianceDetails.filter(appliance => appliance.item && appliance.quantity > 0),
            specialItems: inventoryData.specialItems.filter(item => item.type && item.description.trim()),
            floorAccess: floorDetails,
            totalItems: getTotalItemCount()
        };

        return summary;
    }, [inventoryData, floorDetails, getTotalItemCount]);

    return {
        // State
        inventoryData,
        floorDetails,
        isValid,

        // Update handlers
        updateBoxDetails,
        updateFurnitureDetails,
        updateApplianceDetails,
        updateSpecialItems,
        updateFloorDetails,

        // Utility functions
        resetForm,
        getTotalItemCount,
        getInventorySummary,

        // Validation
        validateInventory
    };
};

export default useInventoryForm;

const sessionMap = new Map();

// Add or update session data
function updateSession(sessionId, data) {
    // Retrieve the existing session data or initialize an empty object
    const existingData = sessionMap.get(sessionId) || {};

    // Merge the existing session data with the new data
    const updatedData = { ...existingData, ...data };

    // Update the session in the Map
    sessionMap.set(sessionId, updatedData);
}

// Country lookup function
function getCountryName(number) {
    const countries = {
        1: 'Malawi',
        2: 'Zambia'
    };

    // Return the country name if the number exists, otherwise return null or an error message
    return countries[number] || 'Invalid country number';
}

// Retrieving data
function getSession(sessionId) {
    return sessionMap.get(sessionId) || null;
}

// Deleting data
function deleteSession(sessionId) {
    sessionMap.delete(sessionId);
}

const fetchBalance = async (phoneNumber) => {
    // Example API call or mock response
    return "2000"; // Replace with your logic
};

const buyAirtime = async (phoneNumber, amount) => {
    try {
        // Example of making an API request or simulating the airtime purchase
        // Replace the following with actual logic (e.g., an HTTP request to a payment service)

        console.log(`Buying airtime of amount ${amount} for phone number ${phoneNumber}`);

        // Mock response simulating a successful transaction
        const response = {
            success: true,
            message: "Airtime purchase completed.",
        };

        // Check if the operation was successful
        if (response.success) {
            return response;
        } else {
            throw new Error(response.message || "Airtime purchase failed.");
        }
    } catch (error) {
        console.error("Error in buyAirtime:", error.message);
        throw error; // Re-throw error to be caught by caller
    }
};

module.exports = {buyAirtime,fetchBalance, sessionMap, updateSession, getSession,deleteSession, getCountryName}

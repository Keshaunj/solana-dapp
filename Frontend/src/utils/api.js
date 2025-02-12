const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const checkBalanceAPI = async (walletAddress) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/check-balance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ walletAddress }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error fetching balance. Please try again.");
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error(error.message || "Error fetching balance. Please try again.");
    }
};